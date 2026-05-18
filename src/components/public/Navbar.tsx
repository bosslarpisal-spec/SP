// src/components/public/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS, BRAND } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { useWishlist } from "@/hooks/useWishlist";
import type { User } from "@supabase/supabase-js";

/* ── Inline SVG brand icons ── */
function FBIcon()  { return <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#C09A5B"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>; }
function IGIcon()  { return <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="#C09A5B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="#C09A5B" stroke="none"/></svg>; }
function LINEIcon(){ return <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#C09A5B"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>; }
function YTIcon()  { return <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#C09A5B"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>; }
function TTIcon()  { return <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#C09A5B"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>; }
function XIcon()   { return <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#C09A5B"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }

const SOCIAL_ICONS = [
  { label: "Facebook",  Icon: FBIcon },
  { label: "Instagram", Icon: IGIcon },
  { label: "LINE",      Icon: LINEIcon },
  { label: "YouTube",   Icon: YTIcon },
  { label: "TikTok",    Icon: TTIcon },
  { label: "X",         Icon: XIcon },
];

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
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      setUser(u);
      if (u) {
        const { data: adminRow } = await supabase
          .from("admins").select("id").eq("email", u.email ?? "").maybeSingle();
        setIsAdmin(!!adminRow);
      }
    }
    loadUser();

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
        <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex gap-5 items-center">
            <a href={`mailto:${BRAND.email}`}
              className="flex items-center gap-1.5 text-[11px] text-[#A89880] hover:text-secondary-light transition-colors">
              <svg className="w-3.5 h-3.5 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              {BRAND.email}
            </a>
            <a href={`tel:${BRAND.phone1}`}
              className="flex items-center gap-1.5 text-[11px] text-[#A89880] hover:text-secondary-light transition-colors">
              <svg className="w-3.5 h-3.5 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {BRAND.phone1}
            </a>
            <span className="text-[11px] text-[#7A6A58]">{BRAND.hours}</span>
          </div>
          <div className="flex gap-1.5 items-center">
            {SOCIAL_ICONS.map(({ label, Icon }) => (
              <a key={label} href="#" aria-label={label}
                className="w-6 h-6 flex items-center justify-center rounded
                           bg-[rgba(192,154,91,0.12)] border border-[rgba(192,154,91,0.25)]
                           hover:bg-[rgba(192,154,91,0.24)] transition-colors">
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className="bg-[#FDFAF5] border-b border-accent-dark">
        <div className="max-w-6xl mx-auto px-6 flex items-stretch h-16">

          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2.5 shrink-0 mr-8">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-secondary-light font-bold text-sm"
              style={{ fontFamily: "Georgia,serif" }}>SP</div>
            <div className="hidden sm:block">
              <div className="text-primary font-medium text-sm leading-tight"
                style={{ fontFamily: "Georgia,serif" }}>{BRAND.fullName}</div>
              <div className="text-[#8A7B68] text-[10px] mt-0.5">Premiums &amp; Promotion Solution</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-stretch flex-1">
            {NAV_LINKS.map(l => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link key={l.href} href={l.href}
                  className={`flex items-center px-4 text-[12px] font-medium border-b-2 transition-colors whitespace-nowrap ${
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
              className="hidden md:flex items-center gap-1.5 bg-primary text-secondary-light text-[12px] font-medium px-4 py-2 rounded-md hover:bg-primary-light transition-colors whitespace-nowrap">
              Get a Quote
            </Link>

            {/* Admin badge */}
            {isAdmin && (
              <Link href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-secondary-light text-[12px] font-medium hover:bg-primary-light transition-colors">
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
                      {user?.user_metadata?.avatar_url
                        ? <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover"/>
                        : <span className="text-primary text-xs font-bold">
                            {(user?.user_metadata?.full_name ?? user?.email ?? "?")[0].toUpperCase()}
                          </span>
                      }
                    </div>
                    {wishCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                        {wishCount > 9 ? "9+" : wishCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] font-medium text-primary max-w-[72px] truncate">
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
                      className="flex items-center justify-between px-4 py-2.5 text-[12px] text-primary hover:bg-accent transition-colors">
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
                      className="w-full text-left px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sign in button */}
            {!user && (
              <Link href="/login"
                className="hidden md:flex items-center border border-accent-dark text-primary text-[12px] font-medium px-3.5 py-2 rounded-md hover:border-primary transition-colors whitespace-nowrap">
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
