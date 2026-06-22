"use client";

import { useState } from "react";
import { saveContentField, saveVisibility } from "./actions";
import { supabase } from "@/lib/supabase";
import type { ContentRow, Category, Tag } from "./page";
import CategoryManager from "./CategoryManager";
import TagManager from "./TagManager";
import { StyleOverride, type BlockStyles } from "@/app/admin/components/StyleOverride";
import AboutEditor from "./AboutEditor";
import ServicesEditor from "./ServicesEditor";
import OurWorkEditor from "./OurWorkEditor";
import ContactEditor from "./ContactEditor";
import BrandingEditor from "./BrandingEditor";

/* ── helpers ──────────────────────────────────────────────── */
function getVal(rows: ContentRow[], section: string, key: string, fallback: string): string {
  const row = rows.find(r => r.section === section && r.key === key);
  return row?.value ?? fallback;
}
function getVisible(rows: ContentRow[], section: string): boolean {
  const row = rows.find(r => r.section === section && r.key === "is_visible");
  return row?.value !== "false";
}

/* ── catalog style defaults ───────────────────────────────────── */
const CATALOG_BLOCK_DEFAULTS: Record<string, BlockStyles> = {
  label:       { color: "#8A6E00",    fontSize: "11px" },
  heading:     { color: "#0D1E3D",    fontSize: "32px" },
  headingTh:   { color: "#2C3E50",    fontSize: "14px" },
  description: { color: "#2C3E50",    fontSize: "14px" },
  quote:       { color: "#8A9AB8",    fontSize: "15px" },
  btn1:        { background: "#E8D5A3", color: "#1C2951", fontSize: "13px" },
  btn2:        { color: "#0D1E3D",    fontSize: "13px" },
};
const CATALOG_FONT_SIZE_RANGES: Record<string, { min: number; max: number }> = {
  label:       { min: 9,  max: 16 },
  heading:     { min: 18, max: 52 },
  headingTh:   { min: 11, max: 20 },
  description: { min: 11, max: 20 },
  quote:       { min: 12, max: 22 },
  btn1:        { min: 11, max: 18 },
  btn2:        { min: 11, max: 18 },
};

/* ── stats / process / marquee style defaults ─────────────────── */
const STATS_BLOCK_DEFAULTS: Record<string, BlockStyles> = {
  statNumber: { color: "#E8D5A3", fontSize: "28px" },
  statLabel:  { color: "rgba(255,255,255,0.55)", fontSize: "9px" },
};
const STATS_FONT_SIZE_RANGES: Record<string, { min: number; max: number }> = {
  statNumber: { min: 14, max: 40 },
  statLabel:  { min: 7,  max: 14 },
};

const PROCESS_BLOCK_DEFAULTS: Record<string, BlockStyles> = {
  heading:    { color: "#0D1E3D",  fontSize: "18px" },
  subheading: { color: "#4A5568",  fontSize: "10px" },
  stepTitle:  { color: "#0D1E3D",  fontSize: "11px" },
  stepDesc:   { color: "#4A5568",  fontSize: "10px" },
  stepAccent: { background: "#1C2951" },
};
const PROCESS_FONT_SIZE_RANGES: Record<string, { min: number; max: number }> = {
  heading:    { min: 12, max: 30 },
  subheading: { min: 8,  max: 16 },
  stepTitle:  { min: 9,  max: 18 },
  stepDesc:   { min: 8,  max: 14 },
};

const MARQUEE_BLOCK_DEFAULTS: Record<string, BlockStyles> = {
  item:    { color: "#0D1E3D", fontSize: "11px" },
  diamond: { color: "#0D1E3D" },
};
const MARQUEE_FONT_SIZE_RANGES: Record<string, { min: number; max: number }> = {
  item: { min: 9, max: 18 },
};

/* ── field → (section,key) map, and section → fields map ───── */
const FIELD_META: Record<string, { section: string; key: string }> = {
  stat1_number:        { section: "stats",   key: "stat1_number" },
  stat1_label:         { section: "stats",   key: "stat1_label" },
  stat2_number:        { section: "stats",   key: "stat2_number" },
  stat2_label:         { section: "stats",   key: "stat2_label" },
  stat3_number:        { section: "stats",   key: "stat3_number" },
  stat3_label:         { section: "stats",   key: "stat3_label" },
  marquee_items:       { section: "marquee", key: "items" },
  process_heading:     { section: "process", key: "heading" },
  process_subheading:  { section: "process", key: "subheading" },
  process_step1_title: { section: "process", key: "step1_title" },
  process_step1_desc:  { section: "process", key: "step1_desc" },
  process_step2_title: { section: "process", key: "step2_title" },
  process_step2_desc:  { section: "process", key: "step2_desc" },
  process_step3_title: { section: "process", key: "step3_title" },
  process_step3_desc:  { section: "process", key: "step3_desc" },
  process_step4_title: { section: "process", key: "step4_title" },
  process_step4_desc:  { section: "process", key: "step4_desc" },
  process_step5_title: { section: "process", key: "step5_title" },
  process_step5_desc:  { section: "process", key: "step5_desc" },
  catalog_label:       { section: "catalog", key: "label" },
  catalog_heading:     { section: "catalog", key: "heading" },
  catalog_heading_th:  { section: "catalog", key: "heading_th" },
  catalog_description: { section: "catalog", key: "description" },
  catalog_quote:       { section: "catalog", key: "quote" },
  catalog_btn1_text:   { section: "catalog", key: "btn1_text" },
  catalog_btn2_text:   { section: "catalog", key: "btn2_text" },
  catalog_styles:      { section: "catalog", key: "_styles" },
  stats_styles:        { section: "stats",   key: "_styles" },
  process_styles:      { section: "process", key: "_styles" },
  marquee_styles:      { section: "marquee", key: "_styles" },
};

const SECTION_FIELDS: Record<string, string[]> = {
  stats: ["stat1_number", "stat1_label", "stat2_number", "stat2_label", "stat3_number", "stat3_label", "stats_styles"],
  marquee: ["marquee_items", "marquee_styles"],
  process: [
    "process_heading", "process_subheading",
    "process_step1_title", "process_step1_desc",
    "process_step2_title", "process_step2_desc",
    "process_step3_title", "process_step3_desc",
    "process_step4_title", "process_step4_desc",
    "process_step5_title", "process_step5_desc",
    "process_styles",
  ],
  catalog: [
    "catalog_label", "catalog_heading", "catalog_heading_th",
    "catalog_description", "catalog_quote",
    "catalog_btn1_text", "catalog_btn2_text",
    "catalog_styles",
  ],
};

/* ── section registry ─────────────────────────────────────── */
const SECTIONS = [
  { id: "stats",   label: "Stat Badges",         icon: "ti-chart-bar",   fieldCount: 8,  hasVisibility: true,  desc: "Three statistics shown below the hero slides" },
  { id: "marquee", label: "Marquee Ticker",      icon: "ti-arrow-right", fieldCount: 3,  hasVisibility: true,  desc: "Scrolling text ticker across the page" },
  { id: "process", label: "Production Process", icon: "ti-list-check",  fieldCount: 21, hasVisibility: true,  desc: "Step-by-step production process with 5 stages" },
  { id: "catalog", label: "Catalog Section",    icon: "ti-layout-grid", fieldCount: 14, hasVisibility: false, desc: "Heading, description, and buttons for the catalog area" },
];

/* ── sub-components ───────────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      title={on ? "Visible — click to hide" : "Hidden — click to show"}
      style={{
        width: 36, height: 20, borderRadius: 10,
        background: on ? "#0D1E3D" : "#E8E6E0",
        position: "relative", border: "none", cursor: "pointer",
        transition: "background 0.2s ease", flexShrink: 0, padding: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3,
        left: on ? 19 : 3,
        width: 14, height: 14, borderRadius: "50%",
        background: on ? "#E8D5A3" : "#FFFFFF",
        transition: "left 0.2s ease", display: "block",
      }} />
    </button>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
  color: "#aaa", fontWeight: 500, display: "block", marginBottom: 5,
};

const inputBase: React.CSSProperties = {
  background: "#FFFFFF", border: "0.5px solid #E8E6E0",
  borderRadius: 7, padding: "7px 9px", fontSize: 12, color: "#333",
  width: "100%", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

function Field({
  label, value, onChange, multiline = false, placeholder = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          value={value} rows={3} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className="ce-input"
          style={{ ...inputBase, resize: "vertical" }}
        />
      ) : (
        <input
          type="text" value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className="ce-input"
          style={inputBase}
        />
      )}
    </div>
  );
}

/* ── compute initial fields ─────────────────────────────── */
function computeFields(content: ContentRow[]): Record<string, string> {
  return {
    stat1_number:        getVal(content, "stats",   "stat1_number", "3,000+"),
    stat1_label:         getVal(content, "stats",   "stat1_label",  "CLIENTS"),
    stat2_number:        getVal(content, "stats",   "stat2_number", "50,000+"),
    stat2_label:         getVal(content, "stats",   "stat2_label",  "PROJECTS"),
    stat3_number:        getVal(content, "stats",   "stat3_number", "30+"),
    stat3_label:         getVal(content, "stats",   "stat3_label",  "COUNTRIES"),
    marquee_items:       getVal(content, "marquee", "items",        "PREMIUM GIFTS,CORPORATE SOUVENIRS,NEW YEAR PACKAGES,OEM MANUFACTURING,CUSTOM BRANDING,30+ COUNTRIES"),
    process_heading:     getVal(content, "process", "heading",      "Our Process"),
    process_subheading:  getVal(content, "process", "subheading",   "From brief to delivery — every step crafted with care"),
    process_step1_title: getVal(content, "process", "step1_title",  "Brief"),
    process_step1_desc:  getVal(content, "process", "step1_desc",   "Share your vision"),
    process_step2_title: getVal(content, "process", "step2_title",  "Design"),
    process_step2_desc:  getVal(content, "process", "step2_desc",   "Our team creates concepts"),
    process_step3_title: getVal(content, "process", "step3_title",  "Produce"),
    process_step3_desc:  getVal(content, "process", "step3_desc",   "Manufacturing begins"),
    process_step4_title: getVal(content, "process", "step4_title",  "QC"),
    process_step4_desc:  getVal(content, "process", "step4_desc",   "Strict quality inspection"),
    process_step5_title: getVal(content, "process", "step5_title",  "Deliver"),
    process_step5_desc:  getVal(content, "process", "step5_desc",   "Worldwide shipping"),
    catalog_label:       getVal(content, "catalog", "label",        "PRODUCT CATALOG"),
    catalog_heading:     getVal(content, "catalog", "heading",      "Our Collection"),
    catalog_heading_th:  getVal(content, "catalog", "heading_th",   "คอลเลกชันสินค้าพรีเมียมของเรา"),
    catalog_description: getVal(content, "catalog", "description",  "Explore our full range of premium gifts, corporate souvenirs, and branded merchandise."),
    catalog_quote:       getVal(content, "catalog", "quote",        '"Quality is not an act, it is a habit. Every product we deliver carries our promise."'),
    catalog_btn1_text:   getVal(content, "catalog", "btn1_text",    "Browse All"),
    catalog_btn2_text:   getVal(content, "catalog", "btn2_text",    "Filter"),
    catalog_styles:      getVal(content, "catalog", "_styles",      "{}"),
    stats_styles:        getVal(content, "stats",   "_styles",      "{}"),
    process_styles:      getVal(content, "process", "_styles",      "{}"),
    marquee_styles:      getVal(content, "marquee", "_styles",      "{}"),
  };
}

/* ── main component ───────────────────────────────────────── */
export default function ContentEditorClient({
  initialContent, categories, tags, productCounts, tagCounts,
}: {
  initialContent: ContentRow[];
  categories: Category[];
  tags: Tag[];
  productCounts: Record<string, number>;
  tagCounts: Record<string, number>;
}) {
  type PageTab = "home" | "catalog" | "about" | "services" | "our-work" | "contact" | "branding";
  const [activeTab, setActiveTab] = useState<PageTab>("home");
  const [activeSection, setActiveSection] = useState("stats");

  /* visibility state */
  const [vis, setVis] = useState<Record<string, boolean>>({
    stats:   getVisible(initialContent, "stats"),
    marquee: getVisible(initialContent, "marquee"),
    process: getVisible(initialContent, "process"),
  });

  /* flat field values */
  const [fields, setFields] = useState<Record<string, string>>(() => computeFields(initialContent));

  /* snapshot for Discard — updated after each successful save */
  const [initialFields, setInitialFields] = useState<Record<string, string>>(() => computeFields(initialContent));

  /* per-section dirty / saving / saved tracking */
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  function updateField(fieldKey: string, value: string, section: string) {
    setFields(p => ({ ...p, [fieldKey]: value }));
    setDirty(p => ({ ...p, [section]: true }));
    setSaved(p => ({ ...p, [section]: false }));
  }

  function makeStyleChangeHandler(fieldKey: string, section: string) {
    return (blockKey: string, overrides: BlockStyles | null) => {
      setFields(prev => {
        const current: Record<string, BlockStyles> = (() => {
          try { return JSON.parse(prev[fieldKey] || "{}"); } catch { return {}; }
        })();
        const next = { ...current };
        if (overrides === null) { delete next[blockKey]; } else { next[blockKey] = overrides; }
        return { ...prev, [fieldKey]: JSON.stringify(next) };
      });
      setDirty(p => ({ ...p, [section]: true }));
      setSaved(p => ({ ...p, [section]: false }));
    };
  }
  const handleCatalogStyleChange = makeStyleChangeHandler("catalog_styles", "catalog");
  const handleStatsStyleChange   = makeStyleChangeHandler("stats_styles",   "stats");
  const handleProcessStyleChange = makeStyleChangeHandler("process_styles", "process");
  const handleMarqueeStyleChange = makeStyleChangeHandler("marquee_styles", "marquee");

  async function saveSection(section: string) {
    const snapshot = { ...fields };
    setSaving(p => ({ ...p, [section]: true }));
    try {
      for (const fieldKey of SECTION_FIELDS[section]) {
        const { section: s, key } = FIELD_META[fieldKey];
        await saveContentField("home", s, key, snapshot[fieldKey]);
      }
      setDirty(p => ({ ...p, [section]: false }));
      setSaved(p => ({ ...p, [section]: true }));
      setInitialFields(p => {
        const updated = { ...p };
        for (const fieldKey of SECTION_FIELDS[section]) {
          updated[fieldKey] = snapshot[fieldKey];
        }
        return updated;
      });
      setTimeout(() => setSaved(p => ({ ...p, [section]: false })), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(p => ({ ...p, [section]: false }));
    }
  }

  function handleDiscard() {
    setFields(p => {
      const updated = { ...p };
      for (const fieldKey of SECTION_FIELDS[activeSection]) {
        updated[fieldKey] = initialFields[fieldKey];
      }
      return updated;
    });
    setDirty(p => ({ ...p, [activeSection]: false }));
    setSaved(p => ({ ...p, [activeSection]: false }));
  }

  async function toggleVisibility(section: string, value: boolean) {
    setVis(p => ({ ...p, [section]: value }));
    try {
      await saveVisibility("home", section, value);
    } catch (err) {
      console.error(err);
      setVis(p => ({ ...p, [section]: !value }));
      alert("Failed to save. Please try again.");
    }
  }

  /* render fields for the active section */
  function renderFields(section: string) {
    const u = (key: string, v: string) => updateField(key, v, section);

    if (section === "stats") {
      const statsStylesObj: Record<string, BlockStyles> = (() => {
        try { return JSON.parse(fields.stats_styles || "{}"); } catch { return {}; }
      })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {([1, 2, 3] as const).map(n => (
              <div key={n} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Stat {n}</p>
                <Field label="Number" value={fields[`stat${n}_number`]} placeholder={n === 1 ? "3,000+" : n === 2 ? "50,000+" : "30+"}
                  onChange={v => u(`stat${n}_number`, v)} />
                <Field label="Label" value={fields[`stat${n}_label`]} placeholder={n === 1 ? "CLIENTS" : n === 2 ? "PROJECTS" : "COUNTRIES"}
                  onChange={v => u(`stat${n}_label`, v)} />
              </div>
            ))}
          </div>
          <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 14 }}>
            <p style={{ ...labelStyle, marginBottom: 8 }}>Style overrides — shared across all 3 stats</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <StyleOverride blockKey="statNumber" label="Stat number" allStyles={statsStylesObj} onChange={handleStatsStyleChange}
                defaults={STATS_BLOCK_DEFAULTS.statNumber} fontSizeRange={STATS_FONT_SIZE_RANGES.statNumber} />
              <StyleOverride blockKey="statLabel" label="Stat label" allStyles={statsStylesObj} onChange={handleStatsStyleChange}
                defaults={STATS_BLOCK_DEFAULTS.statLabel} fontSizeRange={STATS_FONT_SIZE_RANGES.statLabel} />
            </div>
          </div>
        </div>
      );
    }

    if (section === "marquee") {
      const marqueeStylesObj: Record<string, BlockStyles> = (() => {
        try { return JSON.parse(fields.marquee_styles || "{}"); } catch { return {}; }
      })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <Field
              label="Items (comma-separated)"
              value={fields.marquee_items}
              multiline
              placeholder="PREMIUM GIFTS,CORPORATE SOUVENIRS,..."
              onChange={v => u("marquee_items", v)}
            />
            <p style={{ fontSize: 10, color: "#aaa", marginTop: 6 }}>Separate items with commas.</p>
          </div>
          <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 14 }}>
            <p style={{ ...labelStyle, marginBottom: 8 }}>Style overrides</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <StyleOverride blockKey="item" label="Item text" allStyles={marqueeStylesObj} onChange={handleMarqueeStyleChange}
                defaults={MARQUEE_BLOCK_DEFAULTS.item} fontSizeRange={MARQUEE_FONT_SIZE_RANGES.item} />
              <StyleOverride blockKey="diamond" label="Diamond separator" allStyles={marqueeStylesObj} onChange={handleMarqueeStyleChange}
                defaults={MARQUEE_BLOCK_DEFAULTS.diamond} withFontSize={false} />
            </div>
          </div>
        </div>
      );
    }

    if (section === "process") {
      const processStylesObj: Record<string, BlockStyles> = (() => {
        try { return JSON.parse(fields.process_styles || "{}"); } catch { return {}; }
      })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <Field label="Section Heading" value={fields.process_heading} onChange={v => u("process_heading", v)} />
              <StyleOverride blockKey="heading" label="Section heading" allStyles={processStylesObj} onChange={handleProcessStyleChange}
                defaults={PROCESS_BLOCK_DEFAULTS.heading} fontSizeRange={PROCESS_FONT_SIZE_RANGES.heading} />
            </div>
            <div>
              <Field label="Subheading" value={fields.process_subheading} onChange={v => u("process_subheading", v)} />
              <StyleOverride blockKey="subheading" label="Subheading" allStyles={processStylesObj} onChange={handleProcessStyleChange}
                defaults={PROCESS_BLOCK_DEFAULTS.subheading} fontSizeRange={PROCESS_FONT_SIZE_RANGES.subheading} />
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 12 }}>
            <p style={{ ...labelStyle, marginBottom: 8 }}>Step style overrides — shared across all 5 steps</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <StyleOverride blockKey="stepTitle" label="Step title" allStyles={processStylesObj} onChange={handleProcessStyleChange}
                defaults={PROCESS_BLOCK_DEFAULTS.stepTitle} fontSizeRange={PROCESS_FONT_SIZE_RANGES.stepTitle} />
              <StyleOverride blockKey="stepDesc" label="Step description" allStyles={processStylesObj} onChange={handleProcessStyleChange}
                defaults={PROCESS_BLOCK_DEFAULTS.stepDesc} fontSizeRange={PROCESS_FONT_SIZE_RANGES.stepDesc} />
              <StyleOverride blockKey="stepAccent" label="Active step accent" allStyles={processStylesObj} onChange={handleProcessStyleChange}
                defaults={PROCESS_BLOCK_DEFAULTS.stepAccent}
                withBackground withTextColor={false} withFontSize={false}
                backgroundLabel="Accent color (circle + line)" />
            </div>
          </div>
          <p style={{ ...labelStyle, marginBottom: 2, marginTop: 4 }}>Process Steps</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {([1, 2, 3, 4, 5] as const).map(n => (
              <div key={n} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label={`Step ${n} Title`}       value={fields[`process_step${n}_title`]} onChange={v => u(`process_step${n}_title`, v)} />
                <Field label={`Step ${n} Description`} value={fields[`process_step${n}_desc`]}  onChange={v => u(`process_step${n}_desc`, v)} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section === "catalog") {
      const catalogStylesObj: Record<string, BlockStyles> = (() => {
        try { return JSON.parse(fields.catalog_styles || "{}"); } catch { return {}; }
      })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <Field label="Section Label" value={fields.catalog_label} onChange={v => u("catalog_label", v)} />
              <StyleOverride blockKey="label" label="Section label" allStyles={catalogStylesObj} onChange={handleCatalogStyleChange}
                defaults={CATALOG_BLOCK_DEFAULTS.label} fontSizeRange={CATALOG_FONT_SIZE_RANGES.label} />
            </div>
            <div>
              <Field label="Heading (EN)" value={fields.catalog_heading} onChange={v => u("catalog_heading", v)} />
              <StyleOverride blockKey="heading" label="Heading" allStyles={catalogStylesObj} onChange={handleCatalogStyleChange}
                defaults={CATALOG_BLOCK_DEFAULTS.heading} fontSizeRange={CATALOG_FONT_SIZE_RANGES.heading} />
            </div>
          </div>
          <div>
            <Field label="Heading (TH)" value={fields.catalog_heading_th} onChange={v => u("catalog_heading_th", v)} />
            <StyleOverride blockKey="headingTh" label="Heading TH" allStyles={catalogStylesObj} onChange={handleCatalogStyleChange}
              defaults={CATALOG_BLOCK_DEFAULTS.headingTh} fontSizeRange={CATALOG_FONT_SIZE_RANGES.headingTh} />
          </div>
          <div>
            <Field label="Description" value={fields.catalog_description} multiline onChange={v => u("catalog_description", v)} />
            <StyleOverride blockKey="description" label="Description" allStyles={catalogStylesObj} onChange={handleCatalogStyleChange}
              defaults={CATALOG_BLOCK_DEFAULTS.description} fontSizeRange={CATALOG_FONT_SIZE_RANGES.description} />
          </div>
          <div>
            <Field label="Quote / Tagline" value={fields.catalog_quote} multiline onChange={v => u("catalog_quote", v)} />
            <StyleOverride blockKey="quote" label="Quote" allStyles={catalogStylesObj} onChange={handleCatalogStyleChange}
              defaults={CATALOG_BLOCK_DEFAULTS.quote} fontSizeRange={CATALOG_FONT_SIZE_RANGES.quote} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <Field label="Button 1 Text" value={fields.catalog_btn1_text} onChange={v => u("catalog_btn1_text", v)} />
              <StyleOverride blockKey="btn1" label="Primary button" allStyles={catalogStylesObj} onChange={handleCatalogStyleChange}
                defaults={CATALOG_BLOCK_DEFAULTS.btn1} fontSizeRange={CATALOG_FONT_SIZE_RANGES.btn1} withBackground />
            </div>
            <div>
              <Field label="Button 2 Text" value={fields.catalog_btn2_text} onChange={v => u("catalog_btn2_text", v)} />
              <StyleOverride blockKey="btn2" label="Secondary button" allStyles={catalogStylesObj} onChange={handleCatalogStyleChange}
                defaults={CATALOG_BLOCK_DEFAULTS.btn2} fontSizeRange={CATALOG_FONT_SIZE_RANGES.btn2} withBorderColor borderColorLabel="Border color" />
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  const PAGE_TABS: { label: string; key: PageTab; enabled: boolean }[] = [
    { label: "Home",     key: "home",     enabled: true  },
    { label: "Catalog",  key: "catalog",  enabled: true  },
    { label: "About",    key: "about",    enabled: true  },
    { label: "Services", key: "services", enabled: true  },
    { label: "Our Work", key: "our-work", enabled: true  },
    { label: "Contact",  key: "contact",  enabled: true  },
    { label: "Branding", key: "branding", enabled: true  },
  ];

  const PAGE_LABEL: Record<string, string> = {
    home: "Home page", catalog: "Catalog page", about: "About page",
    services: "Services page", "our-work": "Our Work page", contact: "Contact page",
    branding: "Branding & Logo",
  };
  const activeSec = SECTIONS.find(s => s.id === activeSection)!;
  const showSaveBar = activeTab === "home" && !!dirty[activeSection];

  return (
    <>
      <style>{`
        .ce-input:focus {
          border-color: #0D1E3D !important;
          box-shadow: 0 0 0 2px rgba(13,30,61,0.08) !important;
          outline: none !important;
        }
      `}</style>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Content</h1>
        <span style={{
          fontSize: 11, fontWeight: 500, color: "#888",
          background: "#F5F3F0", border: "0.5px solid #E8E6E0",
          borderRadius: 99, padding: "3px 10px",
        }}>
          {PAGE_LABEL[activeTab] ?? activeTab}
        </span>
      </div>

      {/* Page tabs */}
      <div style={{
        display: "inline-flex", gap: 4, marginBottom: 20,
        background: "#F0EDE6", borderRadius: 9, padding: 4,
      }}>
        {PAGE_TABS.map(tab => {
          const isActive = tab.enabled && activeTab === tab.key;
          return (
            <button
              key={tab.label}
              disabled={!tab.enabled}
              onClick={() => { if (tab.enabled) setActiveTab(tab.key); }}
              style={{
                padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                border: isActive ? "0.5px solid #E8E6E0" : "0.5px solid transparent",
                background: isActive ? "#FFFFFF" : "transparent",
                color: isActive ? "#1a1a1a" : "#7a6e5f",
                cursor: tab.enabled ? "pointer" : "not-allowed",
                opacity: tab.enabled ? 1 : 0.4,
              }}
            >
              {tab.label}{!tab.enabled && " (soon)"}
            </button>
          );
        })}
      </div>

      {/* Catalog tab */}
      {activeTab === "catalog" && (
        <>
          <CategoryManager initialCategories={categories} productCounts={productCounts} />
          <TagManager initialTags={tags} productCounts={tagCounts} />
        </>
      )}

      {/* Page editors — lazy-load from Supabase on mount */}
      {activeTab === "about"    && <AboutEditor />}
      {activeTab === "services" && <ServicesEditor />}
      {activeTab === "our-work" && <OurWorkEditor />}
      {activeTab === "contact"  && <ContactEditor />}
      {activeTab === "branding" && <BrandingEditor />}

      {/* Home tab — split panel */}
      {activeTab === "home" && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0, paddingBottom: showSaveBar ? 72 : 0 }}>

          {/* Left panel — section list */}
          <div style={{
            width: 195, flexShrink: 0,
            background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 10,
            overflow: "hidden", position: "sticky", top: 78,
            maxHeight: "calc(100vh - 160px)", overflowY: "auto",
          }}>
            <div style={{
              padding: "10px 14px", borderBottom: "0.5px solid #E8E6E0",
              fontSize: 10, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.07em", color: "#aaa",
            }}>
              Sections
            </div>
            {SECTIONS.map(sec => {
              const isActive = sec.id === activeSection;
              const hasDot = sec.hasVisibility;
              const dotColor = hasDot
                ? vis[sec.id] ? "#3B6D11" : "#D97706"
                : null;

              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  style={{
                    padding: "11px 14px",
                    display: "flex", alignItems: "center", gap: 9,
                    cursor: "pointer",
                    borderLeft: `3px solid ${isActive ? "#0D1E3D" : "transparent"}`,
                    background: isActive ? "#EEF1F8" : "transparent",
                    transition: "background 0.12s",
                    borderBottom: "0.5px solid #F2F1EE",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "#F5F4F1";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                >
                  <i
                    className={`ti ${sec.icon}`}
                    style={{ fontSize: 14, color: isActive ? "#0D1E3D" : "#999", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: isActive ? "#0D1E3D" : "#333", lineHeight: 1.3 }}>
                      {sec.label}
                    </div>
                    <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>
                      {sec.fieldCount} fields
                    </div>
                  </div>
                  {/* Status dot */}
                  {hasDot ? (
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor!, flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 7, height: 7, borderRadius: "50%", border: "1.5px solid #C0BDB7", flexShrink: 0 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right panel — section editor */}
          <div style={{ flex: 1, paddingLeft: 20 }}>
            {/* Section header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 14,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: "#EEF1F8", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={`ti ${activeSec.icon}`} style={{ fontSize: 16, color: "#0D1E3D" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{activeSec.label}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{activeSec.desc}</div>
                </div>
              </div>
              {activeSec.hasVisibility && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#888" }}>
                    {vis[activeSection] ? "Visible" : "Hidden"}
                  </span>
                  <Toggle
                    on={!!vis[activeSection]}
                    onChange={v => toggleVisibility(activeSection, v)}
                  />
                </div>
              )}
            </div>

            {/* Fields card */}
            <div style={{
              background: "#FFFFFF", border: "0.5px solid #E8E6E0",
              borderRadius: 10, padding: 20,
            }}>
              {renderFields(activeSection)}
            </div>
          </div>
        </div>
      )}

      {/* Sticky save bar */}
      {showSaveBar && (
        <div style={{
          position: "fixed", bottom: 0, left: 220, right: 0,
          background: "#FFFFFF", borderTop: "0.5px solid #E8E6E0",
          padding: "12px 28px", display: "flex",
          alignItems: "center", justifyContent: "space-between", zIndex: 20,
        }}>
          <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: 13, color: "#D97706" }} />
            Unsaved changes in {activeSec.label}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={handleDiscard}
              style={{
                padding: "8px 16px", background: "#FFFFFF",
                border: "0.5px solid #D8D5CE", color: "#555",
                borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer",
              }}
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => saveSection(activeSection)}
              disabled={!!saving[activeSection]}
              style={{
                padding: "8px 20px", background: "#0D1E3D", color: "#E8D5A3",
                border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600,
                cursor: saving[activeSection] ? "wait" : "pointer",
                opacity: saving[activeSection] ? 0.6 : 1,
                display: "flex", alignItems: "center", gap: 7,
              }}
            >
              {saving[activeSection] && (
                <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 13 }} />
              )}
              {saving[activeSection] ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
