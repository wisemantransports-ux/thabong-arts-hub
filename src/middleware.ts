import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from './lib/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // === Detect if we are in Gemini Mock Mode ===
  const isMock = process.env.GEMINI_MOCK === 'true';

  // Allow public pages
  const publicPaths = ['/login', '/signup', '/'];
  if (publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return res;
  }
  
  if (isMock) {
    // Mock user for development/demo
    // In mock mode, we assume the user is authenticated and has a complete profile.
    // This allows access to all dashboard routes without hitting Supabase.
    return res;
  }

  // === Live Supabase ===
  // This part runs only when not in mock mode.
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set(name, value, options),
        remove: (name, options) => res.cookies.delete(name, options),
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // If no session, redirect to login for any protected route.
  if (!user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in, check artist profile completion.
  const { data: artist } = await supabase
    .from('artists')
    .select('id, name')
    .eq('user_id', user.id)
    .single();

  // If profile is incomplete, force redirect to edit profile page.
  if ((!artist || !artist.name) && req.nextUrl.pathname !== '/dashboard/edit-profile') {
    const editProfileUrl = new URL('/dashboard/edit-profile', req.url);
    return NextResponse.redirect(editProfileUrl);
  }

  return res;
}

// Apply middleware to all dashboard routes.
export const config = {
  matcher: ['/dashboard/:path*'],
};