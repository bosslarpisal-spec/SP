// src/app/admin/profile/page.tsx
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";
import AdminProfileClient from "./AdminProfileClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Use service role to bypass RLS — the admins table SELECT policy
  // restricts each user to their own row only, so the session client
  // would silently return only 1 row.
  const service = createSupabaseServiceClient();
  const { data: admins } = await service
    .from("admins")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <AdminProfileClient
      currentUserEmail={user.email ?? ""}
      admins={admins ?? []}
    />
  );
}