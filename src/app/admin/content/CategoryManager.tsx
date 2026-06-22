"use client";

import { useState } from "react";
import {
  addCategory,
  renameCategory,
  deleteCategory,
  updateCategoryOrder,
  toggleCategoryVisibility,
} from "./categoryActions";
import type { Category } from "./page";

export default function CategoryManager({
  initialCategories,
  productCounts,
}: {
  initialCategories: Category[];
  productCounts: Record<string, number>;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [counts, setCounts] = useState(productCounts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function flashSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function handleAdd() {
    const name = newCategoryName.trim();
    if (!name) return;
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      setError(`"${name}" already exists.`);
      return;
    }
    setError(null);
    setAdding(true);
    const displayOrder = categories.length + 1;
    try {
      await addCategory(name, displayOrder);
      setCategories(p => [...p, {
        id: `temp-${Date.now()}`, name, display_order: displayOrder, is_visible: true,
      }]);
      setCounts(p => ({ ...p, [name]: 0 }));
      setNewCategoryName("");
      flashSuccess(`✓ "${name}" added`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category.");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  async function saveRename(cat: Category) {
    const newName = editingName.trim();
    if (!newName || newName === cat.name) {
      cancelEdit();
      return;
    }
    if (categories.some(c => c.id !== cat.id && c.name.toLowerCase() === newName.toLowerCase())) {
      setError(`"${newName}" already exists.`);
      return;
    }
    setError(null);
    setRenamingId(cat.id);
    try {
      const result = await renameCategory(cat.id, cat.name, newName);
      setCategories(p => p.map(c => c.id === cat.id ? { ...c, name: newName } : c));
      setCounts(p => {
        const next = { ...p };
        next[newName] = next[cat.name] ?? 0;
        delete next[cat.name];
        return next;
      });
      flashSuccess(`✓ Renamed — ${result.productsUpdated} product${result.productsUpdated === 1 ? "" : "s"} updated`);
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename category.");
      setEditingName(cat.name);
    } finally {
      setRenamingId(null);
    }
  }

  async function handleDelete(cat: Category) {
    const count = counts[cat.name] ?? 0;
    if (count > 0) return;
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    setError(null);
    setLoading(cat.id);
    try {
      await deleteCategory(cat.id, cat.name);
      setCategories(p => p.filter(c => c.id !== cat.id));
      flashSuccess(`✓ "${cat.name}" deleted`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    } finally {
      setLoading(null);
    }
  }

  async function handleToggleVisibility(cat: Category) {
    const nextVisible = !cat.is_visible;
    setCategories(p => p.map(c => c.id === cat.id ? { ...c, is_visible: nextVisible } : c));
    try {
      await toggleCategoryVisibility(cat.id, nextVisible);
    } catch (err) {
      setCategories(p => p.map(c => c.id === cat.id ? { ...c, is_visible: !nextVisible } : c));
      setError(err instanceof Error ? err.message : "Failed to update visibility.");
    }
  }

  function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      return;
    }
    const fromIndex = categories.findIndex(c => c.id === draggingId);
    const toIndex = categories.findIndex(c => c.id === targetId);
    if (fromIndex === -1 || toIndex === -1) {
      setDraggingId(null);
      return;
    }
    const reordered = [...categories];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    const renumbered = reordered.map((c, i) => ({ ...c, display_order: i + 1 }));
    setCategories(renumbered);
    setDraggingId(null);
    renumbered.forEach(c => {
      updateCategoryOrder(c.id, c.display_order).catch(err => {
        setError(err instanceof Error ? err.message : "Failed to save new order.");
      });
    });
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px" }}>
          Category Manager
        </h2>
        <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>
          Categories auto-generate the filter tabs on the home page. Renaming a category updates all matching products automatically.
        </p>
      </div>

      <div style={{
        display: "flex", alignItems: "flex-start", gap: 8,
        background: "#FEF3C7", border: "1px solid #FDE68A",
        borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#92400E",
        marginBottom: 16,
      }}>
        <i className="ti ti-alert-triangle" style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }} />
        <span>Deleting a category is only possible if no products use it. Reassign products first in the Products section.</span>
      </div>

      {successMsg && (
        <div style={{
          background: "#EAF5E8", border: "1px solid #C9E6C4",
          borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#3B6D11",
          marginBottom: 12,
        }}>
          {successMsg}
        </div>
      )}
      {error && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          background: "#FCEBEB", border: "1px solid #F09595",
          borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#A32D2D",
          marginBottom: 12,
        }}>
          <span>{error}</span>
          <button
            type="button" onClick={() => setError(null)}
            style={{ background: "none", border: "none", color: "#A32D2D", cursor: "pointer", fontSize: 13, padding: 0 }}
          >
            <i className="ti ti-x" />
          </button>
        </div>
      )}

      <div style={{
        background: "#FFFFFF", border: "0.5px solid #E8E6E0",
        borderRadius: 10, overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 18px", borderBottom: "0.5px solid #E8E6E0",
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>
            Categories ({categories.length} total)
          </span>
          <span style={{ fontSize: 11, color: "#aaa" }}>↕ Drag to reorder</span>
        </div>

        {categories.map(cat => {
          const count = counts[cat.name] ?? 0;
          const isEditing = editingId === cat.id;
          const isRenaming = renamingId === cat.id;
          return (
            <div
              key={cat.id}
              draggable
              onDragStart={() => setDraggingId(cat.id)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(cat.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, padding: "12px 18px",
                borderBottom: "0.5px solid #F0EDE6",
                background: draggingId === cat.id ? "#FAFAF8" : "#FFFFFF",
                opacity: isRenaming || loading === cat.id ? 0.6 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                <i className="ti ti-grip-vertical" style={{ fontSize: 14, color: "#D8D5CE", cursor: "grab", flexShrink: 0 }} />

                {isEditing ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                    <input
                      autoFocus
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") saveRename(cat);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      style={{
                        fontSize: 13, padding: "5px 8px", borderRadius: 6,
                        border: "0.5px solid #E8E6E0", outline: "none",
                        background: "#FFFFFF", color: "#333", flex: 1, minWidth: 0,
                      }}
                    />
                    <button
                      type="button" onClick={() => saveRename(cat)} disabled={isRenaming}
                      style={{
                        fontSize: 11, fontWeight: 600, color: "#E8D5A3", background: "#0D1E3D",
                        border: "none", borderRadius: 5, padding: "5px 10px", cursor: "pointer",
                      }}
                    >
                      {isRenaming ? "Renaming…" : "Save"}
                    </button>
                    <button
                      type="button" onClick={cancelEdit} disabled={isRenaming}
                      style={{
                        fontSize: 11, color: "#555", background: "#FFFFFF",
                        border: "1px solid #D8D5CE", borderRadius: 5, padding: "5px 10px", cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => startEdit(cat)}
                    title="Click to rename"
                    style={{ fontSize: 13, color: "#1a1a1a", cursor: "pointer" }}
                  >
                    {cat.name}
                  </span>
                )}

                <span style={{
                  fontSize: 10, fontWeight: 600, color: "#E8D5A3", background: "#0D1E3D",
                  borderRadius: 99, padding: "2px 8px", flexShrink: 0,
                }}>
                  {count} product{count === 1 ? "" : "s"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(cat)}
                  title={cat.is_visible ? "Visible — click to hide" : "Hidden — click to show"}
                  style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: cat.is_visible ? "#0D1E3D" : "#E8E6E0",
                    position: "relative", border: "none", cursor: "pointer",
                    transition: "background 0.2s ease", flexShrink: 0, padding: 0,
                  }}
                >
                  <span style={{
                    position: "absolute", top: 3,
                    left: cat.is_visible ? 19 : 3,
                    width: 14, height: 14, borderRadius: "50%",
                    background: cat.is_visible ? "#E8D5A3" : "#FFFFFF", transition: "left 0.2s ease",
                    display: "block",
                  }} />
                </button>

                <button
                  type="button" onClick={() => startEdit(cat)}
                  style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 4 }}
                >
                  <i className="ti ti-pencil" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(cat)}
                  disabled={count > 0 || loading === cat.id}
                  title={count > 0 ? "Has products" : "Delete category"}
                  style={{
                    background: "none", border: "none", fontSize: 14, padding: 4,
                    color: count > 0 ? "#E8B4B4" : "#A32D2D",
                    cursor: count > 0 ? "not-allowed" : "pointer",
                  }}
                >
                  <i className="ti ti-trash" />
                </button>
              </div>
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 8, padding: "14px 18px", background: "#FAFAF8" }}>
          <input
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
            placeholder="New category name..."
            style={{
              flex: 1, fontSize: 13, padding: "8px 12px", borderRadius: 6,
              border: "0.5px solid #E8E6E0", outline: "none",
              background: "#FFFFFF", color: "#333",
            }}
          />
          <button
            type="button" onClick={handleAdd} disabled={adding || !newCategoryName.trim()}
            style={{
              fontSize: 12, fontWeight: 600, color: "#E8D5A3",
              background: "#0D1E3D",
              opacity: adding ? 0.5 : 1,
              border: "none", borderRadius: 6, padding: "8px 16px",
              cursor: adding ? "wait" : "pointer", whiteSpace: "nowrap",
            }}
          >
            {adding ? "Adding…" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
