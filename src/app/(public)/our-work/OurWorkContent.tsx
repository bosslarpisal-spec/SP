"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import GoldDivider from "@/components/ui/GoldDivider";
import { useLang } from "@/contexts/LanguageContext";

/* ── DB content helpers ─────────────────────────────────────── */
type ContentRow = { section: string; key: string; value: string };
type BS = Record<string, string>;
function gv(rows: ContentRow[], section: string, key: string, fallback: string): string {
  return rows.find(r => r.section === section && r.key === key)?.value ?? fallback;
}
function ga<T>(rows: ContentRow[], section: string, key: string, fallback: T[]): T[] {
  const raw = rows.find(r => r.section === section && r.key === key)?.value;
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T[]; } catch { return fallback; }
}
function gs(obj: Record<string, BS>, key: string, def: BS): BS {
  const ov = obj[key] ?? {};
  return { color: ov.color ?? def.color, fontSize: ov.fontSize ?? def.fontSize };
}

/* ── Portfolio project type (matches portfolio_projects table) ── */
export type PortfolioProject = {
  id: string;
  title: string;
  title_th: string;
  description: string;
  client: string;
  image_url: string;
  project_link: string;
  tags: string;
  metrics: Array<{ n: string; label: string }>;
  icon: string;
  aspect: "tall" | "wide" | "square";
  display_order: number;
  visible: boolean;
};

function normTags(tags: string): string[] {
  return tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];
}

const DEFAULT_STATS = [
  { n: "3,000+", label: "Clients Served" },
  { n: "50k+",   label: "Projects Done" },
  { n: "30+",    label: "Countries" },
];

/* ── Card aspect ──────────────────────────────────────────────── */
function cardAspectClass(aspect: PortfolioProject["aspect"]) {
  if (aspect === "tall")  return "aspect-[3/4]";
  if (aspect === "wide")  return "aspect-[4/3]";
  return "aspect-square";
}

/* ── OVERLAY ─────────────────────────────────────────────────── */
interface OverlayProps {
  project: PortfolioProject;
  orderNum: string;
  visible: boolean;
  transKey: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function ProjectOverlay({ project: p, orderNum, visible, transKey, onClose, onPrev, onNext, hasPrev, hasNext }: OverlayProps) {
  const { lang } = useLang();
  const ctaHref = p.project_link || "/contact";
  const ctaLabel = p.project_link
    ? (lang === "th" ? "ดูโปรเจกต์" : "View Project")
    : (lang === "th" ? "ขอใบเสนอราคา" : "Get a Quote");

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        transform: visible ? "translateY(0)" : "translateY(110%)",
        transition: "transform 0.4s ease-out",
      }}
      className="flex flex-col-reverse md:flex-row overflow-auto md:overflow-hidden"
    >
      {/* Floating close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute", top: "16px", right: "16px", zIndex: 10,
          width: "36px", height: "36px", borderRadius: "50%",
          background: "rgba(232,213,163,0.12)", border: "0.5px solid rgba(232,213,163,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#E8D5A3", fontSize: "16px",
        }}
      >
        ✕
      </button>

      {/* LEFT — dark, text */}
      <div
        className="w-full md:w-[45%] flex-shrink-0 flex flex-col justify-between md:h-full md:overflow-hidden"
        style={{ background: "#1C2951" }}
      >
        <div
          key={transKey}
          className="overlay-content-animate flex-1 overflow-auto"
          style={{ padding: "56px 40px 24px" }}
        >
          <div style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#F0DC9A", marginBottom: "16px" }}>
            {orderNum} — {p.client}
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.15, letterSpacing: "-0.02em", fontFamily: "Georgia, serif", marginBottom: "8px" }}>
            {lang === "th" ? (p.title_th || p.title) : p.title}
          </h2>
          {lang === "th" && p.title_th && (
            <p style={{ fontSize: "11px", color: "#E8D5A3", marginBottom: "16px" }}>{p.title}</p>
          )}
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.90)", lineHeight: 1.8, marginBottom: "22px" }}>
            {p.description || `A premium branded project delivered for ${p.client}, crafted with care and precision by the SP team.`}
          </p>

          {p.metrics.length > 0 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {p.metrics.map((m) => (
                <div key={m.label} style={{ flex: 1, padding: "10px 12px", textAlign: "center", background: "#243160", borderRadius: "6px", border: "0.5px solid rgba(232,213,163,0.15)" }}>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", letterSpacing: "-0.02em" }}>{m.n}</div>
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.75)", marginTop: "2px" }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {normTags(p.tags).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
              {normTags(p.tags).map(t => (
                <span key={t} style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", border: "0.5px solid rgba(232,213,163,0.2)", padding: "4px 10px", borderRadius: "4px" }}>{t}</span>
              ))}
            </div>
          )}

          <Link
            href={ctaHref}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#E8D5A3", color: "#1C2951", fontSize: "12px", fontWeight: 600, padding: "10px 20px", borderRadius: "5px" }}
          >
            {ctaLabel} <i className="ti ti-arrow-right" style={{ fontSize: "12px" }} />
          </Link>
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", gap: "20px", padding: "16px 40px 24px", borderTop: "0.5px solid rgba(232,213,163,0.08)", flexShrink: 0 }}>
          <button onClick={onPrev} disabled={!hasPrev}
            style={{ fontSize: "11px", color: hasPrev ? "#E8D5A3" : "rgba(255,255,255,0.2)", cursor: hasPrev ? "pointer" : "default", background: "none", border: "none", padding: 0 }}>
            {lang === "th" ? "← ก่อนหน้า" : "← Previous"}
          </button>
          <button onClick={onNext} disabled={!hasNext}
            style={{ fontSize: "11px", color: hasNext ? "#E8D5A3" : "rgba(255,255,255,0.2)", cursor: hasNext ? "pointer" : "default", background: "none", border: "none", padding: 0 }}>
            {lang === "th" ? "ถัดไป →" : "Next →"}
          </button>
        </div>
      </div>

      {/* RIGHT — cream, image or placeholder */}
      <div
        className="w-full md:w-[55%] md:h-full md:overflow-auto"
        style={{ background: "#F8F6F1", padding: "40px" }}
      >
        <div
          key={`img-${transKey}`}
          className="overlay-img-animate"
          style={{
            background: "#2E3D73", borderRadius: "12px", minHeight: "360px",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
        >
          {p.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.image_url}
              alt={p.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <i className={`ti ${p.icon}`} style={{ fontSize: "72px", color: "#E8D5A3", opacity: 0.12 }} />
          )}
          <div style={{ position: "absolute", top: "20px", left: "20px", background: "#FFFFFF", borderRadius: "4px", padding: "5px 12px" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#1C2951" }}>{p.client}</span>
          </div>
          <div style={{ position: "absolute", bottom: "20px", right: "20px", background: "rgba(28,41,81,0.85)", border: "0.5px solid rgba(232,213,163,0.2)", borderRadius: "4px", padding: "5px 12px" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)" }}>Project {orderNum}</span>
          </div>
        </div>

        {normTags(p.tags).length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#4A5568", marginBottom: "6px" }}>{normTags(p.tags)[0]}</p>
            <h3 style={{ fontSize: "16px", fontWeight: 400, color: "#0D1E3D", fontFamily: "Georgia, serif" }}>{lang === "th" ? (p.title_th || p.title) : p.title}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────────────── */
export default function OurWorkContent({
  rows = [],
  projects = [],
}: {
  rows?: ContentRow[];
  projects?: PortfolioProject[];
}) {
  const { lang } = useLang();
  const [overlayIdx,     setOverlayIdx    ] = useState<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [transKey,       setTransKey      ] = useState(0);

  const heroBadge         = gv(rows, "hero",  "badge",          "PORTFOLIO");
  const heroHeading       = gv(rows, "hero",  "heading",        "Our Work &");
  const heroHeadingItalic = gv(rows, "hero",  "heading_italic", "Portfolio");
  const STATS             = ga(rows, "stats", "items",          DEFAULT_STATS);

  const heroSt: Record<string, BS> = (() => { try { return JSON.parse(gv(rows, "hero", "_styles", "{}")); } catch { return {}; } })();
  const hBadge    = gs(heroSt, "badge",         { color: "#E8D5A3", fontSize: "10px" });
  const hHead     = gs(heroSt, "heading",        { color: "#FFFFFF", fontSize: "40px" });
  const hHeadIt   = gs(heroSt, "headingItalic",  { color: "#E8D5A3", fontSize: "40px" });

  const overlayProject = overlayIdx !== null ? projects[overlayIdx] ?? null : null;

  // Trigger slide-up after the overlay mounts
  useEffect(() => {
    if (overlayIdx === null) return;
    const t = setTimeout(() => setOverlayVisible(true), 20);
    return () => clearTimeout(t);
  }, [overlayIdx]);

  const closeOverlay = useCallback(() => {
    setOverlayVisible(false);
    setTimeout(() => setOverlayIdx(null), 420);
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeOverlay(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeOverlay]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = overlayVisible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [overlayVisible]);

  function openOverlay(i: number) {
    setOverlayVisible(false);
    setOverlayIdx(i);
    setTransKey(k => k + 1);
  }

  function goPrev() {
    if (overlayIdx !== null && overlayIdx > 0) {
      setOverlayIdx(overlayIdx - 1);
      setTransKey(k => k + 1);
    }
  }

  function goNext() {
    if (overlayIdx !== null && overlayIdx < projects.length - 1) {
      setOverlayIdx(overlayIdx + 1);
      setTransKey(k => k + 1);
    }
  }

  return (
    <>
      <style>{`
        @keyframes hero-fade {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-animate { animation: hero-fade 0.7s ease 0.1s both; }

        @keyframes card-in { from { opacity: 0; } to { opacity: 1; } }
        .card-animate { animation: card-in 0.5s ease both; transition: transform 0.3s ease; }
        .card-animate:hover { transform: scale(1.02); }

        @keyframes overlay-content-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .overlay-content-animate { animation: overlay-content-in 0.4s ease both; }

        @keyframes overlay-img-in { from { opacity: 0; } to { opacity: 1; } }
        .overlay-img-animate { animation: overlay-img-in 0.4s ease 0.1s both; }

        @media (prefers-reduced-motion: reduce) {
          .hero-animate, .card-animate, .overlay-content-animate, .overlay-img-animate {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
        }
      `}</style>

      {/* §1 — HERO */}
      <section style={{ backgroundImage: "url('/HeroBlockHome.png')", backgroundSize: "cover", backgroundPosition: "right center", backgroundRepeat: "no-repeat", position: "relative", overflow: "hidden" }} className="min-h-[45vh] flex items-center">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,30,61,0.92) 0%, rgba(13,30,61,0.80) 40%, rgba(13,30,61,0.40) 70%, rgba(13,30,61,0.10) 100%)", zIndex: 0, pointerEvents: "none" }} />
        <div className="hero-animate" style={{ maxWidth: "1200px", margin: "0 auto", padding: "120px 64px 64px", width: "100%", position: "relative", zIndex: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                <div style={{ width: "24px", height: "1.5px", background: "#E8D5A3", flexShrink: 0 }} />
                <span style={{ fontSize: hBadge.fontSize, textTransform: "uppercase", letterSpacing: "0.18em", color: hBadge.color }}>{heroBadge}</span>
              </div>
              <h1 style={{ fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", fontFamily: "Georgia, serif", marginBottom: "28px" }}>
                <span style={{ position: "relative", display: "inline-block", marginBottom: "4px", fontSize: hHead.fontSize, color: hHead.color }}>
                  {heroHeading}
                  <span style={{ position: "absolute", bottom: "-4px", left: 0, height: "2px", width: "100%", background: "linear-gradient(to right, #E8D5A3, transparent)", display: "block" }} />
                </span>
                <br />
                <em style={{ fontStyle: "italic", color: hHeadIt.color, fontSize: hHeadIt.fontSize }}>{heroHeadingItalic}</em>
              </h1>
              <div style={{ display: "flex" }}>
                {STATS.map((s, i) => (
                  <div key={s.n} style={{ paddingRight: "28px", marginRight: "28px", borderRight: i < STATS.length - 1 ? "0.5px solid rgba(232,213,163,0.2)" : "none" }}>
                    <div style={{ fontSize: "20px", fontWeight: 400, color: "#E8D5A3", letterSpacing: "-0.02em" }}>{s.n}</div>
                    <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", marginTop: "4px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "13px", fontStyle: "italic", color: "rgba(255,255,255,0.90)", lineHeight: 1.8, borderLeft: "1px solid rgba(232,213,163,0.35)", paddingLeft: "24px", fontFamily: "Georgia,serif" }}>
                &ldquo;Every brand we work with leaves a mark — not just on their recipients, but in the memory of every moment those gifts create.&rdquo;
              </p>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: "10px", paddingLeft: "25px" }}>
                — SP Creative Team
              </p>
            </div>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* §3 — MASONRY GALLERY */}
      <section style={{ background: "#F8F6F1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 64px" }}>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {projects.map((p, i) => (
              <div
                key={p.id}
                className={`break-inside-avoid mb-4 card-animate ${cardAspectClass(p.aspect)} rounded-2xl overflow-hidden relative cursor-pointer group`}
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => openOverlay(i)}
              >
                {/* Background: photo or colour placeholder */}
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, background: "#2E3D73", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`ti ${p.icon}`} style={{ fontSize: "40px", color: "#E8D5A3", opacity: 0.15 }} />
                  </div>
                )}

                {/* Always-visible gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,30,61,0.92) 0%, rgba(13,30,61,0.45) 45%, rgba(13,30,61,0.10) 100%)", pointerEvents: "none" }} />

                {/* Card content — always visible */}
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  {/* Top: client badge */}
                  <div>
                    <span style={{ fontSize: "10px", padding: "3px 9px", borderRadius: "3px", background: "rgba(13,30,61,0.55)", color: "#E8D5A3", border: "0.5px solid rgba(232,213,163,0.25)", backdropFilter: "blur(4px)" }}>
                      {p.client}
                    </span>
                  </div>

                  {/* Bottom: title + description + CTA */}
                  <div>
                    <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#FFFFFF", lineHeight: 1.4, marginBottom: p.description ? "5px" : "8px" }}>
                      {lang === "th" ? (p.title_th || p.title) : p.title}
                    </h3>
                    {p.description && (
                      <p style={{
                        fontSize: "11px", color: "rgba(255,255,255,0.75)", lineHeight: 1.55, marginBottom: "8px",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {p.description}
                      </p>
                    )}
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ fontSize: "11px", color: "#E8D5A3" }}
                    >
                      {lang === "th" ? "ดูโปรเจกต์ →" : "View Project →"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <p style={{ textAlign: "center", padding: "60px 0", color: "#4A5568", fontSize: "13px" }}>
              No projects yet.
            </p>
          )}
        </div>
      </section>

      <GoldDivider />

      {/* §4 — SPOTLIGHT OVERLAY */}
      {overlayProject && (
        <ProjectOverlay
          project={overlayProject}
          orderNum={String((overlayIdx ?? 0) + 1).padStart(2, "0")}
          visible={overlayVisible}
          transKey={transKey}
          onClose={closeOverlay}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={(overlayIdx ?? 0) > 0}
          hasNext={(overlayIdx ?? 0) < projects.length - 1}
        />
      )}

      <GoldDivider />

      {/* §5 — CTA STRIP */}
      <section style={{ background: "#1C2951" }} className="py-24">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 64px", textAlign: "center" }}>
          <SectionLabel text={lang === "th" ? "เริ่มโปรเจกต์" : "Start a Project"} />
          <h2 style={{ fontSize: "28px", fontWeight: 400, color: "#FFFFFF", letterSpacing: "-0.02em", fontFamily: "Georgia,serif", marginTop: "16px", marginBottom: "10px" }}>
            {lang === "th"
              ? <>พร้อมสร้างสิ่งที่ <em style={{ fontStyle: "italic", color: "#E8D5A3" }}>น่าจดจำ?</em></>
              : <>Ready to Create Something <em style={{ fontStyle: "italic", color: "#E8D5A3" }}>Remarkable?</em></>}
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.90)", lineHeight: 1.75, maxWidth: "420px", margin: "0 auto 28px" }}>
            {lang === "th" ? "ร่วมสร้างแคมเปญพรีเมียมของคุณกับเรา" : "Let’s build your next premium campaign together."}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#E8D5A3", color: "#1C2951", fontSize: "13px", fontWeight: 500, padding: "12px 24px", borderRadius: "5px", whiteSpace: "nowrap" }}>
              {lang === "th" ? "ขอใบเสนอราคา" : "Get a Quote"} <i className="ti ti-arrow-right" style={{ fontSize: "13px" }} />
            </Link>
            <Link href="/services" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#E8D5A3", fontSize: "13px", border: "0.5px solid rgba(255,255,255,0.15)", padding: "11px 22px", borderRadius: "5px", whiteSpace: "nowrap" }}>
              {lang === "th" ? "ดูบริการของเรา" : "Browse Services"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
