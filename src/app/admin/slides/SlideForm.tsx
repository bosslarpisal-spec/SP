"use client";

import React, { useState, useRef } from "react";
import { StyleOverride, type BlockStyles } from "@/app/admin/components/StyleOverride";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createSlide, updateSlide } from "./actions";
import { useToast } from "../components/Toast";
import type { HeroSlide } from "./page";
import type { SlidePayload } from "./actions";

type Props = {
  mode: "new" | "edit";
  slideId?: number;
  initial?: HeroSlide;
  nextDisplayOrder?: number;
};

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "0.5px solid #E8E6E0",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "12px 16px", borderBottom: "0.5px solid #E8E6E0" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{label}</span>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

const labelSt: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 500,
  color: "#888",
  marginBottom: 5,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const inputSt: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  fontSize: 13,
  border: "0.5px solid #E8E6E0",
  borderRadius: 7,
  outline: "none",
  color: "#333",
  background: "#FAFAF8",
  boxSizing: "border-box",
};

function Field({
  label,
  value,
  onChange,
  multiline,
  placeholder,
  caption,
  maxChars,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  caption?: string;
  maxChars?: number;
}) {
  const len = value.length;
  const isOver = maxChars !== undefined && len > maxChars;
  const isNear = maxChars !== undefined && !isOver && len >= Math.floor(maxChars * 0.8);
  const counterColor = isOver ? "#C0392B" : isNear ? "#D97706" : "#bbb";
  const borderOverride = isOver ? { borderColor: "#C0392B" } : {};

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: caption ? 2 : 5 }}>
        <label style={{ ...labelSt, marginBottom: 0 }}>{label}</label>
        {maxChars !== undefined && (
          <span style={{ fontSize: 10, color: counterColor, fontVariantNumeric: "tabular-nums", flexShrink: 0, marginLeft: 8 }}>
            {len} / {maxChars}
          </span>
        )}
      </div>
      {caption && (
        <p style={{ fontSize: 10, color: "#bbb", margin: "0 0 5px", lineHeight: 1.3 }}>
          Renders as: {caption}
        </p>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          maxLength={maxChars}
          style={{ ...inputSt, resize: "vertical", ...borderOverride }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxChars}
          style={{ ...inputSt, ...borderOverride }}
        />
      )}
    </div>
  );
}

// ── Style override constants ──────────────────────────────────────────────────

const BLOCK_DEFAULTS: Record<string, BlockStyles> = {
  badge:       { color: "#E8D5A3", fontSize: "10px" },
  heading:     { color: "#FFFFFF", fontSize: "clamp(36px,5vw,58px)", fontFamily: "Georgia, serif" },
  subheadline: { color: "#E8D5A3", fontSize: "clamp(28px,4vw,48px)", fontFamily: "Georgia, serif" },
  subtext:     { color: "rgba(255,255,255,0.7)", fontSize: "13px" },
  description: { color: "rgba(255,255,255,0.6)", fontSize: "14px" },
  btn1:        { background: "#E8D5A3", color: "#1C2951", fontSize: "14px" },
  btn2:        { color: "#FFFFFF", fontSize: "14px" },
  badgeLine:   { background: "#E8D5A3" },
};

const FONT_SIZE_RANGES: Record<string, { min: number; max: number }> = {
  badge:       { min: 8,  max: 16 },
  heading:     { min: 24, max: 72 },
  subheadline: { min: 20, max: 64 },
  subtext:     { min: 11, max: 18 },
  description: { min: 11, max: 20 },
  btn1:        { min: 11, max: 18 },
  btn2:        { min: 11, max: 18 },
};

// ── Payload factory ───────────────────────────────────────────────────────────

function makePayload(initial: HeroSlide | undefined, nextDisplayOrder: number): SlidePayload {
  return {
    display_order: initial?.display_order ?? nextDisplayOrder,
    badge:         initial?.badge         ?? "",
    heading:       initial?.heading       ?? "",
    subheadline:   initial?.subheadline   ?? "",
    subtext:       initial?.subtext       ?? "",
    description:   initial?.description   ?? "",
    btn1_text:     initial?.btn1_text     ?? "Learn More",
    btn1_link:     initial?.btn1_link     ?? "/",
    btn2_text:     initial?.btn2_text     ?? "Contact Us",
    btn2_link:     initial?.btn2_link     ?? "/contact",
    bg_image_url:  initial?.bg_image_url  ?? "",
    bg_color:      initial?.bg_color      ?? "#0D1E3D",
    is_active:     initial?.is_active     ?? true,
    styles:        (initial?.styles as Record<string, Record<string, string>>) ?? {},
  };
}

export default function SlideForm({ mode, slideId, initial, nextDisplayOrder = 1 }: Props) {
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<SlidePayload>(() => makePayload(initial, nextDisplayOrder));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof SlidePayload>(key: K, value: SlidePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  // Style override: pass null to remove the whole block key from the JSON
  function setStyle(blockKey: string, overrides: Record<string, string> | null) {
    setForm((prev) => {
      const next = { ...(prev.styles ?? {}) };
      if (overrides === null) {
        delete next[blockKey];
      } else {
        next[blockKey] = overrides;
      }
      return { ...prev, styles: next };
    });
    setDirty(true);
  }

  // Temporary scope guard: style override UI is only shown on slide 1 for
  // this first pass. Remove this condition once the pattern is approved.
  const showStyleOverrides = true;

  function handleDiscard() {
    setForm(makePayload(initial, nextDisplayOrder));
    setDirty(false);
  }

  async function handleImageUpload(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `slides/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from("page-images")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("page-images").getPublicUrl(data.path);
      set("bg_image_url", publicUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.heading.trim()) {
      toast.error("Heading is required");
      return;
    }
    setSaving(true);
    try {
      if (mode === "new") {
        await createSlide(form);
        toast.success("Slide created");
        router.push("/admin/slides");
      } else {
        await updateSlide(slideId!, form);
        toast.success("Changes saved");
        setDirty(false);
        router.refresh();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const showSaveBar = mode === "new" || dirty;

  return (
    <form id="slide-form" onSubmit={handleSubmit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 16,
          paddingBottom: showSaveBar ? 72 : 0,
        }}
        className="lg:grid-cols-[1fr_270px]"
      >
        {/* ── Left column ─────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card label="Slide Content">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <Field
                    label="Badge / Eyebrow"
                    value={form.badge}
                    onChange={(v) => set("badge", v)}
                    placeholder="WELCOME TO SP"
                    maxChars={40}
                  />
                  {showStyleOverrides && (
                    <StyleOverride
                      blockKey="badge"
                      label="Badge"
                      allStyles={form.styles}
                      onChange={setStyle}
                      defaults={BLOCK_DEFAULTS.badge}
                      fontSizeRange={FONT_SIZE_RANGES.badge}
                    />
                  )}
                  {showStyleOverrides && (
                    <StyleOverride
                      blockKey="badgeLine"
                      label="Badge accent line"
                      allStyles={form.styles}
                      onChange={setStyle}
                      defaults={BLOCK_DEFAULTS.badgeLine}
                      withBackground
                      withTextColor={false}
                      withFontSize={false}
                      backgroundLabel="Line color"
                    />
                  )}
                </div>
                <div>
                  <Field
                    label="Heading"
                    value={form.heading}
                    onChange={(v) => set("heading", v)}
                    placeholder="The Expert In"
                    maxChars={35}
                  />
                  {showStyleOverrides && (
                    <StyleOverride
                      blockKey="heading"
                      label="Heading"
                      allStyles={form.styles}
                      onChange={setStyle}
                      defaults={BLOCK_DEFAULTS.heading}
                      fontSizeRange={FONT_SIZE_RANGES.heading}
                      withFontFamily
                    />
                  )}
                </div>
              </div>
              <div>
                <Field
                  label="Gold Italic Subheadline"
                  value={form.subheadline}
                  onChange={(v) => set("subheadline", v)}
                  placeholder='"Total Premiums & Promotion Solution"'
                  maxChars={55}
                />
                {showStyleOverrides && (
                  <StyleOverride
                    blockKey="subheadline"
                    label="Subheadline"
                    allStyles={form.styles}
                    onChange={setStyle}
                    defaults={BLOCK_DEFAULTS.subheadline}
                    fontSizeRange={FONT_SIZE_RANGES.subheadline}
                    withFontFamily
                  />
                )}
              </div>
              <div>
                <Field
                  label="Thai Subtext"
                  value={form.subtext}
                  onChange={(v) => set("subtext", v)}
                  placeholder="ผู้เชี่ยวชาญด้านของพรีเมียม..."
                  maxChars={80}
                />
                {showStyleOverrides && (
                  <StyleOverride
                    blockKey="subtext"
                    label="Thai subtext"
                    allStyles={form.styles}
                    onChange={setStyle}
                    defaults={BLOCK_DEFAULTS.subtext}
                    fontSizeRange={FONT_SIZE_RANGES.subtext}
                  />
                )}
              </div>
              <div>
                <Field
                  label="Description"
                  value={form.description}
                  onChange={(v) => set("description", v)}
                  multiline
                  placeholder="Supporting description text..."
                  maxChars={160}
                />
                {showStyleOverrides && (
                  <StyleOverride
                    blockKey="description"
                    label="Description"
                    allStyles={form.styles}
                    onChange={setStyle}
                    defaults={BLOCK_DEFAULTS.description}
                    fontSizeRange={FONT_SIZE_RANGES.description}
                  />
                )}
              </div>
            </div>
          </Card>

          <Card label="Call-to-Action Buttons">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a", margin: "0 0 8px" }}>
                  Primary Button (Gold fill)
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <Field
                      label="Label"
                      value={form.btn1_text}
                      onChange={(v) => set("btn1_text", v)}
                      placeholder="Browse Our Work"
                      maxChars={30}
                    />
                    {showStyleOverrides && (
                      <StyleOverride
                        blockKey="btn1"
                        label="Primary button"
                        allStyles={form.styles}
                        onChange={setStyle}
                        defaults={BLOCK_DEFAULTS.btn1}
                        fontSizeRange={FONT_SIZE_RANGES.btn1}
                        withBackground
                      />
                    )}
                  </div>
                  <Field
                    label="Link"
                    value={form.btn1_link}
                    onChange={(v) => set("btn1_link", v)}
                    placeholder="/our-work"
                  />
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a", margin: "0 0 8px" }}>
                  Secondary Button (Outline)
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <Field
                      label="Label"
                      value={form.btn2_text}
                      onChange={(v) => set("btn2_text", v)}
                      placeholder="Get a Quote"
                      maxChars={30}
                    />
                    {showStyleOverrides && (
                      <StyleOverride
                        blockKey="btn2"
                        label="Secondary button"
                        allStyles={form.styles}
                        onChange={setStyle}
                        defaults={BLOCK_DEFAULTS.btn2}
                        fontSizeRange={FONT_SIZE_RANGES.btn2}
                      />
                    )}
                  </div>
                  <Field
                    label="Link"
                    value={form.btn2_link}
                    onChange={(v) => set("btn2_link", v)}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Right column ────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Background image */}
          <Card label="Background Image">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
              }}
            />
            {form.bg_image_url ? (
              <div
                style={{
                  border: "0.5px solid #E8E6E0",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.bg_image_url}
                  alt="Slide background"
                  style={{
                    width: "100%",
                    maxHeight: 120,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div style={{ padding: "8px 10px", background: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 10,
                        color: "#888",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {form.bg_image_url.split("/").pop()}
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      style={{
                        padding: "3px 8px",
                        fontSize: 11,
                        borderRadius: 5,
                        border: "0.5px solid #D8D5CE",
                        background: "#F5F4F1",
                        color: "#555",
                        cursor: uploading ? "wait" : "pointer",
                      }}
                    >
                      {uploading ? "…" : "Replace"}
                    </button>
                    <button
                      type="button"
                      onClick={() => set("bg_image_url", "")}
                      style={{
                        padding: "3px 8px",
                        fontSize: 11,
                        borderRadius: 5,
                        border: "0.5px solid rgba(255,100,100,0.4)",
                        background: "rgba(255,100,100,0.08)",
                        color: "#e05555",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <p style={{ fontSize: 10, color: "#aaa", margin: "4px 0 0" }}>
                    Recommended: 1920×1080px (16:9)
                  </p>
                </div>
              </div>
            ) : (
              <div
                role="button"
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{
                  border: "1.5px dashed #D8D5CE",
                  background: "#FAFAF8",
                  borderRadius: 8,
                  padding: "28px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  cursor: uploading ? "wait" : "pointer",
                }}
              >
                <i className="ti ti-photo-plus" style={{ fontSize: 24, color: "#bbb" }} />
                <span style={{ fontSize: 12, color: "#999" }}>
                  {uploading ? "Uploading…" : "Click to upload background"}
                </span>
                <span style={{ fontSize: 10, color: "#bbb" }}>1920×1080px (16:9)</span>
              </div>
            )}
          </Card>

          {/* Status */}
          <Card label="Status">
            <button
              type="button"
              onClick={() => set("is_active", !form.is_active)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 12px",
                background: form.is_active ? "#F0FDF4" : "#F9FAFB",
                border: `0.5px solid ${form.is_active ? "#A7F3D0" : "#E8E6E0"}`,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: form.is_active ? "#065F46" : "#aaa",
                    margin: 0,
                  }}
                >
                  {form.is_active ? "Active" : "Hidden"}
                </p>
                <p style={{ fontSize: 10, color: "#aaa", margin: "2px 0 0" }}>
                  {form.is_active ? "Visible on homepage" : "Not shown on homepage"}
                </p>
              </div>
              <div
                style={{
                  position: "relative",
                  width: 36,
                  height: 20,
                  borderRadius: 99,
                  background: form.is_active ? "#0D1E3D" : "#E8E6E0",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: form.is_active ? 18 : 3,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: form.is_active ? "#E8D5A3" : "#FFFFFF",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    transition: "left 0.2s",
                  }}
                />
              </div>
            </button>
          </Card>

          {/* Display order */}
          <Card label="Display Order">
            <input
              type="number"
              min={1}
              value={form.display_order}
              onChange={(e) => set("display_order", parseInt(e.target.value) || 1)}
              style={inputSt}
            />
            <p style={{ fontSize: 10, color: "#aaa", marginTop: 6 }}>
              Lower numbers appear first. Drag rows in the list to reorder.
            </p>
          </Card>
        </div>
      </div>

      {/* Sticky save bar */}
      {showSaveBar && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 220,
            right: 0,
            background: "#FFFFFF",
            borderTop: "0.5px solid #E8E6E0",
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 30,
          }}
        >
          <Link
            href="/admin/slides"
            style={{ fontSize: 13, color: "#888", textDecoration: "none" }}
          >
            ← Back to slides
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mode === "edit" && (
              <button
                type="button"
                onClick={handleDiscard}
                style={{
                  padding: "8px 16px",
                  fontSize: 13,
                  border: "0.5px solid #E8E6E0",
                  borderRadius: 7,
                  background: "#F5F3F0",
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                Discard
              </button>
            )}
            <button
              type="submit"
              form="slide-form"
              disabled={saving}
              style={{
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 600,
                background: saving ? "#8B9BB4" : "#0D1E3D",
                color: "#E8D5A3",
                border: "none",
                borderRadius: 7,
                cursor: saving ? "wait" : "pointer",
              }}
            >
              {saving ? "Saving…" : mode === "new" ? "Create Slide" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
