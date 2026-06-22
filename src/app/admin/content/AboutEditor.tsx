"use client";
import React, { useState } from "react";
import { usePageEditor } from "@/app/admin/lib/usePageEditor";
import { Repeater } from "@/app/admin/components/Repeater";
import type { RepField } from "@/app/admin/components/Repeater";

/* ── schema ─────────────────────────────────────────────────── */
const FIELD_META: Record<string, { section: string; key: string }> = {
  hero_badge:            { section: "hero",       key: "badge" },
  hero_heading:          { section: "hero",       key: "heading" },
  hero_heading_italic:   { section: "hero",       key: "heading_italic" },
  hero_subtext_th:       { section: "hero",       key: "subtext_th" },
  hero_description:      { section: "hero",       key: "description" },
  story_badge:           { section: "story",      key: "badge" },
  story_heading:         { section: "story",      key: "heading" },
  story_heading_italic:  { section: "story",      key: "heading_italic" },
  story_para1:           { section: "story",      key: "para1" },
  story_para2:           { section: "story",      key: "para2" },
  story_checklist_label: { section: "story",      key: "checklist_label" },
  story_checklist:       { section: "story",      key: "checklist" },
  about_stats:           { section: "stats",      key: "items" },
  milestones:            { section: "milestones", key: "items" },
  quote_label:           { section: "quote",      key: "label" },
  quote_text:            { section: "quote",      key: "text" },
  quote_attribution:     { section: "quote",      key: "attribution" },
};

const SECTION_FIELDS: Record<string, string[]> = {
  hero:       ["hero_badge", "hero_heading", "hero_heading_italic", "hero_subtext_th", "hero_description"],
  story:      ["story_badge", "story_heading", "story_heading_italic", "story_para1", "story_para2", "story_checklist_label", "story_checklist"],
  about_stats: ["about_stats"],
  milestones: ["milestones"],
  quote:      ["quote_label", "quote_text", "quote_attribution"],
};

const DEFAULTS: Record<string, string> = {
  hero_badge:            "Our Story",
  hero_heading:          "Crafting Moments That",
  hero_heading_italic:   "Last a Lifetime",
  hero_subtext_th:       "ผู้เชี่ยวชาญด้านของพรีเมียมและโปรโมชันครบวงจร",
  hero_description:      "Since 2003, SP has partnered with leading brands across Thailand and beyond — designing, producing, and delivering premium gifts that carry meaning far beyond their moment of giving.",
  story_badge:           "About SP",
  story_heading:         "Thailand’s Trusted Partner in",
  story_heading_italic:  "Premium Merchandise",
  story_para1:           "Founded in Bangkok in 2003, SP began as a small creative studio with one goal: to make branded gifting feel personal. Two decades later, we operate as a full-service premium goods partner — from concept and design through OEM manufacturing and global logistics.",
  story_para2:           "We work directly with procurement and marketing teams at companies like P&G, Acer, Oral-B, and SCB Bank — delivering products that reflect each brand’s identity at every touchpoint.",
  story_checklist_label: "Why clients choose SP",
  story_checklist:       JSON.stringify(["20+ years delivering premium merchandise","Custom design team on every project","100% quality guarantee on all orders","Nationwide & international shipping"]),
  about_stats:           JSON.stringify([{value:"25",suffix:"+",label:"Years",bg:"25+"},{value:"3000",suffix:"+",label:"Clients",bg:"3K+"},{value:"50000",suffix:"+",label:"Projects",bg:"50K"},{value:"30",suffix:"+",label:"Countries",bg:"30+"}]),
  milestones:            JSON.stringify([{yr:"03",year:"2003",text:"Founded in Bangkok with a vision to redefine corporate gifting in Thailand.",active:false},{yr:"08",year:"2008",text:"Expanded OEM manufacturing capabilities and opened first dedicated production facility.",active:false},{yr:"12",year:"2012",text:"Surpassed 1,000+ clients across FMCG, finance, and technology sectors.",active:false},{yr:"18",year:"2018",text:"Launched Eco-Premium line — sustainable materials with zero compromise on quality.",active:true},{yr:"24",year:"2024",text:"3,000+ clients in 30+ countries. Celebrating 20+ years of premium excellence.",active:true}]),
  quote_label:           "Our Philosophy",
  quote_text:            "Every gift we create carries a brand’s promise. Our job is to make sure that promise is felt — not just seen.",
  quote_attribution:     "SP Creative & Production Team",
};

const SECTIONS = [
  { id: "hero",        label: "Hero",       icon: "ti-sparkles",    fieldCount: 5,  desc: "Page hero section heading and description" },
  { id: "story",       label: "Our Story",  icon: "ti-book",        fieldCount: 7,  desc: "Story copy, badges, and checklist" },
  { id: "about_stats", label: "Stats",      icon: "ti-chart-bar",   fieldCount: 1,  desc: "Four animated count-up stat cards" },
  { id: "milestones",  label: "Milestones", icon: "ti-timeline",    fieldCount: 1,  desc: "Company history timeline entries" },
  { id: "quote",       label: "Pull Quote", icon: "ti-quote",       fieldCount: 3,  desc: "Philosophy quote section" },
];

/* ── repeater field defs ─────────────────────────────────────── */
const STAT_FIELDS: RepField[] = [
  { key: "value",  label: "Count (number, e.g. 25000)", type: "text",  span: "half" },
  { key: "suffix", label: "Suffix (e.g. +)",            type: "text",  span: "half" },
  { key: "label",  label: "Label",                      type: "text",  span: "half" },
  { key: "bg",     label: "Background text (e.g. 3K+)", type: "text",  span: "half" },
];
const MILESTONE_FIELDS: RepField[] = [
  { key: "yr",     label: "Short year (e.g. 03)",    type: "text",     span: "half" },
  { key: "year",   label: "Full year (e.g. 2003)",   type: "text",     span: "half" },
  { key: "text",   label: "Milestone description",   type: "textarea", rows: 2 },
  { key: "active", label: "Highlighted / active",    type: "checkbox" },
];
const CHECKLIST_FIELDS: RepField[] = [
  { key: "text", label: "Item text", type: "text" },
];

/* ── shared style helpers ────────────────────────────────────── */
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

/* ── main component ──────────────────────────────────────────── */
export default function AboutEditor() {
  const [activeSection, setActiveSection] = useState("hero");
  const { loaded, fields, setFields, dirty, saving, saved, updateField, saveSection, discardSection } =
    usePageEditor("about", FIELD_META, SECTION_FIELDS, DEFAULTS);

  function u(k: string, v: string) { updateField(k, v, activeSection); }
  function arrField(k: string) {
    try { return JSON.parse(fields[k] || "[]") as Record<string, unknown>[]; } catch { return []; }
  }
  function setArr(k: string, arr: Record<string, unknown>[]) {
    setFields(p => ({ ...p, [k]: JSON.stringify(arr) }));
    updateField(k, JSON.stringify(arr), activeSection);
  }

  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#888", fontSize: 13, padding: "40px 0" }}>
        <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} /> Loading About page content…
      </div>
    );
  }

  const activeSec = SECTIONS.find(s => s.id === activeSection)!;
  const showSaveBar = !!dirty[activeSection];

  function renderSection() {
    if (activeSection === "hero") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <F label="Badge label" value={fields.hero_badge} onChange={v => u("hero_badge", v)} placeholder="Our Story" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="Heading (main line)" value={fields.hero_heading} onChange={v => u("hero_heading", v)} />
          <F label="Heading (italic line)" value={fields.hero_heading_italic} onChange={v => u("hero_heading_italic", v)} />
        </div>
        <F label="Thai subtext" value={fields.hero_subtext_th} onChange={v => u("hero_subtext_th", v)} />
        <F label="Description paragraph" value={fields.hero_description} multiline onChange={v => u("hero_description", v)} />
      </div>
    );

    if (activeSection === "story") {
      const checklistArr = arrField("story_checklist").map(i => ({ text: String(i.text ?? i ?? "") }));
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Badge label" value={fields.story_badge} onChange={v => u("story_badge", v)} />
            <F label="Checklist heading" value={fields.story_checklist_label} onChange={v => u("story_checklist_label", v)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Heading (main line)" value={fields.story_heading} onChange={v => u("story_heading", v)} />
            <F label="Heading (italic line)" value={fields.story_heading_italic} onChange={v => u("story_heading_italic", v)} />
          </div>
          <F label="Paragraph 1" value={fields.story_para1} multiline onChange={v => u("story_para1", v)} />
          <F label="Paragraph 2" value={fields.story_para2} multiline onChange={v => u("story_para2", v)} />
          <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 12 }}>
            <p style={{ ...lSt, marginBottom: 8 }}>Checklist items</p>
            <Repeater
              items={checklistArr}
              onChange={arr => {
                const raw = arr.map(i => String(i.text));
                setArr("story_checklist", raw.map(t => ({ text: t })));
              }}
              fields={CHECKLIST_FIELDS}
              defaultItem={{ text: "" }}
              addLabel="Add item"
            />
          </div>
        </div>
      );
    }

    if (activeSection === "about_stats") return (
      <div>
        <p style={{ ...lSt, marginBottom: 8 }}>Stat cards — 4 animated count-up cards</p>
        <Repeater
          items={arrField("about_stats")}
          onChange={arr => setArr("about_stats", arr)}
          fields={STAT_FIELDS}
          defaultItem={{ value: "0", suffix: "+", label: "Label", bg: "0+" }}
          addLabel="Add stat"
        />
        <p style={{ fontSize: 10, color: "#aaa", marginTop: 8 }}>
          &quot;Count&quot; must be a number (e.g. 3000, not &quot;3,000+&quot;). Suffix is added after (e.g. +). Label shows below. Background text is the faint large text.
        </p>
      </div>
    );

    if (activeSection === "milestones") return (
      <div>
        <p style={{ ...lSt, marginBottom: 8 }}>Timeline milestones</p>
        <Repeater
          items={arrField("milestones")}
          onChange={arr => setArr("milestones", arr)}
          fields={MILESTONE_FIELDS}
          defaultItem={{ yr: "00", year: "2000", text: "", active: false }}
          addLabel="Add milestone"
        />
      </div>
    );

    if (activeSection === "quote") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <F label="Section label" value={fields.quote_label} onChange={v => u("quote_label", v)} placeholder="Our Philosophy" />
        <F label="Quote text (without quotes)" value={fields.quote_text} multiline onChange={v => u("quote_text", v)} />
        <F label="Attribution" value={fields.quote_attribution} onChange={v => u("quote_attribution", v)} />
      </div>
    );

    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, paddingBottom: showSaveBar ? 72 : 0 }}>
      {/* Sidebar */}
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
