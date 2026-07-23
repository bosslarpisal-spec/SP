"use client";

import Link from "next/link";
import Image from "next/image";
import GoldDivider from "@/components/ui/GoldDivider";
import { useLang } from "@/contexts/LanguageContext";

export type SvcItem  = { n: string; feat: boolean; icon: string; title: string; th: string; desc: string; desc_th?: string };
export type WhyItem  = { n: string; icon: string; title: string; title_th?: string; desc: string; desc_th?: string };
export type ProcItem = { n: string; icon: string; title: string; title_th?: string; desc: string; desc_th?: string; active: boolean };

type BS = Record<string, string>;
function gs(obj: Record<string, BS>, key: string, def: BS): BS {
  const ov = obj[key] ?? {};
  return { color: ov.color ?? def.color, fontSize: ov.fontSize ?? def.fontSize };
}

interface Props {
  heroBadge: string;
  heroHeading: string;
  heroHeadingIt: string;
  heroSubtextTh: string;
  heroDescription: string;
  heroStylesJson: string;
  whyBadge: string;
  whyHeading: string;
  whyStylesJson: string;
  procBadge: string;
  procHeading: string;
  procStylesJson: string;
  serviceImage1: string;
  serviceImage2: string;
  services: SvcItem[];
  why: WhyItem[];
  process: ProcItem[];
}

function svcTitle(item: SvcItem, lang: string) {
  return lang === "th" ? (item.th || item.title) : item.title;
}

export default function ServicesContent({
  heroBadge, heroHeading, heroHeadingIt, heroSubtextTh, heroDescription, heroStylesJson,
  whyBadge, whyHeading, whyStylesJson,
  procBadge, procHeading, procStylesJson,
  serviceImage1, serviceImage2,
  services: rawServices, why: rawWhy, process: rawProcess,
}: Props) {
  const { lang } = useLang();
  const SERVICES = rawServices.filter(s => s.title?.trim());
  const WHY      = rawWhy.filter(w => w.title?.trim());
  const PROCESS  = rawProcess.filter(p => p.title?.trim());

  const heroSt: Record<string, BS> = (() => { try { return JSON.parse(heroStylesJson); } catch { return {}; } })();
  const whySt:  Record<string, BS> = (() => { try { return JSON.parse(whyStylesJson);  } catch { return {}; } })();
  const procSt: Record<string, BS> = (() => { try { return JSON.parse(procStylesJson); } catch { return {}; } })();

  const hBadge    = gs(heroSt, "badge",         { color: "#E8D5A3",                fontSize: "10px" });
  const hHead     = gs(heroSt, "heading",        { color: "#FFFFFF",                fontSize: "42px" });
  const hHeadIt   = gs(heroSt, "headingItalic",  { color: "#E8D5A3",                fontSize: "38px" });
  const hSubTh    = gs(heroSt, "subtextTh",      { color: "rgba(255,255,255,0.45)", fontSize: "12px" });
  const hDesc     = gs(heroSt, "description",    { color: "rgba(255,255,255,0.65)", fontSize: "13px" });
  const wBadge    = gs(whySt,  "badge",          { color: "#E8D5A3",                fontSize: "10px" });
  const wHead     = gs(whySt,  "heading",        { color: "#FFFFFF",                fontSize: "22px" });
  const pBadge    = gs(procSt, "badge",          { color: "#C9A84C",                fontSize: "10px" });
  const pHead     = gs(procSt, "heading",        { color: "#0D1E3D",                fontSize: "20px" });

  return (
    <>
      <style>{`
        .why-card { transition: background 0.2s ease, border-color 0.2s ease; }
        .why-card:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(232,213,163,0.35) !important; }
        .svc-hero { padding: 120px 80px 60px; }
        .svc-hero-bottom { display: flex; gap: 20px; align-items: flex-start; }
        .svc-hero-vdivider { width: 1px; background: rgba(232,213,163,0.2); align-self: stretch; min-height: 40px; flex-shrink: 0; }
        .svc-subtext-th { white-space: nowrap; flex-shrink: 0; padding-top: 3px; }
        @media (max-width: 768px) {
          .svc-hero { padding: 100px 24px 60px !important; }
          .svc-hero-bottom { flex-direction: column; gap: 10px; }
          .svc-hero-vdivider { display: none; }
          .svc-subtext-th { white-space: normal !important; flex-shrink: unset !important; }
          .svc-hero-heading { font-size: clamp(22px, 7vw, 32px) !important; }
        }
        @media (min-width: 769px) and (max-width: 1023px) {
          .svc-hero { padding: 100px 40px 60px !important; }
        }
      `}</style>

      {/* ── DARK HERO ─────────────────────────────────────── */}
      <section className="svc-hero" style={{ backgroundImage: "url('/HeroBlockHome.png')", backgroundSize: "cover", backgroundPosition: "right center", backgroundRepeat: "no-repeat", minHeight: "45vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,30,61,0.92) 0%, rgba(13,30,61,0.80) 40%, rgba(13,30,61,0.40) 70%, rgba(13,30,61,0.10) 100%)", zIndex: 0, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "-60px", top: "50%", transform: "translateY(-50%)", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", border: "1px solid rgba(201,168,76,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "30px", top: "50%", transform: "translateY(-50%)", width: "180px", height: "180px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "linear-gradient(to bottom, transparent, #C9A84C 30%, #E8D5A3 50%, #C9A84C 70%, transparent)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "620px", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px" }}>
            <div style={{ width: "18px", height: "1.5px", background: "#E8D5A3", flexShrink: 0 }} />
            <span style={{ fontSize: hBadge.fontSize, letterSpacing: "0.18em", color: hBadge.color, textTransform: "uppercase", fontFamily: "sans-serif" }}>{heroBadge}</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
            <span className="svc-hero-heading" style={{ fontSize: hHead.fontSize, color: hHead.color, fontFamily: "Georgia, serif", fontWeight: 400, lineHeight: 1.05 }}>{heroHeading}</span>
            <span className="svc-hero-heading" style={{ fontSize: hHeadIt.fontSize, color: hHeadIt.color, fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: 1.05 }}>{heroHeadingIt}</span>
          </div>
          <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.1))", margin: "10px 0 14px" }} />
          <div className="svc-hero-bottom">
            {lang === "th" && (
              <>
                <div className="svc-subtext-th" style={{ fontSize: hSubTh.fontSize, color: hSubTh.color, fontFamily: "sans-serif" }}>{heroSubtextTh}</div>
                <div className="svc-hero-vdivider" />
              </>
            )}
            <p style={{ fontSize: hDesc.fontSize, color: hDesc.color, lineHeight: 1.85, margin: 0 }}>
              {heroDescription}
            </p>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── UNIFIED BLOCK — Services · Why SP · Process ───── */}
      <section style={{ background: "#F8F6F1" }}>
        <div className="overflow-hidden" style={{ maxWidth: "100%", margin: "0", borderRadius: "0", border: "none", boxShadow: "none" }}>

          {/* ROW 1 — 01 Featured ─ only if ≥ 1 service ──────── */}
          {SERVICES.length >= 1 && (
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-6 md:px-[60px] md:py-[48px] flex flex-col justify-center" style={{ background: "#1C2951" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(232,213,163,0.6)", marginBottom: "12px" }}>
                  01 — {lang === "th" ? "แนะนำ" : "Featured"}
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: 400, color: "#FFFFFF", fontFamily: "Georgia, serif", lineHeight: 1.1, marginBottom: "8px" }}>
                  {svcTitle(SERVICES[0], lang)}
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "16px" }}>{lang === "th" ? (SERVICES[0].desc_th || SERVICES[0].desc) : SERVICES[0].desc}</p>
                <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500, color: "#E8D5A3", textDecoration: "none" }}>
                  → {lang === "th" ? "เรียนรู้เพิ่มเติม" : "Learn more"}
                </Link>
              </div>
              <div className="w-full h-[200px] md:h-auto md:w-1/2 md:min-h-[280px] flex items-center justify-center" style={{ background: "#243160", overflow: "hidden", position: "relative" }}>
                {serviceImage1
                  ? <Image src={serviceImage1} alt={SERVICES[0].title} fill sizes="(max-width: 767px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                  : <i className={`ti ${SERVICES[0].icon}`} style={{ fontSize: "80px", color: "#E8D5A3", opacity: 0.2 }} />
                }
              </div>
            </div>
          )}

          {/* ROW 2 — 02 Flipped ─ only if ≥ 2 services ── */}
          {SERVICES.length >= 2 && (
            <div className="flex flex-col md:flex-row">
              <div className="w-full h-[200px] md:h-auto md:w-1/2 md:min-h-[220px] flex items-center justify-center" style={{ background: "#F0EEE8", overflow: "hidden", position: "relative" }}>
                {serviceImage2
                  ? <Image src={serviceImage2} alt={SERVICES[1].title} fill sizes="(max-width: 767px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                  : <i className={`ti ${SERVICES[1].icon}`} style={{ fontSize: "80px", color: "#1C2951", opacity: 0.12 }} />
                }
              </div>
              <div className="w-full md:w-1/2 p-6 md:px-[60px] md:py-[48px] flex flex-col justify-center" style={{ background: "#FFFFFF" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "12px" }}>02</div>
                <h2 style={{ fontSize: "28px", fontWeight: 400, color: "#0D1E3D", fontFamily: "Georgia, serif", lineHeight: 1.1, marginBottom: "8px" }}>
                  {svcTitle(SERVICES[1], lang)}
                </h2>
                <p style={{ fontSize: "13px", color: "#4A5568", lineHeight: 1.7 }}>{lang === "th" ? (SERVICES[1].desc_th || SERVICES[1].desc) : SERVICES[1].desc}</p>
              </div>
            </div>
          )}

          {/* BOTTOM ROW — 03 … N ─ only if ≥ 3 services ──────── */}
          {SERVICES.length >= 3 && (() => {
            const bottomCards = SERVICES.slice(2);
            return (
              <div className="grid grid-cols-2 md:grid-cols-4">
                {bottomCards.slice(0, -1).map((svc, i) => (
                  <div key={svc.n} style={{ background: "#FFFFFF", borderRight: "0.5px solid rgba(28,41,81,0.1)", padding: "28px 24px", display: "flex", flexDirection: "column", minHeight: "200px" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "10px" }}>0{i + 3}</div>
                    <i className={`ti ${svc.icon}`} style={{ fontSize: "28px", color: "#1C2951", opacity: 0.4, marginBottom: "12px" }} />
                    <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#0D1E3D", marginBottom: "4px" }}>{svcTitle(svc, lang)}</h3>
                    <p style={{ fontSize: "12px", color: "#4A5568", lineHeight: 1.6 }}>{lang === "th" ? (svc.desc_th || svc.desc) : svc.desc}</p>
                  </div>
                ))}
                {/* Last card is always dark navy */}
                {(() => {
                  const last = bottomCards[bottomCards.length - 1];
                  const lastNum = String(SERVICES.length).padStart(2, "0");
                  return (
                    <div style={{ background: "#1C2951", padding: "28px 24px", display: "flex", flexDirection: "column", minHeight: "200px" }}>
                      <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#E8D5A3", marginBottom: "10px" }}>{lastNum}</div>
                      <i className={`ti ${last.icon}`} style={{ fontSize: "28px", color: "#E8D5A3", opacity: 0.5, marginBottom: "12px" }} />
                      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>{svcTitle(last, lang)}</h3>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, flex: 1 }}>{lang === "th" ? (last.desc_th || last.desc) : last.desc}</p>
                      <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 500, color: "#E8D5A3", textDecoration: "none", marginTop: "12px" }}>
                        → {lang === "th" ? "เรียนรู้เพิ่มเติม" : "Learn more"}
                      </Link>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          <GoldDivider />

          {/* ── WHY SP ─────────────────────────────── */}
          <div className="p-6 md:px-20 md:py-14" style={{ background: "#1C2951" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <div style={{ width: "24px", height: "1.5px", background: "#E8D5A3", flexShrink: 0 }} />
              <span style={{ fontSize: wBadge.fontSize, letterSpacing: "0.18em", textTransform: "uppercase", color: wBadge.color }}>{whyBadge}</span>
            </div>
            <h2 style={{ fontSize: wHead.fontSize, fontWeight: 400, color: wHead.color, fontFamily: "Georgia, serif", marginBottom: "28px" }}>
              <span style={{ position: "relative", display: "inline-block" }}>
                {whyHeading}
                <span style={{ position: "absolute", bottom: "-4px", left: 0, height: "2px", width: "100%", background: "linear-gradient(to right, #E8D5A3, transparent)", display: "block" }} />
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {WHY.map(w => (
                <div key={w.n} className="why-card" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(232,213,163,0.2)", borderRadius: "12px", padding: "24px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(232,213,163,0.12)", border: "1px solid rgba(232,213,163,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                    <i className={`ti ${w.icon}`} style={{ fontSize: "20px", color: "#E8D5A3" }} />
                  </div>
                  <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#FFFFFF", marginBottom: "6px" }}>
                    {lang === "th" ? (w.title_th || w.title) : w.title}
                  </h3>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                    {lang === "th" ? (w.desc_th || w.desc) : w.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <GoldDivider />

          {/* ── PRODUCTION PROCESS ──────────────────── */}
          <div className="p-6 md:px-20 md:py-14" style={{ background: "#F8F6F1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <div style={{ width: "24px", height: "1.5px", background: "#C9A84C", flexShrink: 0 }} />
              <span style={{ fontSize: pBadge.fontSize, letterSpacing: "0.18em", textTransform: "uppercase", color: pBadge.color }}>{procBadge}</span>
            </div>
            <h2 style={{ fontSize: pHead.fontSize, fontWeight: 400, color: pHead.color, fontFamily: "Georgia, serif", marginBottom: "36px" }}>
              <span style={{ position: "relative", display: "inline-block" }}>
                {procHeading}
                <span style={{ position: "absolute", bottom: "-4px", left: 0, height: "2px", width: "100%", background: "linear-gradient(to right, #E8D5A3, transparent)", display: "block" }} />
              </span>
            </h2>
            <div style={{ position: "relative" }}>
              <div className="hidden md:block" style={{ position: "absolute", top: "18px", left: "calc(12.5%)", right: "calc(12.5%)", height: "1px", background: "rgba(28,41,81,0.12)", zIndex: 0, pointerEvents: "none" }} />
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-0" style={{ position: "relative" }}>
                {PROCESS.map(step => (
                  <div key={step.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: step.active ? "#E8D5A3" : "#1C2951", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, marginBottom: "12px", flexShrink: 0 }}>
                      <i className={`ti ${step.icon}`} style={{ fontSize: "16px", color: step.active ? "#1C2951" : "#E8D5A3" }} />
                    </div>
                    <div style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "4px" }}>{step.n}</div>
                    <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#0D1E3D", marginBottom: "4px" }}>
                      {lang === "th" ? (step.title_th || step.title) : step.title}
                    </h3>
                    <p style={{ fontSize: "10px", color: "#4A5568", lineHeight: 1.5 }}>
                      {lang === "th" ? (step.desc_th || step.desc) : step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <GoldDivider />
        </div>
      </section>
    </>
  );
}
