"use client";
import React, { useState, useEffect } from "react";
import { th } from "@/app/admin/lib/admin-th";

export type BlockStyles = Record<string, string>;

export const FONT_FAMILIES = [
  { label: "Georgia (serif) — default",  value: "Georgia, serif" },
  { label: "Times New Roman (serif)",     value: "'Times New Roman', Times, serif" },
  { label: "Palatino (serif)",            value: "Palatino, 'Palatino Linotype', serif" },
  { label: "System UI (sans-serif)",      value: "system-ui, -apple-system, sans-serif" },
];

function isHex(v: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(v);
}

/* ── tiny shared helpers ─────────────────────────────────── */
const lbl: React.CSSProperties = {
  fontSize: 9, color: "#aaa", textTransform: "uppercase",
  letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
};
const miniInput: React.CSSProperties = {
  fontSize: 11, padding: "2px 5px", border: "0.5px solid #DEDAD4",
  borderRadius: 4, outline: "none", color: "#333", background: "#fff",
  fontFamily: "monospace", flexShrink: 0,
};
const divider: React.CSSProperties = {
  width: 1, height: 14, background: "#DEDAD4", flexShrink: 0,
};

/* ── colour picker cell ──────────────────────────────────── */
function ColorCell({
  caption, value, swatch, placeholder, onChange,
}: {
  caption: string; value: string; swatch: string;
  placeholder: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
      <span style={lbl}>{caption}</span>
      {/* Visible swatch that opens native colour picker */}
      <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 3,
          background: isHex(value) ? value : swatch,
          border: "0.5px solid #C5C2BC",
          pointerEvents: "none",
        }} />
        <input
          type="color"
          value={swatch}
          onChange={e => onChange(e.target.value)}
          style={{
            position: "absolute", inset: 0,
            opacity: 0, width: "100%", height: "100%",
            cursor: "pointer", padding: 0, border: "none",
          }}
          title={th.stylePickColor(caption)}
        />
      </div>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{ ...miniInput, width: 74 }}
      />
    </div>
  );
}

/* ── main export ─────────────────────────────────────────── */
export function StyleOverride({
  blockKey, label, allStyles, onChange, defaults,
  fontSizeRange: fontSizeRangeProp,
  withFontFamily   = false,
  withBackground   = false,
  withBorderColor  = false,
  withTextColor    = true,
  withFontSize     = true,
  backgroundLabel  = "Background color",
  borderColorLabel = "Border color",
}: {
  blockKey: string;
  label: string;
  allStyles: Record<string, BlockStyles>;
  onChange: (blockKey: string, overrides: BlockStyles | null) => void;
  defaults: BlockStyles;
  fontSizeRange?: { min: number; max: number };
  withFontFamily?:   boolean;
  withBackground?:   boolean;
  withBorderColor?:  boolean;
  withTextColor?:    boolean;
  withFontSize?:     boolean;
  backgroundLabel?:  string;
  borderColorLabel?: string;
}) {
  const block  = allStyles[blockKey] ?? {};
  const hasAny = Object.keys(block).length > 0;
  const fontSizeRange = fontSizeRangeProp ?? { min: 8, max: 72 };
  const defaultSizePx = (defaults.fontSize ?? "").match(/\d+/)?.[0] ?? "";

  const [localFontSize, setLocalFontSize] = useState<string>(() => {
    const n = parseInt(block.fontSize ?? "", 10);
    return isNaN(n) ? "" : String(n);
  });
  useEffect(() => {
    const n = parseInt(block.fontSize ?? "", 10);
    setLocalFontSize(isNaN(n) ? "" : String(n));
  }, [block.fontSize]);

  function setField(field: string, raw: string) {
    const value = raw.trim();
    const updated = { ...block };
    if (value === "" || value === defaults[field]) {
      delete updated[field];
    } else {
      updated[field] = value;
    }
    onChange(blockKey, Object.keys(updated).length === 0 ? null : updated);
  }

  const colorVal       = block.color       ?? "";
  const bgVal          = block.background  ?? "";
  const borderColorVal = block.borderColor ?? "";
  const famVal         = block.fontFamily  ?? "";

  const colorSwatch = isHex(colorVal)   ? colorVal
    : isHex(defaults.color ?? "")       ? (defaults.color as string) : "#ffffff";
  const bgSwatch    = isHex(bgVal)      ? bgVal
    : isHex(defaults.background ?? "")  ? (defaults.background as string) : "#e8d5a3";
  const bdSwatch    = isHex(borderColorVal) ? borderColorVal
    : isHex(defaults.borderColor ?? "") ? (defaults.borderColor as string) : "#1c2951";

  /* ── decide which separator dividers to show ─────────────── */
  const hasColor  = withTextColor;
  const hasBg     = withBackground;
  const hasBd     = withBorderColor;
  const hasSize   = withFontSize;
  const hasFam    = withFontFamily;

  /* show a divider between each active group */
  function needDiv(afterGroup: "color" | "bg" | "bd" | "size"): boolean {
    if (afterGroup === "color")  return hasBg || hasBd || hasSize || hasFam;
    if (afterGroup === "bg")     return hasBd || hasSize || hasFam;
    if (afterGroup === "bd")     return hasSize || hasFam;
    if (afterGroup === "size")   return hasFam;
    return false;
  }

  /* suppress label prop warning if unused — label is still a valid public API */
  void label;

  return (
    <div
      style={{
        marginTop: 3,
        padding: "4px 8px",
        background: "#F3F2EF",
        border: "0.5px solid #DEDAD4",
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        minHeight: 30,
      }}
    >
      {/* Text colour ──────────────────────── */}
      {hasColor && (
        <ColorCell
          caption={th.styleColor}
          value={colorVal}
          swatch={colorSwatch}
          placeholder={defaults.color ?? ""}
          onChange={v => setField("color", v)}
        />
      )}
      {hasColor && needDiv("color") && <div style={divider} />}

      {/* Background colour ────────────────── */}
      {hasBg && (
        <ColorCell
          caption={th.styleBg}
          value={bgVal}
          swatch={bgSwatch}
          placeholder={defaults.background ?? ""}
          onChange={v => setField("background", v)}
        />
      )}
      {hasBg && needDiv("bg") && <div style={divider} />}

      {/* Border colour ────────────────────── */}
      {hasBd && (
        <ColorCell
          caption={th.styleBorder}
          value={borderColorVal}
          swatch={bdSwatch}
          placeholder={defaults.borderColor ?? ""}
          onChange={v => setField("borderColor", v)}
        />
      )}
      {hasBd && needDiv("bd") && <div style={divider} />}

      {/* Font size ───────────────────────── */}
      {hasSize && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <span style={lbl}>{th.styleSize}</span>
          <input
            type="number"
            value={localFontSize}
            min={fontSizeRange.min}
            max={fontSizeRange.max}
            step={1}
            placeholder={defaultSizePx}
            onChange={e => setLocalFontSize(e.target.value)}
            onBlur={() => {
              const n = parseInt(localFontSize, 10);
              if (isNaN(n) || localFontSize === "") {
                setLocalFontSize("");
                setField("fontSize", "");
              } else {
                const clamped = Math.max(fontSizeRange.min, Math.min(fontSizeRange.max, n));
                setLocalFontSize(String(clamped));
                setField("fontSize", `${clamped}px`);
              }
            }}
            style={{ ...miniInput, width: 42 }}
          />
          <span style={{ fontSize: 10, color: "#bbb", flexShrink: 0 }}>px</span>
        </div>
      )}
      {hasSize && needDiv("size") && <div style={divider} />}

      {/* Font family ─────────────────────── */}
      {hasFam && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <span style={lbl}>{th.styleFont}</span>
          <select
            value={famVal}
            onChange={e => setField("fontFamily", e.target.value)}
            style={{ ...miniInput, cursor: "pointer", fontFamily: "inherit", padding: "2px 4px" }}
          >
            <option value="">{th.styleFontDefault}</option>
            {FONT_FAMILIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Reset — far right, only when overrides exist ─── */}
      {hasAny && (
        <button
          type="button"
          onClick={() => onChange(blockKey, null)}
          title={th.styleResetTitle(label)}
          style={{
            marginLeft: "auto",
            fontSize: 10,
            color: "#A32D2D",
            background: "none",
            border: "0.5px solid rgba(163,45,45,0.35)",
            borderRadius: 4,
            padding: "2px 7px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexShrink: 0,
            lineHeight: 1.4,
          }}
        >
          {th.styleReset}
        </button>
      )}
    </div>
  );
}
