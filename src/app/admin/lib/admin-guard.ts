// src/app/admin/lib/admin-guard.ts
"use server";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";

/**
 * Verifies the caller is an authenticated admin.
 * Uses session client for getUser() (requires cookies),
 * then service client to check the admins table (bypasses RLS).
 * Returns the user object so callers can access user.id / user.email.
 */
export async function assertAdmin() {
  const sessionClient = await createSupabaseServerClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user?.email) throw new Error("Not authenticated");

  const service = createSupabaseServiceClient();
  const { data: adminRow } = await service
    .from("admins")
    .select("id")
    .eq("email", (user.email ?? "").toLowerCase())
    .maybeSingle();

  if (!adminRow) throw new Error("Not authorized");
  return user;
}
