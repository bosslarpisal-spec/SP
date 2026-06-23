"use client";

import { useState } from "react";
import { addTag, renameTag, deleteTag } from "./tagActions";
import type { Tag } from "./page";
import { th } from "@/app/admin/lib/admin-th";

export default function TagManager({
  initialTags,
  productCounts,
}: {
  initialTags: Tag[];
  productCounts: Record<string, number>;
}) {
  const [tags, setTags] = useState(initialTags);
  const [counts, setCounts] = useState(productCounts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function flashSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function handleAdd() {
    const name = newTagName.trim().toLowerCase();
    if (!name) return;
    if (tags.some(t => t.name.toLowerCase() === name)) {
      setError(th.tagExistsErr(name));
      return;
    }
    setError(null);
    setAdding(true);
    try {
      const row = await addTag(name);
      setTags(p => [...p, { id: row.id, name: row.name }]);
      setCounts(p => ({ ...p, [name]: 0 }));
      setNewTagName("");
      flashSuccess(th.tagAddedMsg(name));
    } catch (err) {
      setError(err instanceof Error ? err.message : th.tagAddFail);
    } finally {
      setAdding(false);
    }
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id);
    setEditingName(tag.name);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  async function saveRename(tag: Tag) {
    const newName = editingName.trim().toLowerCase();
    if (!newName || newName === tag.name) {
      cancelEdit();
      return;
    }
    if (tags.some(t => t.id !== tag.id && t.name.toLowerCase() === newName)) {
      setError(th.tagExistsErr(newName));
      return;
    }
    setError(null);
    setRenamingId(tag.id);
    try {
      const result = await renameTag(tag.id, tag.name, newName);
      setTags(p => p.map(t => t.id === tag.id ? { ...t, name: newName } : t));
      setCounts(p => {
        const next = { ...p };
        next[newName] = next[tag.name] ?? 0;
        delete next[tag.name];
        return next;
      });
      flashSuccess(th.tagRenamedMsg(result.productsUpdated));
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : th.tagRenameFail);
      setEditingName(tag.name);
    } finally {
      setRenamingId(null);
    }
  }

  async function handleDelete(tag: Tag) {
    const count = counts[tag.name] ?? 0;
    if (count > 0) return;
    if (!confirm(th.tagDeleteConfirm(tag.name))) return;
    setError(null);
    setLoading(tag.id);
    try {
      await deleteTag(tag.id, tag.name);
      setTags(p => p.filter(t => t.id !== tag.id));
      flashSuccess(th.tagDeletedMsg(tag.name));
    } catch (err) {
      setError(err instanceof Error ? err.message : th.tagDeleteFail);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px" }}>
          {th.tagTitle}
        </h2>
        <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>
          {th.tagDesc}
        </p>
      </div>

      <div style={{
        display: "flex", alignItems: "flex-start", gap: 8,
        background: "#FEF3C7", border: "1px solid #FDE68A",
        borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#92400E",
        marginBottom: 16,
      }}>
        <i className="ti ti-alert-triangle" style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }} />
        <span>{th.tagWarning}</span>
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
            {th.tagHeader(tags.length)}
          </span>
        </div>

        {tags.map(tag => {
          const count = counts[tag.name] ?? 0;
          const isEditing = editingId === tag.id;
          const isRenaming = renamingId === tag.id;
          return (
            <div
              key={tag.id}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, padding: "12px 18px",
                borderBottom: "0.5px solid #F0EDE6",
                background: "#FFFFFF",
                opacity: isRenaming || loading === tag.id ? 0.6 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                    <input
                      autoFocus
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") saveRename(tag);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      style={{
                        fontSize: 13, padding: "5px 8px", borderRadius: 6,
                        border: "0.5px solid #E8E6E0", outline: "none",
                        background: "#FFFFFF", color: "#333", flex: 1, minWidth: 0,
                      }}
                    />
                    <button
                      type="button" onClick={() => saveRename(tag)} disabled={isRenaming}
                      style={{
                        fontSize: 11, fontWeight: 600, color: "#E8D5A3", background: "#0D1E3D",
                        border: "none", borderRadius: 5, padding: "5px 10px", cursor: "pointer",
                      }}
                    >
                      {isRenaming ? th.tagRenaming : th.tagSave}
                    </button>
                    <button
                      type="button" onClick={cancelEdit} disabled={isRenaming}
                      style={{
                        fontSize: 11, color: "#555", background: "#FFFFFF",
                        border: "1px solid #D8D5CE", borderRadius: 5, padding: "5px 10px", cursor: "pointer",
                      }}
                    >
                      {th.tagCancel}
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => startEdit(tag)}
                    title={th.tagClickRename}
                    style={{ fontSize: 13, color: "#1a1a1a", cursor: "pointer" }}
                  >
                    {tag.name}
                  </span>
                )}

                <span style={{
                  fontSize: 10, fontWeight: 600, color: "#E8D5A3", background: "#0D1E3D",
                  borderRadius: 99, padding: "2px 8px", flexShrink: 0,
                }}>
                  {th.tagProductCount(count)}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <button
                  type="button" onClick={() => startEdit(tag)}
                  style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 4 }}
                >
                  <i className="ti ti-pencil" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(tag)}
                  disabled={count > 0 || loading === tag.id}
                  title={count > 0 ? th.tagHasProducts : th.tagDeleteTitle}
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
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
            placeholder={th.tagPlaceholder}
            style={{
              flex: 1, fontSize: 13, padding: "8px 12px", borderRadius: 6,
              border: "0.5px solid #E8E6E0", outline: "none",
              background: "#FFFFFF", color: "#333",
            }}
          />
          <button
            type="button" onClick={handleAdd} disabled={adding || !newTagName.trim()}
            style={{
              fontSize: 12, fontWeight: 600, color: "#E8D5A3",
              background: "#0D1E3D",
              opacity: adding ? 0.5 : 1,
              border: "none", borderRadius: 6, padding: "8px 16px",
              cursor: adding ? "wait" : "pointer", whiteSpace: "nowrap",
            }}
          >
            {adding ? th.tagAdding : th.tagAddBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
