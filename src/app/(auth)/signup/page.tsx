"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(232,213,163,0.25)",
  borderRadius: "8px",
  padding: "12px 16px",
  fontSize: "14px",
  color: "#FFFFFF",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "rgba(255,255,255,0.7)",
  fontWeight: 500,
  marginBottom: "6px",
};

function onFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#E8D5A3";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232,213,163,0.1)";
}
function onBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "rgba(232,213,163,0.25)";
  e.currentTarget.style.boxShadow = "none";
}

export default function SignUpPage() {
  const [name,     setName    ] = useState("");
  const [email,    setEmail   ] = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm ] = useState("");
  const [error,    setError   ] = useState("");
  const [loading,  setLoading ] = useState(false);
  const [googleHover, setGoogleHover] = useState(false);
  const [backHover,   setBackHover  ] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    setLoading(false);
    if (error) setError(error.message);
    else router.push("/home");
  }

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: "40px 16px",
      background: "#FFFFFF",
    }}>

      {/* Logo */}
      <Link href="/home" style={{
        display: "flex", alignItems: "center", gap: "10px",
        textDecoration: "none", marginBottom: "20px",
      }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          overflow: "hidden",
          border: "1.5px solid rgba(28,41,81,0.25)",
          outline: "1px solid rgba(28,41,81,0.08)",
          outlineOffset: "3px",
          flexShrink: 0,
          background: "#FFFFFF",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Image src="/F2.png" alt="Siam Premium logo" width={52} height={52} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{
            fontSize: "15px", fontWeight: 700, color: "#1C2951",
            fontFamily: "Georgia, serif", letterSpacing: "0.05em", lineHeight: 1.1,
          }}>SP</span>
          <span style={{
            fontSize: "10px", color: "rgba(28,41,81,0.55)",
            letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1,
          }}>Siam Premium</span>
        </div>
      </Link>

      {/* Card */}
      <div style={{
        background: "#1C2951",
        border: "1px solid rgba(232,213,163,0.2)",
        borderRadius: "16px",
        boxShadow: "0 8px 40px rgba(28,41,81,0.2)",
        width: "100%",
        maxWidth: "620px",
        padding: "44px 72px",
      }}>
        <h1 style={{
          fontSize: "24px", fontWeight: 700, color: "#FFFFFF",
          fontFamily: "Georgia, serif", margin: "0 0 6px",
        }}>
          Create account
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "0 0 24px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#E8D5A3", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              required
              style={inputBase}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              required
              style={inputBase}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              required
              style={inputBase}
            />
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "5px 0 0" }}>
              At least 6 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              required
              style={inputBase}
            />
          </div>

          {error && (
            <p style={{
              fontSize: "12px", color: "rgba(255,120,120,0.9)",
              background: "rgba(255,80,80,0.08)",
              border: "1px solid rgba(255,80,80,0.2)",
              borderRadius: "6px", padding: "8px 12px", margin: 0,
            }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: "#E8D5A3", color: "#1C2951",
              fontSize: "15px", fontWeight: 700,
              borderRadius: "8px", border: "none",
              marginTop: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"; }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0 12px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleSignup}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "12px",
            background: googleHover ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px", cursor: "pointer",
            fontSize: "14px", color: "#FFFFFF",
            transition: "background 0.15s",
          }}
          onMouseEnter={() => setGoogleHover(true)}
          onMouseLeave={() => setGoogleHover(false)}
        >
          <GoogleIcon />
          Sign up with Google
        </button>
      </div>

      {/* Below-card links */}
      <div style={{ textAlign: "center", marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ fontSize: "13px", color: "rgba(28,41,81,0.6)", margin: 0 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#1C2951", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
        <Link
          href="/home"
          style={{
            fontSize: "13px",
            color: backHover ? "#1C2951" : "rgba(28,41,81,0.5)",
            textDecoration: "none",
            transition: "color 0.15s",
          }}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
        >
          ← Back to home
        </Link>
      </div>

    </div>
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
