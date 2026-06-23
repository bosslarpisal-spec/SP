"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/data";
import { useLang } from "@/contexts/LanguageContext";
import { useLogoUrl } from "@/hooks/useLogoUrl";

/* ── DB row type ──────────────────────────────────────────── */
type FR = { page: string; section: string; key: string; value: string };
type BS = Record<string, string>;

function gv(rows: FR[], page: string, section: string, key: string, fb: string): string {
  return rows.find(r => r.page === page && r.section === section && r.key === key)?.value ?? fb;
}
function gs(obj: Record<string, BS>, key: string, def: BS): BS {
  const ov = obj[key] ?? {};
  return { color: ov.color ?? def.color, fontSize: ov.fontSize ?? def.fontSize };
}
function ga<T>(rows: FR[], page: string, section: string, key: string, fb: T[]): T[] {
  const v = rows.find(r => r.page === page && r.section === section && r.key === key)?.value;
  if (!v) return fb;
  try { return JSON.parse(v) as T[]; } catch { return fb; }
}

/* ── Defaults (match FooterEditor DEFAULTS exactly) ──────── */
const DEFAULT_SERVICES: { label: string }[] = [
  { label: "Premium Gifts" }, { label: "Corporate Souvenirs" },
  { label: "New Year Sets" }, { label: "Custom Branding" },
  { label: "OEM Manufacturing" }, { label: "Logistics & Delivery" },
];

type QuickLink = { label_en: string; label_th: string; href: string };
const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { label_en: "Home",     label_th: "หน้าหลัก",     href: "/home" },
  { label_en: "About",    label_th: "เกี่ยวกับเรา",  href: "/about" },
  { label_en: "Services", label_th: "บริการ",        href: "/services" },
  { label_en: "Our Work", label_th: "ผลงาน",         href: "/our-work" },
  { label_en: "Contact",  label_th: "ติดต่อ",        href: "/contact" },
  { label_en: "Sign In",  label_th: "เข้าสู่ระบบ",   href: "/login" },
];

/* ── Newsletter ───────────────────────────────────────────── */
function Newsletter() {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
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

/* ── Footer ───────────────────────────────────────────────── */
export default function Footer() {
  const { t }   = useLang();
  const logoUrl = useLogoUrl();
  const [rows, setRows] = useState<FR[]>([]);

  useEffect(() => {
    supabase
      .from("page_content")
      .select("page, section, key, value")
      .in("page", ["site", "contact"])
      .then(({ data }) => setRows(data ?? []));
  }, []);

  /* ── Resolved content ─── */
  const companyName       = gv(rows, "site", "footer", "company_name",       BRAND.fullName);
  const tagline           = gv(rows, "site", "footer", "tagline",            "Premiums & Promotion");
  const description       = gv(rows, "site", "footer", "description",        "Specialist in premium gifts, corporate souvenirs, and branded merchandise.");
  const descriptionTh     = gv(rows, "site", "footer", "description_th",     BRAND.taglineTH);
  const newsletterHeading = gv(rows, "site", "footer", "newsletter_heading", "Get new product launches & SP news.");
  const copyrightYear     = gv(rows, "site", "footer", "copyright_year",     "2025");

  /* ── Brand styles ─── */
  const footerSt: Record<string, BS> = (() => {
    try { return JSON.parse(gv(rows, "site", "footer", "_styles", "{}")); } catch { return {}; }
  })();
  const stCompanyName       = gs(footerSt, "companyName",       { color: "#FFFFFF",  fontSize: "14px" });
  const stTagline           = gs(footerSt, "tagline",           { color: "#243160",  fontSize: "11px" });
  const stDescription       = gs(footerSt, "description",       { color: "#6A7A9A",  fontSize: "12px" });
  const stDescriptionTh     = gs(footerSt, "descriptionTh",     { color: "#243160",  fontSize: "12px" });
  const stNewsletterHeading = gs(footerSt, "newsletterHeading", { color: "#243160",  fontSize: "12px" });

  const services   = ga<{ label: string }>(rows, "site", "footer", "services_items", DEFAULT_SERVICES);
  const quickLinks = ga<QuickLink>(rows, "site", "footer", "quick_links", DEFAULT_QUICK_LINKS);

  const phone1  = gv(rows, "contact", "info", "phone1",  BRAND.phone1);
  const phone2  = gv(rows, "contact", "info", "phone2",  BRAND.phone2);
  const email   = gv(rows, "contact", "info", "email",   BRAND.email);
  const hours   = gv(rows, "contact", "info", "hours",   BRAND.hours);
  const address = gv(rows, "contact", "info", "address", BRAND.address);

  const socials = [
    { label: "FB",   href: gv(rows, "contact", "social", "facebook",  BRAND.social.facebook)  },
    { label: "IG",   href: gv(rows, "contact", "social", "instagram", BRAND.social.instagram) },
    { label: "LINE", href: gv(rows, "contact", "social", "line",      BRAND.social.line)      },
    { label: "YT",   href: gv(rows, "contact", "social", "youtube",   BRAND.social.youtube)   },
    { label: "TT",   href: gv(rows, "contact", "social", "tiktok",    BRAND.social.tiktok)    },
  ].filter(s => s.href && s.href !== "#");

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
                width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden",
                background: "#FFFFFF", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(232,213,163,0.3)",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Siam Premium Product Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: stCompanyName.fontSize, fontWeight: 500, color: stCompanyName.color }}>{companyName}</div>
                <div style={{ fontSize: stTagline.fontSize, color: stTagline.color, marginTop: "1px" }}>{tagline}</div>
              </div>
            </Link>
            <p style={{ lineHeight: 1.7, marginBottom: "8px", fontSize: stDescription.fontSize, color: stDescription.color }}>
              {description}<br />
              <span style={{ color: stDescriptionTh.color, fontSize: stDescriptionTh.fontSize }}>{descriptionTh}</span>
            </p>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{
                      fontSize: "10px", fontWeight: 500, color: "#E8D5A3",
                      background: "rgba(232,213,163,0.1)",
                      border: "0.5px solid rgba(232,213,163,0.2)",
                      padding: "4px 8px", borderRadius: "3px",
                    }}>{s.label}</a>
                ))}
              </div>
            )}
            <p style={{ fontSize: stNewsletterHeading.fontSize, color: stNewsletterHeading.color, marginBottom: "6px" }}>{newsletterHeading}</p>
            <Newsletter />
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8A9AB8", marginBottom: "12px" }}>
              {t("ลิงก์ด่วน", "Quick Links")}
            </h4>
            <ul className="space-y-[10px]">
              {quickLinks.map(ql => (
                <li key={ql.href + ql.label_en}>
                  <Link href={ql.href} style={{ fontSize: "12px", color: "#6A7A9A" }}>
                    {t(ql.label_th, ql.label_en)}
                  </Link>
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
              {services.map(s => (
                <li key={s.label} style={{ fontSize: "12px", color: "#6A7A9A" }}>{s.label}</li>
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
                { icon: "ti-phone",   text: `${phone1} / ${phone2}` },
                { icon: "ti-mail",    text: email },
                { icon: "ti-clock",   text: hours },
                { icon: "ti-map-pin", text: address },
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
            © {copyrightYear} {companyName} Co., Ltd. {t("สงวนลิขสิทธิ์", "All rights reserved")}.
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