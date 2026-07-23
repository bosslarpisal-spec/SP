// src/app/admin/products/new/page.tsx
import { assertAdmin } from "../../lib/admin-guard";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  try {
    await assertAdmin();
  } catch {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const service = createSupabaseServiceClient();
  const [{ data: categories }, { data: tags, error: tagsError }] = await Promise.all([
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
    console.error("[admin/products/new] tags query failed:", tagsError.message);
  }

  return (
    <ProductForm
      mode="new"
      categories={categories?.map((c) => c.name) ?? []}
      availableTags={tags?.map((t) => t.name) ?? []}
    />
  );
}
