import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // This `response` object is used to set cookies on the client.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // The createServerClient function needs a cookies object with get, set, and remove methods.
  // This object is created here to read cookies from the incoming request and write them to the outgoing response.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
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

  // This will refresh the session cookie if it's expired.
  const { data: { user } } = await supabase.auth.getUser()

  // If the user is not logged in and is trying to access a protected route,
  // redirect them to the login page.
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    // Add the 'next' parameter to redirect them back after login.
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If the user is logged in, allow the request to proceed.
  // The individual dashboard pages will handle fetching their own data and profile completion checks.
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - and any file extensions (e.g., .svg, .png)
     * This ensures the middleware runs on all our application pages.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Specifically re-include the routes we absolutely want to protect
    '/dashboard/:path*',
    '/admin/:path*'
  ],
}
