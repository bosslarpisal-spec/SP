// src/app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    let exchangeError: unknown;
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      exchangeError = error;
    } catch (err) {
      console.error("[auth/callback] exchangeCodeForSession threw:", err)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    if (!exchangeError) {
      // Check if the logged-in user is an admin
      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email) {
        const { data: adminRow, error: adminErr } = await supabase
          .from('admins')
          .select('id')
          .eq('email', user.email)
          .maybeSingle()

        if (adminErr) {
          console.error("[auth/callback] admin lookup failed:", adminErr)
          // Fall through to regular user redirect rather than failing silently
        } else if (adminRow) {
          return NextResponse.redirect(`${origin}/admin`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error("[auth/callback] exchangeCodeForSession error:", exchangeError)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}