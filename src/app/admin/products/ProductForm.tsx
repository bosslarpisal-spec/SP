// src/app/admin/products/ProductForm.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/data";

const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

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
  tags: string;
};

type Props = {
  mode: "new" | "edit";
  productId?: number;
  initial?: Partial<FormData & { tags: string[]; images: string[] }>;
};

export default function ProductForm({ mode, productId, initial }: Props) {
  const router = useRouter();
  const slotInputRef = useRef<HTMLInputElement>(null);
  const pendingSlotRef = useRef<number>(0);

  const [form, setForm] = useState<FormData>({
    name: initial?.name ?? "",
    name_th: initial?.name_th ?? "",
    category: initial?.category ?? PRODUCT_CATEGORIES[0],
    description: initial?.description ?? "",
    description_th: initial?.description_th ?? "",
    image_url: initial?.image_url ?? "",
    is_new: initial?.is_new ?? false,
    is_active: initial?.is_active ?? true,
    display_order: initial?.display_order ?? 0,
    tags: Array.isArray(initial?.tags) ? initial.tags.join(", ") : (initial?.tags ?? ""),
  });

  // allImages[0] = image_url (main), allImages[1-9] = images[]
  const [allImages, setAllImages] = useState<string[]>(
    [initial?.image_url ?? "", ...(initial?.images ?? [])]
  );
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadImage(file: File, slotIndex: number): Promise<void> {
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setUploadingSlot(slotIndex);
    setError(null);

    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(`Image upload failed: ${uploadError.message}`);
      setUploadingSlot(null);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    setAllImages(prev => {
      const next = [...prev];
      next[slotIndex] = urlData.publicUrl;
      return next;
    });

    if (slotIndex === 0) {
      set("image_url", urlData.publicUrl);
    }

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
    setAllImages(prev => {
      const next = [...prev];
      next.splice(slotIndex, 1);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

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
      tags: tagsArray,
    };

    let error;

    if (mode === "new") {
      ({ error } = await supabase.from("products").insert(payload));
    } else {
      ({ error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", productId!));
    }

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Product Name (EN) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
            placeholder="e.g. Eco Water Bottle"
          />
        </div>
        <div>
          <label className={labelClass}>Product Name (TH)</label>
          <input
            type="text"
            value={form.name_th}
            onChange={(e) => set("name_th", e.target.value)}
            className={inputClass}
            placeholder="e.g. กระบอกน้ำรักษ์โลก"
          />
        </div>
      </div>

      {/* Category + display order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Category <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className={inputClass}
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Display Order</label>
          <input
            type="number"
            min={0}
            value={form.display_order}
            onChange={(e) => set("display_order", Number(e.target.value))}
            className={inputClass}
            placeholder="0"
          />
          <p className="text-xs text-gray-400 mt-1">
            Lower numbers appear first in the catalog.
          </p>
        </div>
      </div>

      {/* Description row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Description (EN)</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputClass}
            placeholder="Short product description in English"
          />
        </div>
        <div>
          <label className={labelClass}>Description (TH)</label>
          <textarea
            rows={3}
            value={form.description_th}
            onChange={(e) => set("description_th", e.target.value)}
            className={inputClass}
            placeholder="คำอธิบายสินค้าภาษาไทย"
          />
        </div>
      </div>

      {/* Product Images — 5×2 grid */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
          letterSpacing: "0.1em", color: "#C09A5B", display: "block", marginBottom: "4px" }}>
          Product Images
        </label>
        <p className="text-xs text-gray-400 mb-3">
          Upload up to 10 images total. First image is the main display image.
        </p>
        <input
          ref={slotInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSlotFileChange}
        />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => {
            const url = allImages[i];
            const isUploading = uploadingSlot === i;
            return (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                {url ? (
                  <div className="group w-full h-full cursor-pointer" onClick={() => handleSlotClick(i)}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); removeSlot(i); }}
                        className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <i className="ti ti-trash" style={{ fontSize: "14px" }} />
                      </button>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                        style={{ background: "#C09A5B", color: "#2C1E14" }}>
                        Main
                      </span>
                    )}
                  </div>
                ) : isUploading ? (
                  <div className="w-full h-full border-2 border-dashed rounded-xl flex items-center justify-center"
                    style={{ borderColor: "rgba(192,154,91,0.3)", background: "#F7F5F2" }}>
                    <i className="ti ti-loader-2 animate-spin" style={{ fontSize: "20px", color: "#C09A5B" }} />
                  </div>
                ) : (
                  <div
                    onClick={() => handleSlotClick(i)}
                    className="w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                    style={{ borderColor: "rgba(192,154,91,0.3)", background: "#F7F5F2" }}
                  >
                    <i className="ti ti-plus" style={{ fontSize: "18px", color: "#C09A5B" }} />
                    <span className="text-xs" style={{ color: "#C09A5B" }}>Add</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass}>Tags</label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
          className={inputClass}
          placeholder="eco, custom, gift  (comma-separated)"
        />
        <p className="text-xs text-gray-400 mt-1">
          Comma-separated. Used for search on the catalog page.
        </p>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_new}
            onChange={(e) => set("is_new", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-gray-700">
            Mark as <span className="text-green-600">New</span>
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => set("is_active", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-gray-700">
            Visible on public catalog
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <button
          type="submit"
          disabled={saving || uploadingSlot !== null}
          className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving
            ? "Saving…"
            : mode === "new"
            ? "Add Product"
            : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
