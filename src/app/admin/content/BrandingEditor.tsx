"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { saveContentField } from "./actions";
import { useToast } from "../components/Toast";
import { th } from "@/app/admin/lib/admin-th";

const FALLBACK = "/F2.png";
const BUCKET = "page-images";

export default function BrandingEditor() {
  const toast = useToast();
  const [currentUrl, setCurrentUrl] = useState<string | null>(null); // null = still loading
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase
      .from("page_content")
      .select("value")
      .eq("page", "site")
      .eq("section", "branding")
      .eq("key", "logo_url")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("[BrandingEditor] logo fetch failed:", error.message);
        }
        setCurrentUrl(data?.value || FALLBACK);
      });
  }, []);

  const isCustom  = !!currentUrl && currentUrl !== FALLBACK;
  const previewSrc = currentUrl ?? FALLBACK;
  const busy      = uploading || saving || currentUrl === null;

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(th.toastLogoSize5);
      return;
    }
    setUploading(true);
    const ext  = file.name.split(".").pop() ?? "png";
    const path = `branding/logo-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true });
    if (error) {
      toast.error(th.toastLogoUploadFail(error.message));
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    setUploading(false);
    setSaving(true);
    try {
      const result = await saveContentField("site", "branding", "logo_url", publicUrl);
      if (!result.ok) {
        toast.error(result.error);
      } else {
        setCurrentUrl(publicUrl);
        toast.success(th.toastLogoUpdated);
      }
    } catch {
      toast.error(th.toastLogoSaveFail);
    } finally {
      setSaving(false);
    }
  }

  async function handleRevert() {
    if (!confirm(th.brandingRevertConfirm)) return;
    setSaving(true);
    try {
      const result = await saveContentField("site", "branding", "logo_url", "");
      if (!result.ok) {
        toast.error(result.error);
      } else {
        setCurrentUrl(FALLBACK);
        toast.success(th.toastLogoReverted);
      }
    } catch {
      toast.error(th.toastLogoSaveFail);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 500 }}>
      {/* Section heading */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px" }}>{th.brandingTitle}</h2>
        <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{th.brandingDesc}</p>
      </div>

      {/* Preview card */}
      <div style={{
        display: "flex", alignItems: "center", gap: 18,
        background: "#F8F6F1", border: "1px solid #E8E6E0",
        borderRadius: 10, padding: "16px 20px", marginBottom: 20,
      }}>
        {/* Dark-background circle — mirrors navbar exactly */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%", overflow: "hidden",
          background: "#0D1E3D", flexShrink: 0,
          border: "1.5px solid rgba(232,213,163,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {currentUrl === null ? (
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>…</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc} alt={th.brandingAlt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>
            {currentUrl === null
              ? th.brandingLoadingLogo
              : isCustom
              ? th.brandingCustomLogo
              : th.brandingDefaultLogo}
          </div>
          {isCustom && (
            <div style={{
              fontSize: 10, color: "#888", wordBreak: "break-all",
              maxWidth: 300, lineHeight: 1.5,
            }}>
              {currentUrl}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        style={{ display: "none" }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          style={{
            padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600,
            background: "#1C2951", color: "#E8D5A3", border: "none",
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.6 : 1,
          }}
        >
          {uploading ? th.brandingUploading : saving ? th.brandingSaving : th.brandingUploadBtn}
        </button>

        {isCustom && !busy && (
          <button
            onClick={handleRevert}
            style={{
              padding: "9px 18px", borderRadius: 7, fontSize: 13,
              background: "transparent", color: "#666",
              border: "1px solid #D4D0C8", cursor: "pointer",
            }}
          >
            {th.brandingRevert}
          </button>
        )}
      </div>

      <p style={{ fontSize: 11, color: "#aaa", marginTop: 10 }}>{th.brandingHint}</p>
    </div>
  );
}
