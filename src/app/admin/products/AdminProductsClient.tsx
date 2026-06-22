// src/app/admin/products/AdminProductsClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toggleProductActive, deleteProduct as deleteProductAction } from "./actions";
import { useToast } from "../components/Toast";

type Product = {
  id: number;
  name: string;
  name_th: string;
  category: string;
  image_url: string;
  is_new: boolean;
  is_active: boolean;
  display_order: number;
  tags: string[];
};

const ITEMS_PER_PAGE = 20;

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1].filter(n => n >= 1 && n <= total));
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
    result.push(sorted[i]);
  }
  return result;
}

export default function AdminProductsClient({
  products: initial,
}: {
  products: Product[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [products, setProducts] = useState(initial);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(initial.map((p) => p.category))).sort(),
    [initial]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.name_th.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchCat = !categoryFilter || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, categoryFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  async function toggleActive(product: Product) {
    setLoadingId(product.id);
    try {
      await toggleProductActive(product.id, product.is_active);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, is_active: !p.is_active } : p
        )
      );
      toast.success(
        product.is_active ? `"${product.name}" hidden` : `"${product.name}" visible`
      );
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    }
    setLoadingId(null);
  }

  async function handleDelete(product: Product) {
    setLoadingId(product.id);
    setConfirmDeleteId(null);
    try {
      await deleteProductAction(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success("Product deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    }
    setLoadingId(null);
  }

  const inputStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "0.5px solid #E8E6E0",
    borderRadius: 7,
    padding: "7px 9px",
    fontSize: 12,
    color: "#333",
    outline: "none",
  };

  if (initial.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px",
          background: "#FFFFFF",
          borderRadius: 10,
          border: "0.5px solid #E8E6E0",
        }}
      >
        <p style={{ color: "#aaa", marginBottom: 16, fontSize: 14 }}>
          No products yet.
        </p>
        <Link
          href="/admin/products/new"
          style={{
            padding: "8px 18px",
            background: "#0D1E3D",
            color: "#E8D5A3",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Add your first product
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Search + category pill filters */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", width: 200, flexShrink: 0 }}>
          <i
            className="ti ti-search"
            style={{
              position: "absolute",
              left: 9,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 14,
              color: "#aaa",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 30, width: "100%" }}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <button
            type="button"
            onClick={() => setCategoryFilter("")}
            style={{
              padding: "6px 12px", borderRadius: 99, fontSize: 11, fontWeight: 500,
              border: "none", cursor: "pointer",
              background: !categoryFilter ? "#0D1E3D" : "#F5F3F0",
              color: !categoryFilter ? "#E8D5A3" : "#888",
            }}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(c)}
              style={{
                padding: "6px 12px", borderRadius: 99, fontSize: 11, fontWeight: 500,
                border: "none", cursor: "pointer",
                background: categoryFilter === c ? "#0D1E3D" : "#F5F3F0",
                color: categoryFilter === c ? "#E8D5A3" : "#888",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p style={{ fontSize: 12, color: "#aaa", marginBottom: 10 }}>
        Showing {filtered.length} of {products.length} products
      </p>

      {/* Table */}
      <div
        style={{
          background: "#FFFFFF",
          border: "0.5px solid #E8E6E0",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr
                style={{
                  background: "#FAFAF8",
                  borderBottom: "0.5px solid #E8E6E0",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <th style={thStyle}>
                  <input type="checkbox" style={{ cursor: "pointer" }} disabled title="Bulk select coming soon" />
                </th>
                <th style={thStyle}>Image</th>
                <th style={{ ...thStyle, textAlign: "left" }}>Name</th>
                <th style={{ ...thStyle, textAlign: "left" }} className="hidden sm:table-cell">Category</th>
                <th style={{ ...thStyle, textAlign: "left" }} className="hidden md:table-cell">Tags</th>
                <th style={thStyle} className="hidden lg:table-cell">Order</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr
                  key={p.id}
                  onMouseEnter={() => setHoveredRow(p.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: hoveredRow === p.id ? "#FAFAF8" : "#FFFFFF",
                    borderBottom: "0.5px solid #F0EDE6",
                    transition: "background 0.1s",
                  }}
                >
                  {/* Checkbox */}
                  <td style={tdStyle}>
                    <input type="checkbox" style={{ cursor: "pointer" }} />
                  </td>

                  {/* Thumbnail */}
                  <td style={tdStyle}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        overflow: "hidden",
                        position: "relative",
                        flexShrink: 0,
                        background: p.image_url ? "transparent" : "#F5F3F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt={p.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <i className="ti ti-gift" style={{ fontSize: 15, color: "#888" }} />
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td style={{ ...tdStyle, maxWidth: 200 }}>
                    <p style={{ fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </p>
                    {p.name_th && (
                      <p style={{ fontSize: 11, color: "#aaa", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.name_th}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td style={tdStyle} className="hidden sm:table-cell">
                    <span
                      style={{
                        background: "#F5F3F0",
                        color: "#888",
                        border: "0.5px solid #E8E6E0",
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "3px 8px",
                        borderRadius: 99,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.category}
                    </span>
                  </td>

                  {/* Tags */}
                  <td style={tdStyle} className="hidden md:table-cell">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {p.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          style={{
                            background: "#F5F3F0",
                            color: "#888",
                            border: "0.5px solid #E8E6E0",
                            fontSize: 11,
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      {p.tags.length > 2 && (
                        <span style={{ fontSize: 11, color: "#aaa" }}>
                          +{p.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Display order */}
                  <td
                    style={{ ...tdStyle, textAlign: "center", color: "#aaa" }}
                    className="hidden lg:table-cell"
                  >
                    {p.display_order}
                  </td>

                  {/* Status toggle */}
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <button
                        onClick={() => toggleActive(p)}
                        disabled={loadingId === p.id}
                        title={p.is_active ? "Click to hide" : "Click to show"}
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          width: 36,
                          height: 20,
                          borderRadius: 99,
                          background: p.is_active ? "#0D1E3D" : "#E8E6E0",
                          border: "none",
                          cursor: loadingId === p.id ? "not-allowed" : "pointer",
                          opacity: loadingId === p.id ? 0.5 : 1,
                          transition: "background 0.2s",
                          padding: 0,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 3,
                            left: p.is_active ? 18 : 3,
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: p.is_active ? "#E8D5A3" : "#FFFFFF",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                            transition: "left 0.2s",
                          }}
                        />
                      </button>
                      <span
                        style={{
                          fontSize: 10,
                          color: p.is_active ? "#3B6D11" : "#aaa",
                          fontWeight: 500,
                        }}
                      >
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    {confirmDeleteId === p.id ? (
                      <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#555" }}>Delete?</span>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={loadingId === p.id}
                          style={{
                            padding: "4px 10px",
                            background: "#A32D2D",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          style={{
                            padding: "4px 10px",
                            background: "#F5F3F0",
                            color: "#555",
                            border: "none",
                            borderRadius: 4,
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex", gap: 6, justifyContent: "flex-end",
                          opacity: hoveredRow === p.id ? 1 : 0,
                          transition: "opacity 0.1s",
                        }}
                      >
                        <Link
                          href={`/admin/products/${p.id}`}
                          style={{
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#F5F3F0",
                            border: "0.5px solid #E8E6E0",
                            borderRadius: 6,
                            color: "#555",
                            textDecoration: "none",
                          }}
                          title="Edit"
                        >
                          <i className="ti ti-pencil" style={{ fontSize: 13 }} />
                        </Link>
                        <button
                          onClick={() => setConfirmDeleteId(p.id)}
                          disabled={loadingId === p.id}
                          title="Delete"
                          style={{
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#FCEBEB",
                            border: "0.5px solid #F09595",
                            borderRadius: 6,
                            color: "#A32D2D",
                            cursor: "pointer",
                          }}
                        >
                          <i className="ti ti-trash" style={{ fontSize: 13 }} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && products.length > 0 && (
          <div
            style={{
              padding: "40px 24px",
              textAlign: "center",
              color: "#aaa",
              fontSize: 13,
            }}
          >
            No products match your search.
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 18px", borderTop: "0.5px solid #E8E6E0", flexWrap: "wrap", gap: 10,
            }}
          >
            <span style={{ fontSize: 12, color: "#aaa" }}>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "0 12px", height: 30, border: "0.5px solid #E8E6E0", borderRadius: 6,
                  fontSize: 11, fontWeight: 500, color: "#555", background: "#F5F3F0",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.4 : 1,
                }}
              >
                Prev
              </button>
              {getPageNumbers(currentPage, totalPages).map((pg, i) =>
                pg === "…" ? (
                  <span key={`ellipsis-${i}`} style={{ fontSize: 11, color: "#aaa", padding: "0 4px" }}>…</span>
                ) : (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    style={{
                      width: 28, height: 28, borderRadius: 6, fontSize: 11, cursor: "pointer",
                      background: currentPage === pg ? "#0D1E3D" : "#F5F3F0",
                      color: currentPage === pg ? "#E8D5A3" : "#555",
                      border: currentPage === pg ? "none" : "0.5px solid #E8E6E0",
                    }}
                  >
                    {pg}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "0 12px", height: 30, border: "0.5px solid #E8E6E0", borderRadius: 6,
                  fontSize: 11, fontWeight: 500, color: "#555", background: "#F5F3F0",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1,
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontWeight: 600,
  fontSize: 11,
  color: "#aaa",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  verticalAlign: "middle",
};
