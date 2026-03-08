import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // This `response` object is used to pass through the request to the next
  // middleware in the chain, or to the final page/route handler.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client that can read/write cookies.
  // This is used to refresh the session token and manage authentication state.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // The `set` method is called when the session is refreshed.
        // It's crucial to update the cookies on both the request and response.
        set(name: string, value: string, options: CookieOptions) {
          // `request.cookies.set` is temporary and only for the current request.
          request.cookies.set({ name, value, ...options })
          // The new response object is created to carry the updated cookie to the browser.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          // `response.cookies.set` sets the cookie for future requests.
          response.cookies.set({ name, value, ...options })
        },
        // The `remove` method is called when the user signs out.
        remove(name: string, options: CookieOptions) {
          // `request.cookies.set` is temporary and only for the current request.
          request.cookies.set({ name, value: '', ...options })
          // The new response object is created to carry the updated cookie to the browser.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
           // `response.cookies.set` removes the cookie for future requests.
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // This is the crucial step that refreshes the session cookie if it's expired.
  // It also makes the user object available for the rest of the request.
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  // If the user is not logged in and is trying to access a protected dashboard route, redirect to login.
  if (!session && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is logged in and is trying to access the login or signup page, redirect to the dashboard.
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Return the response object, which may have been updated with new cookies.
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
