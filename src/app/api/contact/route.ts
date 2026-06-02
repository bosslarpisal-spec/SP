// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, phone, company, interest, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone:    phone    ?? null,
    company:  company  ?? null,
    interest: interest ?? null,
    message,
  });

  if (error) {
    console.error("[api/contact] insert failed:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
