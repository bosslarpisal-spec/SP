import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: adminRow } = await supabase
    .from("admins")
    .select("id")
    .eq("email", user.email ?? "")
    .maybeSingle();

  if (!adminRow) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  revalidatePath("/catalog", "page");
  revalidatePath("/catalog/[id]", "page");
  revalidatePath("/home", "page");
  return NextResponse.json({ revalidated: true });
}