import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Service-role client — the admins table's SELECT policy only allows a user to
  // read their own row; using the anon/session client here can silently 403 a
  // legitimate admin. Lowercase to match how emails are always stored.
  const service = createSupabaseServiceClient();
  const { data: adminRow } = await service
    .from("admins")
    .select("id")
    .eq("email", (user.email ?? "").toLowerCase())
    .maybeSingle();

  if (!adminRow) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  revalidatePath("/catalog", "page");
  revalidatePath("/catalog/[id]", "page");
  revalidatePath("/home", "page");
  return NextResponse.json({ revalidated: true });
}