import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";
import AdminProfileClient from "./AdminProfileClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type AuthInfo = { lastSignInAt: string | null };

async function fetchAllAuthUsers(service: ReturnType<typeof createSupabaseServiceClient>): Promise<Map<string, AuthInfo>> {
  const users = new Map<string, AuthInfo>();
  // Small-business admin list — a handful of pages is always enough. Capped so a
  // future large customer base can't turn this into an unbounded loop.
  const maxPages = 5;
  for (let page = 1; page <= maxPages; page++) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) {
      console.error("[admin/profile] listUsers failed:", error.message);
      break;
    }
    for (const u of data.users) {
      if (u.email) users.set(u.email.toLowerCase(), { lastSignInAt: u.last_sign_in_at ?? null });
    }
    if (data.users.length < 1000) break;
  }
  return users;
}

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
  const [{ data: adminRows }, authUsers] = await Promise.all([
    service
      .from("admins")
      .select("*")
      .order("created_at", { ascending: true }),
    fetchAllAuthUsers(service),
  ]);
  const admins = (adminRows ?? []).map((a) => {
    const info = authUsers.get(a.email.toLowerCase());
    return {
      ...a,
      hasAccount: !!info,
      lastSignInAt: info?.lastSignInAt ?? null,
    };
  });

  return (
    <AdminProfileClient
      currentUserEmail={user.email ?? ""}
      admins={admins}
    />
  );
}
