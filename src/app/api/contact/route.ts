import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { isRateLimited, clientIp } from "@/lib/rateLimit";

const resend   = new Resend(process.env.RESEND_API_KEY);
const FROM     = "SP Contact Form <onboarding@resend.dev>";
const FALLBACK = "spproduce.dist@gmail.com";

export async function POST(request: Request) {
  if (isRateLimited(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, phone, company, interest, message, website } = body;

  // Honeypot — a real browser never fills this hidden field in; only bots do.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  for (const [key, value] of Object.entries({ name, email, phone, company, interest, message })) {
    if (value !== undefined && typeof value !== "string") {
      return NextResponse.json({ error: `Invalid value for field "${key}"` }, { status: 400 });
    }
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  /* ── resolve destination from admin content, fall back to hardcoded ── */
  const supabase = createSupabaseServiceClient();
  const { data: rows } = await supabase
    .from("page_content")
    .select("value")
    .eq("page",    "contact")
    .eq("section", "info")
    .eq("key",     "email")
    .maybeSingle();
  const adminEmail = rows?.value?.trim();
  const TO = adminEmail && adminEmail.includes("@") ? adminEmail : FALLBACK;

  const subject = `New enquiry from ${name.trim()} — SP Contact Form`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><style>
  body { font-family: Georgia, serif; background: #F8F6F1; margin: 0; padding: 32px 16px; color: #0D1E3D; }
  .card { background: #fff; border-radius: 12px; max-width: 560px; margin: 0 auto;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08); overflow: hidden; }
  .header { background: #1C2951; padding: 28px 32px; }
  .header h1 { margin: 0; font-size: 20px; font-weight: 400; color: #E8D5A3; letter-spacing: -0.01em; }
  .header p  { margin: 6px 0 0; font-size: 12px; color: rgba(255,255,255,0.55); font-family: system-ui, sans-serif; }
  .body { padding: 28px 32px; }
  .row { margin-bottom: 18px; }
  .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;
           color: #8A6E00; font-family: system-ui, sans-serif; margin-bottom: 4px; }
  .value { font-size: 14px; color: #0D1E3D; line-height: 1.6; }
  .divider { border: none; border-top: 1px solid rgba(13,30,61,0.08); margin: 20px 0; }
  .message-box { background: #F8F6F1; border-radius: 8px; padding: 16px 20px;
                 font-size: 14px; color: #2C3E50; line-height: 1.7; white-space: pre-wrap; }
  .footer { padding: 16px 32px; background: #F8F6F1; border-top: 1px solid rgba(13,30,61,0.06);
            font-size: 11px; color: #9CA3AF; font-family: system-ui, sans-serif; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <h1>New Contact Form Submission</h1>
    <p>Received via siampremium.co.th/contact</p>
  </div>
  <div class="body">
    <div class="row">
      <div class="label">Full Name</div>
      <div class="value">${esc(name)}</div>
    </div>
    <div class="row">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${esc(email)}" style="color:#1C2951">${esc(email)}</a></div>
    </div>
    ${phone ? `<div class="row"><div class="label">Phone</div><div class="value">${esc(phone)}</div></div>` : ""}
    ${company ? `<div class="row"><div class="label">Company</div><div class="value">${esc(company)}</div></div>` : ""}
    ${interest ? `<div class="row"><div class="label">Interested In</div><div class="value">${esc(interest)}</div></div>` : ""}
    <hr class="divider" />
    <div class="row">
      <div class="label">Message</div>
      <div class="message-box">${esc(message)}</div>
    </div>
  </div>
  <div class="footer">
    This email was sent automatically when someone submitted the contact form on your website.
    Reply directly to <strong>${esc(email)}</strong> to respond.
  </div>
</div>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from:     FROM,
    to:       TO,
    replyTo:  email.trim(),
    subject,
    html,
  });

  if (error) {
    console.error("[api/contact] Resend error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
