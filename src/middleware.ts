// src/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // ── Helper: check admins table ─────────────────────────────
  async function isAdmin() {
    if (!user) return false;
    const { data } = await supabase
      .from("admins")
      .select("id")
      .eq("email", user.email ?? "")
      .maybeSingle();
    return !!data;
  }

  // ── Protect /profile ───────────────────────────────────────
  if (path.startsWith("/profile") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── After login, redirect admin straight to /admin ─────────
  // Supabase redirects to /home after login — catch that for admins.
  // Removing /home from this check so admins can still browse the public site freely.
  if (user && path === "/login") {
    if (await isAdmin()) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // ── Protect /admin ─────────────────────────────────────────
  if (path.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!(await isAdmin())) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/profile",
    "/profile/:path*",
    "/admin",
    "/admin/:path*",
  ],
};