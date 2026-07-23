// src/app/(public)/catalog/[id]/page.tsx
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 3600;

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Service role — this table's public RLS only allows reading active
  // products, so a plain anon-key query can no longer see hidden ones at
  // all. We still need to distinguish "doesn't exist" from "hidden" to show
  // the right message, so we bypass RLS here — but only fetch the minimal
  // columns needed for that decision. The full record (name/description/
  // images) is fetched separately, only once we know the product is active,
  // so a hidden product's details are never held server-side — let alone
  // reach the client — for longer than necessary.
  const service = createSupabaseServiceClient();

  const { data: check, error: checkError } = await service
    .from("products")
    .select("id, is_active")
    .eq("id", params.id)
    .single();

  // Product truly doesn't exist in the DB → real 404
  if (checkError || !check) {
    notFound();
  }

  // Product exists but admin has hidden it → friendly message
  if (!check.is_active) {
    return (
      <div className="section-sm">
        <div className="container max-w-2xl">
          <div className="mb-6">
            <a href="/home" className="text-sm text-gray-500 hover:text-primary transition-colors">
              ← Back to Catalog
            </a>
          </div>
          <div className="flex flex-col items-center text-center py-24">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <svg
                viewBox="0 0 24 24"
                className="w-10 h-10 stroke-gray-400 fill-none"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </div>
            <h1
              className="text-2xl font-bold text-primary mb-3"
              style={{ fontFamily: "Georgia,serif" }}
            >
              Product Unavailable
            </h1>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
              This product is not available right now. It may have been
              temporarily removed or is out of stock. Please check back later or
              explore our other products.
            </p>
            <a href="/home" className="btn-primary">
              Browse Catalog
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Product is active → fetch the full record and render normally
  const { data: product, error } = await service
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  const mapped = {
    id: product.id,
    name: product.name,
    nameTH: product.name_th,
    category: product.category,
    desc: product.description,
    descTH: product.description_th,
    image: product.image_url,
    isNew: product.is_new,
    tags: product.tags,
  };

  return <ProductDetailClient product={mapped} />;
}
