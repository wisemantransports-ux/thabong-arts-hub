import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // The createServerClient function needs a cookies object with get, set, and remove methods.
  // The an object is created here that can read cookies from the incoming request and write them to the outgoing response.
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
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // This will refresh the session cookie if it's expired.
  const { data: { user } } = await supabase.auth.getUser()

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/signup', '/auth/callback'];
  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path)) || request.nextUrl.pathname === '/') {
    return response;
  }
  
  // If no user is logged in, redirect to the login page for any protected route.
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If the user is logged in, check if their artist profile is complete.
  const { data: artist } = await supabase
    .from('artists')
    .select('id, name')
    .eq('user_id', user.id)
    .single();

  // If the profile is incomplete (e.g., name is missing) and the user is NOT already on the edit profile page,
  // force them to complete it.
  if ((!artist || !artist.name) && request.nextUrl.pathname !== '/dashboard/edit-profile') {
    const editProfileUrl = new URL('/dashboard/edit-profile', request.url)
    return NextResponse.redirect(editProfileUrl)
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
     * - and any file extensions (e.g., .svg, .png)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
