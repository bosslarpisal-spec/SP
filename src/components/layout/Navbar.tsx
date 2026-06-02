"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/contexts/LanguageContext";

export default function Navbar() {
  const pathname               = usePathname();
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
    <header
      className="sticky top-0 z-50 flex items-stretch"
      style={{ minHeight: "72px", background: "#1C2951", borderBottom: "0.5px solid rgba(232,213,163,0.12)", paddingLeft: "40px", paddingRight: "40px" }}
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
            src="/F2.png"
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
              color: isActive(l.href) ? "#E8D5A3" : "#8A9AB8",
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
      <div className="hidden md:flex items-center gap-2 ml-auto">
        {isAdmin && (
          <Link
            href="/admin"
            style={{
              fontSize: "12px", fontWeight: 500, color: "#8A9AB8",
              border: "0.5px solid rgba(232,213,163,0.2)",
              padding: "8px 16px", borderRadius: "5px",
            }}
          >
            Admin
          </Link>
        )}
        {isUser ? (
          <Link
            href="/profile"
            style={{
              fontSize: "12px", color: "#E8D5A3",
              border: "0.5px solid rgba(255,255,255,0.25)",
              padding: "8px 16px", borderRadius: "5px",
            }}
          >
            {t("บัญชีของฉัน", "My Account")}
          </Link>
        ) : (
          <Link
            href="/login"
            style={{
              fontSize: "12px", color: "#E8D5A3",
              border: "0.5px solid rgba(255,255,255,0.25)",
              padding: "8px 16px", borderRadius: "5px",
            }}
          >
            {t("เข้าสู่ระบบ", "Sign In")}
          </Link>
        )}
        <Link
          href="/contact"
          style={{
            fontSize: "12px", fontWeight: 500,
            background: "#E8D5A3", color: "#1C2951",
            padding: "8px 16px", borderRadius: "5px",
          }}
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
  );
}
