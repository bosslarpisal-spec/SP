// src/app/admin/products/[id]/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();

  // Need to bypass RLS (inactive products need to be editable too)
  // We use the server client which runs as authenticated user
  // The admin check is already done in middleware
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-1">
          Editing: <span className="font-medium text-gray-700">{product.name}</span>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm
          mode="edit"
          productId={product.id}
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
          }}
        />
      </div>
    </div>
  );
}