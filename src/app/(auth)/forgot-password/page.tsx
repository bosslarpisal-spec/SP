"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/profile`,
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/home" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ fontFamily: "Georgia,serif" }}>SP</div>
          <span className="text-primary font-bold text-xl" style={{ fontFamily: "Georgia,serif" }}>
            Siam Premium
          </span>
        </Link>
      </div>

      <div className="card-flat p-8">
        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2" style={{ fontFamily: "Georgia,serif" }}>Check your email</h2>
            <p className="text-gray-500 text-sm mb-6">
              We sent a password reset link to <span className="font-medium text-primary">{email}</span>
            </p>
            <Link href="/login" className="btn-primary w-full justify-center">Back to Sign In</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-primary mb-1" style={{ fontFamily: "Georgia,serif" }}>
              Forgot password?
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        Remember your password?{" "}
        <Link href="/login" className="text-primary font-semibold underline underline-offset-2 hover:text-primary-dark transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
