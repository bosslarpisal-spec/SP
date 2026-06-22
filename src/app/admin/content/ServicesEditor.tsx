"use client";
import React, { useState } from "react";
import { usePageEditor } from "@/app/admin/lib/usePageEditor";
import { Repeater } from "@/app/admin/components/Repeater";
import type { RepField } from "@/app/admin/components/Repeater";

const FIELD_META: Record<string, { section: string; key: string }> = {
  hero_badge:       { section: "hero",     key: "badge" },
  hero_heading:     { section: "hero",     key: "heading" },
  hero_heading_italic: { section: "hero",  key: "heading_italic" },
  hero_subtext_th:  { section: "hero",     key: "subtext_th" },
  hero_description: { section: "hero",     key: "description" },
  services:         { section: "services", key: "items" },
  why_badge:        { section: "why",      key: "badge" },
  why_heading:      { section: "why",      key: "heading" },
  why_items:        { section: "why",      key: "items" },
  process_badge:    { section: "process",  key: "badge" },
  process_heading:  { section: "process",  key: "heading" },
  process_items:    { section: "process",  key: "items" },
};

const SECTION_FIELDS: Record<string, string[]> = {
  hero:     ["hero_badge", "hero_heading", "hero_heading_italic", "hero_subtext_th", "hero_description"],
  services: ["services"],
  why:      ["why_badge", "why_heading", "why_items"],
  process:  ["process_badge", "process_heading", "process_items"],
};

const DEFAULTS: Record<string, string> = {
  hero_badge:          "WHAT WE OFFER",
  hero_heading:        "Our Core",
  hero_heading_italic: "Services",
  hero_subtext_th:     "บริการหลักของเรา",
  hero_description:    "From concept to delivery, SP manages every step. Our in-house design team, manufacturing partners, and logistics network ensure your premium products arrive on time, every time.",
  services: JSON.stringify([
    { n:"01", feat:true,  icon:"ti-gift",    title:"Premium Gifts",        th:"ของพรีเมียม",         desc:"Custom premium gifts from concept to delivery. We handle design, production, and packaging." },
    { n:"02", feat:false, icon:"ti-award",   title:"Corporate Souvenirs",  th:"ของที่ระลึกองค์กร",   desc:"High-quality branded souvenirs for events, exhibitions, and giveaways." },
    { n:"03", feat:false, icon:"ti-package", title:"New Year Packages",    th:"ชุดของขวัญปีใหม่",    desc:"Beautifully curated new-year gift sets that leave a lasting impression." },
    { n:"04", feat:false, icon:"ti-pencil",  title:"Custom Branding",      th:"งานพิมพ์แบรนด์",      desc:"Logo print, screen print, laser engraving, and full-colour embroidery." },
    { n:"05", feat:false, icon:"ti-settings",title:"OEM Manufacturing",    th:"การผลิต OEM",          desc:"End-to-end OEM product manufacturing with strict quality control." },
    { n:"06", feat:true,  icon:"ti-truck",   title:"Logistics & Delivery", th:"โลจิสติกส์และจัดส่ง", desc:"Reliable shipping to 30+ countries with real-time tracking and customs support." },
  ]),
  why_badge:   "WHY CHOOSE US",
  why_heading: "Why SP?",
  why_items: JSON.stringify([
    { n:"01", icon:"ti-clock",  title:"20+ Years of Experience",  desc:"Decades of know-how delivering premium solutions across all sectors." },
    { n:"02", icon:"ti-pencil", title:"Custom Design Team",       desc:"In-house designers who bring your brand vision to life from concept to product." },
    { n:"03", icon:"ti-check",  title:"Strict Quality Control",   desc:"Multi-stage quality checks before every shipment leaves our facility." },
    { n:"04", icon:"ti-world",  title:"Global Export Capability", desc:"Exporting to 30+ countries with full logistics and customs support." },
  ]),
  process_badge:   "HOW IT WORKS",
  process_heading: "Our Production Process",
  process_items: JSON.stringify([
    { n:"01", icon:"ti-message",  title:"Consultation",    desc:"We discuss your needs, target audience, and budget.", active:false },
    { n:"02", icon:"ti-pencil",   title:"Design & Sample", desc:"Our team creates designs and sends physical samples.", active:true  },
    { n:"03", icon:"ti-settings", title:"Production",      desc:"Full-scale manufacturing with quality control at every step.", active:false },
    { n:"04", icon:"ti-truck",    title:"Delivery",        desc:"On-time delivery worldwide with full tracking support.", active:false },
  ]),
};

const SECTIONS = [
  { id: "hero",     label: "Hero",             icon: "ti-sparkles",   fieldCount: 5, desc: "Page hero section" },
  { id: "services", label: "Services",         icon: "ti-gift",       fieldCount: 1, desc: "6 service cards (layout fixed by order)" },
  { id: "why",      label: "Why SP",           icon: "ti-star",       fieldCount: 3, desc: "Why choose SP section" },
  { id: "process",  label: "Process Steps",    icon: "ti-list-check", fieldCount: 3, desc: "4-step production process" },
];

const SERVICE_FIELDS: RepField[] = [
  { key: "n",    label: "Number (e.g. 01)",      type: "text",  span: "half" },
  { key: "icon", label: "Tabler icon class",      type: "text",  span: "half", placeholder: "ti-gift" },
  { key: "title",label: "Title (EN)",             type: "text" },
  { key: "th",   label: "Title (TH)",             type: "text" },
  { key: "desc", label: "Description",            type: "textarea", rows: 2 },
  { key: "feat", label: "Featured (large card)",  type: "checkbox" },
];
const WHY_FIELDS: RepField[] = [
  { key: "n",    label: "Number",     type: "text",  span: "half" },
  { key: "icon", label: "Icon class", type: "text",  span: "half", placeholder: "ti-star" },
  { key: "title",label: "Title",      type: "text" },
  { key: "desc", label: "Description",type: "textarea", rows: 2 },
];
const PROCESS_FIELDS: RepField[] = [
  { key: "n",      label: "Number",     type: "text",  span: "half" },
  { key: "icon",   label: "Icon class", type: "text",  span: "half", placeholder: "ti-message" },
  { key: "title",  label: "Title",      type: "text" },
  { key: "desc",   label: "Description",type: "textarea", rows: 2 },
  { key: "active", label: "Active (gold circle)", type: "checkbox" },
];

const lSt: React.CSSProperties = { fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa", fontWeight: 500, display: "block", marginBottom: 5 };
const iBase: React.CSSProperties = { background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 7, padding: "7px 9px", fontSize: 12, color: "#333", width: "100%", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

function F({ label, value, onChange, multiline = false, placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  return (
    <div>
      <label style={lSt}>{label}</label>
      {multiline
        ? <textarea value={value} rows={3} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={{ ...iBase, resize: "vertical" }} />
        : <input type="text" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={iBase} />
      }
    </div>
  );
}

export default function ServicesEditor() {
  const [activeSection, setActiveSection] = useState("hero");
  const { loaded, fields, setFields, dirty, saving, saved, updateField, saveSection, discardSection } =
    usePageEditor("services", FIELD_META, SECTION_FIELDS, DEFAULTS);

  function u(k: string, v: string) { updateField(k, v, activeSection); }
  function arrField(k: string) {
    try { return JSON.parse(fields[k] || "[]") as Record<string, unknown>[]; } catch { return []; }
  }
  function setArr(k: string, arr: Record<string, unknown>[]) {
    setFields(p => ({ ...p, [k]: JSON.stringify(arr) }));
    updateField(k, JSON.stringify(arr), activeSection);
  }

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#888", fontSize: 13, padding: "40px 0" }}>
      <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} /> Loading Services content…
    </div>
  );

  const activeSec = SECTIONS.find(s => s.id === activeSection)!;
  const showSaveBar = !!dirty[activeSection];

  function renderSection() {
    if (activeSection === "hero") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <F label="Badge / eyebrow" value={fields.hero_badge} onChange={v => u("hero_badge", v)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="Heading (main)" value={fields.hero_heading} onChange={v => u("hero_heading", v)} />
          <F label="Heading (italic accent)" value={fields.hero_heading_italic} onChange={v => u("hero_heading_italic", v)} />
        </div>
        <F label="Thai subtext" value={fields.hero_subtext_th} onChange={v => u("hero_subtext_th", v)} />
        <F label="Description" value={fields.hero_description} multiline onChange={v => u("hero_description", v)} />
      </div>
    );

    if (activeSection === "services") return (
      <div>
        <p style={{ ...lSt, marginBottom: 8 }}>Service cards — order determines layout (items 1 & 2 are large rows, items 3–6 are the grid)</p>
        <Repeater items={arrField("services")} onChange={arr => setArr("services", arr)} fields={SERVICE_FIELDS}
          defaultItem={{ n:"07", feat:false, icon:"ti-star", title:"", th:"", desc:"" }} addLabel="Add service" />
      </div>
    );

    if (activeSection === "why") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="Section badge" value={fields.why_badge} onChange={v => u("why_badge", v)} />
          <F label="Section heading" value={fields.why_heading} onChange={v => u("why_heading", v)} />
        </div>
        <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 12 }}>
          <Repeater items={arrField("why_items")} onChange={arr => setArr("why_items", arr)} fields={WHY_FIELDS}
            defaultItem={{ n:"05", icon:"ti-star", title:"", desc:"" }} addLabel="Add reason" />
        </div>
      </div>
    );

    if (activeSection === "process") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="Section badge" value={fields.process_badge} onChange={v => u("process_badge", v)} />
          <F label="Section heading" value={fields.process_heading} onChange={v => u("process_heading", v)} />
        </div>
        <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 12 }}>
          <Repeater items={arrField("process_items")} onChange={arr => setArr("process_items", arr)} fields={PROCESS_FIELDS}
            defaultItem={{ n:"05", icon:"ti-star", title:"", desc:"", active:false }} addLabel="Add step" />
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
