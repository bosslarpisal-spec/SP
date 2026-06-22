"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/contexts/LanguageContext";
import { useLogoUrl } from "@/hooks/useLogoUrl";

export default function Navbar() {
  const pathname               = usePathname();
  const logoUrl                = useLogoUrl();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin,  setIsAdmin]  = useState(false);
  const [isUser,   setIsUser]   = useState(false);
  const { t } = useLang();
  const LINKS = [
    { label: t("หน้าหลัก", "Home"),      href: "/home" },
    { label: t("เกี่ยวกับเรา", "About"), href: "/about" },
    { label: t("บริการ", "Services"),    href: "/services" },
    { label: t("ผลงาน", "Our Work"),     href: "/our-work" },
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user ?? null;
      setIsUser(!!u);
      if (u) {
        const { data: adminRow } = await supabase
          .from("admins").select("id").eq("email", u.email ?? "").maybeSingle();
        setIsAdmin(!!adminRow);
      } else {
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <style>{`
        .nav-icon-btn:hover { background: rgba(13,30,61,0.95) !important; border-color: rgba(232,213,163,0.6) !important; }
        .nav-quote-btn:hover { background: #E8D5A3 !important; color: #1C2951 !important; }
      `}</style>
    <header
      className="fixed top-0 inset-x-0 z-50 flex items-stretch"
      style={{
        minHeight: "72px",
        background: "#0D1E3D",
        borderBottom: "1px solid rgba(232,213,163,0.35)",
        paddingLeft: "40px",
        paddingRight: "40px",
      }}
    >
      {/* Logo */}
      <Link
        href="/home"
        title="Siam Premium Products & Distribution"
        className="flex items-center gap-3 shrink-0"
      >
        <div
          className="w-11 h-11 md:w-[52px] md:h-[52px]"
          style={{
            borderRadius: "50%", overflow: "hidden",
            border: "1.5px solid rgba(232,213,163,0.5)",
            outline: "1px solid rgba(232,213,163,0.15)", outlineOffset: "3px",
            flexShrink: 0, background: "#FFFFFF",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="Siam Premium logo"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div>
          <div style={{
            fontSize: "16px", fontWeight: 700, color: "#E8D5A3",
            fontFamily: "Georgia, serif", letterSpacing: "0.08em", lineHeight: 1.1,
          }}>SP</div>
          <div className="hidden md:block" style={{
            fontSize: "10px", color: "rgba(232,213,163,0.65)",
            letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1,
          }}>Siam Premium</div>
        </div>
      </Link>

      {/* Separator */}
      <div style={{
        width: "0.5px", height: "32px",
        background: "rgba(232,213,163,0.2)",
        marginLeft: "16px", marginRight: "4px",
        flexShrink: 0, alignSelf: "center",
      }} />

      {/* Desktop nav links */}
      <nav className="hidden md:flex flex-1 items-stretch">
        {LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center h-full"
            style={{
              fontSize: "14px",
              color: isActive(l.href) ? "#E8D5A3" : "rgba(255,255,255,0.8)",
              padding: "0 16px",
              borderBottom: isActive(l.href) ? "2px solid #E8D5A3" : "2px solid transparent",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Right buttons */}
      <div className="hidden md:flex items-center ml-auto" style={{ gap: "8px" }}>
        {isAdmin && (
          <Link
            href="/admin"
            title="Admin Panel"
            className="nav-icon-btn"
            style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(13,30,61,0.8)", border: "1px solid rgba(232,213,163,0.35)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", textDecoration: "none", flexShrink: 0 }}
          >
            <i className="ti ti-shield" style={{ fontSize: "16px", color: "#E8D5A3" }} />
          </Link>
        )}
        <Link
          href="/profile"
          title="My Account"
          className="nav-icon-btn"
          style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(13,30,61,0.8)", border: "1px solid rgba(232,213,163,0.35)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", textDecoration: "none", flexShrink: 0 }}
        >
          <i className="ti ti-user" style={{ fontSize: "16px", color: "#E8D5A3" }} />
        </Link>
        <Link
          href="/contact"
          className="nav-quote-btn"
          style={{ background: "rgba(13,30,61,0.8)", border: "1.5px solid #E8D5A3", color: "#E8D5A3", fontSize: "12px", fontWeight: 600, padding: "8px 18px", borderRadius: "6px", cursor: "pointer", textDecoration: "none", letterSpacing: "0.03em", whiteSpace: "nowrap", flexShrink: 0 }}
        >
          {t("ขอใบเสนอราคา", "Get a Quote")}
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2 ml-auto my-auto"
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
      >
        {[0,1,2].map(i => (
          <span key={i} className="block w-5 h-px" style={{ background: "#8A9AB8" }} />
        ))}
      </button>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="md:hidden absolute inset-x-0 top-full z-40 py-5 px-10 flex flex-col gap-4"
          style={{ background: "#1C2951", borderBottom: "0.5px solid rgba(232,213,163,0.12)" }}
        >
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: "14px", color: isActive(l.href) ? "#E8D5A3" : "#8A9AB8" }}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-2 pt-3" style={{ borderTop: "0.5px solid rgba(232,213,163,0.1)" }}>
            <Link href="/contact" onClick={() => setMenuOpen(false)}
              style={{ fontSize: "12px", fontWeight: 500, background: "#E8D5A3", color: "#1C2951", padding: "9px 16px", borderRadius: "5px", textAlign: "center" }}>
              {t("ขอใบเสนอราคา", "Get a Quote")}
            </Link>
            {isUser ? (
              <Link href="/profile" onClick={() => setMenuOpen(false)}
                style={{ fontSize: "12px", color: "#E8D5A3", border: "0.5px solid rgba(255,255,255,0.25)", padding: "8px 16px", borderRadius: "5px", textAlign: "center" }}>
                {t("บัญชีของฉัน", "My Account")}
              </Link>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                style={{ fontSize: "12px", color: "#E8D5A3", border: "0.5px solid rgba(255,255,255,0.25)", padding: "8px 16px", borderRadius: "5px", textAlign: "center" }}>
                {t("เข้าสู่ระบบ", "Sign In")}
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" onClick={() => setMenuOpen(false)}
                style={{ fontSize: "12px", color: "#8A9AB8", textAlign: "center" }}>
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
}
