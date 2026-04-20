"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { NAV_LINKS, BRAND } from "@/lib/data";

export default function Navbar() {
  const pathname     = usePathname();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status }     = useSession();
  const isAuth = status === "authenticated";

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-white hidden md:block">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex gap-5 items-center text-base">
            <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {BRAND.email}
            </a>
            <a href={`tel:${BRAND.phone1}`} className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              {BRAND.phone1}
            </a>
            <span className="opacity-60">{BRAND.hours}</span>
          </div>
          <div className="flex gap-4 items-center opacity-80 text-base font-semibold">
            {[["FB","#facebook"],["IG","#instagram"],["LINE","#line"],["YT","#youtube"],["TT","#tiktok"]].map(([l,h])=>(
              <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                className="hover:opacity-100 transition-opacity">{l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-32">

          {/* Logo */}
          <Link href="/home" className="flex items-center gap-3 shrink-0 ml-2 mr-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl" style={{fontFamily:"Georgia,serif"}}>SP</div>
            <div className="hidden sm:block">
              <div className="text-primary font-bold text-xl leading-tight" style={{fontFamily:"Georgia,serif"}}>{BRAND.fullName}</div>
              <div className="text-gray-400 text-base mt-0.5">Premiums &amp; Promotion Solution</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-3">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  pathname === l.href || pathname.startsWith(l.href+"/")
                    ? "text-primary bg-accent"
                    : "text-gray-600 hover:text-primary hover:bg-accent"
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right: CTA + auth + hamburger */}
          <div className="flex items-center gap-2">
            <Link href="/contact" className="hidden md:inline-flex btn-primary whitespace-nowrap ml-2">
              Get a Quote
            </Link>

            {/* Auth */}
            {isAuth ? (
              <div className="relative hidden md:block ml-1">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-accent transition-colors">
                  <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center shrink-0">
                    {session?.user?.image
                      ? <img src={session.user.image} alt="avatar" className="w-full h-full object-cover"/>
                      : <span className="text-white text-sm font-bold">{session?.user?.name?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">{session?.user?.name}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-accent transition-colors">
                      My Profile
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: "/home" })}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden md:inline-flex btn-outline whitespace-nowrap ml-1">
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden ml-1 w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-gray-100 transition-colors">
              <span className={`block w-6 h-0.5 bg-gray-700 rounded transition-all ${menuOpen ? "rotate-45 translate-y-2":"" }`}/>
              <span className={`block w-6 h-0.5 bg-gray-700 rounded transition-all ${menuOpen ? "opacity-0":""}`}/>
              <span className={`block w-6 h-0.5 bg-gray-700 rounded transition-all ${menuOpen ? "-rotate-45 -translate-y-2":""}`}/>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-1">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                  pathname === l.href ? "text-primary bg-accent" : "text-gray-700 hover:bg-accent hover:text-primary"
                }`}>{l.label}</Link>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">
                Get a Quote
              </Link>
              {isAuth ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="btn-outline w-full justify-center">
                    My Profile
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/home" })} className="btn-danger w-full justify-center">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-outline w-full justify-center">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
