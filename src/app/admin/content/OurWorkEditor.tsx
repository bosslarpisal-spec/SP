"use client";
import React, { useState } from "react";
import { usePageEditor } from "@/app/admin/lib/usePageEditor";
import { Repeater } from "@/app/admin/components/Repeater";
import type { RepField } from "@/app/admin/components/Repeater";

const FIELD_META: Record<string, { section: string; key: string }> = {
  hero_badge:          { section: "hero",        key: "badge" },
  hero_heading:        { section: "hero",        key: "heading" },
  hero_heading_italic: { section: "hero",        key: "heading_italic" },
  ow_stats:            { section: "stats",       key: "items" },
  client_tags:         { section: "client_tags", key: "items" },
  projects:            { section: "projects",    key: "items" },
};

const SECTION_FIELDS: Record<string, string[]> = {
  hero:        ["hero_badge", "hero_heading", "hero_heading_italic"],
  ow_stats:    ["ow_stats"],
  client_tags: ["client_tags"],
  projects:    ["projects"],
};

const DEFAULTS: Record<string, string> = {
  hero_badge:          "PORTFOLIO",
  hero_heading:        "Our Work &",
  hero_heading_italic: "Portfolio",
  ow_stats:    JSON.stringify([{n:"3,000+",label:"Clients Served"},{n:"50k+",label:"Projects Done"},{n:"30+",label:"Countries"}]),
  client_tags: "All Work,P&G,Acer,Oral-B,Ambipur,VSTECS,Absolute You,SCB Bank,LINE MAN",
  projects:    JSON.stringify([
    { n:"01", client:"P&G",          title:"Premium New Year Gift Sets",      th:"ชุดของขวัญปีใหม่พรีเมียม", desc:"Designed and produced 12,000 curated gift sets for P&G Thailand's New Year campaign.", tags:"Gift Sets,Custom Packaging,Logistics", metrics:'[{"n":"12,000","label":"Units Produced"},{"n":"5","label":"Provinces Covered"},{"n":"10","label":"Days to Delivery"}]', icon:"ti-gift",        category:"Gift Sets",       aspect:"tall"   },
    { n:"02", client:"Acer",         title:"Branded Corporate Merchandise",   th:"สินค้าองค์กรแบรนด์ครบเซ็ต", desc:"A full suite of branded merchandise for Acer's distributor conference.", tags:"OEM Manufacturing,Custom Branding,Screen Print", metrics:'[{"n":"8,500","label":"Items Delivered"},{"n":"3","label":"Product Types"},{"n":"100%","label":"On-time Rate"}]', icon:"ti-award",       category:"OEM",             aspect:"wide"   },
    { n:"03", client:"Oral-B",       title:"Toothbrush Gift Packs",           th:"",                             desc:"",                                                                                tags:"Gift Sets",                              metrics:"[]",                                                                                                                                                                     icon:"ti-package",     category:"Gift Sets",       aspect:"square" },
    { n:"04", client:"Ambipur",      title:"Scented Promo Kits",              th:"",                             desc:"",                                                                                tags:"Custom Branding",                        metrics:"[]",                                                                                                                                                                     icon:"ti-certificate", category:"Custom Branding", aspect:"wide"   },
    { n:"05", client:"VSTECS",       title:"Tech Distributor Gifts",          th:"",                             desc:"",                                                                                tags:"OEM",                                    metrics:"[]",                                                                                                                                                                     icon:"ti-cpu",         category:"OEM",             aspect:"square" },
    { n:"06", client:"Absolute You", title:"Wellness Premium Sets",           th:"",                             desc:"",                                                                                tags:"Premium Gifts",                          metrics:"[]",                                                                                                                                                                     icon:"ti-heart",       category:"Premium Gifts",   aspect:"tall"   },
    { n:"07", client:"SCB Bank",     title:"VIP Client Gift Collection",      th:"",                             desc:"",                                                                                tags:"Luxury Gifts",                           metrics:"[]",                                                                                                                                                                     icon:"ti-diamond",     category:"Luxury Gifts",    aspect:"wide"   },
    { n:"08", client:"LINE MAN",     title:"Rider Appreciation Kits",         th:"",                             desc:"",                                                                                tags:"Corporate",                              metrics:"[]",                                                                                                                                                                     icon:"ti-bike",        category:"Corporate",       aspect:"square" },
  ]),
};

const SECTIONS = [
  { id: "hero",        label: "Hero",        icon: "ti-sparkles",   fieldCount: 3, desc: "Page hero and badge" },
  { id: "ow_stats",    label: "Stats Bar",   icon: "ti-chart-bar",  fieldCount: 1, desc: "3 stats shown in hero" },
  { id: "client_tags", label: "Filter Tags", icon: "ti-tag",        fieldCount: 1, desc: "Client filter buttons" },
  { id: "projects",    label: "Projects",    icon: "ti-layout-grid",fieldCount: 1, desc: "Portfolio project cards" },
];

const STAT_FIELDS: RepField[] = [
  { key: "n",     label: "Number (e.g. 3,000+)", type: "text", span: "half" },
  { key: "label", label: "Label",                 type: "text", span: "half" },
];
const PROJECT_FIELDS: RepField[] = [
  { key: "n",        label: "Number (e.g. 01)",   type: "text",  span: "half" },
  { key: "client",   label: "Client name",        type: "text",  span: "half" },
  { key: "title",    label: "Project title (EN)", type: "text" },
  { key: "th",       label: "Project title (TH)", type: "text" },
  { key: "desc",     label: "Description",        type: "textarea", rows: 3 },
  { key: "tags",     label: "Tags (comma-separated)", type: "text", placeholder: "Gift Sets,Custom Branding" },
  { key: "metrics",  label: "Metrics (JSON array, e.g. [{\"n\":\"12,000\",\"label\":\"Units\"}])", type: "textarea", rows: 2 },
  { key: "icon",     label: "Tabler icon class",  type: "text",  span: "half", placeholder: "ti-gift" },
  { key: "category", label: "Category",           type: "text",  span: "half" },
  { key: "aspect",   label: "Card aspect ratio",  type: "select", options: ["tall","wide","square"] },
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

export default function OurWorkEditor() {
  const [activeSection, setActiveSection] = useState("hero");
  const { loaded, fields, setFields, dirty, saving, saved, updateField, saveSection, discardSection } =
    usePageEditor("our-work", FIELD_META, SECTION_FIELDS, DEFAULTS);

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
      <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} /> Loading Our Work content…
    </div>
  );

  const activeSec = SECTIONS.find(s => s.id === activeSection)!;
  const showSaveBar = !!dirty[activeSection];

  function renderSection() {
    if (activeSection === "hero") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <F label="Badge / eyebrow" value={fields.hero_badge} onChange={v => u("hero_badge", v)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="Heading (main line)" value={fields.hero_heading} onChange={v => u("hero_heading", v)} />
          <F label="Heading (italic accent)" value={fields.hero_heading_italic} onChange={v => u("hero_heading_italic", v)} />
        </div>
      </div>
    );

    if (activeSection === "ow_stats") return (
      <div>
        <p style={{ ...lSt, marginBottom: 8 }}>Hero stats bar — shown at bottom of hero</p>
        <Repeater items={arrField("ow_stats")} onChange={arr => setArr("ow_stats", arr)} fields={STAT_FIELDS}
          defaultItem={{ n:"0+", label:"" }} addLabel="Add stat" />
      </div>
    );

    if (activeSection === "client_tags") return (
      <div>
        <label style={lSt}>Filter tags (comma-separated client names)</label>
        <textarea value={fields.client_tags} rows={3} onChange={e => u("client_tags", e.target.value)}
          placeholder="All Work,P&G,Acer,..." style={{ ...iBase, resize: "vertical" }} />
        <p style={{ fontSize: 10, color: "#aaa", marginTop: 6 }}>First item is the &quot;show all&quot; tag. Each subsequent item is a client name that filters the portfolio.</p>
      </div>
    );

    if (activeSection === "projects") return (
      <div>
        <p style={{ ...lSt, marginBottom: 8 }}>Portfolio projects — click a card to edit</p>
        <Repeater items={arrField("projects")} onChange={arr => setArr("projects", arr)} fields={PROJECT_FIELDS}
          defaultItem={{ n:"09", client:"", title:"", th:"", desc:"", tags:"", metrics:"[]", icon:"ti-star", category:"", aspect:"square" }}
          addLabel="Add project" />
        <p style={{ fontSize: 10, color: "#aaa", marginTop: 8 }}>Tags and Metrics are used in the project overlay. Tags must match filter tag names above for the filter to work.</p>
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
