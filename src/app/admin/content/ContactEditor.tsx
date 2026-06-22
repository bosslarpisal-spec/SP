"use client";
import React, { useState } from "react";
import { usePageEditor } from "@/app/admin/lib/usePageEditor";

const FIELD_META: Record<string, { section: string; key: string }> = {
  hero_badge:       { section: "hero",   key: "badge" },
  hero_heading:     { section: "hero",   key: "heading" },
  hero_subtext_th:  { section: "hero",   key: "subtext_th" },
  hero_description: { section: "hero",   key: "description" },
  info_phone1:      { section: "info",   key: "phone1" },
  info_phone2:      { section: "info",   key: "phone2" },
  info_mobile:      { section: "info",   key: "mobile" },
  info_email:       { section: "info",   key: "email" },
  info_address:     { section: "info",   key: "address" },
  info_address_th:  { section: "info",   key: "address_th" },
  info_hours:       { section: "info",   key: "hours" },
  social_facebook:  { section: "social", key: "facebook" },
  social_instagram: { section: "social", key: "instagram" },
  social_line:      { section: "social", key: "line" },
  social_youtube:   { section: "social", key: "youtube" },
  social_tiktok:    { section: "social", key: "tiktok" },
};

const SECTION_FIELDS: Record<string, string[]> = {
  hero:   ["hero_badge", "hero_heading", "hero_subtext_th", "hero_description"],
  info:   ["info_phone1", "info_phone2", "info_mobile", "info_email", "info_address", "info_address_th", "info_hours"],
  social: ["social_facebook", "social_instagram", "social_line", "social_youtube", "social_tiktok"],
};

const DEFAULTS: Record<string, string> = {
  hero_badge:       "Get In Touch",
  hero_heading:     "Contact Us",
  hero_subtext_th:  "ติดต่อเราเพื่อรับคำปรึกษาและใบเสนอราคาฟรี",
  hero_description: "We're here to help you create the perfect premium experience for your brand.",
  info_phone1:      "02 555 1234",
  info_phone2:      "02 555 5678",
  info_mobile:      "086 999 0000",
  info_email:       "info@siampremium.com",
  info_address:     "88 Sukhumvit Road, Khlong Toei, Bangkok 10110",
  info_address_th:  "88 ถนนสุขุมวิท แขวงคลองเตย กรุงเทพมหานคร 10110",
  info_hours:       "Mon – Fri  09.00 – 18.00",
  social_facebook:  "https://facebook.com",
  social_instagram: "https://instagram.com",
  social_line:      "https://line.me",
  social_youtube:   "https://youtube.com",
  social_tiktok:    "https://tiktok.com",
};

const SECTIONS = [
  { id: "hero",   label: "Hero",            icon: "ti-sparkles",  fieldCount: 4, desc: "Page hero badge and description" },
  { id: "info",   label: "Contact Info",    icon: "ti-info-circle",fieldCount: 7, desc: "Phone, email, address, hours" },
  { id: "social", label: "Social Links",    icon: "ti-brand-facebook", fieldCount: 5, desc: "Social media URLs" },
];

const lSt: React.CSSProperties = { fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa", fontWeight: 500, display: "block", marginBottom: 5 };
const iBase: React.CSSProperties = { background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 7, padding: "7px 9px", fontSize: 12, color: "#333", width: "100%", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

function F({ label, value, onChange, placeholder = "", type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label style={lSt}>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={iBase} />
    </div>
  );
}

export default function ContactEditor() {
  const [activeSection, setActiveSection] = useState("hero");
  const { loaded, fields, dirty, saving, saved, updateField, saveSection, discardSection } =
    usePageEditor("contact", FIELD_META, SECTION_FIELDS, DEFAULTS);

  function u(k: string, v: string) { updateField(k, v, activeSection); }

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#888", fontSize: 13, padding: "40px 0" }}>
      <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} /> Loading Contact content…
    </div>
  );

  const activeSec = SECTIONS.find(s => s.id === activeSection)!;
  const showSaveBar = !!dirty[activeSection];

  function renderSection() {
    if (activeSection === "hero") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="Badge / eyebrow" value={fields.hero_badge} onChange={v => u("hero_badge", v)} />
          <F label="Heading" value={fields.hero_heading} onChange={v => u("hero_heading", v)} />
        </div>
        <F label="Thai subtext" value={fields.hero_subtext_th} onChange={v => u("hero_subtext_th", v)} />
        <div>
          <label style={lSt}>Description</label>
          <textarea value={fields.hero_description} rows={3} onChange={e => u("hero_description", e.target.value)}
            style={{ ...iBase, resize: "vertical" }} />
        </div>
      </div>
    );

    if (activeSection === "info") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <F label="Phone 1" value={fields.info_phone1} onChange={v => u("info_phone1", v)} placeholder="02 555 1234" />
          <F label="Phone 2" value={fields.info_phone2} onChange={v => u("info_phone2", v)} placeholder="02 555 5678" />
          <F label="Mobile" value={fields.info_mobile} onChange={v => u("info_mobile", v)} placeholder="086 999 0000" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="Email" value={fields.info_email} type="email" onChange={v => u("info_email", v)} placeholder="info@siampremium.com" />
          <F label="Hours" value={fields.info_hours} onChange={v => u("info_hours", v)} placeholder="Mon – Fri  09.00 – 18.00" />
        </div>
        <F label="Address (EN)" value={fields.info_address} onChange={v => u("info_address", v)} />
        <F label="Address (TH)" value={fields.info_address_th} onChange={v => u("info_address_th", v)} />
      </div>
    );

    if (activeSection === "social") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: 11, color: "#888", margin: 0 }}>Enter full URLs (https://…)</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="Facebook URL" value={fields.social_facebook} type="url" onChange={v => u("social_facebook", v)} />
          <F label="Instagram URL" value={fields.social_instagram} type="url" onChange={v => u("social_instagram", v)} />
          <F label="LINE URL" value={fields.social_line} type="url" onChange={v => u("social_line", v)} />
          <F label="YouTube URL" value={fields.social_youtube} type="url" onChange={v => u("social_youtube", v)} />
          <F label="TikTok URL" value={fields.social_tiktok} type="url" onChange={v => u("social_tiktok", v)} />
        </div>
      </div>
    );

    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, paddingBottom: showSaveBar ? 72 : 0 }}>
      <div style={{ width: 195, flexShrink: 0, background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 10, overflow: "hidden", position: "sticky", top: 78, maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
        <div style={{ padding: "10px 14px", borderBottom: "0.5px solid #E8E6E0", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#aaa" }}>Sections</div>
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
                <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>{sec.fieldCount} field{sec.fieldCount !== 1 ? "s" : ""}</div>
              </div>
              {dirty[sec.id] && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />}
              {saved[sec.id] && !dirty[sec.id] && <i className="ti ti-check" style={{ fontSize: 11, color: "#3B6D11" }} />}
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
            Unsaved changes in {activeSec.label}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={() => discardSection(activeSection)} style={{ padding: "8px 16px", background: "#FFFFFF", border: "0.5px solid #D8D5CE", color: "#555", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Discard</button>
            <button type="button" onClick={() => saveSection(activeSection)} disabled={!!saving[activeSection]}
              style={{ padding: "8px 20px", background: "#0D1E3D", color: "#E8D5A3", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: saving[activeSection] ? "wait" : "pointer", opacity: saving[activeSection] ? 0.6 : 1, display: "flex", alignItems: "center", gap: 7 }}>
              {saving[activeSection] && <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 13 }} />}
              {saving[activeSection] ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
