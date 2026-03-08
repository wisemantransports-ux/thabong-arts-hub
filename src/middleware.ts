import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from './src/lib/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // This is a no-op because the cookieStore from 'next/headers' is read-only.
        // This will prevent session refreshes from persisting.
        set(name: string, value: string, options: CookieOptions) {},
        remove(name: string, options: CookieOptions) {},
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

  // If no user session, and they are trying to access a dashboard route, redirect to login
  if (!user && isDashboardRoute) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If a user is logged in, check for incomplete artist profile
  if (user && isDashboardRoute) {
    const { data: artist } = await supabase
      .from('artists')
      .select('id, name')
      .eq('user_id', user.id)
      .single();

    // If profile is incomplete and they are NOT on the edit profile page, redirect them.
    if ((!artist || !artist.name) && req.nextUrl.pathname !== '/dashboard/edit-profile') {
      const editProfileUrl = new URL('/dashboard/edit-profile', req.url);
      return NextResponse.redirect(editProfileUrl);
    }
  }

  return res;
}

// Apply middleware to these routes
export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
};
