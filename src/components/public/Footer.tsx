"use client";
import { useState } from "react";
import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/lib/data";
import { IconPhone, IconMail, IconClock, IconMapPin, IconSparkles } from "@/lib/icons";

const SOCIALS = [
  { name: "Facebook",  href: "#facebook",  bg: "#1877F2", label: "FB" },
  { name: "Instagram", href: "#instagram", bg: "#E1306C", label: "IG" },
  { name: "Line",      href: "#line",      bg: "#06C755", label: "LINE" },
  { name: "YouTube",   href: "#youtube",   bg: "#FF0000", label: "YT" },
  { name: "TikTok",    href: "#tiktok",    bg: "#010101", label: "TT" },
  { name: "Twitter/X", href: "#twitter",   bg: "#1DA1F2", label: "X" },
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
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div>
        <h4 className="font-semibold text-xl mb-1">Stay in the loop</h4>
        <p className="text-white/60 text-lg">Get new product launches, promotions, and SP news.</p>
      </div>
      {status === "ok" ? (
        <div className="flex items-center gap-2 text-green-300 text-lg font-medium bg-white/10 rounded-xl px-5 py-3"><IconSparkles className="w-4 h-4 shrink-0"/>{msg}</div>
      ) : (
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 md:w-60 px-4 py-2.5 rounded-xl text-lg text-gray-800 bg-white outline-none focus:ring-4 focus:ring-white/30" />
            <button type="submit" disabled={status==="loading"}
              className="px-5 py-2.5 bg-white text-primary rounded-xl text-lg font-semibold hover:bg-accent transition-colors whitespace-nowrap">
              {status==="loading" ? "…" : "Subscribe"}
            </button>
          </form>
          {status === "err" && <p className="text-red-300 text-base">{msg}</p>}
        </div>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/home" className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-primary font-bold text-2xl" style={{fontFamily:"Georgia,serif"}}>SP</div>
              <div>
                <div className="font-bold text-xl leading-tight">{BRAND.fullName}</div>
                <div className="text-white/60 text-base">Premiums &amp; Promotion Solution</div>
              </div>
            </Link>
            <p className="text-white/75 text-lg leading-relaxed max-w-sm mb-4">
              Specialist in premium gifts, corporate souvenirs, and branded merchandise for leading brands across Thailand and beyond.
            </p>
            <p className="text-white/50 text-base mb-4">{BRAND.taglineTH}</p>
            {/* Social row */}
            <div className="flex gap-2 flex-wrap">
              {SOCIALS.map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" title={s.name}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base font-bold hover:scale-110 transition-transform"
                  style={{background: s.bg}}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5">
              {[...NAV_LINKS, {label:"Sign In", href:"/login"}, {label:"My Account", href:"/profile"}].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 text-lg hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 tracking-wide">Contact Us</h4>
            <ul className="space-y-2.5 text-white/75 text-lg">
              {([
                {icon:<IconPhone className="w-4 h-4 shrink-0 mt-0.5 opacity-70"/>, text: BRAND.phone1},
                {icon:<IconPhone className="w-4 h-4 shrink-0 mt-0.5 opacity-70"/>, text: BRAND.phone2},
                {icon:<IconPhone className="w-4 h-4 shrink-0 mt-0.5 opacity-70"/>, text: BRAND.mobile},
                {icon:<IconMail  className="w-4 h-4 shrink-0 mt-0.5 opacity-70"/>, text: BRAND.email, href:`mailto:${BRAND.email}`},
                {icon:<IconClock className="w-4 h-4 shrink-0 mt-0.5 opacity-70"/>, text: BRAND.hours},
              ] as const).map((item,i) => (
                <li key={i} className="flex items-start gap-2">
                  {item.icon}
                  {"href" in item
                    ? <a href={item.href} className="hover:text-white transition-colors">{item.text}</a>
                    : <span>{item.text}</span>}
                </li>
              ))}
              <li className="flex items-start gap-2 pt-1">
                <IconMapPin className="w-4 h-4 shrink-0 mt-0.5 opacity-70"/>
                <div>
                  <div>{BRAND.address}</div>
                  <div className="text-white/45 text-base mt-0.5">{BRAND.addressTH}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <NewsletterStrip />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-2 text-base text-white/45">
          <span>© 2025 {BRAND.fullName} Co., Ltd. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
