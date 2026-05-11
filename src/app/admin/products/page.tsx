// src/app/admin/products/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import AdminProductsClient from "./AdminProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch ALL products (including inactive) — admin sees everything
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-xl">
        Failed to load products: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">
            {products?.length ?? 0} products total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <AdminProductsClient products={products ?? []} />
    </div>
  );
}