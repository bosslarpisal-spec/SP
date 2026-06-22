"use server";

import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function addCategory(name: string, displayOrder: number) {
  await assertAdmin();
  const service = createSupabaseServiceClient();
  const { error } = await service
    .from("categories")
    .insert({ name: name.trim(), display_order: displayOrder, is_visible: true });
  if (error) throw new Error(error.message);
  revalidatePath("/home");
  revalidatePath("/admin/content");
  return { success: true };
}

export async function renameCategory(id: string, oldName: string, newName: string) {
  await assertAdmin();
  const service = createSupabaseServiceClient();

  const { error: renameError } = await service
    .from("categories")
    .update({ name: newName.trim() })
    .eq("id", id);
  if (renameError) throw new Error(renameError.message);

  const { data: updatedProducts, error: productsError } = await service
    .from("products")
    .update({ category: newName.trim() })
    .eq("category", oldName)
    .select("id");
  if (productsError) throw new Error(productsError.message);

  revalidatePath("/home");
  revalidatePath("/admin/content");
  revalidatePath("/admin/products");
  return { success: true, productsUpdated: updatedProducts?.length ?? 0 };
}

export async function deleteCategory(id: string, name: string) {
  await assertAdmin();
  const service = createSupabaseServiceClient();

  const { count, error: countError } = await service
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category", name);
  if (countError) throw new Error(countError.message);

  if (count && count > 0) {
    throw new Error(`Cannot delete — ${count} product${count === 1 ? "" : "s"} use this category. Reassign them first.`);
  }

  const { error } = await service.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/home");
  revalidatePath("/admin/content");
  return { success: true };
}

export async function updateCategoryOrder(id: string, displayOrder: number) {
  await assertAdmin();
  const service = createSupabaseServiceClient();
  const { error } = await service
    .from("categories")
    .update({ display_order: displayOrder })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/home");
  return { success: true };
}

export async function toggleCategoryVisibility(id: string, isVisible: boolean) {
  await assertAdmin();
  const service = createSupabaseServiceClient();
  const { error } = await service
    .from("categories")
    .update({ is_visible: isVisible })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/home");
  return { success: true };
}
