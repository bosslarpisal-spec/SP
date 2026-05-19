import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: email.trim().toLowerCase() });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "You are already subscribed!" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
