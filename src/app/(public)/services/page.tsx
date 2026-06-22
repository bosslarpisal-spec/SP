import Link from "next/link";
import GoldDivider from "@/components/ui/GoldDivider";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

export const metadata = { title: "Our Services" };
export const revalidate = 3600;

type ContentRow = { section: string; key: string; value: string };
function gv(rows: ContentRow[], section: string, key: string, fallback: string): string {
  return rows.find(r => r.section === section && r.key === key)?.value ?? fallback;
}
function ga<T>(rows: ContentRow[], section: string, key: string, fallback: T[]): T[] {
  const raw = rows.find(r => r.section === section && r.key === key)?.value;
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T[]; } catch { return fallback; }
}

type SvcItem   = { n: string; feat: boolean; icon: string; title: string; th: string; desc: string };
type WhyItem   = { n: string; icon: string; title: string; desc: string };
type ProcItem  = { n: string; icon: string; title: string; desc: string; active: boolean };

const DEFAULT_SERVICES: SvcItem[] = [
  { n:"01", feat:true,  icon:"ti-gift",    title:"Premium Gifts",        th:"ของพรีเมียม",         desc:"Custom premium gifts from concept to delivery. We handle design, production, and packaging." },
  { n:"02", feat:false, icon:"ti-award",   title:"Corporate Souvenirs",  th:"ของที่ระลึกองค์กร",   desc:"High-quality branded souvenirs for events, exhibitions, and giveaways." },
  { n:"03", feat:false, icon:"ti-package", title:"New Year Packages",    th:"ชุดของขวัญปีใหม่",    desc:"Beautifully curated new-year gift sets that leave a lasting impression." },
  { n:"04", feat:false, icon:"ti-pencil",  title:"Custom Branding",      th:"งานพิมพ์แบรนด์",      desc:"Logo print, screen print, laser engraving, and full-colour embroidery." },
  { n:"05", feat:false, icon:"ti-settings",title:"OEM Manufacturing",    th:"การผลิต OEM",          desc:"End-to-end OEM product manufacturing with strict quality control." },
  { n:"06", feat:true,  icon:"ti-truck",   title:"Logistics & Delivery", th:"โลจิสติกส์และจัดส่ง", desc:"Reliable shipping to 30+ countries with real-time tracking and customs support." },
];
const DEFAULT_WHY: WhyItem[] = [
  { n:"01", icon:"ti-clock",  title:"20+ Years of Experience",  desc:"Decades of know-how delivering premium solutions across all sectors." },
  { n:"02", icon:"ti-pencil", title:"Custom Design Team",       desc:"In-house designers who bring your brand vision to life from concept to product." },
  { n:"03", icon:"ti-check",  title:"Strict Quality Control",   desc:"Multi-stage quality checks before every shipment leaves our facility." },
  { n:"04", icon:"ti-world",  title:"Global Export Capability", desc:"Exporting to 30+ countries with full logistics and customs support." },
];
const DEFAULT_PROCESS: ProcItem[] = [
  { n:"01", icon:"ti-message",  title:"Consultation",    desc:"We discuss your needs, target audience, and budget.",              active:false },
  { n:"02", icon:"ti-pencil",   title:"Design & Sample", desc:"Our team creates designs and sends physical samples.",              active:true  },
  { n:"03", icon:"ti-settings", title:"Production",      desc:"Full-scale manufacturing with quality control at every step.",     active:false },
  { n:"04", icon:"ti-truck",    title:"Delivery",        desc:"On-time delivery worldwide with full tracking support.",            active:false },
];

export default async function ServicesPage() {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase.from("page_content").select("section, key, value").eq("page", "services");
  const rows: ContentRow[] = data ?? [];

  const heroBadge        = gv(rows, "hero", "badge",          "WHAT WE OFFER");
  const heroHeading      = gv(rows, "hero", "heading",        "Our Core");
  const heroHeadingIt    = gv(rows, "hero", "heading_italic", "Services");
  const heroSubtextTh    = gv(rows, "hero", "subtext_th",     "บริการหลักของเรา");
  const heroDescription  = gv(rows, "hero", "description",    "From concept to delivery, SP manages every step. Our in-house design team, manufacturing partners, and logistics network ensure your premium products arrive on time, every time.");
  const whyBadge         = gv(rows, "why",  "badge",          "WHY CHOOSE US");
  const whyHeading       = gv(rows, "why",  "heading",        "Why SP?");
  const procBadge        = gv(rows, "process", "badge",       "HOW IT WORKS");
  const procHeading      = gv(rows, "process", "heading",     "Our Production Process");

  const SERVICES  = ga<SvcItem> (rows, "services", "items", DEFAULT_SERVICES);
  const WHY       = ga<WhyItem> (rows, "why",       "items", DEFAULT_WHY);
  const PROCESS   = ga<ProcItem>(rows, "process",   "items", DEFAULT_PROCESS);
  return (
    <>
      <style>{`
        .why-card { transition: background 0.2s ease, border-color 0.2s ease; }
        .why-card:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(232,213,163,0.35) !important; }
        .svc-hero { padding: 120px 80px 60px; }
        .svc-hero-bottom { display: flex; gap: 20px; align-items: flex-start; }
        .svc-hero-vdivider { width: 1px; background: rgba(232,213,163,0.2); align-self: stretch; min-height: 40px; flex-shrink: 0; }
        @media (max-width: 768px) {
          .svc-hero { padding: 100px 24px 60px !important; }
          .svc-hero-bottom { flex-direction: column; gap: 10px; }
          .svc-hero-vdivider { display: none; }
        }
      `}</style>

      {/* ── DARK HERO ─────────────────────────────────────── */}
      <section className="svc-hero" style={{ backgroundImage: "url('/HeroBlockHome.png')", backgroundSize: "cover", backgroundPosition: "right center", backgroundRepeat: "no-repeat", minHeight: "45vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,30,61,0.92) 0%, rgba(13,30,61,0.80) 40%, rgba(13,30,61,0.40) 70%, rgba(13,30,61,0.10) 100%)", zIndex: 0, pointerEvents: "none" }} />

        {/* Large gold glow circle */}
        <div style={{ position: "absolute", right: "-60px", top: "50%", transform: "translateY(-50%)", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", border: "1px solid rgba(201,168,76,0.08)", pointerEvents: "none" }} />

        {/* Small inner circle */}
        <div style={{ position: "absolute", right: "30px", top: "50%", transform: "translateY(-50%)", width: "180px", height: "180px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.06)", pointerEvents: "none" }} />

        {/* Left gold border strip */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "linear-gradient(to bottom, transparent, #C9A84C 30%, #E8D5A3 50%, #C9A84C 70%, transparent)", pointerEvents: "none" }} />

        {/* Content */}
        <div style={{ maxWidth: "620px", width: "100%", position: "relative", zIndex: 1 }}>

          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px" }}>
            <div style={{ width: "18px", height: "1.5px", background: "#E8D5A3", flexShrink: 0 }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#E8D5A3", textTransform: "uppercase", fontFamily: "sans-serif" }}>{heroBadge}</span>
          </div>

          {/* Heading row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
            <span style={{ fontSize: "clamp(28px, 4vw, 42px)", color: "#FFFFFF", fontFamily: "Georgia, serif", fontWeight: 400, lineHeight: 1.05 }}>{heroHeading}</span>
            <span style={{ fontSize: "clamp(24px, 3.5vw, 38px)", color: "#E8D5A3", fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: 1.05 }}>{heroHeadingIt}</span>
          </div>

          {/* Gold divider line */}
          <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.1))", margin: "10px 0 14px" }} />

          {/* Bottom row: Thai | divider | description */}
          <div className="svc-hero-bottom">
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif", whiteSpace: "nowrap", paddingTop: "3px", flexShrink: 0 }}>{heroSubtextTh}</div>
            <div className="svc-hero-vdivider" />
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.85, margin: 0 }}>
              {heroDescription}
            </p>
          </div>

        </div>
      </section>

      <GoldDivider />

      {/* ── UNIFIED BLOCK — Services · Why SP · Process ───── */}
      <section style={{ background: "#F8F6F1" }}>
        <div
          className="overflow-hidden"
          style={{
            maxWidth: "100%",
            margin: "0",
            borderRadius: "0",
            border: "none",
            boxShadow: "none",
          }}
        >

          {/* ROW 1 — 01 Premium Gifts (FEATURED) ──────────── */}
          <div className="flex flex-col md:flex-row">
            {/* LEFT: text — stacks first on mobile */}
            <div
              className="w-full md:w-1/2 p-6 md:px-[60px] md:py-[48px] flex flex-col justify-center"
              style={{ background: "#1C2951" }}
            >
              <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(232,213,163,0.6)", marginBottom: "12px" }}>
                01 — Featured
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: 400, color: "#FFFFFF", fontFamily: "Georgia, serif", lineHeight: 1.1, marginBottom: "8px" }}>
                {SERVICES[0].title}
              </h2>
              <div style={{ fontSize: "14px", color: "#E8D5A3", marginBottom: "12px" }}>{SERVICES[0].th}</div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "16px" }}>{SERVICES[0].desc}</p>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500, color: "#E8D5A3", textDecoration: "none" }}>
                → Learn more
              </Link>
            </div>
            {/* RIGHT: icon — stacks second (below) on mobile */}
            <div
              className="w-full h-[140px] md:h-auto md:w-1/2 md:min-h-[280px] flex items-center justify-center"
              style={{ background: "#243160" }}
            >
              <i className={`ti ${SERVICES[0].icon}`} style={{ fontSize: "80px", color: "#E8D5A3", opacity: 0.2 }} />
            </div>
          </div>

          {/* ROW 2 — 02 Corporate Souvenirs (FLIPPED) ──────── */}
          <div className="flex flex-col md:flex-row">
            {/* LEFT: icon — stacks first (above text) on mobile */}
            <div
              className="w-full h-[140px] md:h-auto md:w-1/2 md:min-h-[220px] flex items-center justify-center"
              style={{ background: "#F0EEE8" }}
            >
              <i className={`ti ${SERVICES[1].icon}`} style={{ fontSize: "80px", color: "#1C2951", opacity: 0.12 }} />
            </div>
            {/* RIGHT: text */}
            <div
              className="w-full md:w-1/2 p-6 md:px-[60px] md:py-[48px] flex flex-col justify-center"
              style={{ background: "#FFFFFF" }}
            >
              <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "12px" }}>02</div>
              <h2 style={{ fontSize: "28px", fontWeight: 400, color: "#0D1E3D", fontFamily: "Georgia, serif", lineHeight: 1.1, marginBottom: "8px" }}>
                {SERVICES[1].title}
              </h2>
              <div style={{ fontSize: "14px", color: "#C9A84C", marginBottom: "12px" }}>{SERVICES[1].th}</div>
              <p style={{ fontSize: "13px", color: "#4A5568", lineHeight: 1.7 }}>{SERVICES[1].desc}</p>
            </div>
          </div>

          {/* BOTTOM ROW — 03 · 04 · 05 · 06 ────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4">
            {/* 03 */}
            <div style={{ background: "#FFFFFF", borderRight: "0.5px solid rgba(28,41,81,0.1)", padding: "28px 24px", display: "flex", flexDirection: "column", minHeight: "200px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "10px" }}>03</div>
              <i className={`ti ${SERVICES[2].icon}`} style={{ fontSize: "28px", color: "#1C2951", opacity: 0.4, marginBottom: "12px" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#0D1E3D", marginBottom: "4px" }}>{SERVICES[2].title}</h3>
              <p style={{ fontSize: "12px", color: "#C9A84C", marginBottom: "8px" }}>{SERVICES[2].th}</p>
              <p style={{ fontSize: "12px", color: "#4A5568", lineHeight: 1.6 }}>{SERVICES[2].desc}</p>
            </div>
            {/* 04 */}
            <div style={{ background: "#FFFFFF", borderRight: "0.5px solid rgba(28,41,81,0.1)", padding: "28px 24px", display: "flex", flexDirection: "column", minHeight: "200px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "10px" }}>04</div>
              <i className={`ti ${SERVICES[3].icon}`} style={{ fontSize: "28px", color: "#1C2951", opacity: 0.4, marginBottom: "12px" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#0D1E3D", marginBottom: "4px" }}>{SERVICES[3].title}</h3>
              <p style={{ fontSize: "12px", color: "#C9A84C", marginBottom: "8px" }}>{SERVICES[3].th}</p>
              <p style={{ fontSize: "12px", color: "#4A5568", lineHeight: 1.6 }}>{SERVICES[3].desc}</p>
            </div>
            {/* 05 */}
            <div style={{ background: "#FFFFFF", borderRight: "0.5px solid rgba(28,41,81,0.1)", padding: "28px 24px", display: "flex", flexDirection: "column", minHeight: "200px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "10px" }}>05</div>
              <i className={`ti ${SERVICES[4].icon}`} style={{ fontSize: "28px", color: "#1C2951", opacity: 0.4, marginBottom: "12px" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#0D1E3D", marginBottom: "4px" }}>{SERVICES[4].title}</h3>
              <p style={{ fontSize: "12px", color: "#C9A84C", marginBottom: "8px" }}>{SERVICES[4].th}</p>
              <p style={{ fontSize: "12px", color: "#4A5568", lineHeight: 1.6 }}>{SERVICES[4].desc}</p>
            </div>
            {/* 06 — Featured dark */}
            <div style={{ background: "#1C2951", padding: "28px 24px", display: "flex", flexDirection: "column", minHeight: "200px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#E8D5A3", marginBottom: "10px" }}>06</div>
              <i className={`ti ${SERVICES[5].icon}`} style={{ fontSize: "28px", color: "#E8D5A3", opacity: 0.5, marginBottom: "12px" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>{SERVICES[5].title}</h3>
              <p style={{ fontSize: "12px", color: "#E8D5A3", marginBottom: "8px" }}>{SERVICES[5].th}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, flex: 1 }}>{SERVICES[5].desc}</p>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 500, color: "#E8D5A3", textDecoration: "none", marginTop: "12px" }}>
                → Learn more
              </Link>
            </div>
          </div>

          <GoldDivider />

          {/* ── WHY SP ───────────────────────────────────────── */}
          <div
            className="p-6 md:px-20 md:py-14"
            style={{ background: "#1C2951" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <div style={{ width: "24px", height: "1.5px", background: "#E8D5A3", flexShrink: 0 }} />
              <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#E8D5A3" }}>{whyBadge}</span>
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 400, color: "#FFFFFF", fontFamily: "Georgia, serif", marginBottom: "28px" }}>
              <span style={{ position: "relative", display: "inline-block" }}>
                {whyHeading}
                <span style={{ position: "absolute", bottom: "-4px", left: 0, height: "2px", width: "100%", background: "linear-gradient(to right, #E8D5A3, transparent)", display: "block" }} />
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {WHY.map(w => (
                <div
                  key={w.n}
                  className="why-card"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(232,213,163,0.2)", borderRadius: "12px", padding: "24px" }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(232,213,163,0.12)", border: "1px solid rgba(232,213,163,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                    <i className={`ti ${w.icon}`} style={{ fontSize: "20px", color: "#E8D5A3" }} />
                  </div>
                  <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#FFFFFF", marginBottom: "6px" }}>{w.title}</h3>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{w.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <GoldDivider />

          {/* ── PRODUCTION PROCESS ───────────────────────────── */}
          <div
            className="p-6 md:px-20 md:py-14"
            style={{ background: "#F8F6F1" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <div style={{ width: "24px", height: "1.5px", background: "#C9A84C", flexShrink: 0 }} />
              <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A84C" }}>{procBadge}</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#0D1E3D", fontFamily: "Georgia, serif", marginBottom: "36px" }}>
              <span style={{ position: "relative", display: "inline-block" }}>
                {procHeading}
                <span style={{ position: "absolute", bottom: "-4px", left: 0, height: "2px", width: "100%", background: "linear-gradient(to right, #E8D5A3, transparent)", display: "block" }} />
              </span>
            </h2>
            <div style={{ position: "relative" }}>
              {/* Connecting line — desktop only */}
              <div
                className="hidden md:block"
                style={{ position: "absolute", top: "18px", left: "calc(12.5%)", right: "calc(12.5%)", height: "1px", background: "rgba(28,41,81,0.12)", zIndex: 0, pointerEvents: "none" }}
              />
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-0" style={{ position: "relative" }}>
                {PROCESS.map(step => (
                  <div key={step.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 12px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: step.active ? "#E8D5A3" : "#1C2951",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      position: "relative", zIndex: 1, marginBottom: "12px", flexShrink: 0,
                    }}>
                      <i className={`ti ${step.icon}`} style={{ fontSize: "16px", color: step.active ? "#1C2951" : "#E8D5A3" }} />
                    </div>
                    <div style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "4px" }}>{step.n}</div>
                    <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#0D1E3D", marginBottom: "4px" }}>{step.title}</h3>
                    <p style={{ fontSize: "10px", color: "#4A5568", lineHeight: 1.5 }}>{step.desc}</p>
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
