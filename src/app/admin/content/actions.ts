"use server";

import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { Result, toError } from "@/app/admin/lib/actionResult";

export async function saveContentField(
  page: string,
  section: string,
  key: string,
  value: string
): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service
      .from("page_content")
      .upsert(
        { page, section, key, value, updated_at: new Date().toISOString() },
        { onConflict: "page,section,key" }
      );
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/home");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/our-work");
    revalidatePath("/contact");
    revalidatePath("/admin/content");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "content/actions.saveContentField") };
  }
}

export async function saveVisibility(
  page: string,
  section: string,
  isVisible: boolean
): Promise<Result> {
  try {
    await assertAdmin();
    const service = createSupabaseServiceClient();
    const { error } = await service
      .from("page_content")
      .upsert(
        {
          page,
          section,
          key: "is_visible",
          value: isVisible.toString(),
          type: "boolean",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page,section,key" }
      );
    if (error) return { ok: false, error: error.message };
    revalidatePath("/home");
    revalidatePath("/admin/content");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: toError(err, "content/actions.saveVisibility") };
  }
}
