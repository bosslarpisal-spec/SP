"use client";
import { useLang } from "@/contexts/LanguageContext";

export default function LangToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      title={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "rgba(28,41,81,0.92)",
        border: "1px solid rgba(232,213,163,0.35)",
        borderRadius: "20px",
        padding: "7px 14px",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      }}
    >
      <span style={{ fontSize: "16px", lineHeight: 1 }}>
        {lang === "th" ? "🇹🇭" : "🇬🇧"}
      </span>
      <span style={{
        fontSize: "11px",
        fontWeight: 500,
        color: "#E8D5A3",
        letterSpacing: "0.05em",
      }}>
        {lang === "th" ? "ไทย" : "EN"}
      </span>
    </button>
  );
}
