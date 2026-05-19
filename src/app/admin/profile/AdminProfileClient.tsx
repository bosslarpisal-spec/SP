// src/app/admin/profile/AdminProfileClient.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [admins, setAdmins] = useState(initial);

  // ── Add admin ──────────────────────────────────────────────
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // ── Remove admin ───────────────────────────────────────────
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  // ── Change own email ───────────────────────────────────────
  const [newAuthEmail, setNewAuthEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);

  // ── Change password ────────────────────────────────────────
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  // ── Handlers ───────────────────────────────────────────────

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    setAddSuccess(null);

    const email = newEmail.trim().toLowerCase();
    if (!email) { setAdding(false); return; }

    const { data, error } = await supabase
      .from("admins")
      .insert({ email })
      .select()
      .single();

    if (error) {
      setAddError(
        error.code === "23505"
          ? "That email is already an admin."
          : error.message
      );
    } else {
      setAdmins((prev) => [...prev, data]);
      setNewEmail("");
      setAddSuccess(`${email} added as admin.`);
    }
    setAdding(false);
  }

  async function handleRemoveAdmin(admin: Admin) {
    if (admin.email === currentUserEmail) {
      alert("You can't remove yourself — add another admin first.");
      return;
    }
    if (!confirm(`Remove ${admin.email} from admins?`)) return;

    setRemovingId(admin.id);
    setRemoveError(null);

    const { error } = await supabase
      .from("admins")
      .delete()
      .eq("id", admin.id);

    if (error) {
      setRemoveError(`Failed to remove ${admin.email}: ${error.message}`);
    } else {
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    }
    setRemovingId(null);
  }

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setChangingEmail(true);
    setEmailMsg(null);
    setEmailErr(null);

    const email = newAuthEmail.trim().toLowerCase();
    if (!email) { setChangingEmail(false); return; }

    // 1. Update Supabase Auth email (sends confirmation to new address)
    const { error: authError } = await supabase.auth.updateUser({ email });
    if (authError) {
      setEmailErr(authError.message);
      setChangingEmail(false);
      return;
    }

    // 2. Update the admins table so the whitelist stays in sync
    const { error: dbError } = await supabase
      .from("admins")
      .update({ email })
      .eq("email", currentUserEmail);

    if (dbError) {
      setEmailErr(`Auth email updated but admins table failed: ${dbError.message}`);
    } else {
      setEmailMsg(
        `Confirmation sent to ${email}. Click the link in that inbox, then log in with the new address.`
      );
      setNewAuthEmail("");
    }
    setChangingEmail(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    setPwErr(null);

    if (newPassword !== confirmPassword) {
      setPwErr("Passwords don't match.");
      return;
    }
    if (newPassword.length < 6) {
      setPwErr("Password must be at least 6 characters.");
      return;
    }

    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPwErr(error.message);
    } else {
      setPwMsg("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPw(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  // ── UI ─────────────────────────────────────────────────────
  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-500 mt-1">
          Logged in as <span className="font-medium text-gray-700">{currentUserEmail}</span>
        </p>
      </div>

      {/* ── Admin whitelist ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Admin Accounts</h2>
        <p className="text-sm text-gray-500">
          Anyone listed here can access <code className="bg-gray-100 px-1 rounded">/admin</code>.
        </p>

        {/* Current admins list */}
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
          {admins.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{a.email}</p>
                <p className="text-xs text-gray-400">
                  Added {new Date(a.created_at).toLocaleDateString()}
                  {a.email === currentUserEmail && (
                    <span className="ml-2 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-semibold">
                      You
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => handleRemoveAdmin(a)}
                disabled={a.email === currentUserEmail || removingId === a.id}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title={
                  a.email === currentUserEmail
                    ? "Can't remove yourself"
                    : "Remove admin"
                }
              >
                {removingId === a.id ? "Removing…" : "Remove"}
              </button>
            </div>
          ))}
        </div>

        {removeError && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {removeError}
          </p>
        )}

        {/* Add new admin */}
        <form onSubmit={handleAddAdmin} className="flex gap-2">
          <input
            type="email"
            required
            placeholder="new-admin@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={`${inputClass} flex-1`}
          />
          <button
            type="submit"
            disabled={adding}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 shrink-0"
          >
            {adding ? "Adding…" : "Add Admin"}
          </button>
        </form>

        {addError && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {addError}
          </p>
        )}
        {addSuccess && (
          <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            {addSuccess}
          </p>
        )}
      </div>

      {/* ── Change login email ────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Change Login Email</h2>
        <p className="text-sm text-gray-500">
          A confirmation link will be sent to the new address. Both the auth
          account and admin whitelist will be updated.
        </p>
        <form onSubmit={handleChangeEmail} className="space-y-3">
          <div>
            <label className={labelClass}>New Email Address</label>
            <input
              type="email"
              required
              placeholder="new-email@example.com"
              value={newAuthEmail}
              onChange={(e) => setNewAuthEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={changingEmail}
            className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {changingEmail ? "Sending…" : "Update Email"}
          </button>
        </form>
        {emailErr && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {emailErr}
          </p>
        )}
        {emailMsg && (
          <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            {emailMsg}
          </p>
        )}
      </div>

      {/* ── Change password ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className={labelClass}>New Password</label>
            <input
              type="password"
              required
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Confirm Password</label>
            <input
              type="password"
              required
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={changingPw}
            className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {changingPw ? "Saving…" : "Update Password"}
          </button>
        </form>
        {pwErr && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {pwErr}
          </p>
        )}
        {pwMsg && (
          <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            {pwMsg}
          </p>
        )}
      </div>

      {/* ── Sign out ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800">Sign Out</p>
          <p className="text-sm text-gray-500">You&apos;ll be sent back to the login page.</p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}