// src/app/admin/profile/actions.ts
"use server";

import { assertAdmin } from "../lib/admin-guard";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";
import { th } from "@/app/admin/lib/admin-th";

export async function addAdmin(email: string) {
  await assertAdmin();
  const clean = email.trim().toLowerCase();
  if (!clean) throw new Error(th.errEmailRequired);
  const service = createSupabaseServiceClient();
  const { data, error } = await service
    .from("admins")
    .insert({ email: clean })
    .select()
    .single();
  if (error) {
    throw new Error(
      error.code === "23505" ? th.errEmailExists : error.message
    );
  }
  return data as { id: number; email: string; created_at: string };
}

export async function removeAdmin(id: number) {
  const user = await assertAdmin();
  const service = createSupabaseServiceClient();
  const { data: target } = await service
    .from("admins")
    .select("email")
    .eq("id", id)
    .single();
  if (target?.email === user.email) {
    throw new Error(th.errCannotRemoveSelf);
  }
  const { error } = await service.from("admins").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function changeAdminEmail(newEmail: string) {
  const user = await assertAdmin();
  const clean = newEmail.trim().toLowerCase();
  if (!clean) throw new Error(th.errEmailRequired);

  // Update Supabase Auth (sends confirmation to new address)
  const sessionClient = await createSupabaseServerClient();
  const { error: authError } = await sessionClient.auth.updateUser({ email: clean });
  if (authError) throw new Error(authError.message);

  // Keep admins table in sync
  const service = createSupabaseServiceClient();
  const { error: dbError } = await service
    .from("admins")
    .update({ email: clean })
    .eq("email", user.email);
  if (dbError) {
    throw new Error(`Auth email queued but admins table sync failed: ${dbError.message}`);
  }
}

export async function changeAdminPassword(newPassword: string) {
  const user = await assertAdmin();
  if (newPassword.length < 6) throw new Error(th.errPwTooShort);
  const service = createSupabaseServiceClient();
  const { error } = await service.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });
  if (error) throw new Error(error.message);
}
