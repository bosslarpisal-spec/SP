//src/components/home/CatalogSection.tsx
"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/contexts/LanguageContext";
import { useWishlist } from "@/hooks/useWishlist";

interface Product {
  id: string;
  name: string;
  nameTh?: string;
  description: string;
  descEn?: string;
  descTh?: string;
  category: string;
  is_visible: boolean;
  is_new?: boolean;
  tags?: string[];
  moq?: number | null;
  branding_methods?: string[];
  icon_name?: string;
  image_url?: string;
  images?: string[];
}

interface Props {
  products: Product[];
  categoryOrder?: string[];
  allTags?: string[];
  label?: string;
  heading?: string;
  headingTh?: string;
  description?: string;
  quote?: string;
  btn1Text?: string;
  btn2Text?: string;
  styles?: Record<string, Record<string, string>>;
}

const ICON_MAP: Record<string, string> = {
  "Premium Gift":   "ti-gift",
  "Premium Sets":   "ti-gift",
  "IT Gadgets":     "ti-device-laptop",
  "Corporate":      "ti-award",
  "New Year":       "ti-package",
  "Branding":       "ti-pencil",
  "Apparel":        "ti-shirt",
  "Packaging":      "ti-box",
  "Award":          "ti-star",
  "Wellness":       "ti-droplet",
  "Stationery":     "ti-pencil",
  "Drinkware":      "ti-cup",
  "Bags":           "ti-briefcase",
  "Souvenirs":      "ti-star",
  "default":        "ti-gift",
};

const ITEMS_PER_PAGE = 12;

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

/* ── QUICK-VIEW POPUP ─────────────────────────────────────── */
function QuickViewPopup({ product: p, onClose }: { product: Product; onClose: () => void }) {
  const { t, lang } = useLang();
  const icon = p.icon_name ?? ICON_MAP[p.category] ?? ICON_MAP["default"];
  const allImages = [p.image_url, ...(p.images ?? [])].filter(Boolean) as string[];
  const [imgIndex, setImgIndex] = useState(0);
  return (
    <>
      <style>{`
        @keyframes qv-overlay-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes qv-modal-in   { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
        @keyframes imgFade       { from { opacity: 0 } to { opacity: 1 } }
        .img-fade { animation: imgFade 0.25s ease both }
      `}</style>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.70)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
          animation: "qv-overlay-in 200ms ease both",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "#F8F6F1",
            borderRadius: "16px",
            maxWidth: "672px", width: "100%",
            maxHeight: "85vh", overflowY: "auto",
            position: "relative",
            animation: "qv-modal-in 250ms ease-out both",
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "14px", right: "14px", zIndex: 10,
              width: "32px", height: "32px", borderRadius: "50%",
              background: "rgba(13,30,61,0.08)", border: "0.5px solid rgba(13,30,61,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#0D1E3D", fontSize: "14px", fontWeight: 500,
            }}
          >✕</button>

          {/* Image panel — gallery */}
          <div style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
            background: "#C9A84C",
          }}>
            {allImages.length > 0 ? (
              <img
                key={imgIndex}
                src={allImages[imgIndex]}
                alt={p.name}
                className="img-fade"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            ) : (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center",
                justifyContent: "center",
              }}>
                <i className={`ti ${icon}`} style={{
                  fontSize: "56px", color: "#FFFFFF", opacity: 0.5
                }} />
              </div>
            )}

            {p.is_new && (
              <span style={{
                position: "absolute", top: "14px", left: "14px", zIndex: 2,
                background: "#E8D5A3", color: "#1C2951",
                fontSize: "9px", fontWeight: 700, padding: "3px 9px",
                borderRadius: "4px", textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>NEW</span>
            )}

            {allImages.length > 1 && (
              <button
                onClick={() => setImgIndex(i =>
                  i === 0 ? allImages.length - 1 : i - 1)}
                style={{
                  position: "absolute", left: "12px",
                  top: "50%", transform: "translateY(-50%)", zIndex: 2,
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "rgba(13,30,61,0.75)",
                  border: "none", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "20px",
                }}>
                ‹
              </button>
            )}

            {allImages.length > 1 && (
              <button
                onClick={() => setImgIndex(i =>
                  i === allImages.length - 1 ? 0 : i + 1)}
                style={{
                  position: "absolute", right: "12px",
                  top: "50%", transform: "translateY(-50%)", zIndex: 2,
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "rgba(13,30,61,0.75)",
                  border: "none", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "20px",
                }}>
                ›
              </button>
            )}

            {allImages.length > 1 && (
              <span style={{
                position: "absolute", bottom: "10px",
                left: "50%", transform: "translateX(-50%)", zIndex: 2,
                background: "rgba(0,0,0,0.55)", color: "#fff",
                fontSize: "11px", padding: "2px 10px",
                borderRadius: "20px",
              }}>
                {imgIndex + 1} / {allImages.length}
              </span>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: "24px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A6E00", marginBottom: "6px" }}>{p.category}</div>
            <h3 style={{ fontSize: "20px", fontWeight: 500, color: "#0D1E3D", lineHeight: 1.2, marginBottom: "4px" }}>{p.name}</h3>
            {p.description && <p style={{ fontSize: "13px", color: "#4A5568", marginBottom: "4px" }}>{p.description}</p>}

            <div style={{ borderTop: "0.5px solid rgba(13,30,61,0.1)", margin: "16px 0" }} />

            {(p.descEn || p.descTh) ? (
              <p style={{ fontSize: "13px", color: "#2C3E50", lineHeight: 1.75 }}>
                {lang === "th" ? (p.descTh || p.descEn) : (p.descEn || p.descTh)}
              </p>
            ) : (
              <p style={{ fontSize: "13px", color: "#2C3E50", lineHeight: 1.75 }}>
                A premium branded product crafted with precision by the SP team — designed to elevate your brand and leave a lasting impression.
              </p>
            )}

            {/* ── Product Details ── */}
            <div style={{ borderTop: "0.5px solid rgba(13,30,61,0.1)", margin: "16px 0" }} />
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A6E00", marginBottom: "10px" }}>{t("รายละเอียดสินค้า", "Product Details")}</div>

            {[
              { icon: "ti-tag",    label: t("หมวดหมู่", "Category"), value: p.category },
              { icon: "ti-box",    label: t("จำนวนสั่งซื้อขั้นต่ำ", "MOQ"),      value: p.moq ? t(`สั่งซื้อขั้นต่ำ ${p.moq} ชิ้น`, `${p.moq} pcs minimum order`) : t("สั่งซื้อขั้นต่ำ 50 ชิ้น", "50 pcs minimum order") },
              { icon: "ti-pencil", label: t("การพิมพ์โลโก้", "Branding"), value: p.branding_methods?.length ? p.branding_methods.join(", ") : "Logo Print, Laser Engraving, Embroidery, Screen Print" },
              { icon: "ti-truck",  label: t("การจัดส่ง", "Delivery"),  value: t("จัดส่งทั่วประเทศและต่างประเทศ", "Nationwide & International Shipping") },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid rgba(13,30,61,0.06)" }}>
                <i className={`ti ${row.icon}`} style={{ fontSize: "13px", color: "#8A6E00", flexShrink: 0, width: "16px" }} />
                <span style={{ fontSize: "12px", color: "#4A5568", minWidth: "72px", flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: "12px", color: "#0D1E3D" }}>{row.value}</span>
              </div>
            ))}

            {p.tags && p.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "16px" }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{ fontSize: "11px", background: "rgba(13,30,61,0.06)", color: "#4A5568", border: "0.5px solid rgba(13,30,61,0.1)", padding: "3px 9px", borderRadius: "4px" }}>{tag}</span>
                ))}
              </div>
            )}

            <div style={{ borderTop: "0.5px solid rgba(13,30,61,0.1)", margin: "20px 0" }} />

            <Link href="/contact" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              background: "#E8D5A3", color: "#1C2951",
              fontSize: "13px", fontWeight: 600, padding: "12px 20px",
              borderRadius: "8px", textDecoration: "none",
            }}>
              {t("ขอใบเสนอราคา", "Get a Quote")} <i className="ti ti-arrow-right" style={{ fontSize: "13px" }} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── GRID CARD ────────────────────────────────────────────── */
function GridCard({ p, setSelected, animDelay = 0 }: { p: Product; setSelected: (p: Product) => void; animDelay?: number }) {
  const { t } = useLang();
  const { isWished, toggle } = useWishlist();
  const wished = isWished(Number(p.id));
  const icon = p.icon_name ?? ICON_MAP[p.category] ?? ICON_MAP["default"];
  return (
    <div
      onClick={() => setSelected(p)}
      onMouseOver={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(28,41,81,0.18), 0 2px 8px rgba(28,41,81,0.1)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(28,41,81,0.12), 0 1px 4px rgba(28,41,81,0.08)";
      }}
      style={{ background: "#FFFBF0", border: "1.5px solid #C9A84C", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", boxShadow: "0 4px 16px rgba(28,41,81,0.12), 0 1px 4px rgba(28,41,81,0.08)", transition: "transform 0.2s ease, box-shadow 0.2s ease", animation: `slideUp 0.3s cubic-bezier(0.4,0,0.2,1) ${animDelay}ms backwards` }}
    >
      <div style={{ background: p.image_url ? "transparent" : "#C9A84C", height: "120px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {p.image_url ? (
          <Image src={p.image_url} alt={p.name} fill style={{ objectFit: "cover" }} />
        ) : (
          <i className={`ti ${icon}`} style={{ fontSize: "32px", color: "#FFFFFF", opacity: 0.6 }} />
        )}
        {p.is_new && (
          <span style={{ position: "absolute", top: "8px", left: "8px", background: "#E8D5A3", color: "#1C2951", fontSize: "9px", fontWeight: 600, padding: "2px 7px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            New
          </span>
        )}
        <button
          onClick={e => { e.stopPropagation(); toggle(Number(p.id)); }}
          aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
          style={{ position: "absolute", top: "8px", right: "8px", width: "24px", height: "24px", borderRadius: "50%", background: "rgba(28,41,81,0.7)", border: "0.5px solid rgba(232,213,163,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <i className={`ti ${wished ? "ti-heart-filled" : "ti-heart"}`} style={{ fontSize: "11px", color: wished ? "#E8D5A3" : "#8A9AB8" }} />
        </button>
      </div>
      <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8A6E00", marginBottom: "2px" }}>{p.category}</div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#0D1E3D", marginBottom: "2px" }}>{p.name}</div>
        <div style={{ fontSize: "11px", color: "#2C3E50", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: "5px" }}>{p.description}</div>
        {p.tags && p.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginBottom: "5px" }}>
            {p.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ fontSize: "10px", background: "rgba(28,41,81,0.06)", color: "#1C2951", border: "1px solid rgba(28,41,81,0.15)", padding: "2px 5px", borderRadius: "3px" }}>{tag}</span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "6px", borderTop: "0.5px solid rgba(201,168,76,0.2)" }}>
          <span style={{ fontSize: "10px", color: "#8A6E00", background: "rgba(201,168,76,0.1)", border: "0.5px solid rgba(201,168,76,0.3)", padding: "2px 6px", borderRadius: "3px" }}>{p.moq ? t(`สั่งขั้นต่ำ ${p.moq} ชิ้น`, `MOQ ${p.moq} pcs`) : t("สั่งขั้นต่ำ 50 ชิ้น", "MOQ 50 pcs")}</span>
          <span
            onClick={e => { e.stopPropagation(); setSelected(p); }}
            className="flex items-center"
            style={{ gap: "3px", fontSize: "11px", fontWeight: 600, color: "#1C2951", cursor: "pointer" }}
          >
            {t("ขอราคา", "Quote")} <i className="ti ti-arrow-right" style={{ fontSize: "11px" }} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── LIST CARD ────────────────────────────────────────────── */
function ListCard({ p, setSelected, animDelay = 0 }: { p: Product; setSelected: (p: Product) => void; animDelay?: number }) {
  const { t } = useLang();
  const icon = p.icon_name ?? ICON_MAP[p.category] ?? ICON_MAP["default"];
  return (
    <div
      onClick={() => setSelected(p)}
      onMouseOver={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(28,41,81,0.18), 0 2px 8px rgba(28,41,81,0.1)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(28,41,81,0.12), 0 1px 4px rgba(28,41,81,0.08)";
      }}
      style={{ background: "#FFFBF0", border: "1.5px solid #C9A84C", borderRadius: "10px", overflow: "hidden", display: "flex", alignItems: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(28,41,81,0.12), 0 1px 4px rgba(28,41,81,0.08)", transition: "transform 0.2s ease, box-shadow 0.2s ease", animation: `slideUp 0.3s cubic-bezier(0.4,0,0.2,1) ${animDelay}ms backwards` }}
    >
      <div style={{ background: p.image_url ? "transparent" : "#C9A84C", width: "110px", height: "80px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {p.image_url ? (
          <Image src={p.image_url} alt={p.name} fill style={{ objectFit: "cover" }} />
        ) : (
          <i className={`ti ${icon}`} style={{ fontSize: "28px", color: "#FFFFFF", opacity: 0.6 }} />
        )}
        {p.is_new && (
          <span style={{ position: "absolute", top: "5px", left: "5px", background: "#E8D5A3", color: "#1C2951", fontSize: "7px", fontWeight: 600, padding: "1px 5px", borderRadius: "2px", textTransform: "uppercase" }}>New</span>
        )}
      </div>
      <div style={{ flex: 1, padding: "10px 14px" }}>
        <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8A6E00", marginBottom: "2px" }}>{p.category}</div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#0D1E3D", marginBottom: "2px" }}>{p.name}</div>
        <div style={{ fontSize: "11px", color: "#2C3E50", lineHeight: 1.4, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{p.description}</div>
        {p.tags && p.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "4px" }}>
            {p.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ fontSize: "10px", background: "rgba(28,41,81,0.06)", color: "#1C2951", border: "1px solid rgba(28,41,81,0.15)", padding: "1px 5px", borderRadius: "3px" }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: "0 12px", flexShrink: 0 }}>
        <button
          onClick={e => { e.stopPropagation(); setSelected(p); }}
          className="flex items-center gap-1"
          style={{ fontSize: "11px", fontWeight: 600, background: "#1C2951", color: "#E8D5A3", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
        >
          {t("ขอราคา", "Quote")} <i className="ti ti-arrow-right" style={{ fontSize: "11px" }} />
        </button>
      </div>
    </div>
  );
}

/* ── SIDE SECTION ─────────────────────────────────────────── */
function SideSection({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: "0.5px solid rgba(13,30,61,0.08)" }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "transparent" }}
      >
        <span style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4A5568" }}>{title}</span>
        <i className={`ti ${open ? "ti-chevron-up" : "ti-chevron-down"}`} style={{ fontSize: "11px", color: "#6B7280" }} />
      </button>
      {open && children}
    </div>
  );
}

/* ── MAIN EXPORT ──────────────────────────────────────────── */
export default function CatalogSection({ products, categoryOrder = [], allTags: allTagsProp, label, heading, headingTh, description, quote, btn1Text, btn2Text, styles = {} }: Props) {
  const { t, lang } = useLang();
  const [searchQuery,      setSearchQuery]      = useState("");
  const [debouncedSearch,  setDebouncedSearch]  = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeTags,       setActiveTags]       = useState<string[]>([]);
  const [sortBy,           setSortBy]           = useState<"popular"|"newest"|"az">("popular");
  const [viewMode,         setViewMode]         = useState<"grid"|"list">("grid");
  const [currentPage,      setCurrentPage]      = useState(1);
  const [openSections,     setOpenSections]     = useState({ category: true, tags: true });
  const [selected,         setSelected]         = useState<Product | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    if (!selected) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const categories = useMemo(() => {
    if (categoryOrder.length > 0) {
      return categoryOrder.filter(cat => products.some(p => p.category === cat));
    }
    return Array.from(new Set(products.map(p => p.category)));
  }, [products, categoryOrder]);
  const allTags    = allTagsProp ?? [];

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        const q           = debouncedSearch.toLowerCase();
        const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q) || (p.descEn ?? "").toLowerCase().includes(q) || (p.descTh ?? "").toLowerCase().includes(q) || (p.category ?? "").toLowerCase().includes(q);
        const matchCat    = activeCategories.length === 0 || activeCategories.includes(p.category);
        const matchTag    = activeTags.length === 0 || activeTags.some(t => p.tags?.includes(t));
        return matchSearch && matchCat && matchTag;
      })
      .sort((a, b) => sortBy === "az" ? a.name.localeCompare(b.name) : 0);
  }, [products, debouncedSearch, activeCategories, activeTags, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const isFiltered = debouncedSearch !== "" || activeCategories.length > 0 || activeTags.length > 0;

  const filterKey = JSON.stringify({ debouncedSearch, activeCategories, activeTags, sortBy });
  useEffect(() => { setCurrentPage(1); }, [filterKey]);

  function toggleCategory(cat: string) { setActiveCategories(p => p.includes(cat) ? p.filter(c => c !== cat) : [...p, cat]); }
  function toggleTag(tag: string)      { setActiveTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag]); }
  function toggleSection(k: keyof typeof openSections) { setOpenSections(p => ({ ...p, [k]: !p[k] })); }
  function clearAll() { setSearchQuery(""); setActiveCategories([]); setActiveTags([]); setCurrentPage(1); }

  return (
    <div style={{ background: "#F8F6F1" }}>
      <style>{`
        .cat-intro-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: end; }
        @media (max-width: 767px) { .cat-intro-grid { grid-template-columns: 1fr; gap: 24px; } }

        .cat-layout { display: grid; grid-template-columns: 180px 1fr; }
        @media (max-width: 767px) { .cat-layout { grid-template-columns: 1fr; } }

        .cat-product-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        @media (max-width: 767px) { .cat-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 768px) and (max-width: 1023px) { .cat-product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      `}</style>

      {selected && <QuickViewPopup product={selected} onClose={() => setSelected(null)} />}

      {/* ── Editorial intro ── */}
      <div style={{ background: "#F8F6F1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 40px" }}>
          <div className="cat-intro-grid">
            <div>
              <span style={{ display: "block", fontSize: "120px", fontWeight: 400, color: "rgba(28,41,81,0.04)", lineHeight: 1, marginBottom: "-16px" }}>SP</span>
              <div className="flex items-center gap-[7px]" style={{ marginBottom: "10px" }}>
                <span style={{ display: "block", width: "18px", height: "2px", background: "#E8D5A3", flexShrink: 0 }} />
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A6E00", ...(styles.label as React.CSSProperties) }}>{label ?? "PRODUCT CATALOG"}</span>
              </div>
              <h2 style={{ fontSize: "32px", fontWeight: 400, color: "#0D1E3D", letterSpacing: "-0.02em", marginTop: "6px", marginBottom: "8px", ...(styles.heading as React.CSSProperties) }}>{lang === "th" ? (headingTh ?? "คอลเลกชันของเรา") : (heading ?? "Our Collection")}</h2>
              <p style={{ fontSize: "14px", color: "#2C3E50", marginBottom: "6px", ...(styles.headingTh as React.CSSProperties) }}>คอลเลกชันสินค้าพรีเมียมของเรา</p>
              <p style={{ fontSize: "14px", color: "#2C3E50", lineHeight: 1.8, maxWidth: "480px", ...(styles.description as React.CSSProperties) }}>{description ?? "Explore our full range of premium gifts, corporate souvenirs, and branded merchandise."}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <p style={{ fontStyle: "italic", fontSize: "15px", color: "#8A9AB8", lineHeight: 1.75, ...(styles.quote as React.CSSProperties) }}>
                {quote || "“Quality is not an act, it is a habit. Every product we deliver carries our promise.”"}
              </p>
              <div className="flex" style={{ marginTop: "20px", gap: "10px" }}>
                <button onClick={clearAll} style={{ fontSize: "13px", fontWeight: 500, background: "#E8D5A3", color: "#1C2951", padding: "9px 20px", borderRadius: "5px", cursor: "pointer", ...(styles.btn1 as React.CSSProperties) }}>{btn1Text ?? "Browse All"}</button>
                <button style={{ fontSize: "13px", color: "#0D1E3D", border: "0.5px solid rgba(13,30,61,0.2)", padding: "9px 18px", borderRadius: "5px", cursor: "pointer", background: "transparent", ...(styles.btn2 as React.CSSProperties), ...(styles.btn2?.borderColor ? { borderColor: styles.btn2.borderColor } : {}) }}>{btn2Text ?? "Filter"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Header bar ── */}
      <div style={{ background: "#E8E4DC", borderBottom: "0.5px solid rgba(13,30,61,0.1)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "#0D1E3D" }}>
            {filtered.length} {t("รายการจาก", "results from")} {products.length} {t("สินค้า", "products")}
            {searchQuery && <em style={{ color: "#2C3E50" }}> for &ldquo;{searchQuery}&rdquo;</em>}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "13px", color: "#2C3E50" }}>{t("เรียงตาม", "Sort by")}</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                style={{ fontSize: "13px", color: "#0D1E3D", background: "#E8E4DC", border: "0.5px solid rgba(13,30,61,0.2)", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
              >
                <option value="popular">{t("ความนิยม", "Popularity")}</option>
                <option value="newest">{t("ใหม่ล่าสุด", "Newest First")}</option>
                <option value="az">{t("ชื่อ A–Z", "Name A–Z")}</option>
              </select>
            </div>
            <div className="flex gap-1">
              {(["grid","list"] as const).map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  style={{ width: "34px", height: "34px", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: viewMode === mode ? "#1C2951" : "#E8E4DC", border: viewMode === mode ? "none" : "0.5px solid rgba(13,30,61,0.2)" }}>
                  <i className={`ti ${mode === "grid" ? "ti-layout-grid" : "ti-list"}`} style={{ fontSize: "16px", color: viewMode === mode ? "#E8D5A3" : "#4A5568" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Applied filters bar ── */}
      {isFiltered && (
        <div style={{ background: "#E8E4DC", borderBottom: "0.5px solid rgba(13,30,61,0.08)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "6px 40px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#4A5568", marginRight: "2px" }}>Applied</span>
            {activeCategories.map(cat => (
              <span key={cat} onClick={() => toggleCategory(cat)} className="flex items-center gap-1" style={{ fontSize: "12px", color: "#0D1E3D", background: "rgba(13,30,61,0.08)", border: "0.5px solid rgba(13,30,61,0.15)", padding: "4px 10px", borderRadius: "3px", cursor: "pointer" }}>
                {cat} <i className="ti ti-x" style={{ fontSize: "12px" }} />
              </span>
            ))}
            {activeTags.map(tag => (
              <span key={tag} onClick={() => toggleTag(tag)} className="flex items-center gap-1" style={{ fontSize: "12px", color: "#0D1E3D", background: "rgba(13,30,61,0.08)", border: "0.5px solid rgba(13,30,61,0.15)", padding: "4px 10px", borderRadius: "3px", cursor: "pointer" }}>
                {tag} <i className="ti ti-x" style={{ fontSize: "12px" }} />
              </span>
            ))}
            {searchQuery && (
              <span onClick={() => setSearchQuery("")} className="flex items-center gap-1" style={{ fontSize: "12px", color: "#0D1E3D", background: "rgba(13,30,61,0.08)", border: "0.5px solid rgba(13,30,61,0.15)", padding: "4px 10px", borderRadius: "3px", cursor: "pointer" }}>
                &ldquo;{searchQuery}&rdquo; <i className="ti ti-x" style={{ fontSize: "12px" }} />
              </span>
            )}
            <span onClick={clearAll} style={{ fontSize: "12px", color: "#0D1E3D", textDecoration: "underline", cursor: "pointer", marginLeft: "2px" }}>{t("ล้างตัวกรองทั้งหมด", "Clear all")}</span>
          </div>
        </div>
      )}

      {/* ── Search + category pills ── */}
      <div style={{ background: "#E8E4DC", borderBottom: "0.5px solid rgba(13,30,61,0.08)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px 40px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: "260px", flexShrink: 0 }}>
            <i className="ti ti-search" style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#4A5568", pointerEvents: "none" }} />
            <input
              type="text" value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={t("ค้นหาสินค้า...", "Search products...")}
              style={{ width: "100%", background: "rgba(255,255,255,0.9)", border: "0.5px solid rgba(13,30,61,0.15)", borderRadius: "5px", padding: "7px 10px 7px 28px", fontSize: "11px", color: "#0D1E3D", outline: "none" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "transparent", cursor: "pointer" }}>
                <i className="ti ti-x" style={{ fontSize: "10px", color: "#4A5568" }} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => toggleCategory(cat)}
                style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 12px", borderRadius: "20px", cursor: "pointer", background: activeCategories.includes(cat) ? "rgba(13,30,61,0.1)" : "transparent", color: activeCategories.includes(cat) ? "#0D1E3D" : "#4A5568", border: activeCategories.includes(cat) ? "0.5px solid rgba(13,30,61,0.3)" : "0.5px solid rgba(13,30,61,0.15)" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main body: sidebar + content ── */}
      <div className="cat-layout" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>

        {/* Sidebar */}
        <div style={{ background: "#F0EEE8", borderRight: "0.5px solid rgba(13,30,61,0.08)" }}>

          <SideSection title={t("หมวดหมู่", "Category")} open={openSections.category} onToggle={() => toggleSection("category")}>
            {categories.map(cat => (
              <div key={cat} onClick={() => toggleCategory(cat)}
                style={{ padding: "5px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <div className="flex items-center gap-2">
                  <div style={{ width: "12px", height: "12px", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: activeCategories.includes(cat) ? "#1C2951" : "transparent", border: activeCategories.includes(cat) ? "none" : "0.5px solid rgba(13,30,61,0.25)" }}>
                    {activeCategories.includes(cat) && <i className="ti ti-check" style={{ fontSize: "8px", color: "#E8D5A3" }} />}
                  </div>
                  <span style={{ fontSize: "11px", color: "#2C3E50" }}>{cat}</span>
                </div>
                <span style={{ fontSize: "10px", color: "#4A5568", background: "rgba(13,30,61,0.06)", border: "0.5px solid rgba(13,30,61,0.1)", padding: "1px 5px", borderRadius: "10px" }}>
                  {products.filter(p => p.category === cat).length}
                </span>
              </div>
            ))}
          </SideSection>

          {allTags.length > 0 && (
            <SideSection title={t("แท็ก", "Tags")} open={openSections.tags} onToggle={() => toggleSection("tags")}>
              <div style={{ padding: "10px 16px 14px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {allTags.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "3px", cursor: "pointer", background: activeTags.includes(tag) ? "rgba(13,30,61,0.1)" : "rgba(13,30,61,0.04)", color: activeTags.includes(tag) ? "#0D1E3D" : "#4A5568", border: activeTags.includes(tag) ? "0.5px solid rgba(13,30,61,0.3)" : "0.5px solid rgba(13,30,61,0.1)" }}>
                    {tag}
                  </button>
                ))}
              </div>
            </SideSection>
          )}

          {isFiltered && (
            <div style={{ padding: "10px 14px", borderTop: "0.5px solid rgba(13,30,61,0.08)" }}>
              <button onClick={clearAll} className="flex items-center justify-center gap-2" style={{ width: "100%", fontSize: "11px", fontWeight: 500, color: "#0D1E3D", background: "rgba(13,30,61,0.06)", border: "0.5px solid rgba(13,30,61,0.15)", padding: "8px", borderRadius: "4px", cursor: "pointer" }}>
                <i className="ti ti-x" style={{ fontSize: "10px" }} /> {t("ล้างตัวกรองทั้งหมด", "Clear all filters")}
              </button>
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ padding: "14px 16px", background: "#F8F6F1" }}>

          {paginated.length === 0 ? (
            <div style={{ padding: "56px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <i className="ti ti-search-off" style={{ fontSize: "32px", color: "#1C2951", opacity: 0.25 }} />
              <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#0D1E3D" }}>{t("ไม่พบสินค้า", "No products found")}</h3>
              <p style={{ fontSize: "11px", color: "#4A5568" }}>Try adjusting your search or filters.</p>
              <button onClick={clearAll} style={{ fontSize: "10px", fontWeight: 500, background: "#1C2951", color: "#E8D5A3", padding: "7px 16px", borderRadius: "5px", marginTop: "8px", cursor: "pointer" }}>Clear filters</button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div key={`g-${filterKey}`} className="cat-product-grid">
                  {paginated.map((p, i) => <GridCard key={p.id} p={p} setSelected={setSelected} animDelay={Math.min(i * 25, 80)} />)}
                </div>
              ) : (
                <div key={`l-${filterKey}`} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {paginated.map((p, i) => <ListCard key={p.id} p={p} setSelected={setSelected} animDelay={Math.min(i * 25, 80)} />)}
                </div>
              )}

              {totalPages > 1 && (
                <div>
                  <div style={{ padding: "16px 0 4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1"
                      style={{ padding: "0 12px", height: "32px", border: "0.5px solid rgba(13,30,61,0.15)", borderRadius: "4px", fontSize: "11px", fontWeight: 500, color: "#4A5568", background: "#F0EEE8", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.4 : 1 }}>
                      <i className="ti ti-chevron-left" style={{ fontSize: "11px" }} /> {t("ก่อนหน้า", "Previous")}
                    </button>
                    {getPageNumbers(currentPage, totalPages).map((p, i) =>
                      p === "…" ? (
                        <span key={`e${i}`} style={{ fontSize: "11px", color: "#6B7280", padding: "0 4px" }}>…</span>
                      ) : (
                        <button key={p} onClick={() => setCurrentPage(p as number)}
                          style={{ width: "30px", height: "30px", borderRadius: "3px", fontSize: "11px", cursor: "pointer", background: currentPage === p ? "#1C2951" : "#F0EEE8", color: currentPage === p ? "#E8D5A3" : "#4A5568", border: currentPage === p ? "none" : "0.5px solid rgba(13,30,61,0.15)" }}>
                          {p}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1"
                      style={{ padding: "0 12px", height: "32px", border: "0.5px solid rgba(13,30,61,0.15)", borderRadius: "4px", fontSize: "11px", fontWeight: 500, color: "#4A5568", background: "#F0EEE8", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1 }}>
                      {t("ถัดไป", "Next")} <i className="ti ti-chevron-right" style={{ fontSize: "11px" }} />
                    </button>
                  </div>
                  <p style={{ textAlign: "center", fontSize: "11px", color: "#6B7280", marginTop: "6px" }}>
                    {t("แสดง", "Showing")} {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} {t("จาก", "of")} {filtered.length} {t("สินค้า", "products")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
