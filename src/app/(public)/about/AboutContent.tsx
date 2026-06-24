"use client";

import { useRef, useState, useEffect } from "react";
import GoldDivider from "@/components/ui/GoldDivider";
import { useLang } from "@/contexts/LanguageContext";

/* ── DB content helpers ─────────────────────────────────── */
type ContentRow = { section: string; key: string; value: string };
function gv(rows: ContentRow[], section: string, key: string, fallback: string): string {
  return rows.find(r => r.section === section && r.key === key)?.value ?? fallback;
}
function ga<T>(rows: ContentRow[], section: string, key: string, fallback: T[]): T[] {
  const raw = rows.find(r => r.section === section && r.key === key)?.value;
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T[]; } catch { return fallback; }
}
type BS = Record<string, string>;
function gs(obj: Record<string, BS>, key: string, def: BS): BS {
  const ov = obj[key] ?? {};
  return { color: ov.color ?? def.color, fontSize: ov.fontSize ?? def.fontSize };
}

/* ── DEFAULT DATA (used when no DB rows present) ─────────── */
const DEFAULT_MILESTONES = [
  { yr: "03", year: "2003", text: "Founded in Bangkok with a vision to redefine corporate gifting in Thailand.", active: false },
  { yr: "08", year: "2008", text: "Expanded OEM manufacturing capabilities and opened first dedicated production facility.", active: false },
  { yr: "12", year: "2012", text: "Surpassed 1,000+ clients across FMCG, finance, and technology sectors.", active: false },
  { yr: "18", year: "2018", text: "Launched Eco-Premium line — sustainable materials with zero compromise on quality.", active: true },
  { yr: "24", year: "2024", text: "3,000+ clients in 30+ countries. Celebrating 20+ years of premium excellence.", active: true },
];
const DEFAULT_CHECKLIST = [
  "20+ years delivering premium merchandise",
  "Custom design team on every project",
  "100% quality guarantee on all orders",
  "Nationwide & international shipping",
];
const DEFAULT_STATS = [
  { value: "25",    suffix: "+", label: "Years",     bg: "25+" },
  { value: "3000",  suffix: "+", label: "Clients",   bg: "3K+" },
  { value: "50000", suffix: "+", label: "Projects",  bg: "50K" },
  { value: "30",    suffix: "+", label: "Countries", bg: "30+" },
];

const PARTICLES = [
  { top: "8%",  left: "7%",  dur: "7s",  del: "0s"   },
  { top: "5%",  left: "42%", dur: "11s", del: "0.5s" },
  { top: "35%", left: "82%", dur: "12s", del: "0.8s" },
  { top: "72%", left: "74%", dur: "10s", del: "0.3s" },
  { top: "65%", left: "33%", dur: "11s", del: "1s"   },
  { top: "45%", left: "4%",  dur: "12s", del: "0.6s" },
];

/* ── HOOKS ──────────────────────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    let lastUpdate = 0;
    let rafId: number;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      if (now - lastUpdate >= 50 || progress >= 1) {
        lastUpdate = now;
        setCount(Math.floor(target * progress));
      }
      if (progress < 1) { rafId = requestAnimationFrame(tick); }
      else { setCount(target); }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, duration]);
  return count;
}

/* ── SUB-COMPONENTS ─────────────────────────────────────── */
function StatCard({ value, suffix, label, inView }: {
  value: number; suffix: string; label: string; inView: boolean;
}) {
  const count = useCountUp(value, inView);
  const display = value >= 1000 ? count.toLocaleString() : String(count);
  // Ghost uses same formatting as the foreground count — never mismatches
  const ghost = (value >= 1000 ? value.toLocaleString() : String(value)) + suffix;
  return (
    <div style={{ textAlign: "center", position: "relative", padding: "40px 16px", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pointerEvents: "none", userSelect: "none" }}>
        <span style={{ fontSize: "clamp(4rem, 6vw, 6rem)", fontWeight: 700, color: "#1C2951", opacity: 0.06, lineHeight: 1, whiteSpace: "nowrap" }}>{ghost}</span>
      </div>
      <div style={{ position: "relative", fontSize: "2.25rem", fontWeight: 600, color: "#0D1E3D", letterSpacing: "-0.03em", lineHeight: 1 }}>
        {display}{suffix}
      </div>
      <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#4A5568", marginTop: "10px" }}>{label}</div>
    </div>
  );
}

/* ── MAIN COMPONENT ─────────────────────────────────────── */
export default function AboutContent({ rows = [] }: { rows?: ContentRow[] }) {
  const { lang } = useLang();
  const { ref: statsRef,  inView: statsInView  } = useInView(0.3);
  const { ref: storyRef,  inView: storyInView  } = useInView(0.15);
  const { ref: quoteRef,  inView: quoteInView  } = useInView(0.3);

  const storyPhoto    = gv(rows, "story",      "team_photo_url",      "");
  const timelinePhoto = gv(rows, "milestones", "history_photo_url",   "");

  /* resolve content from DB rows, falling back to defaults */
  const heroBadge          = gv(rows, "hero",       "badge",           "Our Story");
  const heroHeading        = gv(rows, "hero",       "heading",         "Crafting Moments That");
  const heroHeadingItalic  = gv(rows, "hero",       "heading_italic",  "Last a Lifetime");
  const heroSubtextTh      = gv(rows, "hero",       "subtext_th",      "ผู้เชี่ยวชาญด้านของพรีเมียมและโปรโมชันครบวงจร");
  const heroDescription    = gv(rows, "hero",       "description",     "Since 2003, SP has partnered with leading brands across Thailand and beyond — designing, producing, and delivering premium gifts that carry meaning far beyond their moment of giving.");
  const storyBadge         = gv(rows, "story",      "badge",           "About SP");
  const storyHeading       = gv(rows, "story",      "heading",         "Thailand’s Trusted Partner in");
  const storyHeadingItalic = gv(rows, "story",      "heading_italic",  "Premium Merchandise");
  const storyPara1En       = gv(rows, "story",      "para1",              "Founded in Bangkok in 2003, SP began as a small creative studio with one goal: to make branded gifting feel personal. Two decades later, we operate as a full-service premium goods partner — from concept and design through OEM manufacturing and global logistics.");
  const storyPara1Th       = gv(rows, "story",      "para1_th",           "ก่อตั้งในกรุงเทพฯ ปี 2546 SP เริ่มต้นเป็นสตูดิโอสร้างสรรค์ขนาดเล็กที่มีเป้าหมายเดียว: ทำให้ของขวัญแบรนด์รู้สึกเป็นส่วนตัว สองทศวรรษต่อมา เราดำเนินงานเป็นพาร์ทเนอร์ด้านสินค้าพรีเมียมครบวงจร");
  const storyPara1         = lang === "th" ? (storyPara1Th || storyPara1En) : storyPara1En;
  const storyPara2En       = gv(rows, "story",      "para2",              "We work directly with procurement and marketing teams at companies like P&G, Acer, Oral-B, and SCB Bank — delivering products that reflect each brand’s identity at every touchpoint.");
  const storyPara2Th       = gv(rows, "story",      "para2_th",           "เราทำงานโดยตรงกับทีมจัดซื้อและการตลาดของบริษัทชั้นนำอย่าง P&G, Acer, Oral-B และ SCB Bank — ส่งมอบสินค้าที่สะท้อนอัตลักษณ์ของแต่ละแบรนด์ในทุกจุดสัมผัส");
  const storyPara2         = lang === "th" ? (storyPara2Th || storyPara2En) : storyPara2En;
  const storyChecklistLabelEn = gv(rows, "story",   "checklist_label",    "Why clients choose SP");
  const storyChecklistLabelTh = gv(rows, "story",   "checklist_label_th", "เหตุผลที่ลูกค้าเลือก SP");
  const storyChecklistLabel   = lang === "th" ? (storyChecklistLabelTh || storyChecklistLabelEn) : storyChecklistLabelEn;
  const quoteLabel         = gv(rows, "quote",      "label",              "Our Philosophy");
  const quoteTextEn        = gv(rows, "quote",      "text",               "Every gift we create carries a brand’s promise. Our job is to make sure that promise is felt — not just seen.");
  const quoteTextTh        = gv(rows, "quote",      "text_th",            "ทุกของขวัญที่เราสร้างสรรค์บรรจุคำมั่นของแบรนด์ งานของเราคือทำให้คำมั่นนั้นถูกรับรู้ ไม่ใช่แค่มองเห็น");
  const quoteText          = lang === "th" ? (quoteTextTh || quoteTextEn) : quoteTextEn;
  const quoteAttribution   = gv(rows, "quote",      "attribution",        "SP Creative & Production Team");

  /* ── style overrides ─────────────────────────────────── */
  const heroSt:  Record<string, BS> = (() => { try { return JSON.parse(gv(rows, "hero",  "_styles", "{}")); } catch { return {}; } })();
  const storySt: Record<string, BS> = (() => { try { return JSON.parse(gv(rows, "story", "_styles", "{}")); } catch { return {}; } })();
  const quoteSt: Record<string, BS> = (() => { try { return JSON.parse(gv(rows, "quote", "_styles", "{}")); } catch { return {}; } })();

  const hBadge  = gs(heroSt,  "badge",          { color: "#E8D5A3",                fontSize: "10px" });
  const hHead   = gs(heroSt,  "heading",         { color: "#FFFFFF",                fontSize: "40px" });
  const hHeadIt = gs(heroSt,  "headingItalic",   { color: "#E8D5A3",                fontSize: "40px" });
  const hDesc   = gs(heroSt,  "description",     { color: "rgba(255,255,255,0.9)",   fontSize: "14px" });
  const sBadge  = gs(storySt, "badge",           { color: "#8A6E00",                fontSize: "11px" });
  const sHead   = gs(storySt, "heading",         { color: "#0D1E3D",                fontSize: "22px" });
  const sHeadIt = gs(storySt, "headingItalic",   { color: "#8A6E00",                fontSize: "22px" });
  const sBody   = gs(storySt, "body",            { color: "#2C3E50",                fontSize: "13px" });
  const sCl     = gs(storySt, "checklistLabel",  { color: "#4A5568",                fontSize: "11px" });
  const qLabel  = gs(quoteSt, "label",           { color: "#F0DC9A",                fontSize: "11px" });
  const qText   = gs(quoteSt, "quoteText",       { color: "#FFFFFF",                fontSize: ""     });
  const qAttr   = gs(quoteSt, "attribution",     { color: "rgba(255,255,255,0.75)", fontSize: "10px" });

  const checklistRaw = ga<string | {text:string}>(rows, "story", "checklist", DEFAULT_CHECKLIST as unknown as (string | {text:string})[]);
  const CHECKLIST: string[] = checklistRaw
    .map(i => typeof i === "string" ? i : String((i as {text:string}).text ?? ""))
    .filter(s => s.trim());

  type StatRow = { value: string; suffix: string; label: string; label_th?: string; bg?: string };
  const STATS_RAW = ga<StatRow>(rows, "stats", "items", DEFAULT_STATS);
  const STATS = STATS_RAW
    .filter(s => s.value && s.value.trim() && s.value !== "0" && s.label && s.label.trim() && s.label.toLowerCase() !== "label")
    .map(s => ({ ...s, label: lang === "th" ? (s.label_th || s.label) : s.label }));

  type MilestoneRow = { yr: string; year: string; text: string; text_th?: string; active: boolean };
  const MILESTONES_RAW = ga<MilestoneRow>(rows, "milestones", "items", DEFAULT_MILESTONES);
  const MILESTONES = MILESTONES_RAW.map(m => ({ ...m, text: lang === "th" ? (m.text_th || m.text) : m.text }));

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes hero-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .hero-content { animation: hero-fade-in 0.8s ease 0.15s both; }

        @keyframes particle-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }

        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.in-view { opacity: 1; transform: translateY(0); }

        .quote-reveal { opacity: 0; transform: scale(0.95); transition: opacity 0.9s ease, transform 0.9s ease; }
        .quote-reveal.in-view { opacity: 1; transform: scale(1); }

        .checklist-item {
          background-image: linear-gradient(to right, rgba(232,213,163,0.08) 50%, transparent 50%);
          background-size: 200% 100%;
          background-position: 100% 0;
          transition: background-position 0.35s ease;
          cursor: default;
        }
        .checklist-item:hover { background-position: 0% 0; }

        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        .stats-strip { display: flex; flex-wrap: nowrap; }
        @media (max-width: 640px) {
          .stats-strip { flex-wrap: wrap; }
          .stats-strip > div { flex: 0 0 50% !important; border-right: none !important; border-bottom: 0.5px solid rgba(28,41,81,0.07); }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .quote-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          .hero-content { animation: none !important; opacity: 1 !important; }
        }

        .story-outer-grid {
          display: grid;
          grid-template-columns: 35% 65%;
          gap: 48px;
          align-items: start;
        }
        .timeline-outer-grid {
          display: grid;
          grid-template-columns: 65% 35%;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .story-outer-grid,
          .timeline-outer-grid { grid-template-columns: 1fr; }
          .timeline-photo-mobile-first { order: -1; }
          .photo-frame-mobile { max-height: 200px; }
        }
      `}</style>

      {/* §1 — HERO ──────────────────────────────────────── */}
      <section style={{ backgroundImage: "url('/HeroBlockHome.png')", backgroundSize: "cover", backgroundPosition: "right center", backgroundRepeat: "no-repeat", minHeight: "45vh", paddingTop: "120px", paddingBottom: "60px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,30,61,0.92) 0%, rgba(13,30,61,0.80) 40%, rgba(13,30,61,0.40) 70%, rgba(13,30,61,0.10) 100%)", zIndex: 0, pointerEvents: "none" }} />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} aria-hidden="true" style={{ position: "absolute", top: p.top, left: p.left, width: "3px", height: "3px", borderRadius: "50%", background: "#E8D5A3", opacity: 0.25, animation: `particle-float ${p.dur} ease-in-out ${p.del} infinite`, pointerEvents: "none" }} />
        ))}

        {/* Content */}
        <div className="hero-content" style={{ maxWidth: "700px", textAlign: "center", padding: "0 40px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
            <div style={{ width: "24px", height: "1.5px", background: "#E8D5A3", flexShrink: 0 }} />
            <span style={{ fontSize: hBadge.fontSize, letterSpacing: "0.18em", textTransform: "uppercase", color: hBadge.color }}>{heroBadge}</span>
          </div>
          <h1 style={{ fontSize: hHead.fontSize, fontWeight: 400, color: hHead.color, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "0 0 18px 0", fontFamily: "Georgia, serif" }}>
            <span style={{ position: "relative", display: "inline-block", marginBottom: "4px" }}>
              {heroHeading}
              <span style={{ position: "absolute", bottom: "-4px", left: 0, height: "2px", width: "100%", background: "linear-gradient(to right, #E8D5A3, transparent)", display: "block" }} />
            </span>
            <br />
            <em style={{ fontStyle: "italic", color: hHeadIt.color, fontSize: hHeadIt.fontSize }}>{heroHeadingItalic}</em>
          </h1>
          {lang === "th" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "0 auto 28px" }}>
              <span style={{ width: "16px", height: "1px", background: "#E8D5A3", opacity: 0.4, flexShrink: 0, display: "block" }} />
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{heroSubtextTh}</span>
            </div>
          )}
          <p style={{ fontSize: hDesc.fontSize, color: hDesc.color, lineHeight: 1.8, maxWidth: "520px", margin: "0 auto" }}>
            {heroDescription}
          </p>
        </div>
      </section>

      <GoldDivider />

      {/* §2 — STATS ─────────────────────────────────────── */}
      <section style={{ background: "#F8F6F1", borderTop: "0.5px solid rgba(232,213,163,0.15)", borderBottom: "0.5px solid rgba(232,213,163,0.15)" }}>
        <div
          ref={statsRef}
          className="stats-strip"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 64px" }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} style={{ flex: 1, borderRight: i < STATS.length - 1 ? "0.5px solid rgba(28,41,81,0.07)" : "none" }}>
              <StatCard value={Number(s.value)} suffix={s.suffix} label={s.label} inView={statsInView} />
            </div>
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* §3 — STORY GRID ─────────────────────────────────── */}
      <section style={{ background: "#F8F6F1" }}>
        <div
          ref={storyRef}
          className={`reveal${storyInView ? " in-view" : ""} story-outer-grid`}
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 64px" }}
        >
          {/* Photo frame — LEFT (35%) */}
          <div>
            <div
              className="photo-frame-mobile"
              style={{ width: "100%", aspectRatio: "3/4", borderRadius: "12px", overflow: "hidden", border: "1.5px solid rgba(232,213,163,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            >
              {storyPhoto ? (
                <img src={storyPhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Our Team" />
              ) : (
                <div style={{ background: "#1C2951", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <i className="ti ti-users" style={{ fontSize: "36px", color: "#E8D5A3", opacity: 0.4 }} />
                  <span style={{ fontSize: "10px", color: "rgba(232,213,163,0.35)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Our Team</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", marginTop: "8px", fontStyle: "italic" }}>— {gv(rows, "story", "team_photo_caption", "Our Team & Workshop")}</p>
          </div>

          {/* Story copy + checklist — RIGHT (65%) */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "72px", alignItems: "start" }}>
            {/* Left — story copy */}
            <div style={{ position: "relative" }}>
              <div aria-hidden="true" style={{ position: "absolute", top: "-0.5rem", left: "-1rem", fontSize: "6rem", fontWeight: 700, color: "#E8D5A3", opacity: 0.15, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>01</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ display: "block", width: "20px", height: "1px", background: "#C4B07A", flexShrink: 0 }} />
                <span style={{ fontSize: sBadge.fontSize, textTransform: "uppercase", letterSpacing: "0.16em", color: sBadge.color }}>{storyBadge}</span>
              </div>
              <h2 style={{ fontSize: sHead.fontSize, fontWeight: 400, color: sHead.color, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "20px", fontFamily: "Georgia, serif" }}>
                {storyHeading}<br />
                <em style={{ fontStyle: "italic", color: sHeadIt.color, fontSize: sHeadIt.fontSize }}>{storyHeadingItalic}</em>
              </h2>
              <p style={{ fontSize: sBody.fontSize, color: sBody.color, lineHeight: 1.8, marginBottom: "14px" }}>
                {storyPara1}
              </p>
              <p style={{ fontSize: sBody.fontSize, color: sBody.color, lineHeight: 1.8 }}>
                {storyPara2}
              </p>
            </div>

            {/* Right — checklist */}
            <div style={{ paddingTop: "12px" }}>
              <p style={{ fontSize: sCl.fontSize, textTransform: "uppercase", letterSpacing: "0.12em", color: sCl.color, marginBottom: "20px" }}>{storyChecklistLabel}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {CHECKLIST.map((item) => (
                  <div key={item} className="checklist-item" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "6px" }}>
                    <div style={{ width: "18px", height: "18px", flexShrink: 0, borderRadius: "50%", background: "rgba(13,30,61,0.06)", border: "0.5px solid rgba(13,30,61,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="ti ti-check" style={{ fontSize: "12px", color: "#8A6E00" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "#2C3E50", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* §4 — PULL QUOTE ─────────────────────────────────── */}
      <section style={{ background: "#1C2951", paddingTop: "112px", paddingBottom: "112px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Oversized opening mark */}
        <div aria-hidden="true" style={{ position: "absolute", top: "-2rem", left: "4rem", fontSize: "clamp(12rem, 28vw, 22rem)", fontWeight: 700, color: "#E8D5A3", opacity: 0.04, lineHeight: 1, userSelect: "none", pointerEvents: "none", fontFamily: "Georgia, serif" }}>&ldquo;</div>

        <div
          ref={quoteRef}
          className={`quote-reveal${quoteInView ? " in-view" : ""}`}
          style={{ maxWidth: "720px", textAlign: "center", padding: "80px 64px", position: "relative", zIndex: 2 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "32px" }}>
            <div style={{ width: "36px", height: "1px", background: "#E8D5A3", flexShrink: 0 }} />
            <span style={{ fontSize: qLabel.fontSize, letterSpacing: "0.18em", textTransform: "uppercase", color: qLabel.color }}>{quoteLabel}</span>
            <div style={{ width: "36px", height: "1px", background: "#E8D5A3", flexShrink: 0 }} />
          </div>
          <blockquote style={{ margin: 0 }}>
            <p style={{ fontSize: qText.fontSize || "clamp(1.4rem, 2vw, 1.75rem)", fontWeight: 400, color: qText.color, lineHeight: 1.55, letterSpacing: "-0.01em", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
              &ldquo;{quoteText}&rdquo;
            </p>
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "28px" }}>
            <div style={{ width: "24px", height: "0.5px", background: "rgba(232,213,163,0.4)" }} />
            <p style={{ fontSize: qAttr.fontSize, textTransform: "uppercase", letterSpacing: "0.14em", color: qAttr.color, margin: 0 }}>{quoteAttribution}</p>
            <div style={{ width: "24px", height: "0.5px", background: "rgba(232,213,163,0.4)" }} />
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* §5 — TIMELINE ───────────────────────────────────── */}
      <section style={{ background: "#F8F6F1" }}>
        <div className="timeline-outer-grid" style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 64px" }}>

          {/* Left (65%) — header + timelines */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ display: "block", width: "20px", height: "1px", background: "#C4B07A", flexShrink: 0 }} />
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", color: "#8A6E00" }}>Our History</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#0D1E3D", letterSpacing: "-0.02em", margin: "0 0 32px 0", fontFamily: "Georgia, serif" }}>Milestones</h2>

            {/* Desktop timeline */}
            <div className="hidden md:block scrollbar-hide" style={{ overflowX: "auto", paddingBottom: "16px" }}>
              <div style={{ display: "flex", position: "relative", minWidth: `${MILESTONES.length * 190}px` }}>
                {/* Connecting line */}
                <div style={{ position: "absolute", top: "82px", left: "95px", right: "95px", height: "1px", background: "rgba(13,30,61,0.15)", pointerEvents: "none" }} />

                {MILESTONES.map((m) => (
                  <div key={m.yr} style={{ flex: "0 0 190px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 10px" }}>
                    {/* Decorative year above */}
                    <div style={{ height: "72px", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "12px" }}>
                      <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: m.active ? "#8A6E00" : "#4A5568", fontWeight: m.active ? 600 : 400 }}>{m.year}</span>
                    </div>
                    {/* Dot */}
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: m.active ? "#1C2951" : "rgba(13,30,61,0.1)", border: `0.5px solid ${m.active ? "#1C2951" : "rgba(13,30,61,0.2)"}`, flexShrink: 0, position: "relative", zIndex: 2, marginBottom: "14px" }} />
                    {/* Text */}
                    <p style={{ fontSize: "12px", color: m.active ? "#0D1E3D" : "#4A5568", lineHeight: 1.6 }}>{m.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile timeline */}
            <div className="md:hidden" style={{ borderLeft: "1px solid rgba(13,30,61,0.15)", marginLeft: "16px", display: "flex", flexDirection: "column", gap: "0" }}>
              {MILESTONES.map((m) => (
                <div key={m.yr} style={{ position: "relative", padding: "12px 0 12px 28px" }}>
                  {/* Dot */}
                  <div style={{ position: "absolute", left: "-5px", top: "18px", width: "10px", height: "10px", borderRadius: "50%", background: m.active ? "#1C2951" : "rgba(13,30,61,0.1)", border: `0.5px solid ${m.active ? "#1C2951" : "rgba(13,30,61,0.2)"}` }} />
                  <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#8A6E00", display: "block", marginBottom: "4px" }}>{m.year}</span>
                  <p style={{ fontSize: "13px", color: m.active ? "#0D1E3D" : "#4A5568", lineHeight: 1.6, margin: 0 }}>{m.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right (35%) — photo frame */}
          <div className="timeline-photo-mobile-first" style={{ alignSelf: "center" }}>
            <div
              className="photo-frame-mobile"
              style={{ width: "100%", aspectRatio: "4/3", borderRadius: "12px", overflow: "hidden", border: "1.5px solid rgba(232,154,91,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            >
              {timelinePhoto ? (
                <img src={timelinePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Bangkok 2003" />
              ) : (
                <div style={{ background: "#1C2951", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <i className="ti ti-building" style={{ fontSize: "36px", color: "#E8D5A3", opacity: 0.4 }} />
                  <span style={{ fontSize: "10px", color: "rgba(232,213,163,0.35)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Since 2003</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", marginTop: "8px", fontStyle: "italic" }}>— {gv(rows, "milestones", "history_photo_caption", "Bangkok, 2003")}</p>
          </div>

        </div>
      </section>

      <GoldDivider />
    </>
  );
}
