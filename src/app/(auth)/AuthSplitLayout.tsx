"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface AuthSplitLayoutProps {
  /** Normal-weight first line of the large heading, e.g. "Welcome" */
  leftLine1: string;
  /** Italic second line of the large heading, e.g. "back" */
  leftLine2: string;
  /** Small muted italic tagline below the divider */
  leftSubtext: string;
  /** Right-panel content (form, links, etc.) */
  children: React.ReactNode;
}

export function AuthSplitLayout({
  leftLine1,
  leftLine2,
  leftSubtext,
  children,
}: AuthSplitLayoutProps) {
  return (
    <>
      <style>{`
        .lp-split {
          display: flex;
          min-height: 100vh;
          align-items: stretch;
        }

        /* LEFT — white brand panel
           sticky + explicit height = true 100vh centering regardless
           of how tall the right panel grows                          */
        .lp-left {
          flex: 0 0 45%;
          background: #FFFFFF;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* RIGHT — navy form panel */
        .lp-right {
          flex: 1 1 55%;
          background: #1C2951;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 56px 32px;
        }

        /* mobile-only logo: hidden on desktop, shown on narrow viewports */
        .lp-mobile-logo { display: none; }

        @media (max-width: 767px) {
          .lp-split  { flex-direction: column; }
          .lp-left   { display: none; }
          .lp-right  { flex: 1; min-height: 100svh; padding: 48px 24px 40px; justify-content: flex-start; }
          .lp-mobile-logo { display: flex; margin-bottom: 28px; }
        }
      `}</style>

      <div className="lp-split">

        {/* ════ LEFT PANEL — white brand moment ══════════════════ */}
        <div className="lp-left">
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center",
          }}>

            {/* Small label */}
            <p style={{
              margin: "0 0 28px",
              fontFamily: "Georgia, serif",
              fontSize: "13px",
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8A6E00",
            }}>
              Siam Premium
            </p>

            {/* Large two-line heading */}
            <div style={{ lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              <div style={{
                fontFamily: "Georgia, serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "clamp(38px, 3.2vw, 52px)",
                color: "#1C2951",
              }}>
                {leftLine1}
              </div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "clamp(38px, 3.2vw, 52px)",
                color: "#1C2951",
              }}>
                {leftLine2}
              </div>
            </div>

            {/* Gold divider */}
            <div style={{
              width: "32px", height: "1px",
              background: "#8A6E00", opacity: 0.45,
              margin: "22px 0",
            }} />

            {/* Subtext */}
            <p style={{
              margin: 0,
              fontSize: "13px",
              color: "rgba(28,41,81,0.45)",
              letterSpacing: "0.02em",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
            }}>
              {leftSubtext}
            </p>

          </div>
        </div>

        {/* ════ RIGHT PANEL — navy form area ══════════════════════ */}
        <div className="lp-right">

          {/* Mobile-only logo (hidden on desktop via CSS) */}
          <div className="lp-mobile-logo" style={{ alignItems: "center" }}>
            <Link href="/home" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden",
                border: "1.5px solid rgba(232,213,163,0.3)", flexShrink: 0,
                background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Image src="/F2.png" alt="Siam Premium logo" width={44} height={44}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#E8D5A3", fontFamily: "Georgia, serif", letterSpacing: "0.05em", lineHeight: 1.1 }}>SP</span>
                <span style={{ fontSize: "9px", color: "rgba(232,213,163,0.55)", letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1 }}>Siam Premium</span>
              </div>
            </Link>
          </div>

          {/* Page-specific right-panel content */}
          {children}

        </div>
      </div>
    </>
  );
}
