// src/app/(public)/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { PRODUCTS } from "@/lib/data";
import { useWishlist } from "@/hooks/useWishlist";
import WishlistButton from "@/components/public/WishlistButton";
import type { User } from "@supabase/supabase-js";

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", textTransform: "uppercase",
  letterSpacing: "0.12em", color: "#4A5568", marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#F8F6F1",
  border: "1px solid rgba(13,30,61,0.15)",
  borderRadius: "8px", color: "#0D1E3D",
  padding: "10px 16px", fontSize: "14px",
  outline: "none", boxSizing: "border-box",
};

const goldBtn: React.CSSProperties = {
  background: "#E8D5A3", color: "#1C2951", fontWeight: 600,
  fontSize: "13px", padding: "10px 22px", borderRadius: "8px",
  border: "none", cursor: "pointer", transition: "opacity 0.2s",
  whiteSpace: "nowrap" as const,
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser]                   = useState<User | null>(null);
  const [loading, setLoading]             = useState(true);
  const [name, setName]                   = useState("");
  const [nameSaved, setNameSaved]         = useState(false);
  const [pwSaved, setPwSaved]             = useState(false);
  const [pwError, setPwError]             = useState("");
  const [pwSaving, setPwSaving]           = useState(false);
  const [newPw, setNewPw]                 = useState("");
  const [confirmPw, setConfirmPw]         = useState("");
  const [showNewPw, setShowNewPw]         = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [activeIds, setActiveIds]         = useState<Set<string>>(new Set());

  const [wishlistOpen, setWishlistOpen] = useState(true);
  const [accountOpen, setAccountOpen]   = useState(true);
  const [securityOpen, setSecurityOpen] = useState(false);

  const { ids: wishlistIds, isWished, toggle } = useWishlist();
  const wishedProducts = PRODUCTS.filter(p => wishlistIds.has(p.id));

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);
      setName(data.user.user_metadata?.full_name ?? "");
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    supabase
      .from("products")
      .select("id")
      .eq("is_active", true)
      .then(({ data, error }) => {
        if (error) { console.error("wishlist query failed", error); return; }
        if (data) setActiveIds(new Set(data.map(p => String(p.id))));
      });
  }, []);

  if (loading || !user) return null;

  async function saveName() {
    await supabase.auth.updateUser({ data: { full_name: name } });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  }

  async function savePassword() {
    setPwError("");
    if (newPw.length < 6) return setPwError("Password must be at least 6 characters.");
    if (newPw !== confirmPw) return setPwError("Passwords do not match.");
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwSaving(false);
    if (error) return setPwError(error.message);
    setNewPw(""); setConfirmPw("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/home");
  }

  const initials = (name || user.email || "?")[0].toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#F8F6F1" }}>
      <style>{`
        .profile-input:focus {
          border-color: #1C2951 !important;
          box-shadow: 0 0 0 3px rgba(28,41,81,0.08) !important;
        }
        .gold-btn:hover { opacity: 0.85; }
        .eye-btn:hover { color: #8A6E00 !important; }
        .sign-out-btn:hover { background: rgba(239,68,68,0.2) !important; color: rgba(239,68,68,1) !important; border-color: rgba(239,68,68,0.5) !important; }
        .acc-explore:hover { background: rgba(13,30,61,0.06) !important; }
        .acc-header:hover { background: #FAFAF8; }
        @media (max-width: 640px) {
          .profile-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── SECTION 1: MAGAZINE HEADER ────────────────────────── */}
      <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", padding: "48px 0 0" }}>
        <div style={{ maxWidth: "896px", margin: "0 auto", padding: "0 32px" }}>

          <Link href="/home" style={{ fontSize: "13px", color: "#8A6E00", textDecoration: "none" }}>
            ← Back
          </Link>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "20px" }}>
            {/* Left: label + name + email */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#8A6E00", textTransform: "uppercase" }}>
                SP Member Profile
              </div>
              <h1 style={{
                fontSize: "clamp(40px, 6vw, 72px)",
                fontFamily: "Georgia, serif", fontWeight: 400,
                color: "#0D1E3D", lineHeight: 1,
                margin: "4px 0 0", overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {name || "Member"}
              </h1>
              <p style={{ fontSize: "13px", color: "#4A5568", margin: "8px 0 0" }}>
                {user.email}
              </p>
            </div>

            {/* Right: avatar + MEMBER stamp */}
            <div style={{ textAlign: "center", flexShrink: 0, marginLeft: "32px" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "#1C2951",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", fontWeight: 600, color: "#E8D5A3",
                fontFamily: "Georgia, serif",
                outline: "3px solid rgba(28,41,81,0.15)",
                outlineOffset: "4px",
              }}>
                {initials}
              </div>
              <div style={{
                fontSize: "9px", letterSpacing: "0.2em", color: "#8A6E00",
                textAlign: "center", marginTop: "6px",
                border: "1px solid rgba(138,110,0,0.3)",
                padding: "2px 8px", borderRadius: "3px",
                textTransform: "uppercase",
              }}>
                Member
              </div>
            </div>
          </div>

          {/* Gold gradient divider */}
          <div style={{
            height: "2px",
            background: "linear-gradient(to right, #E8D5A3, rgba(232,213,163,0.1))",
            marginTop: "32px",
          }} />
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div style={{ maxWidth: "896px", margin: "0 auto", padding: "32px 32px 0" }}>

        {/* ── SECTION 2: WISHLIST ACCORDION ─────────────────── */}
        <div style={{
          background: "rgba(255,255,255,0.92)", borderRadius: "16px",
          boxShadow: "0 2px 20px rgba(0,0,0,0.12)",
          marginBottom: "16px", overflow: "hidden",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        }}>
          <div className="acc-header"
            onClick={() => setWishlistOpen(o => !o)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", cursor: "pointer", transition: "background 0.15s" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", fill: "#8A6E00", stroke: "#8A6E00", flexShrink: 0 }}
                strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span style={{ fontSize: "15px", fontWeight: 500, color: "#0D1E3D" }}>My Wishlist</span>
              <span style={{ background: "#F0EEE8", color: "#4A5568", fontSize: "11px", padding: "2px 8px", borderRadius: "10px" }}>
                {wishedProducts.length} item{wishedProducts.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/home" onClick={e => e.stopPropagation()}
                style={{ fontSize: "12px", color: "#8A6E00", textDecoration: "none" }}>
                Browse Products →
              </Link>
              <i className="ti ti-chevron-down" style={{
                fontSize: "16px", color: "#8A6E00",
                transform: wishlistOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }} />
            </div>
          </div>

          <div style={{
            maxHeight: wishlistOpen ? "800px" : "0",
            overflow: "hidden",
            opacity: wishlistOpen ? 1 : 0,
            transition: "max-height 0.35s ease, opacity 0.25s ease",
          }}>
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid #F0EDE8" }}>
              {wishedProducts.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: "32px", paddingBottom: "32px" }}>
                  <div style={{ fontSize: "48px", color: "rgba(13,30,61,0.15)", lineHeight: 1 }}>♡</div>
                  <p style={{ fontSize: "14px", color: "#4A5568", margin: "8px 0 0" }}>Your wishlist is empty</p>
                  <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>Tap ♡ on any product to save it here.</p>
                  <Link href="/home" className="acc-explore" style={{
                    display: "inline-block", marginTop: "16px",
                    border: "1px solid rgba(13,30,61,0.2)",
                    color: "#0D1E3D", background: "transparent",
                    padding: "8px 20px", borderRadius: "8px",
                    fontSize: "14px", textDecoration: "none",
                    transition: "background 0.15s",
                  }}>
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", paddingTop: "16px" }}>
                  {wishedProducts.map(p => {
                    const unavailable = !activeIds.has(String(p.id));
                    return (
                      <div key={p.id} style={{
                        background: "#FFFFFF", border: "1px solid #F0EDE8",
                        borderRadius: "12px", padding: "12px",
                        position: "relative",
                        opacity: unavailable ? 0.5 : 1,
                        filter: unavailable ? "grayscale(1)" : "none",
                      }}>
                        {unavailable ? (
                          <div style={{ position: "relative", width: "100%", height: "80px", borderRadius: "8px", overflow: "hidden", marginBottom: "8px" }}><Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} /></div>
                        ) : (
                          <Link href={`/catalog/${p.id}`}>
                            <div style={{ position: "relative", width: "100%", height: "80px", borderRadius: "8px", overflow: "hidden", marginBottom: "8px" }}><Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} /></div>
                          </Link>
                        )}
                        <div style={{ position: "absolute", top: "8px", right: "8px" }}>
                          <WishlistButton productId={p.id} wished={isWished(p.id)} onToggle={toggle} size="sm" />
                        </div>
                        {unavailable ? (
                          <>
                            <p style={{ fontSize: "12px", fontWeight: 500, color: "#8A9AB8", margin: "0 0 2px", lineHeight: 1.4 }}>{p.name}</p>
                            <span style={{ fontSize: "11px", color: "rgba(239,68,68,0.6)" }}>Unavailable</span>
                          </>
                        ) : (
                          <>
                            <Link href={`/catalog/${p.id}`} style={{ fontSize: "12px", fontWeight: 500, color: "#0D1E3D", textDecoration: "none", display: "block", lineHeight: 1.4, marginBottom: "2px" }}>
                              {p.name}
                            </Link>
                            <span style={{ fontSize: "11px", color: "#4A5568" }}>{p.category}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: TWO-COLUMN ROW ─────────────────────── */}
        <div className="profile-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>

          {/* LEFT: Account Settings */}
          <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderRadius: "16px", boxShadow: "0 2px 20px rgba(0,0,0,0.12)", overflow: "hidden" }}>
            <div className="acc-header"
              onClick={() => setAccountOpen(o => !o)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", cursor: "pointer", transition: "background 0.15s" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="ti ti-user" style={{ fontSize: "16px", color: "#8A6E00" }} />
                <span style={{ fontSize: "15px", fontWeight: 500, color: "#0D1E3D" }}>Account Settings</span>
              </div>
              <i className="ti ti-chevron-down" style={{
                fontSize: "16px", color: "#8A6E00",
                transform: accountOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }} />
            </div>
            <div style={{
              maxHeight: accountOpen ? "300px" : "0",
              overflow: "hidden", opacity: accountOpen ? 1 : 0,
              transition: "max-height 0.35s ease, opacity 0.25s ease",
            }}>
              <div style={{ padding: "0 24px 24px", borderTop: "1px solid #F0EDE8" }}>
                <div style={{ paddingTop: "16px" }}>
                  <label style={labelStyle}>Display Name</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    <input
                      className="profile-input"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      style={inputStyle}
                    />
                    <button className="gold-btn" onClick={saveName}
                      style={{ ...goldBtn, background: nameSaved ? "#5A8A5A" : "#E8D5A3" }}>
                      {nameSaved ? "Saved ✓" : "Save"}
                    </button>
                  </div>
                  <div style={{ borderTop: "1px solid #F0EDE8", margin: "0 0 16px" }} />
                  <label style={labelStyle}>Email</label>
                  <input
                    className="profile-input"
                    value={user.email ?? ""}
                    disabled
                    style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Security / Change Password */}
          <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderRadius: "16px", boxShadow: "0 2px 20px rgba(0,0,0,0.12)", overflow: "hidden" }}>
            <div className="acc-header"
              onClick={() => setSecurityOpen(o => !o)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", cursor: "pointer", transition: "background 0.15s" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="ti ti-lock" style={{ fontSize: "16px", color: "#8A6E00" }} />
                <span style={{ fontSize: "15px", fontWeight: 500, color: "#0D1E3D" }}>Security</span>
              </div>
              <i className="ti ti-chevron-down" style={{
                fontSize: "16px", color: "#8A6E00",
                transform: securityOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }} />
            </div>
            <div style={{
              maxHeight: securityOpen ? "400px" : "0",
              overflow: "hidden", opacity: securityOpen ? 1 : 0,
              transition: "max-height 0.35s ease, opacity 0.25s ease",
            }}>
              <div style={{ padding: "0 24px 24px", borderTop: "1px solid #F0EDE8" }}>
                <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="profile-input"
                        type={showNewPw ? "text" : "password"}
                        value={newPw}
                        onChange={e => setNewPw(e.target.value)}
                        placeholder="••••••••"
                        style={{ ...inputStyle, paddingRight: "42px" }}
                      />
                      <button type="button" className="eye-btn" onClick={() => setShowNewPw(p => !p)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8A9AB8", padding: 0, display: "flex", transition: "color 0.15s" }}>
                        {showNewPw ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="profile-input"
                        type={showConfirmPw ? "text" : "password"}
                        value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)}
                        placeholder="••••••••"
                        style={{ ...inputStyle, paddingRight: "42px" }}
                      />
                      <button type="button" className="eye-btn" onClick={() => setShowConfirmPw(p => !p)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8A9AB8", padding: 0, display: "flex", transition: "color 0.15s" }}>
                        {showConfirmPw ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                  {pwError && <p style={{ fontSize: "12px", color: "rgba(239,68,68,0.8)", margin: 0 }}>{pwError}</p>}
                  {pwSaved && <p style={{ fontSize: "12px", color: "#5A8A5A", margin: 0, fontWeight: 500 }}>Password updated successfully.</p>}
                  <button className="gold-btn" onClick={savePassword} disabled={pwSaving}
                    style={{ ...goldBtn, width: "100%", opacity: pwSaving ? 0.6 : 1, cursor: pwSaving ? "not-allowed" : "pointer" }}>
                    {pwSaving ? "Saving…" : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: SIGN OUT ───────────────────────────── */}
        <div style={{ marginTop: "24px", marginBottom: "48px", textAlign: "center" }}>
          <button className="sign-out-btn" onClick={handleSignOut}
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.75)", fontSize: "13px", fontWeight: 500, padding: "9px 28px", borderRadius: "8px", cursor: "pointer", transition: "background 0.15s, color 0.15s, border-color 0.15s" }}>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }} fill="none"
      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }} fill="none"
      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.49 18.49 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
