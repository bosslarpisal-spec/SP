"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";

/* ── DATA ─────────────────────────────────────────────────── */
const STATS = [
  { n: "3,000+", label: "Clients Served" },
  { n: "50k+",   label: "Projects Done" },
  { n: "30+",    label: "Countries" },
];

const CLIENT_TAGS = [
  "All Work", "P&G", "Acer", "Oral-B", "Ambipur",
  "VSTECS", "Absolute You", "SCB Bank", "LINE MAN",
];

interface Project {
  n: string; client: string; title: string;
  th?: string; desc?: string;
  tags: string[]; metrics: { n: string; label: string }[];
  icon: string; category: string;
  aspect: "tall" | "wide" | "square";
}

const ALL_PROJECTS: Project[] = [
  {
    n: "01", client: "P&G",
    title: "Premium New Year Gift Sets",
    th: "ชุดของขวัญปีใหม่พรีเมียม",
    desc: "Designed and produced 12,000 curated gift sets for P&G Thailand's New Year campaign. Each set featured custom packaging, branded ribbon, and a personalised card — delivered across 5 provinces in under 10 days.",
    tags: ["Gift Sets", "Custom Packaging", "Logistics"],
    metrics: [
      { n: "12,000", label: "Units Produced" },
      { n: "5",      label: "Provinces Covered" },
      { n: "10",     label: "Days to Delivery" },
    ],
    icon: "ti-gift", category: "Gift Sets", aspect: "tall",
  },
  {
    n: "02", client: "Acer",
    title: "Branded Corporate Merchandise",
    th: "สินค้าองค์กรแบรนด์ครบเซ็ต",
    desc: "A full suite of branded merchandise for Acer's distributor conference — including custom tote bags, tech accessories, and premium notebooks. OEM production with laser-engraved logo and full-colour print.",
    tags: ["OEM Manufacturing", "Custom Branding", "Screen Print"],
    metrics: [
      { n: "8,500", label: "Items Delivered" },
      { n: "3",     label: "Product Types" },
      { n: "100%",  label: "On-time Rate" },
    ],
    icon: "ti-award", category: "OEM", aspect: "wide",
  },
  {
    n: "03", client: "Oral-B",
    title: "Toothbrush Gift Packs",
    tags: ["Gift Sets"], metrics: [],
    icon: "ti-package", category: "Gift Sets", aspect: "square",
  },
  {
    n: "04", client: "Ambipur",
    title: "Scented Promo Kits",
    tags: ["Custom Branding"], metrics: [],
    icon: "ti-certificate", category: "Custom Branding", aspect: "wide",
  },
  {
    n: "05", client: "VSTECS",
    title: "Tech Distributor Gifts",
    tags: ["OEM"], metrics: [],
    icon: "ti-cpu", category: "OEM", aspect: "square",
  },
  {
    n: "06", client: "Absolute You",
    title: "Wellness Premium Sets",
    tags: ["Premium Gifts"], metrics: [],
    icon: "ti-heart", category: "Premium Gifts", aspect: "tall",
  },
  {
    n: "07", client: "SCB Bank",
    title: "VIP Client Gift Collection",
    tags: ["Luxury Gifts"], metrics: [],
    icon: "ti-diamond", category: "Luxury Gifts", aspect: "wide",
  },
  {
    n: "08", client: "LINE MAN",
    title: "Rider Appreciation Kits",
    tags: ["Corporate"], metrics: [],
    icon: "ti-bike", category: "Corporate", aspect: "square",
  },
];

/* ── HELPERS ──────────────────────────────────────────────── */
function cardAspectClass(aspect: Project["aspect"]) {
  if (aspect === "tall")  return "aspect-[3/4]";
  if (aspect === "wide")  return "aspect-[4/3]";
  return "aspect-square";
}

/* ── OVERLAY COMPONENT ────────────────────────────────────── */
interface OverlayProps {
  project: Project;
  visible: boolean;
  transKey: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function ProjectOverlay({ project: p, visible, transKey, onClose, onPrev, onNext, hasPrev, hasNext }: OverlayProps) {
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
            {p.n} — {p.client}
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.15, letterSpacing: "-0.02em", fontFamily: "Georgia, serif", marginBottom: "8px" }}>
            {p.title}
          </h2>
          {p.th && (
            <p style={{ fontSize: "11px", color: "#E8D5A3", marginBottom: "16px" }}>{p.th}</p>
          )}
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.90)", lineHeight: 1.8, marginBottom: "22px" }}>
            {p.desc ?? `A premium branded project delivered for ${p.client}, crafted with care and precision by the SP team.`}
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

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
            {p.tags.map(t => (
              <span key={t} style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", border: "0.5px solid rgba(232,213,163,0.2)", padding: "4px 10px", borderRadius: "4px" }}>{t}</span>
            ))}
          </div>

          <Link
            href="/contact"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#E8D5A3", color: "#1C2951", fontSize: "12px", fontWeight: 600, padding: "10px 20px", borderRadius: "5px" }}
          >
            Get a Quote <i className="ti ti-arrow-right" style={{ fontSize: "12px" }} />
          </Link>
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", gap: "20px", padding: "16px 40px 24px", borderTop: "0.5px solid rgba(232,213,163,0.08)", flexShrink: 0 }}>
          <button
            onClick={onPrev} disabled={!hasPrev}
            style={{ fontSize: "11px", color: hasPrev ? "#E8D5A3" : "rgba(255,255,255,0.2)", cursor: hasPrev ? "pointer" : "default", background: "none", border: "none", padding: 0 }}
          >
            ← Previous
          </button>
          <button
            onClick={onNext} disabled={!hasNext}
            style={{ fontSize: "11px", color: hasNext ? "#E8D5A3" : "rgba(255,255,255,0.2)", cursor: hasNext ? "pointer" : "default", background: "none", border: "none", padding: 0 }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* RIGHT — cream, scrollable */}
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
          <i className={`ti ${p.icon}`} style={{ fontSize: "72px", color: "#E8D5A3", opacity: 0.12 }} />
          <div style={{ position: "absolute", top: "20px", left: "20px", background: "#FFFFFF", borderRadius: "4px", padding: "5px 12px" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#1C2951" }}>{p.client}</span>
          </div>
          <div style={{ position: "absolute", bottom: "20px", right: "20px", background: "rgba(28,41,81,0.85)", border: "0.5px solid rgba(232,213,163,0.2)", borderRadius: "4px", padding: "5px 12px" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)" }}>Project {p.n}</span>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#4A5568", marginBottom: "6px" }}>{p.category}</p>
          <h3 style={{ fontSize: "16px", fontWeight: 400, color: "#0D1E3D", fontFamily: "Georgia, serif" }}>{p.title}</h3>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────────────── */
export default function OurWorkContent() {
  const [activeTag,      setActiveTag     ] = useState("All Work");
  const [overlayN,       setOverlayN      ] = useState<string | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [transKey,       setTransKey      ] = useState(0);

  const filteredProjects = activeTag === "All Work"
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter(p => p.client === activeTag);

  const overlayProject = overlayN ? ALL_PROJECTS.find(p => p.n === overlayN) ?? null : null;
  const overlayIdx     = overlayN ? filteredProjects.findIndex(p => p.n === overlayN) : -1;

  // Trigger slide-up after the overlay mounts
  useEffect(() => {
    if (!overlayN) return;
    const t = setTimeout(() => setOverlayVisible(true), 20);
    return () => clearTimeout(t);
  }, [overlayN]);

  const closeOverlay = useCallback(() => {
    setOverlayVisible(false);
    setTimeout(() => setOverlayN(null), 420);
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

  function openOverlay(n: string) {
    setOverlayVisible(false);
    setOverlayN(n);
    setTransKey(k => k + 1);
  }

  function handleFilter(tag: string) {
    setActiveTag(tag);
    if (overlayN) closeOverlay();
  }

  function goPrev() {
    if (overlayIdx > 0) {
      setOverlayN(filteredProjects[overlayIdx - 1].n);
      setTransKey(k => k + 1);
    }
  }

  function goNext() {
    if (overlayIdx < filteredProjects.length - 1) {
      setOverlayN(filteredProjects[overlayIdx + 1].n);
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

        .filter-btn { transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease; cursor: pointer; }
        .filter-btn:not(.filter-active):hover { border-color: rgba(232,213,163,0.5) !important; color: #E8D5A3 !important; }

        @media (prefers-reduced-motion: reduce) {
          .hero-animate, .card-animate, .overlay-content-animate, .overlay-img-animate {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
        }
      `}</style>

      {/* §1 — HERO */}
      <section style={{ background: "#1C2951" }} className="min-h-[45vh] flex items-center">
        <div className="hero-animate" style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 64px", width: "100%" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                <span style={{ display: "block", width: "20px", height: "1px", background: "#E8D5A3", flexShrink: 0 }} />
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", color: "#F0DC9A" }}>PORTFOLIO</span>
              </div>
              <h1 style={{ fontSize: "40px", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: "-0.02em", fontFamily: "Georgia, serif", marginBottom: "28px" }}>
                Our Work &amp;<br />
                <em style={{ fontStyle: "italic", color: "#E8D5A3" }}>Portfolio</em>
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

      {/* §2 — FILTER BAR */}
      <div style={{ background: "#1C2951", borderBottom: "0.5px solid rgba(232,213,163,0.12)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px 64px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#F0DC9A", marginRight: "6px" }}>Filter:</span>
          {CLIENT_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleFilter(tag)}
              className={`filter-btn${activeTag === tag ? " filter-active" : ""}`}
              style={{
                fontSize: "10px",
                fontWeight: activeTag === tag ? 600 : 400,
                color: activeTag === tag ? "#1C2951" : "#F5EDD8",
                background: activeTag === tag ? "#E8D5A3" : "rgba(255,255,255,0.06)",
                border: activeTag === tag ? "none" : "0.5px solid rgba(232,213,163,0.35)",
                padding: "5px 14px", borderRadius: "4px",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* §3 — MASONRY GALLERY */}
      <section style={{ background: "#F8F6F1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 64px" }}>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {filteredProjects.map((p, i) => (
              <div
                key={p.n}
                className={`break-inside-avoid mb-4 card-animate ${cardAspectClass(p.aspect)} rounded-2xl overflow-hidden relative cursor-pointer group`}
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => openOverlay(p.n)}
              >
                {/* Placeholder */}
                <div style={{ position: "absolute", inset: 0, background: "#2E3D73", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`ti ${p.icon}`} style={{ fontSize: "40px", color: "#E8D5A3", opacity: 0.15 }} />
                </div>

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-between p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(0,0,0,0.65)" }}
                >
                  <div>
                    <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#E8D5A3" }}>
                      {p.n} — {p.client}
                    </span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#FFFFFF", lineHeight: 1.4 }}>{p.title}</h3>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "11px", color: "#E8D5A3" }}>View Project →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <p style={{ textAlign: "center", padding: "60px 0", color: "#4A5568", fontSize: "13px" }}>
              No projects found for this filter.
            </p>
          )}
        </div>
      </section>

      {/* §4 — SPOTLIGHT OVERLAY */}
      {overlayProject && (
        <ProjectOverlay
          project={overlayProject}
          visible={overlayVisible}
          transKey={transKey}
          onClose={closeOverlay}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={overlayIdx > 0}
          hasNext={overlayIdx < filteredProjects.length - 1}
        />
      )}

      {/* §5 — CTA STRIP */}
      <section style={{ background: "#1C2951" }} className="py-24">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 64px", textAlign: "center" }}>
          <SectionLabel text="Start a Project" />
          <h2 style={{ fontSize: "28px", fontWeight: 400, color: "#FFFFFF", letterSpacing: "-0.02em", fontFamily: "Georgia,serif", marginTop: "16px", marginBottom: "10px" }}>
            Ready to Create Something <em style={{ fontStyle: "italic", color: "#E8D5A3" }}>Remarkable?</em>
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.90)", lineHeight: 1.75, maxWidth: "420px", margin: "0 auto 28px" }}>
            Let&apos;s build your next premium campaign together.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#E8D5A3", color: "#1C2951", fontSize: "13px", fontWeight: 500, padding: "12px 24px", borderRadius: "5px", whiteSpace: "nowrap" }}>
              Get a Quote <i className="ti ti-arrow-right" style={{ fontSize: "13px" }} />
            </Link>
            <Link href="/services" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#E8D5A3", fontSize: "13px", border: "0.5px solid rgba(255,255,255,0.15)", padding: "11px 22px", borderRadius: "5px", whiteSpace: "nowrap" }}>
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
