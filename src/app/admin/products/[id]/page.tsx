// src/app/admin/products/[id]/page.tsx
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();
  const service = createSupabaseServiceClient();

  // Products use the auth client (needs session to bypass inactive-product RLS).
  // Tags/categories use the service client to bypass RLS on those lookup tables.
  const [
    { data: product, error },
    { data: categories },
    { data: tags, error: tagsError },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single(),
    supabase
      .from("categories")
      .select("name")
      .eq("is_visible", true)
      .order("display_order"),
    service
      .from("tags")
      .select("name")
      .order("name"),
  ]);

  if (tagsError) {
    console.error("[admin/products/edit] tags query failed:", tagsError.message);
  }

  if (error || !product) {
    notFound();
  }

  return (
    <ProductForm
      mode="edit"
      productId={product.id}
      categories={categories?.map((c) => c.name) ?? []}
      availableTags={tags?.map((t) => t.name) ?? []}
      initial={{
        name: product.name,
        name_th: product.name_th,
        category: product.category,
        description: product.description,
        description_th: product.description_th,
        image_url: product.image_url,
        is_new: product.is_new,
        is_active: product.is_active,
        display_order: product.display_order,
        tags: product.tags,
        moq: product.moq ?? null,
        branding_methods: product.branding_methods ?? [],
        images: product.images ?? [],
      }}
    />
  );
}
