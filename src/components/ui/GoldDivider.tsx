"use client";

export default function GoldDivider() {
  return (
    <div style={{
      width: "100%",
      height: "2px",
      background: "linear-gradient(to right, transparent 0%, #C9A84C 20%, #E8D5A3 50%, #C9A84C 80%, transparent 100%)",
      flexShrink: 0,
    }} />
  );
}
