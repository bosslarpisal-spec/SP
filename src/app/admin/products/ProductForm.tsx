// src/app/admin/products/ProductForm.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/data";

// Remove "All" from category dropdown — products need a real category
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
  tags: string; // comma-separated string in the form, parsed to array on save
};

type Props = {
  mode: "new" | "edit";
  productId?: number;
  initial?: Partial<FormData & { tags: string[] }>;
};

export default function ProductForm({ mode, productId, initial }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initial?.image_url ?? "");

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const fileName = `product-${Date.now()}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setError(`Image upload failed: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    set("image_url", urlData.publicUrl);
    setImagePreview(urlData.publicUrl);
    setUploading(false);
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
      image_url: form.image_url.trim(),
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

      {/* Image */}
      <div>
        <label className={labelClass}>Product Image</label>
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-300 text-3xl">🖼</span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* OR paste URL */}
            <p className="text-xs text-gray-400">or paste an image URL below</p>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => {
                set("image_url", e.target.value);
                setImagePreview(e.target.value);
              }}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
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
          disabled={saving || uploading}
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