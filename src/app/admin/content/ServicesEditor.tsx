"use client";
import React, { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { usePageEditor } from "@/app/admin/lib/usePageEditor";
import { Repeater } from "@/app/admin/components/Repeater";
import type { RepField } from "@/app/admin/components/Repeater";
import { th } from "@/app/admin/lib/admin-th";
import { StyleOverride, type BlockStyles } from "@/app/admin/components/StyleOverride";

/* ── Schema ───────────────────────────────────────────────── */
const FIELD_META: Record<string, { section: string; key: string }> = {
  hero_badge:          { section: "hero",     key: "badge" },
  hero_heading:        { section: "hero",     key: "heading" },
  hero_heading_italic: { section: "hero",     key: "heading_italic" },
  hero_subtext_th:     { section: "hero",     key: "subtext_th" },
  hero_description:    { section: "hero",     key: "description" },
  hero_styles:         { section: "hero",     key: "_styles" },
  services:            { section: "services", key: "items" },
  services_image1:     { section: "services", key: "image1_url" },
  services_image2:     { section: "services", key: "image2_url" },
  why_badge:           { section: "why",      key: "badge" },
  why_heading:         { section: "why",      key: "heading" },
  why_items:           { section: "why",      key: "items" },
  why_styles:          { section: "why",      key: "_styles" },
  process_badge:       { section: "process",  key: "badge" },
  process_heading:     { section: "process",  key: "heading" },
  process_items:       { section: "process",  key: "items" },
  process_styles:      { section: "process",  key: "_styles" },
};

const SECTION_FIELDS: Record<string, string[]> = {
  hero:     ["hero_badge", "hero_heading", "hero_heading_italic", "hero_subtext_th", "hero_description", "hero_styles"],
  services: ["services", "services_image1", "services_image2"],
  why:      ["why_badge", "why_heading", "why_items", "why_styles"],
  process:  ["process_badge", "process_heading", "process_items", "process_styles"],
};

const DEFAULTS: Record<string, string> = {
  hero_badge:          "WHAT WE OFFER",
  hero_heading:        "Our Core",
  hero_heading_italic: "Services",
  hero_subtext_th:     "บริการหลักของเรา",
  hero_description:    "From concept to delivery, SP manages every step. Our in-house design team, manufacturing partners, and logistics network ensure your premium products arrive on time, every time.",
  hero_styles: JSON.stringify({}),
  services_image1: "",
  services_image2: "",
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
  why_styles: JSON.stringify({}),
  process_badge:   "HOW IT WORKS",
  process_heading: "Our Production Process",
  process_items: JSON.stringify([
    { n:"01", icon:"ti-message",  title:"Consultation",    desc:"We discuss your needs, target audience, and budget.", active:false },
    { n:"02", icon:"ti-pencil",   title:"Design & Sample", desc:"Our team creates designs and sends physical samples.", active:true  },
    { n:"03", icon:"ti-settings", title:"Production",      desc:"Full-scale manufacturing with quality control at every step.", active:false },
    { n:"04", icon:"ti-truck",    title:"Delivery",        desc:"On-time delivery worldwide with full tracking support.", active:false },
  ]),
  process_styles: JSON.stringify({}),
};

const SECTIONS = [
  { id: "hero",     label: th.svSecHero,     icon: "ti-sparkles",   fieldCount: 5, desc: th.svSecHeroDesc },
  { id: "services", label: th.svSecServices, icon: "ti-gift",       fieldCount: 1, desc: th.svSecServicesDesc },
  { id: "why",      label: th.svSecWhy,      icon: "ti-star",       fieldCount: 3, desc: th.svSecWhyDesc },
  { id: "process",  label: th.svSecProcess,  icon: "ti-list-check", fieldCount: 3, desc: th.svSecProcessDesc },
];

/* ── Style defaults ───────────────────────────────────────── */
const HERO_STYLE_DEF: Record<string, BlockStyles> = {
  badge:          { color: "#E8D5A3",                 fontSize: "10px" },
  heading:        { color: "#FFFFFF",                 fontSize: "42px" },
  headingItalic:  { color: "#E8D5A3",                 fontSize: "38px" },
  subtextTh:      { color: "rgba(255,255,255,0.45)",  fontSize: "12px" },
  description:    { color: "rgba(255,255,255,0.65)",  fontSize: "13px" },
};
const HERO_STYLE_RANGE: Record<string, { min: number; max: number }> = {
  badge:         { min: 8,  max: 14 },
  heading:       { min: 24, max: 60 },
  headingItalic: { min: 20, max: 56 },
  subtextTh:     { min: 10, max: 16 },
  description:   { min: 11, max: 18 },
};
const WHY_STYLE_DEF: Record<string, BlockStyles> = {
  badge:   { color: "#E8D5A3", fontSize: "10px" },
  heading: { color: "#FFFFFF", fontSize: "22px" },
};
const WHY_STYLE_RANGE: Record<string, { min: number; max: number }> = {
  badge:   { min: 8, max: 14 },
  heading: { min: 14, max: 32 },
};
const PROC_STYLE_DEF: Record<string, BlockStyles> = {
  badge:   { color: "#C9A84C", fontSize: "10px" },
  heading: { color: "#0D1E3D", fontSize: "20px" },
};
const PROC_STYLE_RANGE: Record<string, { min: number; max: number }> = {
  badge:   { min: 8, max: 14 },
  heading: { min: 14, max: 30 },
};

/* ── Repeater field defs ─────────────────────────────────── */
const SERVICE_FIELDS: RepField[] = [
  { key: "n",       label: th.svNum,       type: "text",     span: "half" },
  { key: "icon",    label: th.svIcon,      type: "text",     span: "half", placeholder: "ti-gift" },
  { key: "title",   label: th.svTitleEn,  type: "text",     maxLength: 50 },
  { key: "th",      label: th.svTitleTh,  type: "text",     maxLength: 50 },
  { key: "desc",    label: th.svDescEn,   type: "textarea", rows: 2, maxLength: 200 },
  { key: "desc_th", label: th.svDescTh,   type: "textarea", rows: 2, maxLength: 200 },
  { key: "feat",    label: th.svFeatured, type: "checkbox" },
];
const WHY_FIELDS: RepField[] = [
  { key: "n",        label: th.svWhyNum,     type: "text",     span: "half" },
  { key: "icon",     label: th.svWhyIcon,    type: "text",     span: "half", placeholder: "ti-star" },
  { key: "title",    label: th.svWhyTitleEn, type: "text",     maxLength: 50 },
  { key: "title_th", label: th.svWhyTitleTh, type: "text",     maxLength: 50 },
  { key: "desc",     label: th.svWhyDescEn,  type: "textarea", rows: 2, maxLength: 160 },
  { key: "desc_th",  label: th.svWhyDescTh,  type: "textarea", rows: 2, maxLength: 160 },
];
const PROCESS_FIELDS: RepField[] = [
  { key: "n",        label: th.svProcNum,     type: "text",     span: "half" },
  { key: "icon",     label: th.svProcIcon,    type: "text",     span: "half", placeholder: "ti-message" },
  { key: "title",    label: th.svProcTitleEn, type: "text",     maxLength: 50 },
  { key: "title_th", label: th.svProcTitleTh, type: "text",     maxLength: 50 },
  { key: "desc",     label: th.svProcDescEn,  type: "textarea", rows: 2, maxLength: 160 },
  { key: "desc_th",  label: th.svProcDescTh,  type: "textarea", rows: 2, maxLength: 160 },
  { key: "active",   label: th.svProcActive,  type: "checkbox" },
];

/* ── Input styles ─────────────────────────────────────────── */
const lSt: React.CSSProperties = { fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa", fontWeight: 500, display: "block", marginBottom: 5 };
const iBase: React.CSSProperties = { background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 7, padding: "7px 9px", fontSize: 12, color: "#333", width: "100%", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

/* ── ImageUpload ─────────────────────────────────────────── */
function ImageUpload({ label, currentUrl, storagePath, onUpload }: {
  label: string; currentUrl: string; storagePath: string; onUpload: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
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
      <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", border: "0.5px solid #E8E6E0", background: "#1C2951", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, flexDirection: "column", gap: 6 }}>
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onLoad={e => { const i = e.currentTarget; setDims({ w: i.naturalWidth, h: i.naturalHeight }); }} />
        ) : (
          <>
            <i className="ti ti-photo" style={{ fontSize: 22, color: "rgba(232,213,163,0.35)" }} />
            <span style={{ fontSize: 9, color: "rgba(232,213,163,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{th.imgNoImage}</span>
          </>
        )}
      </div>
      {currentUrl && dims && (
        <p style={{ fontSize: 10, color: "#888", margin: "0 0 6px", fontVariantNumeric: "tabular-nums" }}>
          {dims.w} × {dims.h} px
        </p>
      )}
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#1C2951", color: "#E8D5A3", border: "none", cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.6 : 1 }}>
          {uploading ? th.imgUploading : currentUrl ? th.imgReplace : th.imgUpload}
        </button>
        {currentUrl && !uploading && (
          <button type="button" onClick={() => { onUpload(""); setDims(null); }}
            style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, background: "transparent", color: "#888", border: "0.5px solid #D8D5CE", cursor: "pointer" }}>
            {th.imgRemove}
          </button>
        )}
      </div>
      <p style={{ fontSize: 10, color: "#bbb", marginTop: 6 }}>PNG, JPG, WEBP — max 10 MB · recommended 1200 × 800 px</p>
    </div>
  );
}

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
        ? <textarea value={value} rows={3} placeholder={placeholder} onChange={e => onChange(e.target.value)}
            style={{ ...iBase, resize: "vertical", ...(over ? { borderColor: "#F09595" } : {}) }} />
        : <input type="text" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
            style={{ ...iBase, ...(over ? { borderColor: "#F09595" } : {}) }} />
      }
    </div>
  );
}

/* ── Editor ───────────────────────────────────────────────── */
export default function ServicesEditor() {
  const [activeSection, setActiveSection] = useState("hero");

  const { loaded, fields, setFields, dirty, saving, saved, updateField, saveSection, discardSection } =
    usePageEditor("services", FIELD_META, SECTION_FIELDS, DEFAULTS);

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
  const handleHeroStyle    = makeStyleChange("hero_styles",    "hero");
  const handleWhyStyle     = makeStyleChange("why_styles",     "why");
  const handleProcessStyle = makeStyleChange("process_styles", "process");

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#888", fontSize: 13, padding: "40px 0" }}>
      <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} /> {th.servicesLoading}
    </div>
  );

  const activeSec   = SECTIONS.find(s => s.id === activeSection)!;
  const showSaveBar = !!dirty[activeSection];

  function renderSection() {

    if (activeSection === "hero") {
      const heroSt: Record<string, BlockStyles> = (() => { try { return JSON.parse(fields.hero_styles || "{}"); } catch { return {}; } })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <CF label={th.svHeroBadge} value={fields.hero_badge} onChange={v => u("hero_badge", v)} max={40} />
            <StyleOverride blockKey="badge" label="Badge" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.badge} fontSizeRange={HERO_STYLE_RANGE.badge} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <CF label={th.svHeroHead} value={fields.hero_heading} onChange={v => u("hero_heading", v)} max={55} />
              <StyleOverride blockKey="heading" label="Heading" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.heading} fontSizeRange={HERO_STYLE_RANGE.heading} />
            </div>
            <div>
              <CF label={th.svHeroHeadIt} value={fields.hero_heading_italic} onChange={v => u("hero_heading_italic", v)} max={55} />
              <StyleOverride blockKey="headingItalic" label="Heading italic" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.headingItalic} fontSizeRange={HERO_STYLE_RANGE.headingItalic} />
            </div>
          </div>
          <div>
            <CF label={th.svHeroSubtext} value={fields.hero_subtext_th} onChange={v => u("hero_subtext_th", v)} max={80} />
            <StyleOverride blockKey="subtextTh" label="Subtext TH" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.subtextTh} fontSizeRange={HERO_STYLE_RANGE.subtextTh} />
          </div>
          <div>
            <CF label={th.svHeroDesc} value={fields.hero_description} onChange={v => u("hero_description", v)} max={220} multiline />
            <StyleOverride blockKey="description" label="Description" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.description} fontSizeRange={HERO_STYLE_RANGE.description} />
          </div>
        </div>
      );
    }

    if (activeSection === "services") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Featured image slots */}
        <div style={{ background: "#F8F6F1", border: "0.5px solid #E8E6E0", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#0D1E3D", marginBottom: 12 }}>Featured panel images</div>
          <p style={{ fontSize: 11, color: "#888", marginBottom: 14, marginTop: 0, lineHeight: 1.6 }}>
            Row 1 (right panel, dark blue background) and Row 2 (left panel, cream background). When no image is set, the service icon is shown instead.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <ImageUpload
              label="Row 1 image (right of featured service)"
              currentUrl={fields.services_image1}
              storagePath="services/img1"
              onUpload={url => { setFields(p => ({ ...p, services_image1: url })); updateField("services_image1", url, "services"); }}
            />
            <ImageUpload
              label="Row 2 image (left of second service)"
              currentUrl={fields.services_image2}
              storagePath="services/img2"
              onUpload={url => { setFields(p => ({ ...p, services_image2: url })); updateField("services_image2", url, "services"); }}
            />
          </div>
        </div>

        {/* Service cards */}
        <div>
          <p style={{ ...lSt, marginBottom: 8 }}>{th.svCardsNote}</p>
          <Repeater key="services"
            items={arrField("services")}
            onChange={arr => setArr("services", arr)}
            fields={SERVICE_FIELDS}
            defaultItem={{ n:"07", feat:false, icon:"ti-star", title:"", th:"", desc:"" }}
            addLabel={th.svAddService}
            maxItems={6}
          />
        </div>
      </div>
    );

    if (activeSection === "why") {
      const whySt: Record<string, BlockStyles> = (() => { try { return JSON.parse(fields.why_styles || "{}"); } catch { return {}; } })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <CF label={th.svWhyBadge} value={fields.why_badge} onChange={v => u("why_badge", v)} max={40} />
              <StyleOverride blockKey="badge" label="Badge" allStyles={whySt} onChange={handleWhyStyle} defaults={WHY_STYLE_DEF.badge} fontSizeRange={WHY_STYLE_RANGE.badge} />
            </div>
            <div>
              <CF label={th.svWhyHead} value={fields.why_heading} onChange={v => u("why_heading", v)} max={55} />
              <StyleOverride blockKey="heading" label="Heading" allStyles={whySt} onChange={handleWhyStyle} defaults={WHY_STYLE_DEF.heading} fontSizeRange={WHY_STYLE_RANGE.heading} />
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 12 }}>
            <Repeater key="why_items"
              items={arrField("why_items")}
              onChange={arr => setArr("why_items", arr)}
              fields={WHY_FIELDS}
              defaultItem={{ n:"05", icon:"ti-star", title:"", title_th:"", desc:"", desc_th:"" }}
              addLabel={th.svAddReason}
              maxItems={8}
            />
          </div>
        </div>
      );
    }

    if (activeSection === "process") {
      const procSt: Record<string, BlockStyles> = (() => { try { return JSON.parse(fields.process_styles || "{}"); } catch { return {}; } })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <CF label={th.svProcBadge} value={fields.process_badge} onChange={v => u("process_badge", v)} max={40} />
              <StyleOverride blockKey="badge" label="Badge" allStyles={procSt} onChange={handleProcessStyle} defaults={PROC_STYLE_DEF.badge} fontSizeRange={PROC_STYLE_RANGE.badge} />
            </div>
            <div>
              <CF label={th.svProcHead} value={fields.process_heading} onChange={v => u("process_heading", v)} max={55} />
              <StyleOverride blockKey="heading" label="Heading" allStyles={procSt} onChange={handleProcessStyle} defaults={PROC_STYLE_DEF.heading} fontSizeRange={PROC_STYLE_RANGE.heading} />
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid #E8E6E0", paddingTop: 12 }}>
            <Repeater key="process_items"
              items={arrField("process_items")}
              onChange={arr => setArr("process_items", arr)}
              fields={PROCESS_FIELDS}
              defaultItem={{ n:"05", icon:"ti-star", title:"", title_th:"", desc:"", desc_th:"", active:false }}
              addLabel={th.svAddStep}
              maxItems={4}
            />
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
