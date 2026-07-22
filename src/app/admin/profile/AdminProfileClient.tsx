// src/app/admin/profile/AdminProfileClient.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { addAdmin, removeAdmin, changeAdminEmail, changeAdminPassword } from "./actions";
import { useToast } from "../components/Toast";
import { th } from "@/app/admin/lib/admin-th";
import { nameFromEmail } from "@/app/admin/lib/format";

type Admin = {
  id: number;
  email: string;
  created_at: string;
};

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

  // ── Change own email ───────────────────────────────────────
  const [newAuthEmail, setNewAuthEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

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
        setAdmins((prev) => [...prev, adminRow]);
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

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setChangingEmail(true);
    try {
      const result = await changeAdminEmail(newAuthEmail);
      if (!result.ok) {
        toast.error(result.error);
      } else {
        toast.success(th.toastEmailSent(newAuthEmail.trim()));
        setNewAuthEmail("");
      }
    } catch {
      toast.error(th.toastEmailFail);
    }
    setChangingEmail(false);
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

        <form onSubmit={handleChangeEmail} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <SLabel>{th.profileNewEmail}</SLabel>
            <input
              type="email"
              required
              placeholder="new-email@example.com"
              value={newAuthEmail}
              onChange={(e) => setNewAuthEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
          <PrimaryButton type="submit" disabled={changingEmail}>
            {changingEmail ? th.profileSending : th.profileSave}
          </PrimaryButton>
        </form>
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
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#1a1a1a",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {a.email}
                </p>
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
                </div>
              </div>

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
