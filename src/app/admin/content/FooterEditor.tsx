"use client";
import React, { useState } from "react";
import { usePageEditor } from "@/app/admin/lib/usePageEditor";
import { Repeater } from "@/app/admin/components/Repeater";
import type { RepField } from "@/app/admin/components/Repeater";
import { th } from "@/app/admin/lib/admin-th";
import { StyleOverride, type BlockStyles } from "@/app/admin/components/StyleOverride";

/* ── Schema ───────────────────────────────────────────────── */
const FIELD_META: Record<string, { section: string; key: string }> = {
  company_name:       { section: "footer", key: "company_name" },
  tagline:            { section: "footer", key: "tagline" },
  description:        { section: "footer", key: "description" },
  description_th:     { section: "footer", key: "description_th" },
  newsletter_heading: { section: "footer", key: "newsletter_heading" },
  copyright_year:     { section: "footer", key: "copyright_year" },
  footer_styles:      { section: "footer", key: "_styles" },
  services_items:     { section: "footer", key: "services_items" },
  quick_links:        { section: "footer", key: "quick_links" },
};

const SECTION_FIELDS: Record<string, string[]> = {
  brand: ["company_name", "tagline", "description", "description_th", "newsletter_heading", "copyright_year", "footer_styles"],
  svc:   ["services_items"],
  ql:    ["quick_links"],
};

const DEFAULTS: Record<string, string> = {
  company_name:       "Siam Premium Product",
  tagline:            "Premiums & Promotion",
  description:        "Specialist in premium gifts, corporate souvenirs, and branded merchandise.",
  description_th:     "ผู้เชี่ยวชาญด้านของพรีเมียมและโปรโมชั่นครบวงจร",
  newsletter_heading: "Get new product launches & SP news.",
  copyright_year:     "2025",
  footer_styles: JSON.stringify({}),
  services_items: JSON.stringify([
    { label: "Premium Gifts" }, { label: "Corporate Souvenirs" },
    { label: "New Year Sets" }, { label: "Custom Branding" },
    { label: "OEM Manufacturing" }, { label: "Logistics & Delivery" },
  ]),
  quick_links: JSON.stringify([
    { label_en: "Home",     label_th: "หน้าหลัก",     href: "/home" },
    { label_en: "About",    label_th: "เกี่ยวกับเรา",  href: "/about" },
    { label_en: "Services", label_th: "บริการ",        href: "/services" },
    { label_en: "Our Work", label_th: "ผลงาน",         href: "/our-work" },
    { label_en: "Contact",  label_th: "ติดต่อ",        href: "/contact" },
    { label_en: "Sign In",  label_th: "เข้าสู่ระบบ",   href: "/login" },
  ]),
};

const SECTIONS = [
  { id: "brand", label: th.ftSecBrand,    icon: "ti-building-store", fieldCount: 6, desc: th.ftSecBrandDesc },
  { id: "svc",   label: th.ftSecServices, icon: "ti-list",           fieldCount: 1, desc: th.ftSecServicesDesc },
  { id: "ql",    label: th.ftSecLinks,    icon: "ti-link",           fieldCount: 1, desc: th.ftSecLinksDesc },
  { id: "info",  label: th.ftSecContact,  icon: "ti-info-circle",    fieldCount: 0, desc: th.ftSecContactDesc },
];

/* ── Style defaults (Brand section) ─────────────────────── */
const BRAND_STYLE_DEF: Record<string, BlockStyles> = {
  companyName:       { color: "#FFFFFF",  fontSize: "14px" },
  tagline:           { color: "#243160",  fontSize: "11px" },
  description:       { color: "#6A7A9A",  fontSize: "12px" },
  descriptionTh:     { color: "#243160",  fontSize: "12px" },
  newsletterHeading: { color: "#243160",  fontSize: "12px" },
};
const BRAND_STYLE_RANGE: Record<string, { min: number; max: number }> = {
  companyName:       { min: 10, max: 20 },
  tagline:           { min: 8,  max: 14 },
  description:       { min: 10, max: 16 },
  descriptionTh:     { min: 10, max: 16 },
  newsletterHeading: { min: 10, max: 14 },
};

/* ── Repeater schemas ─────────────────────────────────────── */
const SVC_FIELDS: RepField[] = [
  { key: "label", label: th.ftServiceName, type: "text", maxLength: 40 },
];
const SVC_DEFAULT = { label: "" };

const QL_FIELDS: RepField[] = [
  { key: "label_en", label: th.ftLinkLabelEn, type: "text", span: "half", maxLength: 40 },
  { key: "label_th", label: th.ftLinkLabelTh, type: "text", span: "half", maxLength: 40 },
  { key: "href",     label: th.ftLinkUrl,     type: "text", maxLength: 100 },
];
const QL_DEFAULT = { label_en: "", label_th: "", href: "/" };

/* ── Input styles ─────────────────────────────────────────── */
const lSt: React.CSSProperties = { fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa", fontWeight: 500, display: "block", marginBottom: 5 };
const iBase: React.CSSProperties = { background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 7, padding: "7px 9px", fontSize: 12, color: "#333", width: "100%", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

/* ── CF — counted field ───────────────────────────────────── */
function CF({ label, value, onChange, max, multiline = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  max: number; multiline?: boolean; placeholder?: string;
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
        ? <textarea value={value} rows={3} onChange={e => onChange(e.target.value)}
            style={{ ...iBase, resize: "vertical", ...(over ? { borderColor: "#F09595" } : {}) }} />
        : <input type="text" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
            style={{ ...iBase, ...(over ? { borderColor: "#F09595" } : {}) }} />
      }
    </div>
  );
}

/* ── Editor ───────────────────────────────────────────────── */
export default function FooterEditor() {
  const [activeSection, setActiveSection] = useState("brand");

  const { loaded, fields, setFields, dirty, saving, saved, updateField, saveSection, discardSection } =
    usePageEditor("site", FIELD_META, SECTION_FIELDS, DEFAULTS);

  function u(k: string, v: string) { updateField(k, v, activeSection); }

  function arrField(k: string) {
    try { return JSON.parse(fields[k] || "[]") as Record<string, unknown>[]; } catch { return []; }
  }
  function setArr(k: string, arr: Record<string, unknown>[]) {
    const v = JSON.stringify(arr);
    setFields(p => ({ ...p, [k]: v }));
    updateField(k, v, activeSection);
  }

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
  const handleBrandStyle = makeStyleChange("footer_styles", "brand");

  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#888", fontSize: 13, padding: "40px 0" }}>
        <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} /> {th.footerLoading}
      </div>
    );
  }

  const activeSec   = SECTIONS.find(s => s.id === activeSection)!;
  const showSaveBar = !!dirty[activeSection];

  function renderSection() {

    /* ── Brand ── */
    if (activeSection === "brand") {
      const brandSt: Record<string, BlockStyles> = (() => { try { return JSON.parse(fields.footer_styles || "{}"); } catch { return {}; } })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <CF label={th.ftCompanyName} value={fields.company_name} onChange={v => u("company_name", v)} max={50} placeholder="Siam Premium Product" />
              <StyleOverride blockKey="companyName" label="Company name" allStyles={brandSt} onChange={handleBrandStyle} defaults={BRAND_STYLE_DEF.companyName} fontSizeRange={BRAND_STYLE_RANGE.companyName} />
            </div>
            <div>
              <CF label={th.ftTagline} value={fields.tagline} onChange={v => u("tagline", v)} max={50} placeholder="Premiums & Promotion" />
              <StyleOverride blockKey="tagline" label="Tagline" allStyles={brandSt} onChange={handleBrandStyle} defaults={BRAND_STYLE_DEF.tagline} fontSizeRange={BRAND_STYLE_RANGE.tagline} />
            </div>
          </div>
          <div>
            <CF label={th.ftDescEn} value={fields.description} onChange={v => u("description", v)} max={180} multiline />
            <StyleOverride blockKey="description" label="Description EN" allStyles={brandSt} onChange={handleBrandStyle} defaults={BRAND_STYLE_DEF.description} fontSizeRange={BRAND_STYLE_RANGE.description} />
          </div>
          <div>
            <CF label={th.ftDescTh} value={fields.description_th} onChange={v => u("description_th", v)} max={180} multiline />
            <StyleOverride blockKey="descriptionTh" label="Description TH" allStyles={brandSt} onChange={handleBrandStyle} defaults={BRAND_STYLE_DEF.descriptionTh} fontSizeRange={BRAND_STYLE_RANGE.descriptionTh} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <CF label={th.ftNewsletterHead} value={fields.newsletter_heading} onChange={v => u("newsletter_heading", v)} max={80} />
              <StyleOverride blockKey="newsletterHeading" label="Newsletter heading" allStyles={brandSt} onChange={handleBrandStyle} defaults={BRAND_STYLE_DEF.newsletterHeading} fontSizeRange={BRAND_STYLE_RANGE.newsletterHeading} />
            </div>
            <CF label={th.ftCopyrightYear} value={fields.copyright_year} onChange={v => u("copyright_year", v)} max={4} placeholder="2025" />
          </div>
        </div>
      );
    }

    /* ── Services List ── */
    if (activeSection === "svc") return (
      <div>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 14, marginTop: 0 }}>{th.ftServicesHint}</p>
        <Repeater
          key="services_items"
          items={arrField("services_items") as { label: string }[]}
          onChange={arr => setArr("services_items", arr as Record<string, unknown>[])}
          fields={SVC_FIELDS}
          defaultItem={SVC_DEFAULT}
          addLabel={th.ftAddService}
          maxItems={10}
        />
      </div>
    );

    /* ── Quick Links ── */
    if (activeSection === "ql") return (
      <div>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 14, marginTop: 0 }}>{th.ftLinksHint}</p>
        <Repeater
          key="quick_links"
          items={arrField("quick_links") as { label_en: string; label_th: string; href: string }[]}
          onChange={arr => setArr("quick_links", arr as Record<string, unknown>[])}
          fields={QL_FIELDS}
          defaultItem={QL_DEFAULT}
          addLabel={th.ftAddLink}
          maxItems={10}
        />
      </div>
    );

    /* ── Contact & Social (read-only notice) ── */
    if (activeSection === "info") return (
      <div style={{ background: "#F8F6F1", border: "1px solid #E8E6E0", borderRadius: 10, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <i className="ti ti-info-circle" style={{ fontSize: 16, color: "#8A6E00" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{th.ftContactHead}</span>
        </div>
        <p style={{ fontSize: 12, color: "#555", lineHeight: 1.8, margin: "0 0 14px" }}>{th.ftContactBody}</p>
        <p style={{ fontSize: 12, color: "#555", margin: 0 }}>{th.ftContactLink}</p>
      </div>
    );

    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, paddingBottom: showSaveBar ? 72 : 0 }}>

      {/* Sidebar */}
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
                <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>
                  {sec.fieldCount > 0 ? th.contentFields(sec.fieldCount) : th.ftInfoOnly}
                </div>
              </div>
              {dirty[sec.id]                    && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />}
              {saved[sec.id] && !dirty[sec.id]  && <i className="ti ti-check" style={{ fontSize: 11, color: "#3B6D11" }} />}
            </div>
          );
        })}
      </div>

      {/* Content panel */}
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

      {/* Save bar */}
      {showSaveBar && (
        <div style={{ position: "fixed", bottom: 0, left: 220, right: 0, background: "#FFFFFF", borderTop: "0.5px solid #E8E6E0", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 20 }}>
          <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: 13, color: "#D97706" }} />
            {th.saveUnsaved(activeSec.label)}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={() => discardSection(activeSection)}
              style={{ padding: "8px 16px", background: "#FFFFFF", border: "0.5px solid #D8D5CE", color: "#555", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              {th.saveDiscard}
            </button>
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
