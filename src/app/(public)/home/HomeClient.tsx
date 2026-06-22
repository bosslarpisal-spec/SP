"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import CatalogSection from "@/components/home/CatalogSection";
import SectionLabel from "@/components/ui/SectionLabel";
import GoldDivider from "@/components/ui/GoldDivider";
import type { ContentMap } from "@/app/admin/content/page";
import type { HeroSlide } from "./page";

interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  is_visible: boolean;
  is_new: boolean;
  tags: string[];
  moq?: number | null;
  branding_methods?: string[];
  icon_name?: string;
  image_url?: string;
  images?: string[];
}

export default function HomeClient({
  products,
  content,
  categoryOrder,
  allTags,
  slides,
}: {
  products: CatalogProduct[];
  content: ContentMap;
  categoryOrder: string[];
  allTags: string[];
  slides: HeroSlide[];
}) {
  const { t } = useLang();

  /* ── content helpers ─────────────────────────────────────── */
  const c = (section: string, key: string, fallback: string) =>
    content[section]?.[key] ?? fallback;
  const visible = (section: string) =>
    content[section]?.["is_visible"] !== "false";

  /* ── hero carousel (DB-driven) ───────────────────────────── */
  const heroSlides = slides.map(s => ({
    badge:       s.badge,
    bgImage:     s.bg_image_url ? `url('${s.bg_image_url}')` : undefined,
    bgColor:     '#0D1E3D',
    headline:    s.heading,
    subheadline: s.subheadline,
    subtext:     s.subtext,
    description: s.description,
    ctas: [
      { label: s.btn1_text, href: s.btn1_link, primary: true },
      { label: s.btn2_text, href: s.btn2_link, primary: false },
    ],
  }));

  const HERO_INTERVAL_MS = 6500;
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const goToSlide = (index: number) => {
    if (index === activeSlide) return;
    if (index === prevSlide) {
      // Target slide is currently at -100% (just exited). Snap it to +100% first,
      // then animate from there so it always enters from the right.
      const currentActive = activeSlide;
      setPrevSlide(null);
      requestAnimationFrame(() => {
        setPrevSlide(currentActive);
        setActiveSlide(index);
      });
    } else {
      setPrevSlide(activeSlide);
      setActiveSlide(index);
    }
  };

  useEffect(() => {
    if (isHeroPaused || heroSlides.length <= 1) return;
    const id = setInterval(() => {
      setActiveSlide(prev => {
        setPrevSlide(prev);
        return (prev + 1) % heroSlides.length;
      });
    }, HERO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isHeroPaused, activeSlide, heroSlides.length]);

  const stat1Num   = c("stats", "stat1_number", "3,000+");
  const stat1Label = c("stats", "stat1_label",  "CLIENTS");
  const stat2Num   = c("stats", "stat2_number", "50,000+");
  const stat2Label = c("stats", "stat2_label",  "PROJECTS");
  const stat3Num   = c("stats", "stat3_number", "30+");
  const stat3Label = c("stats", "stat3_label",  "COUNTRIES");

  const marqueeRaw  = c("marquee", "items", "PREMIUM GIFTS,CORPORATE SOUVENIRS,NEW YEAR PACKAGES,OEM MANUFACTURING,CUSTOM BRANDING,30+ COUNTRIES");
  const marqueeItems = marqueeRaw.split(",").map(s => s.trim()).filter(Boolean);

  const catalogLabel       = c("catalog", "label",       "PRODUCT CATALOG");
  const catalogHeading     = c("catalog", "heading",     "Our Collection");
  const catalogHeadingTh   = c("catalog", "heading_th",  "คอลเลกชันของเรา");
  const catalogDescription = c("catalog", "description", "Explore our full range of premium gifts, corporate souvenirs, and branded merchandise.");
  const catalogQuote       = c("catalog", "quote",       '"Quality is not an act, it is a habit. Every product we deliver carries our promise."');
  const catalogBtn1Text    = c("catalog", "btn1_text",   "Browse All");
  const catalogBtn2Text    = c("catalog", "btn2_text",   "Filter");

  const processHeading    = c("process", "heading",    "Our Process");
  const processSubheading = c("process", "subheading", "From brief to delivery — every step crafted with care");

  const PROCESS_STEPS = [
    { n: "01", label: c("process", "step1_title", "Brief"),   sub: c("process", "step1_desc", "Share your vision") },
    { n: "02", label: c("process", "step2_title", "Design"),  sub: c("process", "step2_desc", "Our team creates concepts") },
    { n: "03", label: c("process", "step3_title", "Produce"), sub: c("process", "step3_desc", "Manufacturing begins"), active: true },
    { n: "04", label: c("process", "step4_title", "QC"),      sub: c("process", "step4_desc", "Strict quality inspection") },
    { n: "05", label: c("process", "step5_title", "Deliver"), sub: c("process", "step5_desc", "Worldwide shipping") },
  ];

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      {visible("hero") && (
        <section
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          style={{
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            marginTop: '-72px',
            paddingTop: '188px',
            paddingBottom: '80px',
            minHeight: '580px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingLeft: '140px',
            paddingRight: '80px',
          }}>
          {/* Per-slide full-width backgrounds — push with the transition */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
            {heroSlides.map((slide, i) => {
              const isActive = i === activeSlide;
              const isExiting = prevSlide !== null && i === prevSlide;
              const tx = isActive ? 'translateX(0%)' : isExiting ? 'translateX(-100%)' : 'translateX(100%)';
              const tr = (isActive && prevSlide !== null) || isExiting
                ? 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
                : 'none';
              return (
                <div key={i} style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: slide.bgImage,
                  backgroundColor: slide.bgColor,
                  backgroundSize: 'cover',
                  backgroundPosition: 'right center',
                  backgroundRepeat: 'no-repeat',
                  transform: tx,
                  transition: tr,
                }} />
              );
            })}
          </div>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(232,213,163,0.03) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '680px', width: '100%', textAlign: 'left', marginLeft: '0', marginRight: 'auto', position: 'relative', zIndex: 2, textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)' }}>
            {/* Slide stage */}
            <div style={{ position: 'relative', minHeight: '360px', clipPath: 'inset(0)' }}>
              {heroSlides.map((slide, i) => {
                const isActive = i === activeSlide;
                const isExiting = prevSlide !== null && i === prevSlide;
                const tx = isActive ? 'translateX(0%)' : isExiting ? 'translateX(-100%)' : 'translateX(100%)';
                const tr = (isActive && prevSlide !== null) || isExiting
                  ? 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
                  : 'none';
                return (
                <div
                  key={i}
                  aria-hidden={!isActive}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: tx,
                    transition: tr,
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                >
                  {/* Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <div style={{ width: '24px', height: '1.5px', background: '#E8D5A3', flexShrink: 0 }} />
                    <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E8D5A3' }}>
                      {slide.badge}
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 style={{ margin: '0 0 0 0' }}>
                    <span style={{ position: 'relative', display: 'inline-block', marginBottom: 0 }}>
                      <span style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 400, color: '#FFFFFF', fontFamily: 'Georgia, serif', lineHeight: 1.05, display: 'block' }}>
                        {slide.headline}
                      </span>
                      <span style={{ position: 'absolute', bottom: '-4px', left: 0, height: '2px', width: '100%', background: 'linear-gradient(to right, #E8D5A3, transparent)', display: 'block' }} />
                    </span>
                  </h1>

                  {/* Gold italic subheadline */}
                  <div style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontStyle: 'italic', color: '#E8D5A3', fontFamily: 'Georgia, serif', lineHeight: 1.15, marginTop: '10px', marginBottom: '12px' }}>
                    {slide.subheadline}
                  </div>

                  {/* Thai subtext */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ width: '16px', height: '1px', background: '#E8D5A3', opacity: 0.4, flexShrink: 0, display: 'block' }} />
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{slide.subtext}</span>
                  </div>

                  {/* English description */}
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '580px', margin: '0 0 20px' }}>
                    {slide.description}
                  </p>

                  {/* CTAs */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {slide.ctas.map((cta, ci) => (
                      cta.primary ? (
                        <a key={ci} href={cta.href} style={{
                          background: '#E8D5A3', color: '#1C2951',
                          fontSize: '14px', fontWeight: 600,
                          padding: '13px 28px', borderRadius: '6px',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          textDecoration: 'none', textShadow: 'none',
                        }}>
                          {cta.label}
                          <i className="ti ti-arrow-right" style={{ fontSize: '14px' }} aria-hidden="true" />
                        </a>
                      ) : (
                        <a key={ci} href={cta.href} style={{
                          border: '0.5px solid rgba(255,255,255,0.25)',
                          color: '#FFFFFF', fontSize: '14px',
                          padding: '13px 24px', borderRadius: '6px',
                          textDecoration: 'none',
                        }}>
                          {cta.label}
                        </a>
                      )
                    ))}
                  </div>
                </div>
                );
              })}
            </div>

            {/* Dot indicators */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginTop: '28px' }}>
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: i === activeSlide ? '10px' : '7px',
                    height: i === activeSlide ? '10px' : '7px',
                    borderRadius: '50%',
                    border: '1px solid #E8D5A3',
                    background: i === activeSlide ? '#E8D5A3' : 'transparent',
                    opacity: i === activeSlide ? 1 : 0.6,
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 300ms ease',
                  }}
                />
              ))}
            </div>

            {/* Stat badges */}
            {visible("stats") && (
              <div style={{ display: 'flex', gap: '32px', marginTop: '40px', paddingTop: '32px', borderTop: '0.5px solid rgba(232,213,163,0.2)' }}>
                {[
                  { num: stat1Num, label: stat1Label },
                  { num: stat2Num, label: stat2Label },
                  { num: stat3Num, label: stat3Label },
                ].map((stat, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: '#E8D5A3', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
                      {stat.num}
                    </span>
                    <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <GoldDivider />

      {/* ── MARQUEE ─────────────────────────────────────────── */}
      {visible("marquee") && (
        <>
          <div className="marquee-wrapper" style={{ overflow: 'hidden', whiteSpace: 'nowrap', background: '#E8D5A3', paddingTop: '8px', paddingBottom: '8px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2, background: 'linear-gradient(to right, #E8D5A3, transparent)' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2, background: 'linear-gradient(to left, #E8D5A3, transparent)' }} />
            <div className="marquee-track" style={{ display: 'flex', width: 'max-content' }}>
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span key={i} style={{ padding: '0 24px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: '#0D1E3D' }}>
                  {item} <span style={{ color: '#0D1E3D', margin: '0 8px' }}>◆</span>
                </span>
              ))}
            </div>
          </div>
          <GoldDivider />
        </>
      )}

      {/* ── CATALOG ─────────────────────────────────────────── */}
      {visible("catalog") && (
        <>
          <CatalogSection
            products={products}
            categoryOrder={categoryOrder}
            allTags={allTags}
            label={catalogLabel}
            heading={catalogHeading}
            headingTh={catalogHeadingTh}
            description={catalogDescription}
            quote={catalogQuote}
            btn1Text={catalogBtn1Text}
            btn2Text={catalogBtn2Text}
          />
          <GoldDivider />
        </>
      )}

      {/* ── PROCESS TIMELINE ────────────────────────────────── */}
      {visible("process") && (
        <>
          <div style={{ width: '100%', background: '#F8F6F1' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
                <div>
                  <SectionLabel text={t("วิธีการทำงานของเรา", "HOW WE WORK")} />
                  <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#0D1E3D', letterSpacing: '-0.02em', marginTop: '4px' }}>
                    {processHeading}
                  </h2>
                </div>
                <p style={{ fontSize: '10px', color: '#4A5568' }}>
                  {processSubheading}
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
          <GoldDivider />
        </>
      )}
    </>
  );
}
