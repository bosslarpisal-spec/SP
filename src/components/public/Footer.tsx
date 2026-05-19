"use client";
import { useState } from "react";
import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/lib/data";
import { IconPhone, IconMail, IconClock, IconMapPin, IconSparkles } from "@/lib/icons";

/* ── Inline SVG brand social icons ── */
const SOCIALS = [
  {
    label: "Facebook",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#C09A5B"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  {
    label: "Instagram",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="#C09A5B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="#C09A5B" stroke="none"/></svg>,
  },
  {
    label: "LINE",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#C09A5B"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>,
  },
  {
    label: "YouTube",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#C09A5B"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
  {
    label: "TikTok",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#C09A5B"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>,
  },
  {
    label: "X",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#C09A5B"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
];

function NewsletterStrip() {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"err">("idle");
  const [msg,    setMsg]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res  = await fetch("/api/newsletter", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (res.ok) { setStatus("ok");  setMsg("You're subscribed!"); setEmail(""); }
    else        { setStatus("err"); setMsg(data.error ?? "Something went wrong."); }
  }

  return (
    <div>
      <p className="text-[13px] text-[#5A4E44] mb-2">Get new product launches, promotions, and SP news.</p>
      {status === "ok" ? (
        <div className="flex items-center gap-2 text-secondary text-sm font-medium">
          <IconSparkles className="w-4 h-4 shrink-0"/>{msg}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <form onSubmit={handleSubmit} className="flex gap-1.5">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-[13px] text-[#C8B99A] outline-none focus:border-secondary/40 placeholder:text-[#5A4E44]" />
            <button type="submit" disabled={status==="loading"}
              className="bg-secondary text-primary text-[13px] font-semibold px-3 py-1.5 rounded whitespace-nowrap hover:bg-secondary-dark transition-colors">
              {status==="loading" ? "…" : "Subscribe"}
            </button>
          </form>
          {status === "err" && <p className="text-red-400 text-[13px]">{msg}</p>}
        </div>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "#1E1810" }} className="text-white">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 pb-9 border-b border-white/5">

          {/* Brand col */}
          <div>
            <Link href="/home" className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center text-secondary font-bold text-xs"
                style={{ fontFamily: "Georgia,serif" }}>SP</div>
              <div>
                <div className="font-medium text-[14px] text-[#D4C9B8] leading-tight">{BRAND.fullName}</div>
                <div className="text-[13px] text-[#5A4E44] mt-0.5">Premiums &amp; Promotion Solution</div>
              </div>
            </Link>
            <p className="text-[13px] text-[#7A6B5C] leading-relaxed mb-3 max-w-xs">
              Specialist in premium gifts, corporate souvenirs, and branded merchandise for leading brands across Thailand and beyond.
              <br/><span className="text-[#4A3A2C]">{BRAND.taglineTH}</span>
            </p>
            <div className="flex gap-1.5 mb-5">
              {SOCIALS.map(s => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center hover:bg-primary transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
            <NewsletterStrip />
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[14px] font-medium text-[#C8B99A] mb-3 tracking-wide">Quick Links</h4>
            <ul className="space-y-2">
              {[...NAV_LINKS, {label:"Sign In", href:"/login"}, {label:"My Account", href:"/profile"}].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-[#7A6B5C] hover:text-[#A09080] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[14px] font-medium text-[#C8B99A] mb-3 tracking-wide">Services</h4>
            <ul className="space-y-2">
              {["Premium Gifts","Corporate Souvenirs","New Year Packages","Custom Branding","OEM Manufacturing","Logistics & Delivery"].map(s => (
                <li key={s}><span className="text-[13px] text-[#7A6B5C] cursor-pointer hover:text-[#A09080] transition-colors">{s}</span></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[14px] font-medium text-[#C8B99A] mb-3 tracking-wide">Contact Us</h4>
            <ul className="space-y-2">
              {([
                { icon: <IconPhone className="w-3.5 h-3.5 shrink-0 mt-0.5 text-secondary"/>, text: BRAND.phone1 },
                { icon: <IconPhone className="w-3.5 h-3.5 shrink-0 mt-0.5 text-secondary"/>, text: BRAND.phone2 },
                { icon: <IconPhone className="w-3.5 h-3.5 shrink-0 mt-0.5 text-secondary"/>, text: BRAND.mobile },
                { icon: <IconMail  className="w-3.5 h-3.5 shrink-0 mt-0.5 text-secondary"/>, text: BRAND.email, href:`mailto:${BRAND.email}` },
                { icon: <IconClock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-secondary"/>, text: BRAND.hours },
              ] as const).map((item,i) => (
                <li key={i} className="flex items-start gap-2">
                  {item.icon}
                  {"href" in item
                    ? <a href={item.href} className="text-[13px] text-[#7A6B5C] hover:text-[#A09080] transition-colors leading-relaxed">{item.text}</a>
                    : <span className="text-[13px] text-[#7A6B5C] leading-relaxed">{item.text}</span>}
                </li>
              ))}
              <li className="flex items-start gap-2 pt-0.5">
                <IconMapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-secondary"/>
                <div>
                  <div className="text-[13px] text-[#7A6B5C] leading-relaxed">{BRAND.address}</div>
                  <div className="text-[13px] text-[#4A3A2C] mt-0.5">{BRAND.addressTH}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex flex-wrap justify-between items-center gap-2">
          <span className="text-[13px] text-[#3A3028]">© 2025 {BRAND.fullName} Co., Ltd. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/contact" className="text-[13px] text-[#3A3028] hover:text-[#5A4E44] transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="text-[13px] text-[#3A3028] hover:text-[#5A4E44] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
