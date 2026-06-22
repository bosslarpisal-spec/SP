"use server";

import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function addTag(name: string) {
  await assertAdmin();
  const service = createSupabaseServiceClient();
  const { error } = await service
    .from("tags")
    .upsert({ name: name.trim().toLowerCase() }, { onConflict: "name", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
  revalidatePath("/home");
  revalidatePath("/admin/content");
  return { success: true };
}

export async function renameTag(id: string, oldName: string, newName: string) {
  await assertAdmin();
  const service = createSupabaseServiceClient();
  const normalizedNewName = newName.trim().toLowerCase();

  const { error: renameError } = await service
    .from("tags")
    .update({ name: normalizedNewName })
    .eq("id", id);
  if (renameError) throw new Error(renameError.message);

  const { data: matchingProducts, error: fetchError } = await service
    .from("products")
    .select("id, tags")
    .contains("tags", [oldName]);
  if (fetchError) throw new Error(fetchError.message);

  for (const p of matchingProducts ?? []) {
    const updatedTags = (p.tags as string[]).map(t =>
      t === oldName ? normalizedNewName : t
    );
    const { error: updateError } = await service
      .from("products")
      .update({ tags: updatedTags })
      .eq("id", p.id);
    if (updateError) throw new Error(updateError.message);
  }

  revalidatePath("/home");
  revalidatePath("/admin/content");
  revalidatePath("/admin/products");
  return { success: true, productsUpdated: matchingProducts?.length ?? 0 };
}

export async function deleteTag(id: string, name: string) {
  await assertAdmin();
  const service = createSupabaseServiceClient();

  const { count, error: countError } = await service
    .from("products")
    .select("id", { count: "exact", head: true })
    .contains("tags", [name]);
  if (countError) throw new Error(countError.message);

  if (count && count > 0) {
    throw new Error(`Cannot delete — ${count} product${count === 1 ? "" : "s"} use this tag. Reassign them first.`);
  }

  const { error } = await service.from("tags").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/home");
  revalidatePath("/admin/content");
  return { success: true };
}
