// src/app/(auth)/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AuthSplitLayout } from "../AuthSplitLayout";

/* ── input style for dark panel ──────────────────────────── */
const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(232,213,163,0.25)",
  borderRadius: "8px",
  padding: "10px 16px",
  fontSize: "14px",
  color: "#FFFFFF",
  outline: "none",
  boxSizing: "border-box",
};
function onFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#E8D5A3";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232,213,163,0.1)";
}
function onBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "rgba(232,213,163,0.25)";
  e.currentTarget.style.boxShadow = "none";
}

export default function LoginPage() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [googleHover, setGoogleHover]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        'Invalid email or password. If you signed up with Google, use "Continue with Google" below, or click "Forgot password?" to set an email password.'
      );
      setLoading(false);
      return;
    }

    const userEmail = data.user?.email ?? "";
    if (userEmail) {
      const { data: adminRow } = await supabase
        .from("admins")
        .select("id")
        .eq("email", userEmail)
        .maybeSingle();

      if (adminRow) {
        router.push("/admin");
        return;
      }
    }

    router.push("/home");
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <AuthSplitLayout
      leftLine1="Welcome"
      leftLine2="back"
      leftSubtext="good to see you again"
    >
      <div style={{ width: "100%", maxWidth: "390px" }}>

        {/* Form header */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ margin: "0 0 4px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(232,213,163,0.6)" }}>
            Sign In
          </p>
          <h2 style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: 400, color: "#FFFFFF", fontFamily: "Georgia, serif" }}>
            Your account
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
            New here?{" "}
            <Link href="/signup" style={{ color: "#E8D5A3", fontWeight: 500, textDecoration: "none" }}>Create an account</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)", marginBottom: "6px" }}>
              Email
            </label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} onFocus={onFocus} onBlur={onBlur}
              required style={inputBase} />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)" }}>
                Password
              </label>
              <Link href="/forgot-password" style={{ fontSize: "11px", color: "#E8D5A3", textDecoration: "none", fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} onFocus={onFocus} onBlur={onBlur}
                required style={{ ...inputBase, paddingRight: "42px" }} />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ position: "absolute", inset: "0 0 0 auto", width: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "rgba(232,213,163,0.5)", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8D5A3")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,213,163,0.5)")}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ fontSize: "12px", color: "rgba(255,120,120,0.9)", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: "6px", padding: "8px 12px", margin: 0 }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "12px", background: "#E8D5A3", color: "#1C2951", fontSize: "14px", fontWeight: 700, borderRadius: "8px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.15s" }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"; }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "18px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Google */}
        <button onClick={handleGoogleLogin}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "11px 16px", background: googleHover ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#FFFFFF", transition: "background 0.15s" }}
          onMouseEnter={() => setGoogleHover(true)}
          onMouseLeave={() => setGoogleHover(false)}>
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Below-form links */}
        <div style={{ marginTop: "28px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: "0 0 10px" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#E8D5A3", fontWeight: 500, textDecoration: "none" }}>Sign up</Link>
          </p>
          <Link href="/home"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
            ← Back to home
          </Link>
        </div>

      </div>
    </AuthSplitLayout>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "18px", height: "18px" }} fill="none"
      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "18px", height: "18px" }} fill="none"
      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.49 18.49 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg style={{ width: "18px", height: "18px", flexShrink: 0 }} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
