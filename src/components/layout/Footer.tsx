"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/data";
import { useLang } from "@/contexts/LanguageContext";

/* ── Social platform SVG icons ───────────────────────────── */
function IconFacebook() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}
function IconLineApp() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  );
}
function IconYouTube() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}
function IconTikTok() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

/* ── DB helpers ───────────────────────────────────────────── */
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

/* ── Defaults ─────────────────────────────────────────────── */
const DEFAULT_SERVICES: { label: string }[] = [
  { label: "Premium Gifts" }, { label: "Corporate Souvenirs" },
  { label: "New Year Sets" }, { label: "Custom Branding" },
  { label: "OEM Manufacturing" }, { label: "Logistics & Delivery" },
];

type QuickLink = { label_en: string; label_th: string; href: string };
const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { label_en: "Home",     label_th: "หน้าหลัก",     href: "/home"     },
  { label_en: "About",    label_th: "เกี่ยวกับเรา",  href: "/about"    },
  { label_en: "Services", label_th: "บริการ",        href: "/services" },
  { label_en: "Our Work", label_th: "ผลงาน",         href: "/our-work" },
  { label_en: "Contact",  label_th: "ติดต่อ",        href: "/contact"  },
  { label_en: "Sign In",  label_th: "เข้าสู่ระบบ",   href: "/login"    },
];

/* ── Footer ───────────────────────────────────────────────── */
export default function Footer() {
  const { t } = useLang();
  const [rows, setRows] = useState<FR[]>([]);

  useEffect(() => {
    supabase
      .from("page_content")
      .select("page, section, key, value")
      .in("page", ["site", "contact"])
      .then(({ data }) => setRows(data ?? []));
  }, []);

  /* ── Content ─── */
  const companyName   = gv(rows, "site", "footer", "company_name",   BRAND.fullName);
  const tagline       = gv(rows, "site", "footer", "tagline",        "Premiums & Promotion");
  const description   = gv(rows, "site", "footer", "description",    "Specialist in premium gifts, corporate souvenirs, and branded merchandise.");
  const descriptionTh = gv(rows, "site", "footer", "description_th", BRAND.taglineTH);
  const copyrightYear = gv(rows, "site", "footer", "copyright_year", "2025");

  /* ── Brand style overrides ─── */
  const footerSt: Record<string, BS> = (() => {
    try { return JSON.parse(gv(rows, "site", "footer", "_styles", "{}")); } catch { return {}; }
  })();
  const stCompanyName   = gs(footerSt, "companyName",   { color: "#FFFFFF",  fontSize: "22px" });
  const stTagline       = gs(footerSt, "tagline",       { color: "#4A5E7A",  fontSize: "11px" });
  const stDescription   = gs(footerSt, "description",   { color: "#6A7A9A",  fontSize: "12px" });
  const stDescriptionTh = gs(footerSt, "descriptionTh", { color: "#4A5E7A",  fontSize: "12px" });

  /* ── Lists ─── */
  const services   = ga<{ label: string }>(rows, "site", "footer", "services_items", DEFAULT_SERVICES).filter(s => s.label?.trim());
  const quickLinks = ga<QuickLink>(rows, "site", "footer", "quick_links", DEFAULT_QUICK_LINKS).filter(ql => ql.label_en?.trim() && ql.href?.trim());

  /* ── Contact ─── */
  const phone1 = gv(rows, "contact", "info", "phone1", BRAND.phone1);
  const phone2 = gv(rows, "contact", "info", "phone2", BRAND.phone2);
  const email  = gv(rows, "contact", "info", "email",  BRAND.email);
  const phones = [phone1, phone2].filter(Boolean);

  /* ── Socials ─── */
  const socials = [
    { label: "Facebook",  Icon: IconFacebook,  href: gv(rows, "contact", "social", "facebook",  BRAND.social.facebook)  },
    { label: "Instagram", Icon: IconInstagram, href: gv(rows, "contact", "social", "instagram", BRAND.social.instagram) },
    { label: "LINE",      Icon: IconLineApp,   href: gv(rows, "contact", "social", "line",      BRAND.social.line)      },
    { label: "YouTube",   Icon: IconYouTube,   href: gv(rows, "contact", "social", "youtube",   BRAND.social.youtube)   },
    { label: "TikTok",    Icon: IconTikTok,    href: gv(rows, "contact", "social", "tiktok",    BRAND.social.tiktok)    },
  ].filter(s => s.href && s.href !== "#");

  return (
    <>
      {/* Responsive grid rules — no > combinator so no hydration mismatch */}
      <style>{`
        .ft-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px;
        }
        @media (min-width: 768px) {
          .ft-grid { grid-template-columns: 1fr 1fr; gap: 32px 48px; }
        }
        @media (min-width: 1024px) {
          .ft-grid { grid-template-columns: 1.6fr 0.9fr 0.9fr 1.1fr; gap: 0 40px; }
        }
        .ft-link { color: #6A7A9A; text-decoration: none; transition: color 0.15s ease; }
        .ft-link:hover { color: #E8D5A3; }
        .ft-social { color: #E8D5A3; opacity: 0.75; text-decoration: none; transition: opacity 0.15s ease; display: flex; align-items: center; }
        .ft-social:hover { opacity: 1; }
        .ft-outer-pad { padding: 52px 64px 0; }
        @media (max-width: 767px) { .ft-outer-pad { padding: 40px 20px 0; } }
        @media (min-width: 768px) and (max-width: 1023px) { .ft-outer-pad { padding: 48px 32px 0; } }
      `}</style>

      <footer style={{ background: "#0D1E3D", borderTop: "0.5px solid rgba(232,213,163,0.1)" }}>
        <div className="ft-outer-pad" style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* ── 4-column grid ── */}
          <div className="ft-grid" style={{ paddingBottom: "48px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>

            {/* COL 1 — Serif wordmark + description + social icons */}
            <div>
              <Link href="/home" style={{ textDecoration: "none" }}>
                <div style={{
                  fontSize: "clamp(18px, 1.8vw, 24px)",
                  fontWeight: 400,
                  color: stCompanyName.color,
                  fontFamily: "Georgia, serif",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}>
                  {companyName}
                </div>
              </Link>

              {/* Gold accent line */}
              <div style={{ width: "28px", height: "2px", background: "#E8D5A3", margin: "11px 0 14px" }} />

              {/* Tagline */}
              {tagline && (
                <div style={{ fontSize: stTagline.fontSize, color: stTagline.color, marginBottom: "10px", letterSpacing: "0.02em" }}>
                  {tagline}
                </div>
              )}

              {/* Description */}
              <p style={{ fontSize: stDescription.fontSize, color: stDescription.color, lineHeight: 1.75, margin: "0 0 4px" }}>
                {description}
              </p>
              {descriptionTh && (
                <p style={{ fontSize: stDescriptionTh.fontSize, color: stDescriptionTh.color, lineHeight: 1.75, margin: "0 0 22px" }}>
                  {descriptionTh}
                </p>
              )}

              {/* Social icons — plain glyphs, no backgrounds */}
              {socials.length > 0 && (
                <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                  {socials.map(({ label, href, Icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      className="ft-social"
                      style={{ color: "#E8D5A3", opacity: 0.75, textDecoration: "none", display: "flex", alignItems: "center" }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* COL 2 — Explore / Quick Links */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#FFFFFF", marginBottom: "18px" }}>
                {t("สำรวจ", "Explore")}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
                {quickLinks.map(ql => (
                  <li key={ql.href + ql.label_en}>
                    <Link href={ql.href} className="ft-link" style={{ fontSize: "12px" }}>
                      {t(ql.label_th, ql.label_en)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COL 3 — Services */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#FFFFFF", marginBottom: "18px" }}>
                {t("บริการ", "Services")}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
                {services.map(s => (
                  <li key={s.label} style={{ fontSize: "12px", color: "#6A7A9A" }}>{s.label}</li>
                ))}
              </ul>
            </div>

            {/* COL 4 — Get in Touch (translucent gold-tint box) */}
            <div style={{
              background: "rgba(232,213,163,0.07)",
              border: "0.5px solid rgba(232,213,163,0.14)",
              borderRadius: "12px",
              padding: "22px 20px",
              alignSelf: "start",
            }}>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#E8D5A3", marginBottom: "18px" }}>
                {t("ติดต่อเรา", "Get in Touch")}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {phones.length > 0 && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "11px" }}>
                    <i className="ti ti-phone" style={{ fontSize: "13px", color: "#E8D5A3", flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {phones.map((p, i) => (
                        <span key={i} style={{ fontSize: "12px", color: "#C8D0DC", lineHeight: 1.5 }}>{p}</span>
                      ))}
                    </div>
                  </div>
                )}
                {email && (
                  <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                    <i className="ti ti-mail" style={{ fontSize: "13px", color: "#E8D5A3", flexShrink: 0 }} />
                    <a href={`mailto:${email}`} className="ft-link" style={{ fontSize: "12px", wordBreak: "break-all" }}>
                      {email}
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── Bottom bar ── */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px", padding: "14px 0" }}>
            <span style={{ fontSize: "11px", color: "#3D4F6E" }}>
              © {copyrightYear} {companyName} Co., Ltd. {t("สงวนลิขสิทธิ์", "All rights reserved")}.
            </span>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link href="/contact" style={{ fontSize: "11px", color: "#3D4F6E", textDecoration: "none" }}>Privacy Policy</Link>
              <Link href="/contact" style={{ fontSize: "11px", color: "#3D4F6E", textDecoration: "none" }}>Terms of Service</Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
