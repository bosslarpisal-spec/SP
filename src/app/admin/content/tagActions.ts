"use server";

import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { th } from "@/app/admin/lib/admin-th";
import { Result, toError } from "@/app/admin/lib/actionResult";

type Tag = { id: string; name: string };

export async function addTag(name: string): Promise<Result<Tag>> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { data, error } = await service
      .from("tags")
      .insert({ name: name.trim().toLowerCase() })
      .select("id, name")
      .single();
    if (error) return { ok: false, error: error.message };
    revalidatePath("/home");
    revalidatePath("/admin/content");
    return { ok: true, ...(data as Tag) };
  } catch (err) {
    return { ok: false, error: toError(err, "tagActions.addTag") };
  }
}

export async function renameTag(
  id: string,
  oldName: string,
  newName: string
): Promise<Result<{ productsUpdated: number }>> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const normalizedNewName = newName.trim().toLowerCase();

    const { error: renameError } = await service
      .from("tags")
      .update({ name: normalizedNewName })
      .eq("id", id);
    if (renameError) return { ok: false, error: renameError.message };

    const { data: matchingProducts, error: fetchError } = await service
      .from("products")
      .select("id, tags")
      .contains("tags", [oldName]);
    if (fetchError) {
      return {
        ok: false,
        error: `Tag renamed, but looking up its products failed: ${fetchError.message}`,
      };
    }

    for (const p of matchingProducts ?? []) {
      const updatedTags = (p.tags as string[]).map(t =>
        t === oldName ? normalizedNewName : t
      );
      const { error: updateError } = await service
        .from("products")
        .update({ tags: updatedTags })
        .eq("id", p.id);
      if (updateError) {
        return {
          ok: false,
          error: `Tag renamed, but updating some of its products failed: ${updateError.message}`,
        };
      }
    }

    revalidatePath("/home");
    revalidatePath("/admin/content");
    revalidatePath("/admin/products");
    return { ok: true, productsUpdated: matchingProducts?.length ?? 0 };
  } catch (err) {
    return { ok: false, error: toError(err, "tagActions.renameTag") };
  }
}

export async function deleteTag(id: string, name: string): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();

    const { count, error: countError } = await service
      .from("products")
      .select("id", { count: "exact", head: true })
      .contains("tags", [name]);
    if (countError) return { ok: false, error: countError.message };

    if (count && count > 0) {
      return { ok: false, error: th.errTagDeleteBlocked(count) };
    }

    const { error } = await service.from("tags").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/home");
    revalidatePath("/admin/content");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "tagActions.deleteTag") };
  }
}
