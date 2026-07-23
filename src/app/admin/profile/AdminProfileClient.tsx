// src/app/admin/profile/AdminProfileClient.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { addAdmin, removeAdmin, changeAdminPassword } from "./actions";
import { useToast } from "../components/Toast";
import { th } from "@/app/admin/lib/admin-th";
import { nameFromEmail } from "@/app/admin/lib/format";

type Admin = {
  id: number;
  email: string;
  created_at: string;
  hasAccount: boolean;
  lastSignInAt: string | null;
};

const STALE_MS = 90 * 24 * 60 * 60 * 1000;

// Supabase timestamps carry their own UTC offset, so diffing against Date.now()
// (also UTC epoch ms) is timezone-safe on its own — no explicit +7 offset needed.
function relativeTimeThai(iso: string): string {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const hour = Math.floor(sec / 3600);
  if (hour < 1) return th.timeJustNow;
  if (hour < 24) return th.timeHoursAgo(hour);
  const day = Math.floor(sec / 86400);
  if (day < 30) return th.timeDaysAgo(day);
  const month = Math.floor(day / 30);
  if (month < 12) return th.timeMonthsAgo(month);
  const year = Math.floor(day / 365);
  return th.timeYearsAgo(year);
}

// Renders email + "last used" text. Starts with no computed state so the
// server-rendered HTML and the client's first paint are identical (both show
// the plain, un-dimmed email and no "last used" line); the actual relative
// time and staleness are filled in by this effect after mount, which is a
// normal post-hydration update rather than a hydration mismatch.
function AdminEmailRow({ email, lastSignInAt }: { email: string; lastSignInAt: string | null }) {
  const [info, setInfo] = useState<{ text: string; stale: boolean } | null>(null);

  useEffect(() => {
    if (!lastSignInAt) return;
    const ms = Date.now() - new Date(lastSignInAt).getTime();
    setInfo({ text: relativeTimeThai(lastSignInAt), stale: ms > STALE_MS });
  }, [lastSignInAt]);

  return (
    <>
      <p
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: info?.stale ? "#aaa" : "#1a1a1a",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {email}
      </p>
      {info && (
        <p style={{ fontSize: 11, color: "#aaa", margin: "2px 0 0" }}>
          {th.profileLastSignIn(info.text)}
        </p>
      )}
    </>
  );
}

export default function AdminProfileClient({
  currentUserEmail,
  admins: initial,
}: {
  currentUserEmail: string;
  admins: Admin[];
}) {
  const toast = useToast();
  const [admins, setAdmins] = useState(initial);

  // ── Add admin ──────────────────────────────────────────────
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // ── Remove admin ───────────────────────────────────────────
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);

  // ── Change password ────────────────────────────────────────
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // ── Handlers ───────────────────────────────────────────────

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    try {
      const result = await addAdmin(newEmail);
      if (!result.ok) {
        setAddError(result.error);
        toast.error(result.error);
      } else {
        const { ok: _ok, ...adminRow } = result;
        setAdmins((prev) => [...prev, { ...adminRow, hasAccount: false, lastSignInAt: null }]);
        setNewEmail("");
        toast.success(th.toastAdminAdded(adminRow.email));
      }
    } catch {
      toast.error(th.toastAdminAddFail);
    }
    setAdding(false);
  }

  async function handleRemoveAdmin(admin: Admin) {
    setRemovingId(admin.id);
    setConfirmRemoveId(null);
    try {
      const result = await removeAdmin(admin.id);
      if (!result.ok) {
        toast.error(result.error);
      } else {
        setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
        toast.success(th.toastAdminRemoved(admin.email));
      }
    } catch {
      toast.error(th.toastAdminRemoveFail(admin.email));
    }
    setRemovingId(null);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(th.toastPwMismatch);
      return;
    }
    if (newPassword.length < 6) {
      toast.error(th.toastPwTooShort);
      return;
    }
    setChangingPw(true);
    try {
      const result = await changeAdminPassword(newPassword);
      if (!result.ok) {
        toast.error(result.error);
      } else {
        toast.success(th.toastPwUpdated);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast.error(th.toastPwFail);
    }
    setChangingPw(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function handleCopyInstructions(email: string) {
    const signupUrl = `${window.location.origin}/signup`;
    const message = `คุณถูกเพิ่มเป็นแอดมินของ Siam Premium — กรุณาสมัครสมาชิกที่ ${signupUrl} โดยใช้อีเมลนี้: ${email}`;
    try {
      await navigator.clipboard.writeText(message);
      toast.success(th.toastInstructionsCopied);
    } catch {
      toast.error(th.toastCopyFail);
    }
  }

  const displayName = nameFromEmail(currentUserEmail);

  // ── UI ─────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Account info */}
      <div
        style={{
          background: "#FFFFFF",
          border: "0.5px solid #E8E6E0",
          borderRadius: 10,
          padding: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div
            style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "#0D1E3D", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, fontWeight: 600, color: "#E8D5A3",
              flexShrink: 0,
            }}
          >
            {(currentUserEmail[0] ?? "A").toUpperCase()}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{displayName}</p>
              <span
                style={{
                  background: "#0D1E3D", color: "#E8D5A3",
                  fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
                }}
              >
                {th.profileRoleBadge}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#aaa", margin: "2px 0 0" }}>{currentUserEmail}</p>
          </div>
        </div>
      </div>

      {/* Password + Session */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SettingsCard title={th.profilePwCard}>
          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <SLabel>{th.profileNewPw}</SLabel>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={th.profilePwPlaceholder}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#aaa",
                    padding: 0,
                  }}
                >
                  <i
                    className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`}
                    style={{ fontSize: 15 }}
                  />
                </button>
              </div>
            </div>
            <div>
              <SLabel>{th.profileConfirmPw}</SLabel>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder={th.profilePwRepeat}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <PrimaryButton type="submit" disabled={changingPw}>
                {changingPw ? th.profileSavingPw : th.profileUpdatePw}
              </PrimaryButton>
            </div>
          </form>
        </SettingsCard>

        <SettingsCard title={th.profileSessionCard}>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>{th.profileSignedAs}</p>
          <p style={{ fontSize: 13, color: "#333", fontWeight: 500, marginBottom: 16 }}>{currentUserEmail}</p>
          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              padding: "9px 18px",
              background: "#FCEBEB",
              color: "#A32D2D",
              border: "0.5px solid #F09595",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {th.profileSignOut}
          </button>
          <p style={{ fontSize: 11, color: "#aaa", marginTop: 8 }}>{th.profileSignOutDesc}</p>
        </SettingsCard>
      </div>

      {/* Admin Accounts */}
      <div
        style={{
          background: "#FFFFFF",
          border: "0.5px solid #E8E6E0",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "0.5px solid #E8E6E0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
            {th.profileAdminAccounts}
          </p>
          <span
            style={{
              background: "#0D1E3D",
              color: "#E8D5A3",
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 99,
            }}
          >
            {admins.length}
          </span>
        </div>

        <div>
          {admins.map((a) => (
            <div
              key={a.id}
              style={{
                padding: "12px 24px",
                borderBottom: "0.5px solid #F0EDE6",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#0D1E3D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#E8D5A3",
                  flexShrink: 0,
                }}
              >
                {(a.email[0] ?? "A").toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <AdminEmailRow email={a.email} lastSignInAt={a.lastSignInAt} />
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: "#aaa" }}>
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                  {a.email === currentUserEmail && (
                    <span
                      style={{
                        background: "#F5F3F0",
                        color: "#888",
                        border: "0.5px solid #E8E6E0",
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "1px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {th.profileYouBadge}
                    </span>
                  )}
                  {!a.hasAccount && (
                    <span
                      title={th.profilePendingTitle(a.email)}
                      style={{
                        background: "#FEF3C7",
                        color: "#92400E",
                        border: "0.5px solid #FDE68A",
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "1px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {th.profilePendingBadge}
                    </span>
                  )}
                  {a.hasAccount && !a.lastSignInAt && (
                    <span
                      style={{
                        background: "#F5F3F0",
                        color: "#888",
                        border: "0.5px solid #E8E6E0",
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "1px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {th.profileNeverSignedIn}
                    </span>
                  )}
                </div>
              </div>

              {!a.hasAccount && (
                <button
                  onClick={() => handleCopyInstructions(a.email)}
                  title={th.profileCopyInstructions}
                  style={{
                    width: 26,
                    height: 26,
                    border: "0.5px solid #E8E6E0",
                    borderRadius: 4,
                    background: "#F5F3F0",
                    color: "#555",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className="ti ti-copy" style={{ fontSize: 13 }} />
                </button>
              )}

              {a.email !== currentUserEmail && (
                confirmRemoveId === a.id ? (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      onClick={() => handleRemoveAdmin(a)}
                      disabled={removingId === a.id}
                      style={{
                        padding: "3px 8px",
                        background: "#A32D2D",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {th.profileRemove}
                    </button>
                    <button
                      onClick={() => setConfirmRemoveId(null)}
                      style={{
                        padding: "3px 8px",
                        background: "#F5F3F0",
                        color: "#555",
                        border: "none",
                        borderRadius: 4,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      {th.profileCancel}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmRemoveId(a.id)}
                    disabled={removingId === a.id}
                    title={th.profileRemoveTitle}
                    style={{
                      width: 26,
                      height: 26,
                      border: "none",
                      borderRadius: 4,
                      background: "#FCEBEB",
                      color: "#A32D2D",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i className="ti ti-x" style={{ fontSize: 13 }} />
                  </button>
                )
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 24px", borderTop: "0.5px solid #E8E6E0" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "#aaa",
              marginBottom: 10,
            }}
          >
            {th.profileAddAdminLabel}
          </p>
          <form onSubmit={handleAddAdmin} style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <PrimaryButton type="submit" disabled={adding}>
              {adding ? th.profileAdding : th.profileAddBtn}
            </PrimaryButton>
          </form>
          {addError && (
            <p style={{ fontSize: 12, color: "#A32D2D", marginTop: 8 }}>{addError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Shared sub-components ─────────────────────────────── */

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "0.5px solid #E8E6E0",
        borderRadius: 10,
        padding: 24,
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#aaa",
          marginBottom: 16,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 10,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        color: "#aaa",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        padding: "9px 20px",
        background: "#0D1E3D",
        opacity: props.disabled ? 0.5 : 1,
        color: "#E8D5A3",
        border: "none",
        borderRadius: 7,
        fontSize: 13,
        fontWeight: 600,
        cursor: props.disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        transition: "background 0.15s",
      }}
    >
      {children}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#FFFFFF",
  border: "0.5px solid #E8E6E0",
  borderRadius: 7,
  padding: "7px 9px",
  fontSize: 12,
  color: "#333",
  outline: "none",
  boxSizing: "border-box",
};
