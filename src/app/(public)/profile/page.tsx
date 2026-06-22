// src/app/(public)/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useWishlist } from "@/hooks/useWishlist";
import WishlistButton from "@/components/public/WishlistButton";
import type { User } from "@supabase/supabase-js";

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "10px", textTransform: "uppercase",
  letterSpacing: "0.1em", color: "#9CA3AF", fontWeight: 500, marginBottom: "5px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#F8F6F1",
  border: "1px solid rgba(28,41,81,0.15)",
  borderRadius: "8px", color: "#0D1E3D",
  padding: "9px 12px", fontSize: "13px",
  outline: "none", boxSizing: "border-box",
};

const goldBtn: React.CSSProperties = {
  background: "#C9A84C", color: "#1C2951", fontWeight: 700,
  fontSize: "12px", padding: "9px 18px", borderRadius: "8px",
  border: "none", cursor: "pointer", transition: "opacity 0.2s",
  whiteSpace: "nowrap" as const,
};

const navyBtn: React.CSSProperties = {
  background: "#1C2951", color: "#FFFFFF", fontWeight: 600,
  fontSize: "12px", padding: "9px 18px", borderRadius: "8px",
  border: "none", cursor: "pointer", transition: "background 0.2s",
  whiteSpace: "nowrap" as const,
};

const cardStyle: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid rgba(28,41,81,0.1)",
  borderRadius: "14px", overflow: "hidden",
  boxShadow: "0 2px 12px rgba(28,41,81,0.06)",
};

const cardHeaderStyle: React.CSSProperties = {
  padding: "14px 20px", display: "flex", alignItems: "center",
  justifyContent: "space-between", borderBottom: "1px solid rgba(28,41,81,0.07)",
  cursor: "pointer",
};

function GoldDivider() {
  return (
    <div style={{
      width: "100%", height: "2px",
      background: "linear-gradient(to right, transparent, #C9A84C 20%, #E8D5A3 50%, #C9A84C 80%, transparent)",
    }} />
  );
}

type WishedProduct = {
  id: number;
  name: string;
  category: string;
  image_url: string | null;
  is_active: boolean;
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
  const [wishedProducts, setWishedProducts] = useState<WishedProduct[]>([]);

  const [wishlistOpen, setWishlistOpen] = useState(true);
  const [accountOpen, setAccountOpen]   = useState(true);
  const [securityOpen, setSecurityOpen] = useState(false);

  const { ids: wishlistIds, isWished, toggle } = useWishlist();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);
      setName(data.user.user_metadata?.full_name ?? "");
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    if (wishlistIds.size === 0) { setWishedProducts([]); return; }
    supabase
      .from("products")
      .select("id,name,category,image_url,is_active")
      .in("id", Array.from(wishlistIds))
      .then(({ data, error }) => {
        if (error) { console.error("wishlist products fetch failed", error); return; }
        setWishedProducts(data ?? []);
      });
  }, [wishlistIds]);

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
    <div style={{ minHeight: "100vh", background: "#F8F6F1", fontFamily: "sans-serif", paddingTop: "72px", paddingBottom: "40px" }}>
      <style>{`
        .profile-input:focus {
          border-color: #1C2951 !important;
          box-shadow: 0 0 0 3px rgba(28,41,81,0.08) !important;
        }
        .gold-btn:hover { opacity: 0.85; }
        .eye-btn:hover { color: #1C2951 !important; }
        .back-link:hover { color: #C9A84C !important; }
        .browse-link:hover { color: #1C2951 !important; }
        .navy-btn:hover { background: #0D1E3D !important; }
        .sign-out-btn:hover { border-color: rgba(239,68,68,0.65) !important; }
        .acc-explore:hover { background: #1C2951 !important; color: #FFFFFF !important; }
        .card-header:hover { background: #F8F6F1; }
        @media (max-width: 640px) {
          .profile-name { font-size: 32px !important; }
          .profile-pad-x { padding-left: 16px !important; padding-right: 16px !important; }
          .profile-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <GoldDivider />

      {/* ← Back */}
      <Link href="/home" className="back-link profile-pad-x" style={{
        padding: "14px 32px 0", display: "flex", alignItems: "center", gap: "4px",
        fontSize: "13px", color: "#1C2951", fontWeight: 500, textDecoration: "none",
        cursor: "pointer", transition: "color 0.15s", width: "fit-content",
      }}>
        <i className="ti ti-arrow-left" style={{ fontSize: "13px" }} />
        Back
      </Link>

      {/* Profile header */}
      <div className="profile-pad-x" style={{
        padding: "20px 32px 16px", display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", borderBottom: "1px solid rgba(28,41,81,0.1)",
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: "10px", letterSpacing: "0.2em", color: "#C9A84C",
            textTransform: "uppercase", fontWeight: 500, marginBottom: "6px",
          }}>
            SP Member Profile
          </div>
          <h1 className="profile-name" style={{
            fontSize: "42px", color: "#1C2951", fontFamily: "Georgia, serif",
            fontWeight: 400, lineHeight: 1, margin: "0 0 6px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {name || "Member"}
          </h1>
          <p style={{ fontSize: "13px", color: "#4A5568", margin: 0 }}>
            {user.email}
          </p>
        </div>

        <div style={{ textAlign: "center", flexShrink: 0, marginLeft: "24px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "#1C2951", border: "2px solid rgba(201,168,76,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: 700, color: "#E8D5A3", marginBottom: "6px",
          }}>
            {initials}
          </div>
          <div style={{
            background: "rgba(28,41,81,0.08)", color: "#1C2951",
            border: "1px solid rgba(28,41,81,0.15)", fontSize: "9px",
            letterSpacing: "0.15em", padding: "3px 8px", borderRadius: "4px",
            textAlign: "center", textTransform: "uppercase",
          }}>
            Member
          </div>
        </div>
      </div>

      <GoldDivider />

      {/* Body */}
      <div className="profile-pad-x" style={{ padding: "20px 32px", display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Wishlist card */}
        <div style={cardStyle}>
          <div className="card-header" onClick={() => setWishlistOpen(o => !o)} style={cardHeaderStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="ti ti-heart" style={{ fontSize: "16px", color: "#1C2951" }} />
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#0D1E3D" }}>My Wishlist</span>
              <span style={{
                background: "rgba(28,41,81,0.06)", color: "#4A5568",
                border: "1px solid rgba(28,41,81,0.1)", fontSize: "11px",
                padding: "2px 8px", borderRadius: "12px", marginLeft: "6px",
              }}>
                {wishedProducts.length} item{wishedProducts.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/home" className="browse-link" onClick={e => e.stopPropagation()}
                style={{ fontSize: "12px", fontWeight: 500, color: "#C9A84C", textDecoration: "none", transition: "color 0.15s" }}>
                Browse Products →
              </Link>
              <i className={`ti ${wishlistOpen ? "ti-chevron-up" : "ti-chevron-down"}`} style={{ fontSize: "14px", color: "#9CA3AF" }} />
            </div>
          </div>

          <div style={{
            maxHeight: wishlistOpen ? "800px" : "0", overflow: "hidden",
            opacity: wishlistOpen ? 1 : 0, transition: "max-height 0.35s ease, opacity 0.25s ease",
          }}>
            <div style={{ padding: "20px" }}>
              {wishedProducts.length === 0 ? (
                <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ fontSize: "32px", color: "rgba(28,41,81,0.12)", lineHeight: 1 }}>♡</div>
                  <p style={{ fontSize: "13px", color: "#4A5568", fontWeight: 500, margin: 0 }}>Your wishlist is empty</p>
                  <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Tap ♡ on any product to save it here.</p>
                  <Link href="/home" className="acc-explore" style={{
                    marginTop: "6px", background: "transparent", border: "1.5px solid #1C2951",
                    color: "#1C2951", fontSize: "12px", fontWeight: 500, padding: "8px 24px",
                    borderRadius: "8px", textDecoration: "none", transition: "background 0.15s, color 0.15s",
                  }}>
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                  {wishedProducts.map(p => {
                    const unavailable = !p.is_active;
                    return (
                      <div key={p.id} style={{
                        background: "#FFFFFF", border: "1.5px solid #C9A84C",
                        borderRadius: "10px", padding: "12px",
                        boxShadow: "0 2px 8px rgba(28,41,81,0.08)",
                        position: "relative",
                        opacity: unavailable ? 0.5 : 1,
                        filter: unavailable ? "grayscale(1)" : "none",
                      }}>
                        {unavailable ? (
                          <div style={{ position: "relative", width: "100%", height: "80px", borderRadius: "8px", overflow: "hidden", marginBottom: "8px" }}>{p.image_url && <Image src={p.image_url} alt={p.name} fill style={{ objectFit: "cover" }} />}</div>
                        ) : (
                          <Link href={`/catalog/${p.id}`}>
                            <div style={{ position: "relative", width: "100%", height: "80px", borderRadius: "8px", overflow: "hidden", marginBottom: "8px" }}>{p.image_url && <Image src={p.image_url} alt={p.name} fill style={{ objectFit: "cover" }} />}</div>
                          </Link>
                        )}
                        <div style={{ position: "absolute", top: "8px", right: "8px" }}>
                          <WishlistButton productId={p.id} wished={isWished(p.id)} onToggle={toggle} size="sm" />
                        </div>
                        {unavailable ? (
                          <>
                            <p style={{ fontSize: "12px", fontWeight: 500, color: "#9CA3AF", margin: "0 0 2px", lineHeight: 1.4 }}>{p.name}</p>
                            <span style={{ fontSize: "11px", color: "rgba(239,68,68,0.65)" }}>Unavailable</span>
                          </>
                        ) : (
                          <>
                            <Link href={`/catalog/${p.id}`} style={{ fontSize: "12px", fontWeight: 500, color: "#0D1E3D", textDecoration: "none", display: "block", lineHeight: 1.4, marginBottom: "2px" }}>
                              {p.name}
                            </Link>
                            <span style={{ fontSize: "11px", color: "#C9A84C" }}>{p.category}</span>
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

        {/* Account Settings + Security */}
        <div className="profile-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

          {/* Account Settings */}
          <div style={cardStyle}>
            <div className="card-header" onClick={() => setAccountOpen(o => !o)} style={cardHeaderStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="ti ti-user" style={{ fontSize: "16px", color: "#1C2951" }} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#0D1E3D" }}>Account Settings</span>
              </div>
              <i className={`ti ${accountOpen ? "ti-chevron-up" : "ti-chevron-down"}`} style={{ fontSize: "14px", color: "#9CA3AF" }} />
            </div>
            <div style={{
              maxHeight: accountOpen ? "300px" : "0", overflow: "hidden",
              opacity: accountOpen ? 1 : 0, transition: "max-height 0.35s ease, opacity 0.25s ease",
            }}>
              <div style={{ padding: "20px" }}>
                <label style={labelStyle}>Display Name</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    className="profile-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    style={inputStyle}
                  />
                  <button className="gold-btn" onClick={saveName} style={goldBtn}>
                    {nameSaved ? "Saved ✓" : "Save"}
                  </button>
                </div>

                <div style={{ marginTop: "14px" }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    className="profile-input"
                    value={user.email ?? ""}
                    disabled
                    style={{
                      ...inputStyle,
                      background: "rgba(28,41,81,0.03)", border: "1px solid rgba(28,41,81,0.08)",
                      color: "#9CA3AF", cursor: "not-allowed",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div style={cardStyle}>
            <div className="card-header" onClick={() => setSecurityOpen(o => !o)} style={cardHeaderStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="ti ti-lock" style={{ fontSize: "16px", color: "#1C2951" }} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#0D1E3D" }}>Security</span>
              </div>
              <i className={`ti ${securityOpen ? "ti-chevron-up" : "ti-chevron-down"}`} style={{ fontSize: "14px", color: "#9CA3AF" }} />
            </div>
            <div style={{
              maxHeight: securityOpen ? "400px" : "0", overflow: "hidden",
              opacity: securityOpen ? 1 : 0, transition: "max-height 0.35s ease, opacity 0.25s ease",
            }}>
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, display: "flex", transition: "color 0.15s" }}>
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
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, display: "flex", transition: "color 0.15s" }}>
                        {showConfirmPw ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                  {pwError && <p style={{ fontSize: "12px", color: "#DC2626", marginTop: "6px", margin: 0 }}>{pwError}</p>}
                  {pwSaved && <p style={{ fontSize: "12px", color: "#059669", marginTop: "6px", margin: 0 }}>Password updated successfully.</p>}
                  <button className="navy-btn" onClick={savePassword} disabled={pwSaving}
                    style={{ ...navyBtn, width: "100%", marginTop: "12px", opacity: pwSaving ? 0.6 : 1, cursor: pwSaving ? "not-allowed" : "pointer" }}>
                    {pwSaving ? "Saving…" : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <button className="sign-out-btn" onClick={handleSignOut}
            style={{
              background: "transparent", border: "1.5px solid rgba(239,68,68,0.35)",
              color: "rgba(239,68,68,0.65)", borderRadius: "8px", padding: "10px 32px",
              fontSize: "13px", fontWeight: 500, cursor: "pointer", transition: "border-color 0.15s",
            }}>
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
