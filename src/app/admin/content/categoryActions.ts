"use server";

import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { th } from "@/app/admin/lib/admin-th";
import { Result, toError } from "@/app/admin/lib/actionResult";

type Category = { id: string; name: string; display_order: number; is_visible: boolean };

export async function addCategory(name: string, displayOrder: number): Promise<Result<Category>> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { data, error } = await service
      .from("categories")
      .insert({ name: name.trim(), display_order: displayOrder, is_visible: true })
      .select("id, name, display_order, is_visible")
      .single();
    if (error) return { ok: false, error: error.message };
    revalidatePath("/home");
    revalidatePath("/admin/content");
    return { ok: true, ...(data as Category) };
  } catch (err) {
    return { ok: false, error: toError(err, "categoryActions.addCategory") };
  }
}

export async function renameCategory(
  id: string,
  oldName: string,
  newName: string
): Promise<Result<{ productsUpdated: number }>> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();

    const { error: renameError } = await service
      .from("categories")
      .update({ name: newName.trim() })
      .eq("id", id);
    if (renameError) return { ok: false, error: renameError.message };

    const { data: updatedProducts, error: productsError } = await service
      .from("products")
      .update({ category: newName.trim() })
      .eq("category", oldName)
      .select("id");
    if (productsError) {
      // The category row itself was already renamed successfully — make that clear
      // rather than leaving the admin thinking nothing happened.
      return {
        ok: false,
        error: `Category renamed, but updating its products failed: ${productsError.message}`,
      };
    }

    revalidatePath("/home");
    revalidatePath("/admin/content");
    revalidatePath("/admin/products");
    return { ok: true, productsUpdated: updatedProducts?.length ?? 0 };
  } catch (err) {
    return { ok: false, error: toError(err, "categoryActions.renameCategory") };
  }
}

export async function deleteCategory(id: string, name: string): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();

    const { count, error: countError } = await service
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category", name);
    if (countError) return { ok: false, error: countError.message };

    if (count && count > 0) {
      return { ok: false, error: th.errCatDeleteBlocked(count) };
    }

    const { error } = await service.from("categories").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/home");
    revalidatePath("/admin/content");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "categoryActions.deleteCategory") };
  }
}

export async function updateCategoryOrder(id: string, displayOrder: number): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service
      .from("categories")
      .update({ display_order: displayOrder })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/home");
    revalidatePath("/admin/content");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "categoryActions.updateCategoryOrder") };
  }
}

export async function toggleCategoryVisibility(id: string, isVisible: boolean): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service
      .from("categories")
      .update({ is_visible: isVisible })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/home");
    revalidatePath("/admin/content");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "categoryActions.toggleCategoryVisibility") };
  }
}
