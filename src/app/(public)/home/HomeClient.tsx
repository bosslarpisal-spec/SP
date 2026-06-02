"use client";
import { useLang } from "@/contexts/LanguageContext";
import CatalogSection from "@/components/home/CatalogSection";
import SectionLabel from "@/components/ui/SectionLabel";

interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  is_visible: boolean;
  is_new: boolean;
  tags: string[];
  icon_name?: string;
  image_url?: string;
  images?: string[];
}

export default function HomeClient({ products }: { products: CatalogProduct[] }) {
  const { t } = useLang();

  const MARQUEE_ITEMS = [
    t("ของพรีเมียมระดับพรีเมียม", "PREMIUM GIFTS"),
    t("ของที่ระลึกองค์กร", "CORPORATE SOUVENIRS"),
    t("ชุดปีใหม่", "NEW YEAR PACKAGES"),
    t("ผลิต OEM", "OEM MANUFACTURING"),
    t("แบรนด์ดิ้งสั่งทำ", "CUSTOM BRANDING"),
    t("30+ ประเทศ", "30+ COUNTRIES"),
  ];

  const PROCESS_STEPS = [
    { n: "01", label: t("รับบรีฟ", "Brief"),   sub: t("แชร์ไอเดียของคุณ", "Share your vision") },
    { n: "02", label: t("ออกแบบ", "Design"),    sub: t("ทีมเราสร้างแนวคิด", "Our team creates concepts") },
    { n: "03", label: t("ผลิต", "Produce"),     sub: t("เริ่มการผลิต", "Manufacturing begins"), active: true },
    { n: "04", label: t("ตรวจสอบ", "QC"),       sub: t("ตรวจสอบคุณภาพอย่างเข้มงวด", "Strict quality inspection") },
    { n: "05", label: t("จัดส่ง", "Deliver"),   sub: t("จัดส่งทั่วโลก", "Worldwide shipping") },
  ];

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{
        width: '100%',
        background: '#1C2951',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '120px',
        paddingBottom: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(232,213,163,0.05) 1px, transparent 0)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{ width: '36px', height: '1px', background: '#E8D5A3', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F0DC9A' }}>
              {t("ยินดีต้อนรับสู่ SP", "WELCOME TO SP")}
            </span>
          </div>

          <h1 style={{
            fontSize: '56px',
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 18px 0',
            fontFamily: 'Georgia, serif',
          }}>
            {t("ผู้เชี่ยวชาญด้าน", "The Expert In")}<br />
            <em style={{ fontStyle: 'italic', color: '#E8D5A3' }}>
              {t(
                '“โซลูชันของพรีเมียมและโปรโมชันครบวงจร”',
                '“Total Premiums & Promotion Solution”'
              )}
            </em>
          </h1>

          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '8px', marginTop: 0 }}>
            ผู้เชี่ยวชาญด้านของพรีเมียมและโปรโมชันครบวงจร
          </p>

          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.90)', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto 36px' }}>
            {t(
              "ออกแบบ ผลิต และจัดส่งของพรีเมียม และสินค้าองค์กรระดับโลก สำหรับแบรนด์ชั้นนำทั่วประเทศไทยและต่างประเทศ",
              "Designing, producing, and delivering world-class premium gifts and corporate merchandise for leading brands across Thailand and beyond."
            )}
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', alignItems: 'center' }}>
            <a href="/our-work" style={{
              background: '#E8D5A3', color: '#1C2951',
              fontSize: '15px', fontWeight: 500,
              padding: '13px 28px', borderRadius: '6px',
              display: 'flex', alignItems: 'center', gap: '6px',
              textDecoration: 'none',
            }}>
              {t("ดูผลงานของเรา", "Browse Our Work")}
              <i className="ti ti-arrow-right" style={{ fontSize: '14px' }} aria-hidden="true" />
            </a>
            <a href="/contact" style={{
              border: '0.5px solid rgba(255,255,255,0.25)',
              color: '#FFFFFF', fontSize: '15px',
              padding: '13px 26px', borderRadius: '6px',
              textDecoration: 'none',
            }}>
              {t("ขอใบเสนอราคา", "Get a Quote")}
            </a>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────── */}
      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', background: '#E8D5A3', paddingTop: '8px', paddingBottom: '8px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2, background: 'linear-gradient(to right, #E8D5A3, transparent)' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2, background: 'linear-gradient(to left, #E8D5A3, transparent)' }} />
        <div className="marquee-track" style={{ display: 'inline-flex' }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ padding: '0 24px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: '#0D1E3D' }}>
              {item} <span style={{ color: '#0D1E3D', margin: '0 8px' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── CATALOG ─────────────────────────────────────────── */}
      <CatalogSection products={products} />

      {/* ── PROCESS TIMELINE ────────────────────────────────── */}
      <div style={{ width: '100%', background: '#F8F6F1' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <SectionLabel text={t("วิธีการทำงานของเรา", "HOW WE WORK")} />
              <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#0D1E3D', letterSpacing: '-0.02em', marginTop: '4px' }}>
                {t("ขั้นตอนการทำงาน", "Our Process")}
              </h2>
            </div>
            <p style={{ fontSize: '10px', color: '#4A5568' }}>
              {t("จากการรับบรีฟถึงการจัดส่ง — ทุกขั้นตอนทำด้วยความใส่ใจ", "From brief to delivery — every step crafted with care")}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '1px', pointerEvents: 'none', background: 'rgba(28,41,81,0.1)' }} />

            {PROCESS_STEPS.map(step => (
              <div key={step.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', position: 'relative', zIndex: 10, background: step.active ? '#1C2951' : 'rgba(28,41,81,0.08)', border: step.active ? 'none' : '0.5px solid rgba(28,41,81,0.15)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: step.active ? '#FFFFFF' : '#1C2951' }}>{step.n}</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#0D1E3D', marginBottom: '2px' }}>{step.label}</span>
                <span style={{ fontSize: '10px', color: '#4A5568', lineHeight: 1.5 }}>{step.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
