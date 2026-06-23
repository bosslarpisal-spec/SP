"use client";
import React, { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { usePageEditor } from "@/app/admin/lib/usePageEditor";
import { Repeater } from "@/app/admin/components/Repeater";
import type { RepField } from "@/app/admin/components/Repeater";
import { th } from "@/app/admin/lib/admin-th";
import { StyleOverride, type BlockStyles } from "@/app/admin/components/StyleOverride";

/* ── schema ─────────────────────────────────────────────────── */
const FIELD_META: Record<string, { section: string; key: string }> = {
  hero_badge:              { section: "hero",       key: "badge" },
  hero_heading:            { section: "hero",       key: "heading" },
  hero_heading_italic:     { section: "hero",       key: "heading_italic" },
  hero_subtext_th:         { section: "hero",       key: "subtext_th" },
  hero_description:        { section: "hero",       key: "description" },
  story_badge:             { section: "story",      key: "badge" },
  story_heading:           { section: "story",      key: "heading" },
  story_heading_italic:    { section: "story",      key: "heading_italic" },
  story_para1:             { section: "story",      key: "para1" },
  story_para2:             { section: "story",      key: "para2" },
  story_para1_th:          { section: "story",      key: "para1_th" },
  story_para2_th:          { section: "story",      key: "para2_th" },
  story_checklist_label:   { section: "story",      key: "checklist_label" },
  story_checklist_label_th:{ section: "story",      key: "checklist_label_th" },
  story_checklist:         { section: "story",      key: "checklist" },
  story_team_photo:        { section: "story",      key: "team_photo_url" },
  story_team_caption:      { section: "story",      key: "team_photo_caption" },
  about_stats:             { section: "stats",      key: "items" },
  milestones:              { section: "milestones", key: "items" },
  milestones_photo:        { section: "milestones", key: "history_photo_url" },
  milestones_caption:      { section: "milestones", key: "history_photo_caption" },
  quote_label:             { section: "quote",      key: "label" },
  quote_text:              { section: "quote",      key: "text" },
  quote_text_th:           { section: "quote",      key: "text_th" },
  quote_attribution:       { section: "quote",      key: "attribution" },
  hero_styles:             { section: "hero",       key: "_styles" },
  story_styles:            { section: "story",      key: "_styles" },
  quote_styles:            { section: "quote",      key: "_styles" },
};

const SECTION_FIELDS: Record<string, string[]> = {
  hero:        ["hero_badge", "hero_heading", "hero_heading_italic", "hero_subtext_th", "hero_description", "hero_styles"],
  story:       ["story_badge", "story_heading", "story_heading_italic", "story_para1", "story_para1_th", "story_para2", "story_para2_th", "story_checklist_label", "story_checklist_label_th", "story_checklist", "story_team_photo", "story_team_caption", "story_styles"],
  about_stats: ["about_stats"],
  milestones:  ["milestones", "milestones_photo", "milestones_caption"],
  quote:       ["quote_label", "quote_text", "quote_text_th", "quote_attribution", "quote_styles"],
};

const DEFAULTS: Record<string, string> = {
  hero_badge:            "Our Story",
  hero_heading:          "Crafting Moments That",
  hero_heading_italic:   "Last a Lifetime",
  hero_subtext_th:       "ผู้เชี่ยวชาญด้านของพรีเมียมและโปรโมชันครบวงจร",
  hero_description:      "Since 2003, SP has partnered with leading brands across Thailand and beyond — designing, producing, and delivering premium gifts that carry meaning far beyond their moment of giving.",
  story_badge:           "About SP",
  story_heading:         "Thailand's Trusted Partner in",
  story_heading_italic:  "Premium Merchandise",
  story_para1:           "Founded in Bangkok in 2003, SP began as a small creative studio with one goal: to make branded gifting feel personal. Two decades later, we operate as a full-service premium goods partner — from concept and design through OEM manufacturing and global logistics.",
  story_para1_th:        "ก่อตั้งในกรุงเทพฯ ปี 2546 SP เริ่มต้นเป็นสตูดิโอสร้างสรรค์ขนาดเล็กที่มีเป้าหมายเดียว: ทำให้ของขวัญแบรนด์รู้สึกเป็นส่วนตัว สองทศวรรษต่อมา เราดำเนินงานเป็นพาร์ทเนอร์ด้านสินค้าพรีเมียมครบวงจร — ตั้งแต่แนวคิดและการออกแบบ ผ่านการผลิต OEM จนถึงโลจิสติกส์ระดับโลก",
  story_para2:           "We work directly with procurement and marketing teams at companies like P&G, Acer, Oral-B, and SCB Bank — delivering products that reflect each brand's identity at every touchpoint.",
  story_para2_th:        "เราทำงานโดยตรงกับทีมจัดซื้อและการตลาดของบริษัทชั้นนำอย่าง P&G, Acer, Oral-B และ SCB Bank — ส่งมอบสินค้าที่สะท้อนอัตลักษณ์ของแต่ละแบรนด์ในทุกจุดสัมผัส",
  story_checklist_label: "Why clients choose SP",
  story_checklist_label_th: "เหตุผลที่ลูกค้าเลือก SP",
  story_checklist:       JSON.stringify(["20+ years delivering premium merchandise","Custom design team on every project","100% quality guarantee on all orders","Nationwide & international shipping"]),
  story_team_photo:      "",
  story_team_caption:    "Our Team & Workshop",
  about_stats:           JSON.stringify([{value:"25",suffix:"+",label:"Years",bg:"25+"},{value:"3000",suffix:"+",label:"Clients",bg:"3K+"},{value:"50000",suffix:"+",label:"Projects",bg:"50K"},{value:"30",suffix:"+",label:"Countries",bg:"30+"}]),
  milestones:            JSON.stringify([{yr:"03",year:"2003",text:"Founded in Bangkok with a vision to redefine corporate gifting in Thailand.",active:false},{yr:"08",year:"2008",text:"Expanded OEM manufacturing capabilities and opened first dedicated production facility.",active:false},{yr:"12",year:"2012",text:"Surpassed 1,000+ clients across FMCG, finance, and technology sectors.",active:false},{yr:"18",year:"2018",text:"Launched Eco-Premium line — sustainable materials with zero compromise on quality.",active:true},{yr:"24",year:"2024",text:"3,000+ clients in 30+ countries. Celebrating 20+ years of premium excellence.",active:true}]),
  milestones_photo:      "",
  milestones_caption:    "Bangkok, 2003",
  quote_label:           "Our Philosophy",
  quote_text:            "Every gift we create carries a brand's promise. Our job is to make sure that promise is felt — not just seen.",
  quote_text_th:         "ทุกของขวัญที่เราสร้างสรรค์บรรจุคำมั่นของแบรนด์ งานของเราคือทำให้คำมั่นนั้นถูกรับรู้ ไม่ใช่แค่มองเห็น",
  quote_attribution:     "SP Creative & Production Team",
  hero_styles:           "{}",
  story_styles:          "{}",
  quote_styles:          "{}",
};

const SECTIONS = [
  { id: "hero",        label: th.aboutSecHero,       icon: "ti-sparkles",  fieldCount: 5,  desc: th.aboutSecHeroDesc },
  { id: "story",       label: th.aboutSecStory,      icon: "ti-book",      fieldCount: 9,  desc: th.aboutSecStoryDesc },
  { id: "about_stats", label: th.aboutSecStats,      icon: "ti-chart-bar", fieldCount: 1,  desc: th.aboutSecStatsDesc },
  { id: "milestones",  label: th.aboutSecMilestones, icon: "ti-timeline",  fieldCount: 3,  desc: th.aboutSecMilDesc },
  { id: "quote",       label: th.aboutSecQuote,      icon: "ti-quote",     fieldCount: 3,  desc: th.aboutSecQuoteDesc },
];

/* ── repeater field defs ─────────────────────────────────────── */
const STAT_FIELDS: RepField[] = [
  { key: "value",    label: th.aboutStatsCount,   type: "text", span: "half", maxLength: 7  },
  { key: "suffix",   label: th.aboutStatsSuffix,  type: "text", span: "half", maxLength: 3  },
  { key: "label",    label: th.aboutStatsLabelEn, type: "text", span: "half", maxLength: 20 },
  { key: "label_th", label: th.aboutStatsLabelTh, type: "text", span: "half", maxLength: 20 },
  // "bg" field removed — ghost number is now auto-derived from value+suffix
];
const MILESTONE_FIELDS: RepField[] = [
  { key: "yr",      label: th.aboutMilYrShort, type: "text",     span: "half" },
  { key: "year",    label: th.aboutMilYrFull,  type: "text",     span: "half" },
  { key: "text",    label: th.aboutMilTextEn,  type: "textarea", rows: 2 },
  { key: "text_th", label: th.aboutMilTextTh,  type: "textarea", rows: 2 },
  { key: "active",  label: th.aboutMilActive,  type: "checkbox" },
];
const CHECKLIST_FIELDS: RepField[] = [
  { key: "text", label: th.aboutChecklistItem, type: "text" },
];

/* ── style defaults ──────────────────────────────────────────── */
const HERO_STYLE_DEF: Record<string, BlockStyles> = {
  badge:         { color: "#E8D5A3", fontSize: "10px" },
  heading:       { color: "#FFFFFF", fontSize: "40px" },
  headingItalic: { color: "#E8D5A3", fontSize: "40px" },
  description:   { color: "rgba(255,255,255,0.9)", fontSize: "14px" },
};
const HERO_STYLE_RANGE: Record<string, { min: number; max: number }> = {
  badge:         { min: 8,  max: 14 },
  heading:       { min: 24, max: 56 },
  headingItalic: { min: 24, max: 56 },
  description:   { min: 11, max: 18 },
};
const STORY_STYLE_DEF: Record<string, BlockStyles> = {
  badge:          { color: "#8A6E00",  fontSize: "11px" },
  heading:        { color: "#0D1E3D",  fontSize: "22px" },
  headingItalic:  { color: "#8A6E00",  fontSize: "22px" },
  body:           { color: "#2C3E50",  fontSize: "13px" },
  checklistLabel: { color: "#4A5568",  fontSize: "11px" },
};
const STORY_STYLE_RANGE: Record<string, { min: number; max: number }> = {
  badge:          { min: 8,  max: 14 },
  heading:        { min: 14, max: 32 },
  headingItalic:  { min: 14, max: 32 },
  body:           { min: 11, max: 18 },
  checklistLabel: { min: 9,  max: 14 },
};
const QUOTE_STYLE_DEF: Record<string, BlockStyles> = {
  label:       { color: "#F0DC9A",               fontSize: "11px" },
  quoteText:   { color: "#FFFFFF",               fontSize: "26px" },
  attribution: { color: "rgba(255,255,255,0.75)", fontSize: "10px" },
};
const QUOTE_STYLE_RANGE: Record<string, { min: number; max: number }> = {
  label:       { min: 8,  max: 14 },
  quoteText:   { min: 16, max: 36 },
  attribution: { min: 8,  max: 14 },
};

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
        ? <textarea value={value} rows={3} placeholder={placeholder} onChange={e => onChange(e.target.value)}
            style={{ ...iBase, resize: "vertical", ...(over ? { borderColor: "#F09595" } : {}) }} />
        : <input type="text" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
            style={{ ...iBase, ...(over ? { borderColor: "#F09595" } : {}) }} />
      }
    </div>
  );
}

/* ── image upload widget ─────────────────────────────────────── */
function ImageUpload({ label, currentUrl, storagePath, aspectRatio = "3/4", onUpload }: {
  label: string;
  currentUrl: string;
  storagePath: string; // e.g. "about/team"
  aspectRatio?: string;
  onUpload: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > 10 * 1024 * 1024) { alert(th.imgErrSize); return; }
    setUploading(true);
    const ext  = file.name.split(".").pop() ?? "jpg";
    const path = `${storagePath}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from("page-images").upload(path, file, { upsert: true });
    if (error) { alert(th.imgErrUpload(error.message)); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("page-images").getPublicUrl(data.path);
    onUpload(publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <label style={lSt}>{label}</label>

      {/* Preview */}
      <div style={{
        width: "100%", maxWidth: 200, aspectRatio,
        borderRadius: 8, overflow: "hidden",
        border: "0.5px solid #E8E6E0",
        background: "#1C2951",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 8, flexDirection: "column", gap: 6,
      }}>
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <>
            <i className="ti ti-photo" style={{ fontSize: 22, color: "rgba(232,213,163,0.35)" }} />
            <span style={{ fontSize: 9, color: "rgba(232,213,163,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{th.imgNoImage}</span>
          </>
        )}
      </div>

      {/* Controls */}
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp"
        style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#1C2951", color: "#E8D5A3", border: "none", cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.6 : 1 }}>
          {uploading ? th.imgUploading : currentUrl ? th.imgReplace : th.imgUpload}
        </button>
        {currentUrl && !uploading && (
          <button type="button" onClick={() => onUpload("")}
            style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, background: "transparent", color: "#888", border: "0.5px solid #D8D5CE", cursor: "pointer" }}>
            {th.imgRemove}
          </button>
        )}
      </div>
      <p style={{ fontSize: 10, color: "#bbb", marginTop: 6 }}>{th.imgHint}</p>
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
  const handleHeroStyle  = makeStyleChange("hero_styles",  "hero");
  const handleStoryStyle = makeStyleChange("story_styles", "story");
  const handleQuoteStyle = makeStyleChange("quote_styles", "quote");

  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#888", fontSize: 13, padding: "40px 0" }}>
        <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} /> {th.aboutLoading}
      </div>
    );
  }

  const activeSec   = SECTIONS.find(s => s.id === activeSection)!;
  const showSaveBar = !!dirty[activeSection];

  function renderSection() {
    if (activeSection === "hero") {
      const heroSt: Record<string, BlockStyles> = (() => { try { return JSON.parse(fields.hero_styles || "{}"); } catch { return {}; } })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <CF label={th.aboutHeroBadge} value={fields.hero_badge} onChange={v => u("hero_badge", v)} placeholder="Our Story" max={40} />
            <StyleOverride blockKey="badge" label="Badge" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.badge} fontSizeRange={HERO_STYLE_RANGE.badge} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <CF label={th.aboutHeroHead} value={fields.hero_heading} onChange={v => u("hero_heading", v)} max={55} />
              <StyleOverride blockKey="heading" label="Heading" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.heading} fontSizeRange={HERO_STYLE_RANGE.heading} />
            </div>
            <div>
              <CF label={th.aboutHeroHeadIt} value={fields.hero_heading_italic} onChange={v => u("hero_heading_italic", v)} max={55} />
              <StyleOverride blockKey="headingItalic" label="Heading italic" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.headingItalic} fontSizeRange={HERO_STYLE_RANGE.headingItalic} />
            </div>
          </div>
          <CF label={th.aboutHeroSubtext} value={fields.hero_subtext_th} onChange={v => u("hero_subtext_th", v)} max={80} />
          <div>
            <CF label={th.aboutHeroDesc} value={fields.hero_description} multiline onChange={v => u("hero_description", v)} max={220} />
            <StyleOverride blockKey="description" label="Description" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.description} fontSizeRange={HERO_STYLE_RANGE.description} />
          </div>
        </div>
      );
    }

    if (activeSection === "story") {
      const checklistArr = arrField("story_checklist").map(i => ({ text: String(i.text ?? i ?? "") }));
      const storySt: Record<string, BlockStyles> = (() => { try { return JSON.parse(fields.story_styles || "{}"); } catch { return {}; } })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <CF label={th.aboutStoryBadge} value={fields.story_badge} onChange={v => u("story_badge", v)} max={40} />
              <StyleOverride blockKey="badge" label="Badge" allStyles={storySt} onChange={handleStoryStyle} defaults={STORY_STYLE_DEF.badge} fontSizeRange={STORY_STYLE_RANGE.badge} />
            </div>
            <div>
              <CF label={th.aboutStoryClLabelEn} value={fields.story_checklist_label} onChange={v => u("story_checklist_label", v)} max={50} />
              <StyleOverride blockKey="checklistLabel" label="Checklist label" allStyles={storySt} onChange={handleStoryStyle} defaults={STORY_STYLE_DEF.checklistLabel} fontSizeRange={STORY_STYLE_RANGE.checklistLabel} />
            </div>
            <CF label={th.aboutStoryClLabelTh} value={fields.story_checklist_label_th} onChange={v => u("story_checklist_label_th", v)} max={50} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <CF label={th.aboutStoryHead} value={fields.story_heading} onChange={v => u("story_heading", v)} max={55} />
              <StyleOverride blockKey="heading" label="Heading" allStyles={storySt} onChange={handleStoryStyle} defaults={STORY_STYLE_DEF.heading} fontSizeRange={STORY_STYLE_RANGE.heading} />
            </div>
            <div>
              <CF label={th.aboutStoryHeadIt} value={fields.story_heading_italic} onChange={v => u("story_heading_italic", v)} max={55} />
              <StyleOverride blockKey="headingItalic" label="Heading italic" allStyles={storySt} onChange={handleStoryStyle} defaults={STORY_STYLE_DEF.headingItalic} fontSizeRange={STORY_STYLE_RANGE.headingItalic} />
            </div>
          </div>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <CF label={th.aboutStoryP1En} value={fields.story_para1} multiline onChange={v => u("story_para1", v)} max={500} />
              <CF label={th.aboutStoryP1Th} value={fields.story_para1_th} multiline onChange={v => u("story_para1_th", v)} max={500} />
            </div>
            <StyleOverride blockKey="body" label="Body text" allStyles={storySt} onChange={handleStoryStyle} defaults={STORY_STYLE_DEF.body} fontSizeRange={STORY_STYLE_RANGE.body} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <CF label={th.aboutStoryP2En} value={fields.story_para2} multiline onChange={v => u("story_para2", v)} max={350} />
            <CF label={th.aboutStoryP2Th} value={fields.story_para2_th} multiline onChange={v => u("story_para2_th", v)} max={350} />
          </div>
          <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 12 }}>
            <p style={{ ...lSt, marginBottom: 8 }}>{th.aboutStoryChecklist}</p>
            <Repeater
              items={checklistArr}
              onChange={arr => {
                const raw = arr.map(i => String(i.text));
                setArr("story_checklist", raw.map(t => ({ text: t })));
              }}
              fields={CHECKLIST_FIELDS}
              defaultItem={{ text: "" }}
              maxItems={12}
            />
          </div>
          <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 12, display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start" }}>
            <ImageUpload
              label={th.aboutStoryPhoto}
              currentUrl={fields.story_team_photo ?? ""}
              storagePath="about/team"
              aspectRatio="3/4"
              onUpload={url => u("story_team_photo", url)}
            />
            <CF label={th.aboutStoryCaption} value={fields.story_team_caption} onChange={v => u("story_team_caption", v)} placeholder="Our Team & Workshop" max={60} />
          </div>
        </div>
      );
    }

    if (activeSection === "about_stats") return (
      <div>
        <p style={{ ...lSt, marginBottom: 8 }}>{th.aboutStatsNote}</p>
        <Repeater
          items={arrField("about_stats")}
          onChange={arr => setArr("about_stats", arr)}
          fields={STAT_FIELDS}
          defaultItem={{ value: "", suffix: "+", label: "", label_th: "" }}
          addLabel={th.aboutStatsAdd}
          maxItems={5}
        />
        <p style={{ fontSize: 10, color: "#aaa", marginTop: 8 }}>{th.aboutStatsHint}</p>
      </div>
    );

    if (activeSection === "milestones") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <p style={{ ...lSt, marginBottom: 8 }}>{th.aboutMilNote}</p>
          <Repeater
            items={arrField("milestones")}
            onChange={arr => setArr("milestones", arr)}
            fields={MILESTONE_FIELDS}
            defaultItem={{ yr: "00", year: "2000", text: "", text_th: "", active: false }}
            addLabel={th.aboutMilAdd}
            maxItems={20}
          />
        </div>
        <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 12, display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start" }}>
          <ImageUpload
            label={th.aboutMilPhoto}
            currentUrl={fields.milestones_photo ?? ""}
            storagePath="about/history"
            aspectRatio="4/3"
            onUpload={url => u("milestones_photo", url)}
          />
          <CF label={th.aboutMilCaption} value={fields.milestones_caption} onChange={v => u("milestones_caption", v)} placeholder="Bangkok, 2003" max={60} />
        </div>
      </div>
    );

    if (activeSection === "quote") {
      const quoteSt: Record<string, BlockStyles> = (() => { try { return JSON.parse(fields.quote_styles || "{}"); } catch { return {}; } })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <CF label={th.aboutQuoteLabel} value={fields.quote_label} onChange={v => u("quote_label", v)} placeholder="Our Philosophy" max={40} />
            <StyleOverride blockKey="label" label="Label" allStyles={quoteSt} onChange={handleQuoteStyle} defaults={QUOTE_STYLE_DEF.label} fontSizeRange={QUOTE_STYLE_RANGE.label} />
          </div>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <CF label={th.aboutQuoteTextEn} value={fields.quote_text} multiline onChange={v => u("quote_text", v)} max={250} />
              <CF label={th.aboutQuoteTextTh} value={fields.quote_text_th} multiline onChange={v => u("quote_text_th", v)} max={250} />
            </div>
            <StyleOverride blockKey="quoteText" label="Quote text" allStyles={quoteSt} onChange={handleQuoteStyle} defaults={QUOTE_STYLE_DEF.quoteText} fontSizeRange={QUOTE_STYLE_RANGE.quoteText} />
          </div>
          <div>
            <CF label={th.aboutQuoteAttr} value={fields.quote_attribution} onChange={v => u("quote_attribution", v)} max={60} />
            <StyleOverride blockKey="attribution" label="Attribution" allStyles={quoteSt} onChange={handleQuoteStyle} defaults={QUOTE_STYLE_DEF.attribution} fontSizeRange={QUOTE_STYLE_RANGE.attribution} />
          </div>
        </div>
      );
    }

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
                <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>{th.contentFields(sec.fieldCount)}</div>
              </div>
              {dirty[sec.id]                   && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />}
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
