// src/app/admin/profile/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminProfileClient from "./AdminProfileClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get all admins
  const { data: admins } = await supabase
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