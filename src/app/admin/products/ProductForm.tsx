// src/app/admin/products/ProductForm.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { createProduct, updateProduct } from "./actions";
import { useToast } from "../components/Toast";

const BRANDING_OPTIONS = ["Logo Print", "Laser Engraving", "Embroidery", "Screen Print"];

type FormData = {
  name: string;
  name_th: string;
  category: string;
  description: string;
  description_th: string;
  image_url: string;
  is_new: boolean;
  is_active: boolean;
  display_order: number;
  tags: string[];
  moq: number | null;
  branding_methods: string[];
};

type Props = {
  mode: "new" | "edit";
  productId?: number;
  initial?: Partial<Omit<FormData, "tags"> & { tags: string[]; images: string[] }>;
  categories: string[];
  availableTags: string[];
};

export default function ProductForm({ mode, productId, initial, categories, availableTags }: Props) {
  const router = useRouter();
  const toast = useToast();
  const slotInputRef = useRef<HTMLInputElement>(null);
  const pendingSlotRef = useRef<number>(0);

  const [form, setForm] = useState<FormData>({
    name: initial?.name ?? "",
    name_th: initial?.name_th ?? "",
    category: initial?.category ?? categories[0] ?? "",
    description: initial?.description ?? "",
    description_th: initial?.description_th ?? "",
    image_url: initial?.image_url ?? "",
    is_new: initial?.is_new ?? false,
    is_active: initial?.is_active ?? true,
    display_order: initial?.display_order ?? 0,
    tags: initial?.tags ?? [],
    moq: initial?.moq ?? null,
    branding_methods: initial?.branding_methods ?? [],
  });

  const [allImages, setAllImages] = useState<string[]>(
    [initial?.image_url ?? "", ...(initial?.images ?? [])]
  );
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  async function uploadImage(file: File, slotIndex: number): Promise<void> {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setUploadingSlot(slotIndex);

    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error(`Upload failed: ${uploadError.message}`);
      setUploadingSlot(null);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    setAllImages((prev) => {
      const next = [...prev];
      next[slotIndex] = urlData.publicUrl;
      return next;
    });

    if (slotIndex === 0) set("image_url", urlData.publicUrl);
    setDirty(true);
    setUploadingSlot(null);
  }

  function handleSlotClick(slotIndex: number) {
    pendingSlotRef.current = slotIndex;
    slotInputRef.current?.click();
  }

  function handleSlotFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImage(file, pendingSlotRef.current);
    e.target.value = "";
  }

  function removeSlot(slotIndex: number) {
    setAllImages((prev) => {
      const next = [...prev];
      next.splice(slotIndex, 1);
      return next;
    });
    setDirty(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      name_th: form.name_th.trim(),
      category: form.category,
      description: form.description.trim(),
      description_th: form.description_th.trim(),
      image_url: allImages[0] ?? "",
      images: allImages.slice(1).filter(Boolean),
      is_new: form.is_new,
      is_active: form.is_active,
      display_order: Number(form.display_order),
      tags: form.tags,
      moq: form.moq,
      branding_methods: form.branding_methods,
    };

    try {
      if (mode === "new") {
        await createProduct(payload);
        toast.success("Product created!");
      } else {
        await updateProduct(productId!, payload);
        toast.success("Product saved!");
        setLastSaved(new Date());
        setDirty(false);
        setSaving(false);
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save product";
      setError(msg);
      toast.error(msg);
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  function toggleBranding(method: string) {
    setForm((prev) => ({
      ...prev,
      branding_methods: prev.branding_methods.includes(method)
        ? prev.branding_methods.filter((m) => m !== method)
        : [...prev.branding_methods, method],
    }));
    setDirty(true);
  }

  const showSaveBar = mode === "new" || dirty;

  return (
    <div style={{ paddingBottom: showSaveBar ? 72 : 0 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link
          href="/admin/products"
          style={{
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 7,
            color: "#555", textDecoration: "none", flexShrink: 0,
          }}
        >
          <i className="ti ti-arrow-left" style={{ fontSize: 15 }} />
        </Link>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
            {mode === "new" ? "Add product" : "Edit product"}
          </h1>
          {mode === "edit" && form.name && (
            <p style={{ fontSize: 11, color: "#aaa", margin: "2px 0 0" }}>{form.name}</p>
          )}
        </div>
      </div>

      <style>{`
        .pf-input:focus {
          border-color: #0D1E3D !important;
          box-shadow: 0 0 0 2px rgba(13,30,61,0.08) !important;
          outline: none !important;
        }
      `}</style>

      {error && (
        <div style={{
          background: "#FCEBEB", border: "1px solid #F09595", color: "#A32D2D",
          borderRadius: 8, padding: "12px 16px", fontSize: 13, marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      <input
        ref={slotInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSlotFileChange}
      />

      <form id="product-form" onSubmit={handleSubmit}>
        {/* Two-column grid: flexible left + 270px right */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_270px]">

          {/* ── LEFT COLUMN ─────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Basic information */}
            <Card label="Basic information">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <Label>Product Name (EN) *</Label>
                  <Caption>#0D1E3D, 13px bold (catalog card) / 20px (quick-view popup)</Caption>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Eco Water Bottle"
                  />
                </div>
                <div>
                  <Label>Product Name (TH)</Label>
                  <Caption>#1C2951, 14px</Caption>
                  <Input
                    value={form.name_th}
                    onChange={(e) => set("name_th", e.target.value)}
                    placeholder="e.g. กระบอกน้ำรักษ์โลก"
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                <div>
                  <Label>Category *</Label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="pf-input"
                    style={inputStyle}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.display_order}
                    onChange={(e) => set("display_order", Number(e.target.value))}
                    placeholder="0"
                  />
                  <p style={{ fontSize: 10, color: "#aaa", marginTop: 4 }}>Lower = appears first</p>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card label="Description">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <Label>Description (EN)</Label>
                  <Caption>#4B5563, 18px, relaxed line-height</Caption>
                  <textarea
                    className="pf-input"
                    rows={4}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Short product description in English"
                    style={{ ...inputStyle, height: 80, resize: "vertical" }}
                  />
                </div>
                <div>
                  <Label>Description (TH)</Label>
                  <Caption>#9CA3AF, 16px, relaxed line-height</Caption>
                  <textarea
                    className="pf-input"
                    rows={4}
                    value={form.description_th}
                    onChange={(e) => set("description_th", e.target.value)}
                    placeholder="คำอธิบายสินค้าภาษาไทย"
                    style={{ ...inputStyle, height: 80, resize: "vertical" }}
                  />
                </div>
              </div>
            </Card>

            {/* Tags */}
            <Card label="Tags" allowOverflow headerRight={form.tags.length > 0 ? `${form.tags.length} selected` : undefined}>
              <TagMultiSelect
                options={availableTags}
                selected={form.tags}
                onChange={(tags) => { setForm(prev => ({ ...prev, tags })); setDirty(true); }}
              />
              <p style={{ fontSize: 10, color: "#aaa", marginTop: 8 }}>
                Used for filtering on the catalog page. To add or rename tags, go to{" "}
                <a href="/admin/content" style={{ color: "#0D1E3D", textDecoration: "underline" }}>
                  Content settings
                </a>
                .
              </p>
            </Card>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Images */}
            <Card label="Images">
              <p style={{ fontSize: 10, color: "#aaa", marginBottom: 12 }}>
                First slot = main image. Upload up to 10 images.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                {Array.from({ length: 10 }).map((_, i) => {
                  const url = allImages[i];
                  const isUploading = uploadingSlot === i;
                  return (
                    <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden" }}>
                      {url ? (
                        <div
                          className="group"
                          style={{ width: "100%", height: "100%", cursor: "pointer" }}
                          onClick={() => handleSlotClick(i)}
                        >
                          <Image src={url} alt="" fill style={{ objectFit: "cover" }} />
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              background: "rgba(0,0,0,0.5)", display: "flex",
                              alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeSlot(i); }}
                              style={{
                                width: 26, height: 26, borderRadius: "50%",
                                background: "#A32D2D", border: "none",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "#fff",
                              }}
                            >
                              <i className="ti ti-trash" style={{ fontSize: 12 }} />
                            </button>
                          </div>
                          {i === 0 && (
                            <span style={{
                              position: "absolute", top: 3, left: 3,
                              background: "#0D1E3D", color: "#E8D5A3",
                              fontSize: 8, fontWeight: 700,
                              padding: "2px 4px", borderRadius: 3,
                              letterSpacing: "0.06em", textTransform: "uppercase",
                            }}>
                              MAIN
                            </span>
                          )}
                        </div>
                      ) : isUploading ? (
                        <div style={{
                          width: "100%", height: "100%",
                          border: "1.5px dashed #D8D5CE", borderRadius: 8,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "#FAFAF8",
                        }}>
                          <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18, color: "#0D1E3D" }} />
                        </div>
                      ) : (
                        <div
                          onClick={() => handleSlotClick(i)}
                          style={{
                            width: "100%", height: "100%",
                            border: "1.5px dashed #D8D5CE", borderRadius: 8,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center", gap: 2,
                            cursor: "pointer", background: "#FAFAF8", transition: "border-color 0.15s",
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#0D1E3D")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#D8D5CE")}
                        >
                          {i === 0 && (
                            <span style={{
                              position: "absolute", top: 3, left: 3,
                              background: "#E8E6E0", color: "#aaa",
                              fontSize: 8, fontWeight: 700,
                              padding: "2px 4px", borderRadius: 3,
                              letterSpacing: "0.06em", textTransform: "uppercase",
                            }}>
                              MAIN
                            </span>
                          )}
                          <i className="ti ti-plus" style={{ fontSize: 14, color: "#C0BDB7" }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Branding */}
            <Card label="Branding">
              <Label>Branding methods</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {BRANDING_OPTIONS.map((method) => {
                  const selected = form.branding_methods.includes(method);
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => toggleBranding(method)}
                      style={{
                        background: selected ? "#0D1E3D" : "#F5F3F0",
                        color: selected ? "#E8D5A3" : "#888",
                        border: selected ? "0.5px solid #0D1E3D" : "0.5px solid #E8E6E0",
                        fontSize: 11, padding: "5px 11px", borderRadius: 99,
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {method}
                    </button>
                  );
                })}
              </div>
              <Label>MOQ</Label>
              <Input
                type="number"
                min={0}
                value={form.moq ?? ""}
                onChange={(e) => set("moq", e.target.value === "" ? null : Number(e.target.value))}
                placeholder="e.g. 50"
              />
              <p style={{ fontSize: 10, color: "#aaa", marginTop: 4 }}>
                Shown to customers as minimum pieces per order.
              </p>
            </Card>

            {/* Visibility */}
            <Card label="Visibility">
              <ToggleRow
                label="Visible on catalog"
                description="Show this product to customers"
                checked={form.is_active}
                onChange={(v) => set("is_active", v)}
              />
              <div style={{ height: 1, background: "#F0EDE6", margin: "14px 0" }} />
              <ToggleRow
                label="Mark as New"
                description='Shows a "New" badge on the product'
                checked={form.is_new}
                onChange={(v) => set("is_new", v)}
              />
            </Card>
          </div>
        </div>
      </form>

      {/* Fixed sticky save bar */}
      {showSaveBar && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 220,
            right: 0,
            background: "#FFFFFF",
            borderTop: "0.5px solid #E8E6E0",
            padding: "12px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 20,
          }}
        >
          <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
            {(mode === "new" || dirty) && (
              <i className="ti ti-alert-triangle" style={{ fontSize: 13, color: "#D97706" }} />
            )}
            {mode === "new"
              ? "New product — not yet saved"
              : dirty
              ? "Unsaved changes"
              : lastSaved
              ? `Last saved: ${formatTimeSince(lastSaved)}`
              : ""}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              style={{
                padding: "8px 16px", background: "#FFFFFF", border: "0.5px solid #D8D5CE",
                color: "#555", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={saving || uploadingSlot !== null}
              style={{
                padding: "8px 20px", background: "#0D1E3D",
                opacity: saving || uploadingSlot !== null ? 0.5 : 1,
                color: "#E8D5A3", border: "none", borderRadius: 7,
                fontSize: 12, fontWeight: 600,
                cursor: saving || uploadingSlot !== null ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 7,
              }}
            >
              {saving && <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 13 }} />}
              {saving ? "Saving…" : mode === "new" ? "Add Product" : "Save Product"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared sub-components ─────────────────────────────── */

function Card({
  label, headerRight, children, allowOverflow,
}: {
  label: string; headerRight?: string; children: React.ReactNode; allowOverflow?: boolean;
}) {
  return (
    <div style={{ background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 10, overflow: allowOverflow ? "visible" : "hidden" }}>
      <div style={{
        padding: "12px 16px", borderBottom: "0.5px solid #E8E6E0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{label}</span>
        {headerRight && <span style={{ fontSize: 11, color: "#888" }}>{headerRight}</span>}
      </div>
      <div style={{ padding: 16 }}>
        {children}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: "block", fontSize: 10, fontWeight: 500,
      textTransform: "uppercase", letterSpacing: "0.07em",
      color: "#aaa", marginBottom: 5,
    }}>
      {children}
    </label>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, color: "#bbb", margin: "0 0 5px", lineHeight: 1.3 }}>
      Renders as: {children}
    </p>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="pf-input" style={{ ...inputStyle, ...props.style }} />;
}

function ToggleRow({
  label, description, checked, onChange,
}: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", margin: 0 }}>{label}</p>
        <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          position: "relative", width: 36, height: 20, borderRadius: 99,
          background: checked ? "#0D1E3D" : "#E8E6E0",
          border: "none", cursor: "pointer", flexShrink: 0,
          transition: "background 0.2s", padding: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: checked ? 19 : 3,
          width: 14, height: 14, borderRadius: "50%",
          background: checked ? "#E8D5A3" : "#FFFFFF",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)", transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#FFFFFF", border: "0.5px solid #E8E6E0",
  borderRadius: 7, padding: "7px 9px", fontSize: 12, color: "#333",
  outline: "none", boxSizing: "border-box",
};

function TagMultiSelect({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  function toggle(tag: string) {
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]);
  }

  const displayText = selected.length === 0
    ? "Select tags…"
    : selected.join(", ");

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger — matches Category select visually */}
      <div
        role="button"
        onClick={() => setOpen(o => !o)}
        style={{
          ...inputStyle,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", userSelect: "none",
          color: selected.length === 0 ? "#aaa" : "#333",
          borderColor: open ? "#0D1E3D" : "#E8E6E0",
          boxShadow: open ? "0 0 0 2px rgba(13,30,61,0.08)" : "none",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {displayText}
        </span>
        <i
          className={`ti ${open ? "ti-chevron-up" : "ti-chevron-down"}`}
          style={{ fontSize: 11, color: "#aaa", flexShrink: 0, marginLeft: 6 }}
        />
      </div>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 3px)", left: 0, right: 0, zIndex: 50,
          background: "#FFFFFF", border: "0.5px solid #E8E6E0",
          borderRadius: 7, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          maxHeight: 220, overflowY: "auto",
        }}>
          {options.length === 0 ? (
            <p style={{ padding: "10px 12px", fontSize: 11, color: "#aaa", margin: 0 }}>
              No tags yet — add them in Content settings.
            </p>
          ) : options.map(tag => {
            const isSelected = selected.includes(tag);
            return (
              <div
                key={tag}
                onClick={() => toggle(tag)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 10px", cursor: "pointer",
                  background: isSelected ? "rgba(13,30,61,0.04)" : "#FFFFFF",
                  borderBottom: "0.5px solid #F5F3F0",
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "#FAFAF8";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = isSelected ? "rgba(13,30,61,0.04)" : "#FFFFFF";
                }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isSelected ? "#0D1E3D" : "transparent",
                  border: isSelected ? "none" : "0.5px solid #C8C5C0",
                }}>
                  {isSelected && <i className="ti ti-check" style={{ fontSize: 9, color: "#E8D5A3" }} />}
                </div>
                <span style={{ fontSize: 12, color: isSelected ? "#0D1E3D" : "#555" }}>
                  {tag}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatTimeSince(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  return `${min} minute${min !== 1 ? "s" : ""} ago`;
}
