import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                               !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-url');

  if (!isSupabaseConfigured) {
    const { pathname } = request.nextUrl;
    const hasMockSession = request.cookies.has('mock_session');
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

    if (!hasMockSession && isDashboardRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (hasMockSession && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  if (!session && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (our public images)
     */
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
}
