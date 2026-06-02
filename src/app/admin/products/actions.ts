// src/app/admin/products/actions.ts
"use server";

import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Not authenticated");

  const { data: adminRow } = await supabase
    .from("admins")
    .select("id")
    .eq("email", user.email)
    .maybeSingle();

  if (!adminRow) throw new Error("Not authorized");
}

export async function toggleProductActive(id: number, isActive: boolean) {
  await assertAdmin();
  const service = createSupabaseServiceClient();
  const { error } = await service.from("products").update({ is_active: !isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/home");
  revalidatePath(`/catalog/${id}`);
}

export async function deleteProduct(id: number) {
  await assertAdmin();
  const service = createSupabaseServiceClient();
  const { error } = await service.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/home");
}
