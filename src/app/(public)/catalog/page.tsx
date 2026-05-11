// src/app/(public)/catalog/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CatalogClient from "./CatalogClient";
import { CATEGORIES } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CatalogPage() {
  const supabase = await createSupabaseServerClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    return (
      <div className="section container text-center text-red-500">
        Failed to load products. Please try again later.
      </div>
    );
  }

  return <CatalogClient products={products ?? []} categories={CATEGORIES} />;
}