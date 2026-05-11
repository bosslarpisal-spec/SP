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

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("is_active", true)
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