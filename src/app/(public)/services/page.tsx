import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata = { title: "Our Services" };
export const revalidate = 86400;

const SERVICES = [
  { n: "01", feat: true,  icon: "ti-gift",    title: "Premium Gifts",        th: "ของพรีเมียม",         desc: "Custom premium gifts from concept to delivery. We handle design, production, and packaging." },
  { n: "02", feat: false, icon: "ti-award",   title: "Corporate Souvenirs",  th: "ของที่ระลึกองค์กร",   desc: "High-quality branded souvenirs for events, exhibitions, and giveaways." },
  { n: "03", feat: false, icon: "ti-package", title: "New Year Packages",    th: "ชุดของขวัญปีใหม่",    desc: "Beautifully curated new-year gift sets that leave a lasting impression." },
  { n: "04", feat: false, icon: "ti-pencil",  title: "Custom Branding",      th: "งานพิมพ์แบรนด์",      desc: "Logo print, screen print, laser engraving, and full-colour embroidery." },
  { n: "05", feat: false, icon: "ti-settings",title: "OEM Manufacturing",    th: "การผลิต OEM",          desc: "End-to-end OEM product manufacturing with strict quality control." },
  { n: "06", feat: true,  icon: "ti-truck",   title: "Logistics & Delivery", th: "โลจิสติกส์และจัดส่ง", desc: "Reliable shipping to 30+ countries with real-time tracking and customs support." },
];

const WHY = [
  { n: "01", icon: "ti-clock",  title: "20+ Years of Experience",  desc: "Decades of know-how delivering premium solutions across all sectors." },
  { n: "02", icon: "ti-pencil", title: "Custom Design Team",       desc: "In-house designers who bring your brand vision to life from concept to product." },
  { n: "03", icon: "ti-check",  title: "Strict Quality Control",   desc: "Multi-stage quality checks before every shipment leaves our facility." },
  { n: "04", icon: "ti-globe",  title: "Global Export Capability", desc: "Exporting to 30+ countries with full logistics and customs support." },
];

const PROCESS = [
  { n: "01", icon: "ti-message",  title: "Consultation",    desc: "We discuss your needs, target audience, and budget." },
  { n: "02", icon: "ti-pencil",   title: "Design & Sample", desc: "Our team creates designs and sends physical samples." },
  { n: "03", icon: "ti-settings", title: "Production",      desc: "Full-scale manufacturing with quality control at every step." },
  { n: "04", icon: "ti-truck",    title: "Delivery",        desc: "On-time delivery worldwide with full tracking support." },
];

const SVC_TAGS = ["Design", "Manufacturing", "Branding", "Logistics", "OEM"];

export default function ServicesPage() {
  return (
    <>
      {/* ── DARK HERO ─────────────────────────────────────── */}
      <section style={{ background: "#1C2951" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ display: "block", width: "20px", height: "1px", background: "#E8D5A3", flexShrink: 0 }} />
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", color: "#F0DC9A" }}>WHAT WE OFFER</span>
            </div>
            <h1 style={{ fontSize: "40px", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: "-0.02em", marginTop: "16px", fontFamily: "Georgia,serif" }}>
              Our Core<br />
              <em style={{ fontStyle: "italic", color: "#E8D5A3" }}>Services</em><br />
              <span style={{ fontSize: "14px", fontStyle: "normal", color: "rgba(255,255,255,0.85)" }}>บริการหลักของเรา</span>
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "14px" }}>
              {SVC_TAGS.map(t => (
                <span key={t} style={{ fontSize: "11px", color: "#E8D5A3", border: "0.5px solid rgba(232,213,163,0.3)", padding: "5px 12px", borderRadius: "4px" }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.90)", lineHeight: 1.8, borderLeft: "1px solid rgba(232,213,163,0.35)", paddingLeft: "24px" }}>
              From concept to delivery, SP manages every step. Our in-house design team, manufacturing partners, and logistics network ensure your premium products arrive on time, every time.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICE GRID — row by row ─────────────────────── */}
      <section style={{ background: "#F8F6F1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 64px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ROW 1 — 3 equal cards: 01 (featured) · 02 · 03 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
            {/* 01 — Featured */}
            <div style={{ background: "#FFFFFF", border: "0.5px solid rgba(13,30,61,0.1)", borderLeft: "3px solid #1C2951", borderRadius: "8px", padding: "24px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(28,41,81,0.35)", marginBottom: "8px" }}>01 — Featured</div>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(13,30,61,0.06)", border: "0.5px solid rgba(13,30,61,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                <i className={`ti ${SERVICES[0].icon}`} style={{ fontSize: "20px", color: "#8A6E00" }} />
              </div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0D1E3D", marginBottom: "4px" }}>{SERVICES[0].title}</h3>
              <p style={{ fontSize: "11px", color: "#8A6E00", marginBottom: "8px" }}>{SERVICES[0].th}</p>
              <p style={{ fontSize: "12px", color: "#2C3E50", lineHeight: 1.7, marginBottom: "14px" }}>{SERVICES[0].desc}</p>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#8A6E00" }}>
                <i className="ti ti-arrow-right" style={{ fontSize: "12px" }} /> Learn more
              </Link>
            </div>

            {/* 02, 03 — Standard */}
            {SERVICES.slice(1, 3).map(s => (
              <div key={s.n} style={{ background: "#FFFFFF", border: "0.5px solid rgba(13,30,61,0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(28,41,81,0.3)", marginBottom: "6px" }}>{s.n}</div>
                <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "rgba(13,30,61,0.06)", border: "0.5px solid rgba(13,30,61,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                  <i className={`ti ${s.icon}`} style={{ fontSize: "16px", color: "#8A6E00" }} />
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#0D1E3D", marginBottom: "4px" }}>{s.title}</h3>
                <p style={{ fontSize: "11px", color: "#8A6E00", marginBottom: "8px" }}>{s.th}</p>
                <p style={{ fontSize: "12px", color: "#4A5568", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* ROW 2 — 2 equal cards: 04 · 05 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {SERVICES.slice(3, 5).map(s => (
              <div key={s.n} style={{ background: "#FFFFFF", border: "0.5px solid rgba(13,30,61,0.08)", borderRadius: "8px", padding: "24px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(28,41,81,0.3)", marginBottom: "6px" }}>{s.n}</div>
                <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "rgba(13,30,61,0.06)", border: "0.5px solid rgba(13,30,61,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                  <i className={`ti ${s.icon}`} style={{ fontSize: "16px", color: "#8A6E00" }} />
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#0D1E3D", marginBottom: "4px" }}>{s.title}</h3>
                <p style={{ fontSize: "11px", color: "#8A6E00", marginBottom: "8px" }}>{s.th}</p>
                <p style={{ fontSize: "12px", color: "#4A5568", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* ROW 3 — Full-width featured card: 06 (horizontal layout) */}
          <div style={{ background: "#FFFFFF", border: "0.5px solid rgba(13,30,61,0.1)", borderLeft: "3px solid #1C2951", borderRadius: "8px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ width: "40px", height: "40px", flexShrink: 0, borderRadius: "8px", background: "rgba(13,30,61,0.06)", border: "0.5px solid rgba(13,30,61,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className={`ti ${SERVICES[5].icon}`} style={{ fontSize: "20px", color: "#8A6E00" }} />
              </div>
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(28,41,81,0.35)", marginBottom: "4px" }}>06 — Featured</div>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0D1E3D", marginBottom: "4px" }}>{SERVICES[5].title}</h3>
                <p style={{ fontSize: "11px", color: "#8A6E00", marginBottom: "6px" }}>{SERVICES[5].th}</p>
                <p style={{ fontSize: "12px", color: "#2C3E50", lineHeight: 1.7, maxWidth: "600px" }}>{SERVICES[5].desc}</p>
              </div>
            </div>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#8A6E00", whiteSpace: "nowrap", flexShrink: 0 }}>
              <i className="ti ti-arrow-right" style={{ fontSize: "12px" }} /> Learn more
            </Link>
          </div>

        </div>
      </section>

      {/* ── WHY SP ────────────────────────────────────────── */}
      <section style={{ background: "#F8F6F1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 64px" }}>
          <SectionLabel text="Why Choose Us" />
          <h2 style={{ fontSize: "22px", fontWeight: 400, color: "#0D1E3D", marginTop: "10px", marginBottom: "20px" }}>Why SP?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {WHY.map(w => (
              <div key={w.n} style={{ background: "#FFFFFF", border: "0.5px solid rgba(13,30,61,0.08)", borderRadius: "8px", padding: "20px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#8A6E00", marginBottom: "8px" }}>{w.n}</div>
                <div style={{ width: "32px", height: "32px", borderRadius: "5px", background: "rgba(13,30,61,0.06)", border: "0.5px solid rgba(13,30,61,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                  <i className={`ti ${w.icon}`} style={{ fontSize: "16px", color: "#8A6E00" }} />
                </div>
                <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#0D1E3D", marginBottom: "4px" }}>{w.title}</h3>
                <p style={{ fontSize: "12px", color: "#2C3E50", lineHeight: 1.65 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTION PROCESS ────────────────────────────── */}
      <section style={{ background: "#F8F6F1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 64px" }}>
          <SectionLabel text="How It Works" />
          <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#0D1E3D", marginTop: "10px", marginBottom: "20px" }}>Our Production Process</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
            {PROCESS.map(step => (
              <div key={step.n} style={{ background: "#FFFFFF", border: "0.5px solid rgba(13,30,61,0.08)", borderRadius: "8px", padding: "18px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#8A6E00", marginBottom: "8px" }}>{step.n}</div>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(13,30,61,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                  <i className={`ti ${step.icon}`} style={{ fontSize: "15px", color: "#8A6E00" }} />
                </div>
                <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#0D1E3D", marginBottom: "4px" }}>{step.title}</h3>
                <p style={{ fontSize: "11px", color: "#2C3E50", lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
