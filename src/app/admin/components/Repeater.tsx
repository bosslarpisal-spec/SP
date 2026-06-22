"use client";
import React, { useState } from "react";

export type RepFieldType = "text" | "textarea" | "checkbox" | "select";

export interface RepField {
  key: string;
  label: string;
  type: RepFieldType;
  placeholder?: string;
  options?: string[];
  rows?: number;
  span?: "full" | "half";
}

const iSt: React.CSSProperties = {
  width: "100%", padding: "6px 8px", fontSize: 12,
  border: "0.5px solid #E8E6E0", borderRadius: 5,
  outline: "none", color: "#333", background: "#FFFFFF",
  boxSizing: "border-box",
};
const lSt: React.CSSProperties = {
  display: "block", fontSize: 10, fontWeight: 500,
  textTransform: "uppercase", letterSpacing: "0.07em",
  color: "#aaa", marginBottom: 4,
};

export function Repeater<T extends Record<string, unknown>>({
  items, onChange, fields, defaultItem, addLabel = "Add item",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  fields: RepField[];
  defaultItem: T;
  addLabel?: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  function upd(i: number, k: string, v: unknown) {
    onChange(items.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  }
  function moveUp(i: number) {
    if (i === 0) return;
    const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n);
  }
  function moveDown(i: number) {
    if (i >= items.length - 1) return;
    const n = [...items]; [n[i], n[i + 1]] = [n[i + 1], n[i]]; onChange(n);
  }
  function remove(i: number) {
    if (!confirm("Remove this item?")) return;
    onChange(items.filter((_, idx) => idx !== i));
    if (openIdx === i) setOpenIdx(null);
    else if (openIdx !== null && openIdx > i) setOpenIdx(openIdx - 1);
  }
  function add() {
    onChange([...items, { ...defaultItem }]);
    setOpenIdx(items.length);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {items.map((item, i) => {
        const isOpen = openIdx === i;
        const preview = (() => {
          for (const f of fields) {
            if (f.type !== "checkbox") {
              const v = String(item[f.key] ?? "");
              if (v) return v.length > 60 ? v.slice(0, 60) + "…" : v;
            }
          }
          return `Item ${i + 1}`;
        })();

        return (
          <div key={i} style={{ border: "0.5px solid #E8E6E0", borderRadius: 7, overflow: "hidden" }}>
            <div
              onClick={() => setOpenIdx(isOpen ? null : i)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#F9F8F6", cursor: "pointer", userSelect: "none" }}
            >
              <i className={`ti ti-chevron-${isOpen ? "up" : "down"}`} style={{ fontSize: 10, color: "#bbb", flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, color: "#444", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {preview}
              </span>
              <div style={{ display: "flex", gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <button type="button" title="Move up" onClick={() => moveUp(i)} disabled={i === 0}
                  style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", color: i === 0 ? "#ddd" : "#888", padding: "2px 4px", fontSize: 11, lineHeight: 1 }}>↑</button>
                <button type="button" title="Move down" onClick={() => moveDown(i)} disabled={i === items.length - 1}
                  style={{ background: "none", border: "none", cursor: i >= items.length - 1 ? "default" : "pointer", color: i >= items.length - 1 ? "#ddd" : "#888", padding: "2px 4px", fontSize: 11, lineHeight: 1 }}>↓</button>
                <button type="button" title="Delete" onClick={() => remove(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#A32D2D", padding: "2px 4px", fontSize: 11, lineHeight: 1 }}>✕</button>
              </div>
            </div>

            {isOpen && (
              <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: "#FFFFFF" }}>
                {fields.map(f => (
                  <div key={f.key} style={{ gridColumn: f.span === "half" ? undefined : "1 / -1" }}>
                    {f.type !== "checkbox" && <label style={lSt}>{f.label}</label>}
                    {f.type === "checkbox" ? (
                      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "#333" }}>
                        <input type="checkbox" checked={Boolean(item[f.key])} onChange={e => upd(i, f.key, e.target.checked)} />
                        {f.label}
                      </label>
                    ) : f.type === "select" ? (
                      <select value={String(item[f.key] ?? "")} onChange={e => upd(i, f.key, e.target.value)}
                        style={{ ...iSt, cursor: "pointer" }}>
                        {(f.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === "textarea" ? (
                      <textarea value={String(item[f.key] ?? "")} rows={f.rows ?? 3} placeholder={f.placeholder}
                        onChange={e => upd(i, f.key, e.target.value)}
                        style={{ ...iSt, resize: "vertical", fontFamily: "inherit" }} />
                    ) : (
                      <input type="text" value={String(item[f.key] ?? "")} placeholder={f.placeholder}
                        onChange={e => upd(i, f.key, e.target.value)} style={iSt} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <button type="button" onClick={add}
        style={{ alignSelf: "flex-start", marginTop: 2, fontSize: 12, color: "#0D1E3D", background: "#EEF1F8", border: "0.5px solid rgba(13,30,61,0.15)", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>
        + {addLabel}
      </button>
    </div>
  );
}
