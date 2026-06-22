"use client";
import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/data";
import { useLang } from "@/contexts/LanguageContext";
import { useLogoUrl } from "@/hooks/useLogoUrl";

const SERVICES = [
  "Premium Gifts", "Corporate Souvenirs", "New Year Sets",
  "Custom Branding", "OEM Manufacturing", "Logistics & Delivery",
];

const SOCIALS = ["FB", "IG", "LINE", "YT", "TT"];

function Newsletter() {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"err">("idle");
  const [msg,    setMsg]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res  = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await res.json().catch(() => ({}));
    if (res.ok) { setStatus("ok"); setMsg("You're subscribed!"); setEmail(""); }
    else        { setStatus("err"); setMsg(data.error ?? "Something went wrong."); }
  }

  if (status === "ok") return <p style={{ fontSize: "11px", color: "#E8D5A3" }}>{msg}</p>;
  return (
    <form onSubmit={handleSubmit} className="flex gap-1.5">
      <input
        type="email" required value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        style={{
          flex: 1, fontSize: "11px", color: "#E8D5A3",
          background: "rgba(255,255,255,0.05)",
          border: "0.5px solid rgba(232,213,163,0.2)",
          borderRadius: "4px", padding: "7px 9px",
        }}
      />
      <button
        type="submit" disabled={status === "loading"}
        style={{
          fontSize: "10px", fontWeight: 600,
          background: "#E8D5A3", color: "#1C2951",
          padding: "7px 10px", borderRadius: "4px",
          whiteSpace: "nowrap", cursor: "pointer",
        }}
      >
        {status === "loading" ? "…" : "Subscribe"}
      </button>
    </form>
  );
}

export default function Footer() {
  const { t }   = useLang();
  const logoUrl = useLogoUrl();
  const QUICK_LINKS = [
    { label: t("หน้าหลัก", "Home"),        href: "/home" },
    { label: t("เกี่ยวกับเรา", "About"),   href: "/about" },
    { label: t("บริการ", "Services"),      href: "/services" },
    { label: t("ผลงาน", "Our Work"),       href: "/our-work" },
    { label: t("ติดต่อ", "Contact"),       href: "/contact" },
    { label: t("เข้าสู่ระบบ", "Sign In"),  href: "/login" },
  ];

  return (
    <footer style={{ background: "#0D1E3D", borderTop: "0.5px solid rgba(232,213,163,0.1)" }}>
      <div style={{ padding: "40px 64px 0" }}>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-6"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}
        >
          {/* Brand + newsletter */}
          <div>
            <Link href="/home" className="flex items-center gap-[10px] mb-3">
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#FFFFFF",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(232,213,163,0.3)",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="Siam Premium Product Logo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>{BRAND.fullName}</div>
                <div style={{ fontSize: "11px", color: "#243160", marginTop: "1px" }}>Premiums &amp; Promotion</div>
              </div>
            </Link>
            <p style={{ fontSize: "12px", color: "#6A7A9A", lineHeight: 1.7, marginBottom: "8px" }}>
              Specialist in premium gifts, corporate souvenirs, and branded merchandise.<br />
              <span style={{ color: "#243160" }}>{BRAND.taglineTH}</span>
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {SOCIALS.map(s => (
                <a key={s} href="#" aria-label={s}
                  style={{
                    fontSize: "10px", fontWeight: 500, color: "#E8D5A3",
                    background: "rgba(232,213,163,0.1)",
                    border: "0.5px solid rgba(232,213,163,0.2)",
                    padding: "4px 8px", borderRadius: "3px",
                  }}>{s}</a>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "#243160", marginBottom: "6px" }}>
              Get new product launches &amp; SP news.
            </p>
            <Newsletter />
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8A9AB8", marginBottom: "12px" }}>
              {t("ลิงก์ด่วน", "Quick Links")}
            </h4>
            <ul className="space-y-[10px]">
              {QUICK_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: "12px", color: "#6A7A9A" }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8A9AB8", marginBottom: "12px" }}>
              Services
            </h4>
            <ul className="space-y-[10px]">
              {SERVICES.map(s => (
                <li key={s} style={{ fontSize: "12px", color: "#6A7A9A" }}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8A9AB8", marginBottom: "12px" }}>
              {t("ติดต่อ", "Contact")}
            </h4>
            <ul className="space-y-[10px]">
              {[
                { icon: "ti-phone",   text: `${BRAND.phone1} / ${BRAND.phone2}` },
                { icon: "ti-mail",    text: BRAND.email },
                { icon: "ti-clock",   text: BRAND.hours },
                { icon: "ti-map-pin", text: `${BRAND.address}` },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <i className={`ti ${item.icon}`} style={{ fontSize: "14px", color: "#E8D5A3", marginTop: "1px", flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "#6A7A9A", lineHeight: 1.5 }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding: "0 64px" }}>
        <div className="flex flex-wrap justify-between items-center gap-2 py-3">
          <span style={{ fontSize: "11px", color: "#1C2951" }}>
            © 2025 {BRAND.fullName} Co., Ltd. {t("สงวนลิขสิทธิ์", "All rights reserved")}.
          </span>
          <div className="flex gap-4">
            <Link href="/contact" style={{ fontSize: "11px", color: "#1C2951" }}>Privacy Policy</Link>
            <Link href="/contact" style={{ fontSize: "11px", color: "#1C2951" }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}