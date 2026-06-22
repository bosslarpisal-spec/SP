"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const NAV_GROUPS = [
  {
    label: "MAIN",
    items: [
      { href: "/admin",          label: "Dashboard", icon: "ti-layout-dashboard" },
      { href: "/admin/products", label: "Products",  icon: "ti-package" },
      { href: "/admin/content",  label: "Content",    icon: "ti-file-text" },
      { href: "/admin/slides",   label: "Hero Slides", icon: "ti-slideshow" },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { href: "/admin/profile",  label: "Profile",   icon: "ti-user-shield" },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin":          "Dashboard",
  "/admin/products": "Products",
  "/admin/content":  "Content",
  "/admin/slides":   "Hero Slides",
  "/admin/profile":  "Profile",
};

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Admin";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export default function AdminShell({
  adminEmail,
  children,
}: {
  adminEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pageTitle =
    Object.entries(PAGE_TITLES)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([key]) => pathname === key || pathname.startsWith(key + "/"))?.[1] ??
    "Admin";

  const displayName = nameFromEmail(adminEmail);
  const initial = (adminEmail?.[0] ?? "A").toUpperCase();

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const Sidebar = () => (
    <aside
      style={{
        width: 220,
        background: "#0D1E3D",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Logo area */}
      <div
        style={{ padding: "20px 24px 16px", borderBottom: "0.5px solid rgba(232,213,163,0.15)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "1px solid rgba(232,213,163,0.4)", display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <Image
              src="/F2.png"
              alt="SP Logo"
              width={32}
              height={32}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              SP Admin
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(232,213,163,0.6)",
                marginTop: 1,
              }}
            >
              Siam Premium
            </div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.22)",
                textTransform: "uppercase",
                padding: "10px 20px 6px",
              }}
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href + "/")) ||
                (item.href === "/admin/products" && pathname.startsWith("/admin/products"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 20px",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#E8D5A3" : "rgba(255,255,255,0.45)",
                    background: isActive ? "rgba(232,213,163,0.09)" : "transparent",
                    borderLeft: isActive ? "3px solid #E8D5A3" : "3px solid transparent",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)";
                    }
                  }}
                >
                  <i className={`ti ${item.icon}`} style={{ fontSize: 15, flexShrink: 0, color: isActive ? "#E8D5A3" : "rgba(255,255,255,0.35)" }} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />

        {/* Public site */}
        <a
          href="/home"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(255,255,255,0.45)",
            borderLeft: "3px solid transparent",
            textDecoration: "none",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)";
          }}
        >
          <i className="ti ti-arrow-left" style={{ fontSize: 15 }} />
          Public site
        </a>

        {/* Sign out */}
        <button
          onClick={signOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(240,149,149,0.6)",
            background: "transparent",
            border: "none",
            borderLeft: "3px solid transparent",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#F09595";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,149,149,0.6)";
          }}
        >
          <i className="ti ti-logout" style={{ fontSize: 15 }} />
          Sign Out
        </button>
      </nav>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop sidebar */}
      <div
        className="hidden md:flex"
        style={{
          width: 220,
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
        }}
      >
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
            }}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div style={{ position: "relative", width: 220, zIndex: 51 }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className="md:ml-[220px]"
        style={{ flex: 1, minHeight: "100vh", background: "#F7F6F3" }}
      >
        {/* Top bar */}
        <div
          style={{
            height: 50,
            background: "#FFFFFF",
            borderBottom: "0.5px solid #E8E6E0",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              style={{
                padding: "6px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#888",
                marginRight: 4,
              }}
            >
              <i className="ti ti-menu-2" style={{ fontSize: 20 }} />
            </button>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#1a1a1a",
              }}
            >
              {pageTitle}
            </span>
          </div>

          {/* Right: bell, settings, user chip */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              title="Notifications"
              style={{
                width: 30, height: 30, display: "flex", alignItems: "center",
                justifyContent: "center", background: "#F7F6F3",
                border: "0.5px solid #E8E6E0", borderRadius: 7,
                color: "#0D1E3D", cursor: "default",
              }}
            >
              <i className="ti ti-bell" style={{ fontSize: 15 }} />
            </button>
            <Link
              href="/admin/profile"
              title="Settings"
              style={{
                width: 30, height: 30, display: "flex", alignItems: "center",
                justifyContent: "center", background: "#F7F6F3",
                border: "0.5px solid #E8E6E0", borderRadius: 7,
                color: "#0D1E3D", textDecoration: "none",
              }}
            >
              <i className="ti ti-settings" style={{ fontSize: 15 }} />
            </Link>

            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "transparent", border: "none", cursor: "pointer",
                  padding: "4px 6px 4px 4px", borderRadius: 7,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#0D1E3D",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#E8D5A3",
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </div>
                <span
                  className="hidden sm:block"
                  style={{ fontSize: 12, color: "#333", fontWeight: 500 }}
                >
                  {displayName}
                </span>
                <i className="ti ti-chevron-down" style={{ fontSize: 12, color: "#aaa" }} />
              </button>
              {userMenuOpen && (
                <div
                  style={{
                    position: "absolute", right: 0, top: "calc(100% + 6px)",
                    background: "#FFFFFF", border: "0.5px solid #E8E6E0",
                    borderRadius: 8, minWidth: 160, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    overflow: "hidden", zIndex: 60,
                  }}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div style={{ padding: "10px 14px", borderBottom: "0.5px solid #E8E6E0" }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", margin: 0 }}>{displayName}</p>
                    <p style={{ fontSize: 11, color: "#aaa", margin: "2px 0 0" }}>{adminEmail}</p>
                  </div>
                  <Link
                    href="/admin/profile"
                    style={{ display: "block", padding: "10px 14px", fontSize: 12, color: "#333", textDecoration: "none" }}
                  >
                    Profile settings
                  </Link>
                  <button
                    onClick={signOut}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "10px 14px", fontSize: 12, color: "#A32D2D",
                      background: "transparent", border: "none", cursor: "pointer",
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "28px 32px" }}>{children}</div>
      </div>
    </div>
  );
}
