import { NextRequest, NextResponse } from "next/server";

// In production: save to email marketing service (Mailchimp, etc.)
const subscribers: string[] = [];

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (subscribers.includes(email)) {
    return NextResponse.json({ error: "You are already subscribed!" }, { status: 409 });
  }
  subscribers.push(email);
  console.log("Newsletter subscriber:", email); // In production: send to Mailchimp/etc
  return NextResponse.json({ ok: true });
}
