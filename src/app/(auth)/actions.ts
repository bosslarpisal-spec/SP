"use server";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

export async function checkIsAdmin(email: string): Promise<boolean> {
  if (!email) return false;
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("admins")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return !!data;
}
