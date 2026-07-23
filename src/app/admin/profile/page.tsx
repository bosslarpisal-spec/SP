import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";
import { unstable_cache } from "next/cache";
import AdminProfileClient from "./AdminProfileClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type AuthInfo = { lastSignInAt: string | null };

// Cached for 60s — this lists every auth user on the project just to check a
// handful of admin emails, so it's worth not re-running on every page load.
// A newly-added admin's "pending sign-up" badge is unaffected by this cache
// (that's driven by optimistic client state, not this fetch); the only
// staleness this introduces is that a badge can take up to 60s to clear
// after someone actually signs up, which is fine for an internal tool.
const getAllAuthUsers = unstable_cache(
  async (): Promise<Record<string, AuthInfo>> => {
    const service = createSupabaseServiceClient();
    const users: Record<string, AuthInfo> = {};
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
        if (u.email) users[u.email.toLowerCase()] = { lastSignInAt: u.last_sign_in_at ?? null };
      }
      if (data.users.length < 1000) break;
    }
    return users;
  },
  ["admin-profile-auth-users"],
  { revalidate: 60 }
);

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
    getAllAuthUsers(),
  ]);
  const admins = (adminRows ?? []).map((a) => {
    const info = authUsers[a.email.toLowerCase()];
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
