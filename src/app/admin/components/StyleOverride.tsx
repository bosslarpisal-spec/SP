"use client";
import React, { useState, useEffect } from "react";

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

const ovLabelSt: React.CSSProperties = {
  display: "block", fontSize: 10, fontWeight: 500, color: "#999",
  marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase",
};
const ovInputSt: React.CSSProperties = {
  width: "100%", padding: "6px 8px", fontSize: 12,
  border: "0.5px solid #E8E6E0", borderRadius: 5,
  outline: "none", color: "#333", background: "#FFFFFF",
  boxSizing: "border-box",
};
const ovColorSwatchSt: React.CSSProperties = {
  width: 30, height: 28, border: "0.5px solid #E8E6E0",
  borderRadius: 4, padding: 2, cursor: "pointer",
  background: "white", flexShrink: 0,
};

export function StyleOverride({
  blockKey,
  label,
  allStyles,
  onChange,
  defaults,
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
  const [open, setOpen] = useState(false);
  const block  = allStyles[blockKey] ?? {};
  const hasAny = Object.keys(block).length > 0;
  const fontSizeRange  = fontSizeRangeProp ?? { min: 8, max: 72 };
  const defaultSizePx  = (defaults.fontSize ?? "").match(/\d+/)?.[0] ?? "";

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

  const colorSwatchVal = isHex(colorVal)
    ? colorVal
    : isHex(defaults.color ?? "") ? (defaults.color as string) : "#ffffff";
  const bgSwatchVal = isHex(bgVal)
    ? bgVal
    : isHex(defaults.background ?? "") ? (defaults.background as string) : "#e8d5a3";
  const borderColorSwatchVal = isHex(borderColorVal)
    ? borderColorVal
    : isHex(defaults.borderColor ?? "") ? (defaults.borderColor as string) : "#1c2951";

  return (
    <div style={{ marginTop: 6 }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "none", border: "none", cursor: "pointer",
          padding: "2px 0", fontSize: 10,
          color: hasAny ? "#0D1E3D" : "#bbb",
          fontWeight: hasAny ? 600 : 400,
        }}
      >
        <i className={`ti ${open ? "ti-chevron-up" : "ti-chevron-down"}`} style={{ fontSize: 10 }} />
        {label} style overrides
        {hasAny && (
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#0D1E3D", display: "inline-block", marginLeft: 2,
          }} />
        )}
      </button>

      {open && (
        <div style={{
          marginTop: 6, padding: "12px 14px",
          background: "#F9F8F6", borderRadius: 8,
          border: "0.5px solid #E8E6E0",
          display: "flex", flexDirection: "column", gap: 10,
        }}>

          {/* Text colour */}
          {withTextColor && (
            <div>
              <label style={ovLabelSt}>Text color</label>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="color" value={colorSwatchVal}
                  onChange={e => setField("color", e.target.value)}
                  style={ovColorSwatchSt} title="Pick a colour" />
                <input type="text" value={colorVal}
                  placeholder={defaults.color ?? ""}
                  onChange={e => setField("color", e.target.value)}
                  style={ovInputSt} />
              </div>
              <p style={{ fontSize: 9, color: "#bbb", margin: "3px 0 0" }}>Default: {defaults.color}</p>
            </div>
          )}

          {/* Background */}
          {withBackground && (
            <div>
              <label style={ovLabelSt}>{backgroundLabel}</label>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="color" value={bgSwatchVal}
                  onChange={e => setField("background", e.target.value)}
                  style={ovColorSwatchSt} title="Pick a colour" />
                <input type="text" value={bgVal}
                  placeholder={defaults.background ?? ""}
                  onChange={e => setField("background", e.target.value)}
                  style={ovInputSt} />
              </div>
              <p style={{ fontSize: 9, color: "#bbb", margin: "3px 0 0" }}>Default: {defaults.background}</p>
            </div>
          )}

          {/* Border colour */}
          {withBorderColor && (
            <div>
              <label style={ovLabelSt}>{borderColorLabel}</label>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="color" value={borderColorSwatchVal}
                  onChange={e => setField("borderColor", e.target.value)}
                  style={ovColorSwatchSt} title="Pick a colour" />
                <input type="text" value={borderColorVal}
                  placeholder={defaults.borderColor ?? "rgba(13,30,61,0.2)"}
                  onChange={e => setField("borderColor", e.target.value)}
                  style={ovInputSt} />
              </div>
              <p style={{ fontSize: 9, color: "#bbb", margin: "3px 0 0" }}>
                Default: {defaults.borderColor ?? "rgba(13,30,61,0.2)"}
              </p>
            </div>
          )}

          {/* Font size */}
          {withFontSize && (
            <div>
              <label style={ovLabelSt}>
                Font size (px) — {fontSizeRange.min}–{fontSizeRange.max}
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                  style={{ ...ovInputSt, width: 80 }}
                />
                <span style={{ fontSize: 11, color: "#999" }}>px</span>
              </div>
              <p style={{ fontSize: 9, color: "#bbb", margin: "3px 0 0" }}>Default: {defaults.fontSize}</p>
            </div>
          )}

          {/* Font family */}
          {withFontFamily && (
            <div>
              <label style={ovLabelSt}>Font family</label>
              <select
                value={famVal}
                onChange={e => setField("fontFamily", e.target.value)}
                style={{ ...ovInputSt, cursor: "pointer" }}
              >
                <option value="">Default (Georgia, serif)</option>
                {FONT_FAMILIES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Reset */}
          {hasAny && (
            <button
              type="button"
              onClick={() => onChange(blockKey, null)}
              style={{
                alignSelf: "flex-start", fontSize: 11, color: "#A32D2D",
                background: "none", border: "0.5px solid rgba(163,45,45,0.35)",
                borderRadius: 4, padding: "3px 8px", cursor: "pointer",
              }}
            >
              ↩ Reset to default
            </button>
          )}
        </div>
      )}
    </div>
  );
}
