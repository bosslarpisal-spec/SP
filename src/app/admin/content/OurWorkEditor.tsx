"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePageEditor } from "@/app/admin/lib/usePageEditor";
import { Repeater } from "@/app/admin/components/Repeater";
import type { RepField } from "@/app/admin/components/Repeater";
import { supabase } from "@/lib/supabase";
import {
  upsertPortfolioProject,
  insertPortfolioProject,
  deletePortfolioProject,
  savePortfolioOrder,
  type PortfolioProjectData,
} from "@/app/admin/lib/portfolioActions";
import { useToast } from "../components/Toast";
import { th } from "@/app/admin/lib/admin-th";
import { StyleOverride, type BlockStyles } from "@/app/admin/components/StyleOverride";

/* ── usePageEditor schema (hero + stats only) ─────────────── */
const FIELD_META: Record<string, { section: string; key: string }> = {
  hero_badge:          { section: "hero",  key: "badge" },
  hero_heading:        { section: "hero",  key: "heading" },
  hero_heading_italic: { section: "hero",  key: "heading_italic" },
  hero_styles:         { section: "hero",  key: "_styles" },
  ow_stats:            { section: "stats", key: "items" },
};

const SECTION_FIELDS: Record<string, string[]> = {
  hero:     ["hero_badge", "hero_heading", "hero_heading_italic", "hero_styles"],
  ow_stats: ["ow_stats"],
};

const DEFAULTS: Record<string, string> = {
  hero_badge:          "PORTFOLIO",
  hero_heading:        "Our Work &",
  hero_heading_italic: "Portfolio",
  hero_styles: JSON.stringify({}),
  ow_stats: JSON.stringify([
    { n: "3,000+", label: "Clients Served" },
    { n: "50k+",   label: "Projects Done"  },
    { n: "30+",    label: "Countries"      },
  ]),
};

const SECTIONS = [
  { id: "hero",     label: th.owSecHero,     icon: "ti-sparkles",    fieldCount: 3, desc: th.owSecHeroDesc },
  { id: "ow_stats", label: th.owSecStats,    icon: "ti-chart-bar",   fieldCount: 1, desc: th.owSecStatsDesc },
  { id: "projects", label: th.owSecProjects, icon: "ti-layout-grid", fieldCount: 0, desc: th.owSecProjectsDesc },
];

const STAT_FIELDS: RepField[] = [
  { key: "n",     label: th.owStatNum,   type: "text", span: "half", maxLength: 10 },
  { key: "label", label: th.owStatLabel, type: "text", span: "half", maxLength: 30 },
];

/* ── Hero style defaults ──────────────────────────────────── */
const HERO_STYLE_DEF: Record<string, BlockStyles> = {
  badge:         { color: "#E8D5A3", fontSize: "10px" },
  heading:       { color: "#FFFFFF", fontSize: "40px" },
  headingItalic: { color: "#E8D5A3", fontSize: "40px" },
};
const HERO_STYLE_RANGE: Record<string, { min: number; max: number }> = {
  badge:         { min: 8,  max: 14 },
  heading:       { min: 24, max: 56 },
  headingItalic: { min: 24, max: 56 },
};

/* ── Project local state ──────────────────────────────────── */
type PL = {
  id: string;
  title: string;
  title_th: string;
  description: string;
  client: string;
  image_url: string;
  project_link: string;
  tags: string;
  metrics: string;
  icon: string;
  aspect: "tall" | "wide" | "square";
  display_order: number;
  visible: boolean;
  _dirty: boolean;
  _saving: boolean;
  _uploading: boolean;
};

function toLocal(raw: Record<string, unknown>): PL {
  const aspect = String(raw.aspect ?? "");
  return {
    id:            String(raw.id ?? ""),
    title:         String(raw.title ?? ""),
    title_th:      String(raw.title_th ?? ""),
    description:   String(raw.description ?? ""),
    client:        String(raw.client ?? ""),
    image_url:     String(raw.image_url ?? ""),
    project_link:  String(raw.project_link ?? ""),
    tags:          String(raw.tags ?? ""),
    metrics:       JSON.stringify(raw.metrics ?? []),
    icon:          String(raw.icon ?? "ti-star"),
    aspect:        (["tall","wide","square"].includes(aspect) ? aspect : "square") as PL["aspect"],
    display_order: Number(raw.display_order ?? 0),
    visible:       raw.visible !== false,
    _dirty:        false,
    _saving:       false,
    _uploading:    false,
  };
}

function toData(p: PL): PortfolioProjectData {
  return {
    id: p.id, title: p.title, title_th: p.title_th,
    description: p.description, client: p.client,
    image_url: p.image_url, project_link: p.project_link,
    tags: p.tags, metrics: p.metrics, icon: p.icon,
    aspect: p.aspect, display_order: p.display_order,
    visible: p.visible,
  };
}

/* ── Shared input styles ──────────────────────────────────── */
const lSt: React.CSSProperties = {
  fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
  color: "#aaa", fontWeight: 500, display: "block", marginBottom: 5,
};
const iBase: React.CSSProperties = {
  background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 7,
  padding: "7px 9px", fontSize: 12, color: "#333", width: "100%",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

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
        ? <textarea value={value} rows={3} placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            style={{ ...iBase, resize: "vertical", ...(over ? { borderColor: "#F09595" } : {}) }} />
        : <input type="text" value={value} placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            style={{ ...iBase, ...(over ? { borderColor: "#F09595" } : {}) }} />}
    </div>
  );
}

/* ── Image Upload ─────────────────────────────────────────── */
function ProjectImageUpload({ projectId, currentUrl, onUpload, uploading, setUploading }: {
  projectId: string;
  currentUrl: string;
  onUpload: (url: string) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [dims, setDims] = React.useState<{ w: number; h: number } | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `portfolio/${projectId}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("page-images").upload(path, file, { upsert: true });
    if (upErr) {
      toast.error(th.owErrUpload(upErr.message));
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("page-images").getPublicUrl(path);
    onUpload(publicUrl);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label style={lSt}>{th.owImage}</label>
      <input ref={inputRef} type="file" accept="image/*"
        style={{ display: "none" }} onChange={handleFile} />
      {currentUrl ? (
        <div style={{ border: "0.5px solid #E8E6E0", borderRadius: 7, overflow: "hidden" }}>
          <div style={{ aspectRatio: "16/9", background: "#E8E6E0", position: "relative", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentUrl} alt="project" style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onLoad={e => { const i = e.currentTarget; setDims({ w: i.naturalWidth, h: i.naturalHeight }); }} />
          </div>
          <div style={{ padding: "6px 10px", display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ flex: 1, fontSize: 10, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {dims ? `${dims.w} × ${dims.h} px` : currentUrl.split("/").pop()}
            </span>
            <button type="button" onClick={() => !uploading && inputRef.current?.click()}
              disabled={uploading}
              style={{ fontSize: 11, padding: "3px 8px", border: "0.5px solid #D8D5CE", borderRadius: 5, background: "#F5F4F1", color: "#555", cursor: uploading ? "wait" : "pointer" }}>
              {uploading ? "…" : th.owImgReplace}
            </button>
            <button type="button" onClick={() => { onUpload(""); setDims(null); }}
              style={{ fontSize: 11, padding: "3px 8px", border: "0.5px solid rgba(255,100,100,0.4)", borderRadius: 5, background: "rgba(255,100,100,0.08)", color: "#e05555", cursor: "pointer" }}>
              {th.owImgRemove}
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          onClick={() => !uploading && inputRef.current?.click()}
          style={{
            border: "1.5px dashed #D8D5CE", background: "#FAFAF8", borderRadius: 7,
            padding: "20px 16px", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 6, cursor: uploading ? "wait" : "pointer",
          }}
        >
          <i className="ti ti-photo-plus" style={{ fontSize: 22, color: "#bbb" }} />
          <span style={{ fontSize: 12, color: "#999" }}>
            {uploading ? th.owImgUploading : th.owImgClick}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Main Editor ──────────────────────────────────────────── */
export default function OurWorkEditor() {
  const [activeSection, setActiveSection] = useState("hero");
  const toast = useToast();

  const {
    loaded: contentLoaded, fields, setFields, dirty: contentDirty,
    saving: contentSaving, saved: contentSaved,
    updateField, saveSection, discardSection,
  } = usePageEditor("our-work", FIELD_META, SECTION_FIELDS, DEFAULTS);

  const [projects, setProjects]             = useState<PL[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [openProjIdx, setOpenProjIdx]       = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("portfolio_projects")
      .select("*")
      .order("display_order")
      .then(({ data }) => {
        setProjects((data ?? []).map(r => toLocal(r as Record<string, unknown>)));
        setProjectsLoaded(true);
      });
  }, []);

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

  function arrField(k: string) {
    try { return JSON.parse(fields[k] || "[]") as Record<string, unknown>[]; }
    catch { return []; }
  }
  function setArr(k: string, arr: Record<string, unknown>[]) {
    setFields(p => ({ ...p, [k]: JSON.stringify(arr) }));
    updateField(k, JSON.stringify(arr), activeSection);
  }

  function updateProj(id: string, field: keyof PL, value: unknown) {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, [field]: value, _dirty: true } : p));
  }

  async function saveProject(id: string) {
    const p = projects.find(pr => pr.id === id);
    if (!p) return;
    setProjects(ps => ps.map(pr => pr.id === id ? { ...pr, _saving: true } : pr));
    try {
      await upsertPortfolioProject(toData(p));
      setProjects(ps => ps.map(pr => pr.id === id ? { ...pr, _dirty: false, _saving: false } : pr));
      toast.success(th.toastProjectSaved);
    } catch (err) {
      toast.error(th.owErrSave(String(err)));
      setProjects(ps => ps.map(pr => pr.id === id ? { ...pr, _saving: false } : pr));
    }
  }

  async function removeProject(id: string) {
    if (!confirm(th.owDeleteConfirm)) return;
    try {
      await deletePortfolioProject(id);
      setProjects(ps => {
        const next = ps.filter(p => p.id !== id);
        setOpenProjIdx(null);
        return next;
      });
      toast.success(th.toastProjectDeleted);
    } catch (err) {
      toast.error(th.owErrDelete(String(err)));
    }
  }

  async function handleAddProject() {
    try {
      const newId = await insertPortfolioProject();
      const newOrder = ((projects[projects.length - 1]?.display_order ?? 0) + 10);
      const newProj: PL = {
        id: newId, title: "New Project", title_th: "", description: "",
        client: "Client", image_url: "", project_link: "", tags: "",
        metrics: "[]", icon: "ti-star", aspect: "square",
        display_order: newOrder, visible: true,
        _dirty: false, _saving: false, _uploading: false,
      };
      setProjects(ps => {
        setOpenProjIdx(ps.length);
        return [...ps, newProj];
      });
      toast.success(th.toastProjectAdded);
    } catch (err) {
      toast.error(th.owErrAdd(String(err)));
    }
  }

  async function moveProject(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= projects.length) return;
    const updated = [...projects];
    [updated[i], updated[j]] = [updated[j], updated[i]];
    const reordered = updated.map((p, idx) => ({ ...p, display_order: (idx + 1) * 10 }));
    setProjects(reordered);
    if (openProjIdx === i) setOpenProjIdx(j);
    else if (openProjIdx === j) setOpenProjIdx(i);
    try {
      await savePortfolioOrder(reordered.map(p => ({ id: p.id, display_order: p.display_order })));
    } catch (err) {
      toast.error(th.owErrReorder(String(err)));
    }
  }

  const activeSec   = SECTIONS.find(s => s.id === activeSection)!;
  const showSaveBar = activeSection !== "projects" && !!contentDirty[activeSection];

  function renderSection() {
    if (activeSection === "hero") {
      const heroSt: Record<string, BlockStyles> = (() => { try { return JSON.parse(fields.hero_styles || "{}"); } catch { return {}; } })();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <CF label={th.owHeroBadge} value={fields.hero_badge} onChange={v => u("hero_badge", v)} max={40} />
            <StyleOverride blockKey="badge" label="Badge" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.badge} fontSizeRange={HERO_STYLE_RANGE.badge} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <CF label={th.owHeroHead} value={fields.hero_heading} onChange={v => u("hero_heading", v)} max={55} />
              <StyleOverride blockKey="heading" label="Heading" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.heading} fontSizeRange={HERO_STYLE_RANGE.heading} />
            </div>
            <div>
              <CF label={th.owHeroHeadIt} value={fields.hero_heading_italic} onChange={v => u("hero_heading_italic", v)} max={55} />
              <StyleOverride blockKey="headingItalic" label="Heading italic" allStyles={heroSt} onChange={handleHeroStyle} defaults={HERO_STYLE_DEF.headingItalic} fontSizeRange={HERO_STYLE_RANGE.headingItalic} />
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "ow_stats") return (
      <div>
        <p style={{ ...lSt, marginBottom: 8 }}>{th.owStatsNote}</p>
        <Repeater key="ow_stats" items={arrField("ow_stats")}
          onChange={arr => setArr("ow_stats", arr)}
          fields={STAT_FIELDS}
          defaultItem={{ n: "0+", label: "" }}
          addLabel={th.owStatsAdd}
          maxItems={4} />
      </div>
    );

    if (activeSection === "projects") {
      if (!projectsLoaded) return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#888", fontSize: 13, padding: "24px 0" }}>
          <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} /> {th.owLoadingProjects}
        </div>
      );

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <p style={{ fontSize: 11, color: "#888", margin: "0 0 10px" }}>{th.owProjectsHint}</p>

          {projects.map((p, i) => {
            const isOpen = openProjIdx === i;
            return (
              <div key={p.id} style={{ border: "0.5px solid #E8E6E0", borderRadius: 7, overflow: "hidden" }}>
                {/* Row header */}
                <div style={{ display: "flex", alignItems: "center", background: "#F9F8F6" }}>
                  <button
                    type="button"
                    onClick={() => setOpenProjIdx(isOpen ? null : i)}
                    style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "none", border: "none", cursor: "pointer", textAlign: "left", minWidth: 0 }}
                  >
                    <i className={`ti ti-chevron-${isOpen ? "up" : "down"}`} style={{ fontSize: 10, color: "#bbb", flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, color: "#444", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <span style={{ color: "#8A9AB8", marginRight: 6 }}>{p.client}</span>
                      {p.title}
                    </span>
                    {p._dirty && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#D97706", display: "inline-block", flexShrink: 0 }} />}
                    {!p.visible && (
                      <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#F3F0E8", color: "#9CA3AF", border: "0.5px solid #E8E6E0", whiteSpace: "nowrap", marginLeft: 4 }}>
                        {th.owProjectHidden}
                      </span>
                    )}
                  </button>
                  <div style={{ display: "flex", gap: 2, flexShrink: 0, padding: "0 8px" }}>
                    <button type="button" title={th.owMoveUp} onClick={() => moveProject(i, -1)} disabled={i === 0}
                      style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", color: i === 0 ? "#ddd" : "#888", padding: "2px 4px", fontSize: 11 }}>↑</button>
                    <button type="button" title={th.owMoveDown} onClick={() => moveProject(i, 1)} disabled={i === projects.length - 1}
                      style={{ background: "none", border: "none", cursor: i >= projects.length - 1 ? "default" : "pointer", color: i >= projects.length - 1 ? "#ddd" : "#888", padding: "2px 4px", fontSize: 11 }}>↓</button>
                    <button type="button" title={th.owDelete} onClick={() => removeProject(p.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#A32D2D", padding: "2px 4px", fontSize: 11 }}>✕</button>
                  </div>
                </div>

                {/* Expanded form */}
                {isOpen && (
                  <div style={{ padding: 16, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <CF label={th.owClient} value={p.client} max={50}
                        onChange={v => updateProj(p.id, "client", v)} />
                      <div>
                        <label style={lSt}>{th.owAspect}</label>
                        <select value={p.aspect}
                          onChange={e => updateProj(p.id, "aspect", e.target.value)}
                          style={{ ...iBase, cursor: "pointer" }}>
                          <option value="tall">{th.owAspectTall}</option>
                          <option value="wide">{th.owAspectWide}</option>
                          <option value="square">{th.owAspectSquare}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={lSt}>{th.owTitleEn}</label>
                      <input type="text" value={p.title} onChange={e => updateProj(p.id, "title", e.target.value)} style={iBase} />
                    </div>
                    <div>
                      <label style={lSt}>{th.owTitleTh}</label>
                      <input type="text" value={p.title_th} onChange={e => updateProj(p.id, "title_th", e.target.value)} style={iBase} />
                    </div>
                    <div>
                      <label style={lSt}>{th.owDesc}</label>
                      <textarea value={p.description} rows={4} onChange={e => updateProj(p.id, "description", e.target.value)}
                        style={{ ...iBase, resize: "vertical", fontFamily: "inherit" }} />
                    </div>

                    <ProjectImageUpload
                      projectId={p.id}
                      currentUrl={p.image_url}
                      onUpload={url => updateProj(p.id, "image_url", url)}
                      uploading={p._uploading}
                      setUploading={v => updateProj(p.id, "_uploading", v as boolean)}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={lSt}>{th.owTags}</label>
                        <input type="text" value={p.tags} placeholder="Gift Sets,Custom Packaging"
                          onChange={e => updateProj(p.id, "tags", e.target.value)} style={iBase} />
                      </div>
                      <div>
                        <label style={lSt}>{th.owIcon}</label>
                        <input type="text" value={p.icon} placeholder="ti-gift"
                          onChange={e => updateProj(p.id, "icon", e.target.value)} style={iBase} />
                      </div>
                    </div>

                    <div>
                      <label style={lSt}>{th.owLink}</label>
                      <input type="text" value={p.project_link} placeholder="https://…"
                        onChange={e => updateProj(p.id, "project_link", e.target.value)} style={iBase} />
                    </div>

                    <div>
                      <label style={lSt}>{th.owMetrics}</label>
                      <textarea
                        value={p.metrics} rows={2}
                        placeholder='[{"n":"12,000","label":"Units Produced"}]'
                        onChange={e => updateProj(p.id, "metrics", e.target.value)}
                        style={{ ...iBase, resize: "vertical", fontFamily: "monospace", fontSize: 11 }}
                      />
                    </div>

                    {/* Visible toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 8, borderTop: "0.5px solid #F0EDE6" }}>
                      <span style={{ ...lSt, margin: 0, flex: 1 }}>{th.owVisible}</span>
                      <button
                        type="button"
                        onClick={() => updateProj(p.id, "visible", !p.visible)}
                        style={{
                          width: 36, height: 20, borderRadius: 10, padding: 0, border: "none",
                          background: p.visible ? "#0D1E3D" : "#E8E6E0",
                          cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
                        }}
                      >
                        <span style={{
                          position: "absolute", top: 3,
                          left: p.visible ? 19 : 3,
                          width: 14, height: 14, borderRadius: "50%",
                          background: p.visible ? "#E8D5A3" : "#FFFFFF",
                          transition: "left 0.2s", display: "block",
                        }} />
                      </button>
                      <span style={{ fontSize: 11, color: "#888" }}>{p.visible ? th.contentVisible : th.contentHidden}</span>
                    </div>

                    {/* Save */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => saveProject(p.id)}
                        disabled={p._saving}
                        style={{
                          padding: "8px 20px",
                          background: p._dirty ? "#0D1E3D" : "#E8E6E0",
                          color: p._dirty ? "#E8D5A3" : "#aaa",
                          border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600,
                          cursor: p._saving ? "wait" : "pointer",
                          display: "flex", alignItems: "center", gap: 7,
                          transition: "background 0.2s",
                        }}
                      >
                        {p._saving && <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 13 }} />}
                        {p._saving ? th.owSaving : th.owSaveProject}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddProject}
            style={{ alignSelf: "flex-start", marginTop: 4, fontSize: 12, color: "#0D1E3D", background: "#EEF1F8", border: "0.5px solid rgba(13,30,61,0.15)", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}
          >
            {th.owAddProject}
          </button>
        </div>
      );
    }

    return null;
  }

  if (!contentLoaded) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#888", fontSize: 13, padding: "40px 0" }}>
      <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} /> {th.owLoading}
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, paddingBottom: showSaveBar ? 72 : 0 }}>

      {/* Sidebar */}
      <div style={{ width: 195, flexShrink: 0, background: "#FFFFFF", border: "0.5px solid #E8E6E0", borderRadius: 10, overflow: "hidden", position: "sticky", top: 78, maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
        <div style={{ padding: "10px 14px", borderBottom: "0.5px solid #E8E6E0", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#aaa" }}>{th.contentSections}</div>
        {SECTIONS.map(sec => {
          const isActive = sec.id === activeSection;
          const isDirty  = sec.id === "projects"
            ? projects.some(p => p._dirty)
            : !!contentDirty[sec.id];
          const isSaved  = sec.id !== "projects" && !!contentSaved[sec.id] && !contentDirty[sec.id];
          return (
            <div
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              style={{ padding: "11px 14px", display: "flex", alignItems: "center", gap: 9, cursor: "pointer", borderLeft: `3px solid ${isActive ? "#0D1E3D" : "transparent"}`, background: isActive ? "#EEF1F8" : "transparent", transition: "background 0.12s", borderBottom: "0.5px solid #F2F1EE" }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "#F5F4F1"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <i className={`ti ${sec.icon}`} style={{ fontSize: 14, color: isActive ? "#0D1E3D" : "#999", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: isActive ? "#0D1E3D" : "#333", lineHeight: 1.3 }}>{sec.label}</div>
                <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>
                  {sec.id === "projects"
                    ? th.owProjCount(projects.length)
                    : th.contentFields(sec.fieldCount)}
                </div>
              </div>
              {isDirty && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />}
              {isSaved  && <i className="ti ti-check" style={{ fontSize: 11, color: "#3B6D11" }} />}
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

      {/* Fixed save bar — hero / stats sections only */}
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
            <button type="button" onClick={() => saveSection(activeSection)}
              disabled={!!contentSaving[activeSection]}
              style={{ padding: "8px 20px", background: "#0D1E3D", color: "#E8D5A3", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: contentSaving[activeSection] ? "wait" : "pointer", opacity: contentSaving[activeSection] ? 0.6 : 1, display: "flex", alignItems: "center", gap: 7 }}>
              {contentSaving[activeSection] && <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 13 }} />}
              {contentSaving[activeSection] ? th.saveSaving : th.saveBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
