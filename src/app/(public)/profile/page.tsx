// src/app/(public)/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PRODUCTS } from "@/lib/data";
import { useWishlist } from "@/hooks/useWishlist";
import WishlistButton from "@/components/public/WishlistButton";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser]             = useState<User | null>(null);
  const [loading, setLoading]       = useState(true);
  const [name, setName]             = useState("");
  const [nameSaved, setNameSaved]   = useState(false);
  const [pwSaved, setPwSaved]       = useState(false);
  const [pwError, setPwError]       = useState("");
  const [pwSaving, setPwSaving]     = useState(false);
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");

  // Track which product IDs are currently active in Supabase
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

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

  // Fetch active product IDs from Supabase so we know which wishlist
  // items have been hidden by the admin
  useEffect(() => {
    supabase
      .from("products")
      .select("id")
      .eq("is_active", true)
      .then(({ data }) => {
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
    <div className="section-sm">
      <div className="container max-w-2xl">
        <div className="mb-6">
          <Link href="/home" className="text-sm text-gray-500 hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-primary mb-8" style={{ fontFamily: "Georgia,serif" }}>
          My Profile
        </h1>

        <div className="space-y-6">

          {/* ── Wishlist ───────────────────────────────────────── */}
          <div className="card-flat">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-primary flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-500 stroke-red-500" strokeWidth={2}
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                My Wishlist
                {wishedProducts.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-red-50 text-red-500 text-xs font-semibold rounded-full">
                    {wishedProducts.length}
                  </span>
                )}
              </h2>
              <Link href="/catalog" className="text-xs text-primary hover:underline">
                Browse Catalog →
              </Link>
            </div>

            {wishedProducts.length === 0 ? (
              /* Empty state */
              <div className="text-center py-10 text-gray-400">
                <svg viewBox="0 0 24 24" className="w-12 h-12 mx-auto mb-3 fill-none stroke-gray-200"
                  strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <p className="text-sm font-medium text-gray-500 mb-1">Your wishlist is empty</p>
                <p className="text-xs text-gray-400 mb-4">
                  Tap the ♡ on any product to save it here.
                </p>
                <Link href="/catalog" className="btn-outline btn-sm">
                  Explore Products
                </Link>
              </div>
            ) : (
              /* Wishlist grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {wishedProducts.map(p => {
                  const unavailable = !activeIds.has(String(p.id));

                  return (
                    <div
                      key={p.id}
                      className={`relative group rounded-xl border overflow-hidden transition-all ${
                        unavailable
                          ? "border-gray-100 opacity-60 grayscale"
                          : "border-gray-100 hover:shadow-md"
                      }`}
                    >
                      {/* Image — not linked when unavailable */}
                      {unavailable ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-28 object-cover"
                        />
                      ) : (
                        <Link href={`/catalog/${p.id}`}>
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      )}

                      {/* Remove heart — top-right */}
                      <div className="absolute top-2 right-2">
                        <WishlistButton
                          productId={p.id}
                          wished={isWished(p.id)}
                          onToggle={toggle}
                          size="sm"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-2.5">
                        {unavailable ? (
                          <>
                            <p className="text-xs font-semibold leading-snug text-gray-400 line-clamp-2">
                              {p.name}
                            </p>
                            <span className="inline-block mt-1 text-xs text-red-400 font-medium">
                              Currently unavailable
                            </span>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/catalog/${p.id}`}
                              className="block text-xs font-semibold leading-snug hover:text-primary transition-colors line-clamp-2"
                            >
                              {p.name}
                            </Link>
                            <span className="text-xs text-gray-400">{p.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Username ───────────────────────────────────────── */}
          <div className="card-flat">
            <h2 className="text-base font-semibold text-primary mb-4">Username</h2>
            <div className="flex gap-3">
              <input
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
              <button onClick={saveName} className="btn-primary whitespace-nowrap">
                {nameSaved ? "Saved ✓" : "Save"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">{user.email}</p>
          </div>

          {/* ── Change Password ────────────────────────────────── */}
          <div className="card-flat">
            <h2 className="text-base font-semibold text-primary mb-4">Change Password</h2>
            <div className="space-y-3">
              <div>
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                />
              </div>
              {pwError  && <p className="form-error">{pwError}</p>}
              {pwSaved  && <p className="text-xs text-green-600 font-medium">Password updated successfully.</p>}
              <button onClick={savePassword} disabled={pwSaving} className="btn-primary disabled:opacity-50">
                {pwSaving ? "Saving…" : "Update Password"}
              </button>
            </div>
          </div>

          {/* ── Sign out ───────────────────────────────────────── */}
          <div className="flex justify-end pt-2">
            <button onClick={handleSignOut} className="btn-danger btn-sm">Sign Out</button>
          </div>

        </div>
      </div>
    </div>
  );
}