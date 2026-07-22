// src/app/admin/products/actions.ts
"use server";

import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { Result, toError } from "@/app/admin/lib/actionResult";

export type ProductPayload = {
  name: string;
  name_th: string;
  category: string;
  description: string;
  description_th: string;
  image_url: string;
  images: string[];
  is_new: boolean;
  is_active: boolean;
  display_order: number;
  tags: string[];
  moq: number | null;
  branding_methods: string[];
};

export async function toggleProductActive(id: number, isActive: boolean): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service.from("products").update({ is_active: !isActive }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/home");
    revalidatePath(`/catalog/${id}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "products/actions.toggleProductActive") };
  }
}

export async function deleteProduct(id: number): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();

    const { data: product } = await service
      .from("products")
      .select("image_url, images")
      .eq("id", id)
      .single();

    const { error } = await service.from("products").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    const urls = [product?.image_url, ...(product?.images ?? [])].filter(Boolean) as string[];
    const paths = urls
      .map((url) => url.split("/product-images/")[1])
      .filter(Boolean) as string[];
    if (paths.length > 0) {
      const { error: storageError } = await service.storage.from("product-images").remove(paths);
      if (storageError) console.error("Failed to clean up product images:", storageError.message);
    }

    revalidatePath("/home");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "products/actions.deleteProduct") };
  }
}

export async function createProduct(payload: ProductPayload): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service.from("products").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/home");
    revalidatePath("/admin/products");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "products/actions.createProduct") };
  }
}

export async function updateProduct(id: number, payload: ProductPayload): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service.from("products").update(payload).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/home");
    revalidatePath("/admin/products");
    revalidatePath(`/catalog/${id}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "products/actions.updateProduct") };
  }
}
