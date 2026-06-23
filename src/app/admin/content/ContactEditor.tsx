"use client";
import React, { useState } from "react";
import { usePageEditor } from "@/app/admin/lib/usePageEditor";
import { th } from "@/app/admin/lib/admin-th";
import { StyleOverride, type BlockStyles } from "@/app/admin/components/StyleOverride";

/* ── schema ─────────────────────────────────────────────────── */
const FIELD_META: Record<string, { section: string; key: string }> = {
  hero_badge:       { section: "hero",   key: "badge" },
  hero_heading:     { section: "hero",   key: "heading" },
  hero_subtext_th:  { section: "hero",   key: "subtext_th" },
  hero_description: { section: "hero",   key: "description" },
  hero_styles:      { section: "hero",   key: "_styles" },
  info_phone1:      { section: "info",   key: "phone1" },
  info_phone2:      { section: "info",   key: "phone2" },
  info_mobile:      { section: "info",   key: "mobile" },
  info_email:       { section: "info",   key: "email" },
  info_address:     { section: "info",   key: "address" },
  info_address_th:  { section: "info",   key: "address_th" },
  info_hours:       { section: "info",   key: "hours" },
  info_hours_th:    { section: "info",   key: "hours_th" },
  info_styles:      { section: "info",   key: "_styles" },
  social_facebook:  { section: "social", key: "facebook" },
  social_instagram: { section: "social", key: "instagram" },
  social_line:      { section: "social", key: "line" },
  social_youtube:   { section: "social", key: "youtube" },
  social_tiktok:    { section: "social", key: "tiktok" },
};

const SECTION_FIELDS: Record<string, string[]> = {
  hero:   ["hero_badge", "hero_heading", "hero_subtext_th", "hero_description", "hero_styles"],
  info:   ["info_phone1", "info_phone2", "info_mobile", "info_email", "info_address", "info_address_th", "info_hours", "info_hours_th", "info_styles"],
  social: ["social_facebook", "social_instagram", "social_line", "social_youtube", "social_tiktok"],
};

const DEFAULTS: Record<string, string> = {
  hero_badge:       "Get In Touch",
  hero_heading:     "Contact Us",
  hero_subtext_th:  "ติดต่อเราเพื่อรับคำปรึกษาและใบเสนอราคาฟรี",
  hero_description: "We're here to help you create the perfect premium experience for your brand.",
  hero_styles:      "{}",
  info_phone1:      "02 555 1234",
  info_phone2:      "02 555 5678",
  info_mobile:      "086 999 0000",
  info_email:       "info@siampremium.com",
  info_address:     "88 Sukhumvit Road, Khlong Toei, Bangkok 10110",
  info_address_th:  "88 ถนนสุขุมวิท แขวงคลองเตย กรุงเทพมหานคร 10110",
  info_hours:       "Mon – Fri  09.00 – 18.00",
  info_hours_th:    "จ–ศ  09.00 – 18.00",
  info_styles:      "{}",
  social_facebook:  "https://facebook.com",
  social_instagram: "https://instagram.com",
  social_line:      "https://line.me",
  social_youtube:   "https://youtube.com",
  social_tiktok:    "https://tiktok.com",
};

const SECTIONS = [
  { id: "hero",   label: th.ctSecHero,   icon: "ti-sparkles",       fieldCount: 4, desc: th.ctSecHeroDesc },
  { id: "info",   label: th.ctSecInfo,   icon: "ti-info-circle",    fieldCount: 8, desc: th.ctSecInfoDesc },
  { id: "social", label: th.ctSecSocial, icon: "ti-brand-facebook", fieldCount: 5, desc: th.ctSecSocialDesc },
];

/* ── style defaults ─────────────────────────────────────────── */
const HERO_STYLE_DEF: Record<string, BlockStyles> = {
  badge:       { color: "#E8D5A3",                fontSize: "10px" },
  heading:     { color: "#FFFFFF",                fontSize: "48px" },
  subtext_th:  { color: "rgba(255,255,255,0.7)",  fontSize: "13px" },
  description: { color: "rgba(255,255,255,0.90)", fontSize: "14px" },
};
const HERO_STYLE_RANGE: Record<string, { min: number; max: number }> = {
  badge:       { min: 8,  max: 14 },
  heading:     { min: 24, max: 72 },
  subtext_th:  { min: 10, max: 18 },
  description: { min: 11, max: 18 },
};

const INFO_STYLE_DEF: Record<string, BlockStyles> = {
  phone_value:   { color: "#0D1E3D", fontSize: "14px" },
  email_value:   { color: "#0D1E3D", fontSize: "14px" },
  hours_value:   { color: "#0D1E3D", fontSize: "14px" },
  address_value: { color: "#0D1E3D", fontSize: "14px" },
};
const INFO_STYLE_RANGE = { min: 10, max: 20 };

/* ── shared input styles ────────────────────────────────────── */
const lSt: React.CSSProperties = { fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa", fontWeight: 500, display: "block", marginBottom: 5 };
const iBase: React.CSSProperties = { background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 7, padding: "7px 9px", fontSize: 12, color: "#333", width: "100%", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

/* ── CF — counted field ─────────────────────────────────────── */
function CF({ label, value, onChange, max, multiline = false, placeholder = "", type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  max: number; multiline?: boolean; placeholder?: string; type?: string;
}) {
  const over = value.length > max;
  const warn = !over && value.length / max > 0.85;
  const cc   = over ? "#A32D2D" : warn ? "#D97706" : "#bbb";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <label style={{ ...lSt, marginBottom: 0 }}>{label}</label>
        <span style={{ fontSize: 10, color: cc, fontVariantNumeric: "tabular-nums" }}>{value.length}/{max}</span>
      </div>
      {multiline
        ? <textarea value={value} rows={3} placeholder={placeholder} onChange={e => onChange(e.target.value)}
            style={{ ...iBase, resize: "vertical", ...(over ? { borderColor: "#F09595" } : {}) }} />
        : <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
            style={{ ...iBase, ...(over ? { borderColor: "#F09595" } : {}) }} />
      }
    </div>
  );
}

/* ── editor ─────────────────────────────────────────────────── */
export default function ContactEditor() {
  const [activeSection, setActiveSection] = useState("hero");
  const { loaded, fields, setFields, dirty, saving, saved, updateField, saveSection, discardSection } =
    usePageEditor("contact", FIELD_META, SECTION_FIELDS, DEFAULTS);

  function u(k: string, v: string) { updateField(k, v, activeSection); }

  function makeStyleChange(fieldKey: string, section: string) {
    return (blockKey: string, overrides: BlockStyles | null) => {
      const current: Record<string, BlockStyles> = (() => {
        try { return JSON.parse(fields[fieldKey] || "{}"); } catch { return {}; }
      })();
      const next = { ...current };
      if (overrides === null) delete next[blockKey]; else next[blockKey] = overrides;
      const v = JSON.stringify(next);
      setFields(p => ({ ...p, [fieldKey]: v }));
      updateField(fieldKey, v, section);
    };
  }
  const handleHeroStyle = makeStyleChange("hero_styles", "hero");
  const handleInfoStyle = makeStyleChange("info_styles",  "info");

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#888", fontSize: 13, padding: "40px 0" }}>
      <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} /> {th.contactLoading}
    </div>
  );

  const activeSec   = SECTIONS.find(s => s.id === activeSection)!;
  const showSaveBar = !!dirty[activeSection];

  function renderSection() {

    /* ── HERO ── */
    if (activeSection === "hero") {
      const heroSt: Record<string, BlockStyles> = (() => { try { return JSON.parse(fields.hero_styles || "{}"); } catch { return {}; } })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <CF label={th.ctHeroBadge} value={fields.hero_badge} onChange={v => u("hero_badge", v)} max={40} />
            <StyleOverride blockKey="badge" label="Badge" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.badge} fontSizeRange={HERO_STYLE_RANGE.badge} />
          </div>
          <div>
            <CF label={th.ctHeroHead} value={fields.hero_heading} onChange={v => u("hero_heading", v)} max={50} />
            <StyleOverride blockKey="heading" label="Heading" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.heading} fontSizeRange={HERO_STYLE_RANGE.heading} />
          </div>
          <div>
            <CF label={th.ctHeroSubtext} value={fields.hero_subtext_th} onChange={v => u("hero_subtext_th", v)} max={80} />
            <StyleOverride blockKey="subtext_th" label="Thai subtext" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.subtext_th} fontSizeRange={HERO_STYLE_RANGE.subtext_th} />
          </div>
          <div>
            <CF label={th.ctHeroDesc} value={fields.hero_description} multiline onChange={v => u("hero_description", v)} max={180} />
            <StyleOverride blockKey="description" label="Description" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.description} fontSizeRange={HERO_STYLE_RANGE.description} />
          </div>
        </div>
      );
    }

    /* ── INFO ── */
    if (activeSection === "info") {
      const infoSt: Record<string, BlockStyles> = (() => { try { return JSON.parse(fields.info_styles || "{}"); } catch { return {}; } })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Phone numbers */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <CF label={th.ctPhone1} value={fields.info_phone1} onChange={v => u("info_phone1", v)} max={25} placeholder="02 555 1234" />
              <CF label={th.ctPhone2} value={fields.info_phone2} onChange={v => u("info_phone2", v)} max={25} placeholder="02 555 5678" />
              <CF label={th.ctMobile} value={fields.info_mobile} onChange={v => u("info_mobile", v)} max={20} placeholder="086 999 0000" />
            </div>
            <StyleOverride blockKey="phone_value" label="Phone text" allStyles={infoSt} onChange={handleInfoStyle} defaults={INFO_STYLE_DEF.phone_value} fontSizeRange={INFO_STYLE_RANGE} />
          </div>

          {/* Email */}
          <div>
            <CF label={th.ctEmail} value={fields.info_email} type="email" onChange={v => u("info_email", v)} max={60} placeholder="info@siampremium.com" />
            <StyleOverride blockKey="email_value" label="Email text" allStyles={infoSt} onChange={handleInfoStyle} defaults={INFO_STYLE_DEF.email_value} fontSizeRange={INFO_STYLE_RANGE} />
          </div>

          {/* Hours */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 6 }}>
              <CF label={th.ctHoursEn} value={fields.info_hours}    onChange={v => u("info_hours",    v)} max={45} placeholder="Mon – Fri  09.00 – 18.00" />
              <CF label={th.ctHoursTh} value={fields.info_hours_th} onChange={v => u("info_hours_th", v)} max={45} placeholder="จ–ศ  09.00 – 18.00" />
            </div>
            <StyleOverride blockKey="hours_value" label="Hours text" allStyles={infoSt} onChange={handleInfoStyle} defaults={INFO_STYLE_DEF.hours_value} fontSizeRange={INFO_STYLE_RANGE} />
          </div>

          {/* Address */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 6 }}>
              <CF label={th.ctAddressEn} value={fields.info_address}    onChange={v => u("info_address",    v)} max={120} />
              <CF label={th.ctAddressTh} value={fields.info_address_th} onChange={v => u("info_address_th", v)} max={120} />
            </div>
            <StyleOverride blockKey="address_value" label="Address text" allStyles={infoSt} onChange={handleInfoStyle} defaults={INFO_STYLE_DEF.address_value} fontSizeRange={INFO_STYLE_RANGE} />
          </div>
        </div>
      );
    }

    /* ── SOCIAL ── */
    if (activeSection === "social") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{th.ctSocialHint}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { k: "social_facebook",  lbl: th.ctFacebook  },
            { k: "social_instagram", lbl: th.ctInstagram },
            { k: "social_line",      lbl: th.ctLine      },
            { k: "social_youtube",   lbl: th.ctYoutube   },
            { k: "social_tiktok",    lbl: th.ctTiktok    },
          ].map(({ k, lbl }) => (
            <div key={k}>
              <label style={lSt}>{lbl}</label>
              <input type="url" value={fields[k] ?? ""} onChange={e => u(k, e.target.value)} style={iBase} />
            </div>
          ))}
        </div>
      </div>
    );

    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, paddingBottom: showSaveBar ? 72 : 0 }}>
      <div style={{ width: 195, flexShrink: 0, background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 10, overflow: "hidden", position: "sticky", top: 78, maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
        <div style={{ padding: "10px 14px", borderBottom: "0.5px solid #E8E6E0", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#aaa" }}>{th.contentSections}</div>
        {SECTIONS.map(sec => {
          const isActive = sec.id === activeSection;
          return (
            <div key={sec.id} onClick={() => setActiveSection(sec.id)}
              style={{ padding: "11px 14px", display: "flex", alignItems: "center", gap: 9, cursor: "pointer", borderLeft: `3px solid ${isActive ? "#0D1E3D" : "transparent"}`, background: isActive ? "#EEF1F8" : "transparent", transition: "background 0.12s", borderBottom: "0.5px solid #F2F1EE" }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "#F5F4F1"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <i className={`ti ${sec.icon}`} style={{ fontSize: 14, color: isActive ? "#0D1E3D" : "#999", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: isActive ? "#0D1E3D" : "#333", lineHeight: 1.3 }}>{sec.label}</div>
                <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>{th.contentFields(sec.fieldCount)}</div>
              </div>
              {dirty[sec.id]                    && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />}
              {saved[sec.id] && !dirty[sec.id]  && <i className="ti ti-check" style={{ fontSize: 11, color: "#3B6D11" }} />}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, paddingLeft: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#EEF1F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className={`ti ${activeSec.icon}`} style={{ fontSize: 16, color: "#0D1E3D" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{activeSec.label}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{activeSec.desc}</div>
          </div>
        </div>
        <div style={{ background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 10, padding: 20 }}>
          {renderSection()}
        </div>
      </div>

      {showSaveBar && (
        <div style={{ position: "fixed", bottom: 0, left: 220, right: 0, background: "#FFFFFF", borderTop: "0.5px solid #E8E6E0", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 20 }}>
          <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: 13, color: "#D97706" }} />
            {th.saveUnsaved(activeSec.label)}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={() => discardSection(activeSection)} style={{ padding: "8px 16px", background: "#FFFFFF", border: "0.5px solid #D8D5CE", color: "#555", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>{th.saveDiscard}</button>
            <button type="button" onClick={() => saveSection(activeSection)} disabled={!!saving[activeSection]}
              style={{ padding: "8px 20px", background: "#0D1E3D", color: "#E8D5A3", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: saving[activeSection] ? "wait" : "pointer", opacity: saving[activeSection] ? 0.6 : 1, display: "flex", alignItems: "center", gap: 7 }}>
              {saving[activeSection] && <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 13 }} />}
              {saving[activeSection] ? th.saveSaving : th.saveBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
