// src/components/public/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS, BRAND } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { useWishlist } from "@/hooks/useWishlist";
import type { User } from "@supabase/supabase-js";


export default function Navbar() {
  const pathname     = usePathname();
  const router       = useRouter();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user,         setUser]         = useState<User | null>(null);
  const [isAdmin,      setIsAdmin]      = useState(false);
  const { ids: wishlistIds } = useWishlist();
  const wishCount = wishlistIds.size;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const { data: adminRow } = await supabase
          .from("admins").select("id").eq("email", u.email ?? "").maybeSingle();
        setIsAdmin(!!adminRow);
      } else {
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const showAsUser = !!user && !isAdmin;

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push("/home");
  }

  return (
    <header className="sticky top-0 z-50">

      {/* ── Top bar ── */}
      <div className="bg-primary hidden md:block">
        <div className="max-w-6xl mx-auto px-6 py-[17px] flex justify-between items-center">
          <div className="flex gap-5 items-center">
            <a href={`mailto:${BRAND.email}`}
              className="flex items-center gap-1.5 text-[14px] text-[#A89880] hover:text-secondary-light transition-colors">
              <svg className="w-3.5 h-3.5 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              {BRAND.email}
            </a>
            <a href={`tel:${BRAND.phone1}`}
              className="flex items-center gap-1.5 text-[14px] text-[#A89880] hover:text-secondary-light transition-colors">
              <svg className="w-3.5 h-3.5 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {BRAND.phone1}
            </a>
            <span className="text-[14px] text-[#7A6A58]">{BRAND.hours}</span>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className="bg-[#FDFAF5] border-b border-accent-dark">
        <div className="max-w-6xl mx-auto px-6 flex items-stretch h-16">

          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2.5 shrink-0 mr-8">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-secondary-light font-bold text-[14px]"
              style={{ fontFamily: "Georgia,serif" }}>SP</div>
            <div className="hidden sm:block">
              <div className="text-primary font-medium text-[14px] leading-tight"
                style={{ fontFamily: "Georgia,serif" }}>{BRAND.fullName}</div>
              <div className="text-[#8A7B68] text-[14px] mt-0.5">Premiums &amp; Promotion Solution</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-stretch flex-1">
            {NAV_LINKS.map(l => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link key={l.href} href={l.href}
                  className={`flex items-center px-4 text-[14px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                    active
                      ? "text-primary border-secondary"
                      : "text-[#6B5843] border-transparent hover:text-primary hover:border-secondary/50"
                  }`}>
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Link href="/contact"
              className="hidden md:flex items-center gap-1.5 bg-primary text-secondary-light text-[14px] font-medium px-4 py-2 rounded-md hover:bg-primary-light transition-colors whitespace-nowrap">
              Get a Quote
            </Link>

            {/* Admin badge */}
            {isAdmin && (
              <Link href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-secondary-light text-[14px] font-medium hover:bg-primary-light transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Admin
              </Link>
            )}

            {/* User dropdown */}
            {showAsUser && (
              <div className="relative hidden md:block">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-accent transition-colors">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-secondary overflow-hidden flex items-center justify-center shrink-0">
                      <span className="text-primary text-[14px] font-bold">
                        {(user?.user_metadata?.full_name ?? user?.email ?? "?")[0].toUpperCase()}
                      </span>
                    </div>
                    {wishCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                        {wishCount > 9 ? "9+" : wishCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[14px] font-medium text-primary max-w-[120px] truncate">
                    {user?.user_metadata?.full_name ?? user?.email}
                  </span>
                  <svg className="w-3.5 h-3.5 text-[#8A7B68]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-accent-dark py-1 z-50"
                    style={{ boxShadow: "0 8px 24px rgba(44,36,25,0.12)" }}>
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-[14px] text-primary hover:bg-accent transition-colors">
                      <span>My Profile</span>
                      {wishCount > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-red-500 font-semibold">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-red-500" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                          {wishCount}
                        </span>
                      )}
                    </Link>
                    <button onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-[14px] text-red-500 hover:bg-red-50 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sign in button */}
            {!user && (
              <Link href="/login"
                className="hidden md:flex items-center border border-accent-dark text-primary text-[14px] font-medium px-3.5 py-2 rounded-md hover:border-primary transition-colors whitespace-nowrap">
                Sign In
              </Link>
            )}

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden ml-1 w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-md hover:bg-accent transition-colors">
              <span className={`block w-5 h-[1.5px] bg-primary transition-all ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}/>
              <span className={`block w-5 h-[1.5px] bg-primary transition-all ${menuOpen ? "opacity-0" : ""}`}/>
              <span className={`block w-5 h-[1.5px] bg-primary transition-all ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}/>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-accent-dark bg-[#FDFAF5] px-6 py-4 space-y-0.5">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  pathname === l.href
                    ? "text-primary bg-accent font-semibold"
                    : "text-[#6B5843] hover:bg-accent hover:text-primary"
                }`}>
                {l.label}
              </Link>
            ))}
            <div className="border-t border-accent-dark pt-3 mt-3 space-y-2">
              <Link href="/contact" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-primary text-secondary-light text-[13px] font-medium py-2.5 rounded-lg w-full hover:bg-primary-light transition-colors">
                Get a Quote
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center bg-primary text-secondary-light text-[13px] font-medium py-2.5 rounded-lg w-full">
                  Admin Dashboard
                </Link>
              )}
              {showAsUser ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 border border-accent-dark text-primary text-[13px] font-medium py-2.5 rounded-lg w-full hover:bg-accent transition-colors">
                    My Profile
                    {wishCount > 0 && (
                      <span className="text-[11px] text-red-500 font-semibold">❤ {wishCount}</span>
                    )}
                  </Link>
                  <button onClick={handleSignOut}
                    className="w-full py-2.5 bg-red-500 text-white text-[13px] font-medium rounded-lg hover:bg-red-600 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : !user ? (
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center border border-accent-dark text-primary text-[13px] font-medium py-2.5 rounded-lg w-full hover:bg-accent transition-colors">
                  Sign In
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
