"use server";

import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function saveContentField(
  page: string,
  section: string,
  key: string,
  value: string
) {
  await assertAdmin();
  const service = createSupabaseServiceClient();
  const { error } = await service
    .from("page_content")
    .upsert(
      { page, section, key, value, updated_at: new Date().toISOString() },
      { onConflict: "page,section,key" }
    );
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/our-work");
  revalidatePath("/contact");
  revalidatePath("/admin/content");
  return { success: true };
}

export async function saveVisibility(
  page: string,
  section: string,
  isVisible: boolean
) {
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
  if (error) throw new Error(error.message);
  revalidatePath("/home");
  revalidatePath("/admin/content");
  return { success: true };
}
