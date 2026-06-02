// src/app/admin/products/AdminProductsClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toggleProductActive, deleteProduct as deleteProductAction } from "./actions";

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

export default function AdminProductsClient({
  products: initial,
}: {
  products: Product[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function toggleActive(product: Product) {
    setLoadingId(product.id);
    setActionError(null);
    try {
      await toggleProductActive(product.id, product.is_active);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, is_active: !p.is_active } : p
        )
      );
      router.refresh();
    } catch (err) {
      setActionError(`Failed to update "${product.name}": ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    setLoadingId(null);
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    setLoadingId(product.id);
    setActionError(null);
    try {
      await deleteProductAction(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      router.refresh();
    } catch (err) {
      setActionError(`Failed to delete "${product.name}": ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    setLoadingId(null);
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-400 mb-4">No products yet.</p>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold"
        >
          Add your first product
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
    {actionError && (
      <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {actionError}
      </div>
    )}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-600 w-16">Image</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Category</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Tags</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr
              key={p.id}
              className={`hover:bg-gray-50 transition-colors ${!p.is_active ? "opacity-50" : ""}`}
            >
              <td className="px-4 py-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                  <Image src={p.image_url} alt={p.name} fill style={{ objectFit: "cover" }} />
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-gray-400 text-xs">{p.name_th}</p>
                {p.is_new && (
                  <span className="inline-block mt-0.5 text-xs bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className="bg-accent text-primary text-xs font-medium px-2 py-1 rounded-full">
                  {p.category}
                </span>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => toggleActive(p)}
                  disabled={loadingId === p.id}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    p.is_active ? "bg-green-500" : "bg-gray-300"
                  } ${loadingId === p.id ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={p.is_active ? "Click to hide" : "Click to show"}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      p.is_active ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <p className="text-xs text-gray-400 mt-0.5">
                  {p.is_active ? "Visible" : "Hidden"}
                </p>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p)}
                    disabled={loadingId === p.id}
                    className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}