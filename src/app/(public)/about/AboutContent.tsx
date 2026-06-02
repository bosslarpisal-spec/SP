"use client";

import { useRef, useState, useEffect } from "react";

/* ── DATA ───────────────────────────────────────────────── */
const MILESTONES = [
  { yr: "03", year: "2003", text: "Founded in Bangkok with a vision to redefine corporate gifting in Thailand.", active: false },
  { yr: "08", year: "2008", text: "Expanded OEM manufacturing capabilities and opened first dedicated production facility.", active: false },
  { yr: "12", year: "2012", text: "Surpassed 1,000+ clients across FMCG, finance, and technology sectors.", active: false },
  { yr: "18", year: "2018", text: "Launched Eco-Premium line — sustainable materials with zero compromise on quality.", active: true },
  { yr: "24", year: "2024", text: "3,000+ clients in 30+ countries. Celebrating 20+ years of premium excellence.", active: true },
];

const CHECKLIST = [
  "20+ years delivering premium merchandise",
  "Custom design team on every project",
  "100% quality guarantee on all orders",
  "Nationwide & international shipping",
];

const STATS = [
  { value: 25,    suffix: "+", label: "Years",     bg: "25+" },
  { value: 3000,  suffix: "+", label: "Clients",   bg: "3K+" },
  { value: 50000, suffix: "+", label: "Projects",  bg: "50K" },
  { value: 30,    suffix: "+", label: "Countries", bg: "30+" },
];

const PARTICLES = [
  { top: "12%", left: "7%",  dur: "7s",  del: "0s"   },
  { top: "28%", left: "19%", dur: "9s",  del: "1.2s" },
  { top: "8%",  left: "42%", dur: "11s", del: "0.5s" },
  { top: "5%",  left: "67%", dur: "8s",  del: "2s"   },
  { top: "35%", left: "82%", dur: "12s", del: "0.8s" },
  { top: "55%", left: "91%", dur: "7s",  del: "1.5s" },
  { top: "72%", left: "74%", dur: "10s", del: "0.3s" },
  { top: "80%", left: "55%", dur: "9s",  del: "2.5s" },
  { top: "65%", left: "33%", dur: "11s", del: "1s"   },
  { top: "78%", left: "14%", dur: "8s",  del: "1.8s" },
  { top: "45%", left: "4%",  dur: "12s", del: "0.6s" },
  { top: "42%", left: "50%", dur: "6s",  del: "2.2s" },
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
    let rafId: number;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(target * progress));
      if (progress < 1) { rafId = requestAnimationFrame(tick); }
      else { setCount(target); }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, duration]);
  return count;
}

/* ── SUB-COMPONENTS ─────────────────────────────────────── */
function StatCard({ value, suffix, label, bg, inView }: {
  value: number; suffix: string; label: string; bg: string; inView: boolean;
}) {
  const count = useCountUp(value, inView);
  const display = value >= 1000 ? count.toLocaleString() : String(count);
  return (
    <div style={{ textAlign: "center", position: "relative", padding: "40px 0", flex: 1, overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pointerEvents: "none", userSelect: "none" }}>
        <span style={{ fontSize: "clamp(4rem, 6vw, 6rem)", fontWeight: 700, color: "#1C2951", opacity: 0.06, lineHeight: 1, whiteSpace: "nowrap" }}>{bg}</span>
      </div>
      <div style={{ position: "relative", fontSize: "2.25rem", fontWeight: 600, color: "#0D1E3D", letterSpacing: "-0.03em", lineHeight: 1 }}>
        {display}{suffix}
      </div>
      <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#4A5568", marginTop: "10px" }}>{label}</div>
    </div>
  );
}

/* ── MAIN COMPONENT ─────────────────────────────────────── */
export default function AboutContent() {
  const { ref: statsRef,  inView: statsInView  } = useInView(0.3);
  const { ref: storyRef,  inView: storyInView  } = useInView(0.15);
  const { ref: quoteRef,  inView: quoteInView  } = useInView(0.3);

  return (
    <>
      <style>{`
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

        @media (prefers-reduced-motion: reduce) {
          .reveal, .quote-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          .hero-content { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      {/* §1 — HERO ──────────────────────────────────────── */}
      <section style={{ background: "#1C2951", minHeight: "60vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* "SP" watermark */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", userSelect: "none", overflow: "hidden" }}>
          <span style={{ fontSize: "clamp(12rem, 30vw, 22rem)", fontWeight: 800, color: "#E8D5A3", opacity: 0.04, lineHeight: 1, letterSpacing: "-0.05em" }}>SP</span>
        </div>

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} aria-hidden="true" style={{ position: "absolute", top: p.top, left: p.left, width: "3px", height: "3px", borderRadius: "50%", background: "#E8D5A3", opacity: 0.25, animation: `particle-float ${p.dur} ease-in-out ${p.del} infinite`, pointerEvents: "none" }} />
        ))}

        {/* Content */}
        <div className="hero-content" style={{ maxWidth: "700px", textAlign: "center", padding: "80px 40px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
            <div style={{ width: "36px", height: "1px", background: "#E8D5A3", flexShrink: 0 }} />
            <span style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#F0DC9A" }}>Our Story</span>
            <div style={{ width: "36px", height: "1px", background: "#E8D5A3", flexShrink: 0 }} />
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: "-0.02em", margin: "0 0 18px 0", fontFamily: "Georgia, serif" }}>
            Crafting Moments That<br />
            <em style={{ fontStyle: "italic", color: "#E8D5A3" }}>Last a Lifetime</em>
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.8, margin: "0 auto 28px" }}>
            ผู้เชี่ยวชาญด้านของพรีเมียมและโปรโมชันครบวงจร
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.90)", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto" }}>
            Since 2003, SP has partnered with leading brands across Thailand and beyond — designing, producing, and delivering premium gifts that carry meaning far beyond their moment of giving.
          </p>
        </div>
      </section>

      {/* §2 — STATS ─────────────────────────────────────── */}
      <section style={{ background: "#F8F6F1", borderTop: "0.5px solid rgba(232,213,163,0.15)", borderBottom: "0.5px solid rgba(232,213,163,0.15)" }}>
        <div
          ref={statsRef}
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 64px", display: "flex" }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} style={{ flex: 1, borderRight: i < STATS.length - 1 ? "0.5px solid rgba(28,41,81,0.07)" : "none" }}>
              <StatCard {...s} inView={statsInView} />
            </div>
          ))}
        </div>
      </section>

      {/* §3 — STORY GRID ─────────────────────────────────── */}
      <section style={{ background: "#F8F6F1" }}>
        <div
          ref={storyRef}
          className={`reveal${storyInView ? " in-view" : ""}`}
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 64px", display: "grid", gridTemplateColumns: "3fr 2fr", gap: "72px", alignItems: "start" }}
        >
          {/* Left — story copy */}
          <div style={{ position: "relative" }}>
            <div aria-hidden="true" style={{ position: "absolute", top: "-0.5rem", left: "-1rem", fontSize: "6rem", fontWeight: 700, color: "#E8D5A3", opacity: 0.15, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>01</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ display: "block", width: "20px", height: "1px", background: "#C4B07A", flexShrink: 0 }} />
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", color: "#8A6E00" }}>About SP</span>
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 400, color: "#0D1E3D", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "20px", fontFamily: "Georgia, serif" }}>
              Thailand&rsquo;s Trusted Partner in<br />
              <em style={{ fontStyle: "italic", color: "#8A6E00" }}>Premium Merchandise</em>
            </h2>
            <p style={{ fontSize: "13px", color: "#2C3E50", lineHeight: 1.8, marginBottom: "14px" }}>
              Founded in Bangkok in 2003, SP began as a small creative studio with one goal: to make branded gifting feel personal. Two decades later, we operate as a full-service premium goods partner — from concept and design through OEM manufacturing and global logistics.
            </p>
            <p style={{ fontSize: "13px", color: "#2C3E50", lineHeight: 1.8 }}>
              We work directly with procurement and marketing teams at companies like P&G, Acer, Oral-B, and SCB Bank — delivering products that reflect each brand&rsquo;s identity at every touchpoint.
            </p>
          </div>

          {/* Right — checklist */}
          <div style={{ paddingTop: "12px" }}>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#4A5568", marginBottom: "20px" }}>Why clients choose SP</p>
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
      </section>

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
            <span style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#F0DC9A" }}>Our Philosophy</span>
            <div style={{ width: "36px", height: "1px", background: "#E8D5A3", flexShrink: 0 }} />
          </div>
          <blockquote style={{ margin: 0 }}>
            <p style={{ fontSize: "clamp(1.4rem, 2vw, 1.75rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.55, letterSpacing: "-0.01em", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
              &ldquo;Every gift we create carries a brand&rsquo;s promise. Our job is to make sure that promise is felt — not just seen.&rdquo;
            </p>
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "28px" }}>
            <div style={{ width: "24px", height: "0.5px", background: "rgba(232,213,163,0.4)" }} />
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.75)", margin: 0 }}>SP Creative &amp; Production Team</p>
            <div style={{ width: "24px", height: "0.5px", background: "rgba(232,213,163,0.4)" }} />
          </div>
        </div>
      </section>

      {/* §5 — TIMELINE ───────────────────────────────────── */}
      <section style={{ background: "#F8F6F1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 64px" }}>
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
      </section>
    </>
  );
}
