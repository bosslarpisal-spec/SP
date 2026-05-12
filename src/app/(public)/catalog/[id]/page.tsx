// src/app/(public)/catalog/[id]/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();

  // Fetch WITHOUT the is_active filter so we can distinguish
  // "product doesn't exist" vs "product is hidden"
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  // Product truly doesn't exist in the DB → real 404
  if (error || !product) {
    notFound();
  }

  // Product exists but admin has hidden it → friendly message
  if (!product.is_active) {
    return (
      <div className="section-sm">
        <div className="container max-w-2xl">
          <div className="mb-6">
            <a href="/catalog" className="text-sm text-gray-500 hover:text-primary transition-colors">
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
            <a href="/catalog" className="btn-primary">
              Browse Catalog
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Product is active → render normally
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