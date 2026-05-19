"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ready, setReady]         = useState(false);
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/login");
      return;
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        router.replace("/login?error=reset_failed");
      } else {
        setReady(true);
      }
    });
  }, [searchParams, router]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => router.push("/login"), 2500);
    return () => clearTimeout(t);
  }, [success, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPw.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess(true);
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/home" className="inline-flex items-center gap-3">
          <div
            className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ fontFamily: "Georgia,serif" }}
          >SP</div>
          <span className="text-primary font-bold text-xl" style={{ fontFamily: "Georgia,serif" }}>
            Siam Premium
          </span>
        </Link>
      </div>

      <div className="card-flat p-8">
        {!ready ? (
          <p className="text-center text-gray-500 py-6">Verifying reset link…</p>
        ) : success ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2" style={{ fontFamily: "Georgia,serif" }}>
              Password set!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              You can now sign in with your email and new password.
            </p>
            <Link href="/login" className="btn-primary w-full justify-center">Go to Sign In</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-primary mb-1" style={{ fontFamily: "Georgia,serif" }}>
              Set new password
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Choose a password to enable email login for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    className="form-input pr-10"
                    placeholder="••••••••"
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-primary opacity-40 hover:opacity-70 focus:outline-none transition-opacity duration-150"
                  >
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Confirm Password</label>
                <input
                  type={showPw ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  required
                />
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? "Saving…" : "Set Password"}
              </button>
            </form>
          </>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        <Link href="/login" className="text-primary hover:underline">← Back to Sign In</Link>
      </p>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.49 18.49 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
