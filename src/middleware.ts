import { NextResponse, type NextRequest } from 'next/server';

// This is a mock authentication check.
// In a real Supabase app, you would use `createMiddlewareClient` from `@supabase/ssr`
// to check for a valid session.
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  // For this demo, we'll allow access if a specific cookie is set,
  // which we could imagine our login flow would do.
  // We are not implementing the full auth flow here, so we will just return false
  // and rely on the login page's mock success to redirect.
  // To test the dashboard, change this to `return true;`
  return true; 
}

export async function middleware(request: NextRequest) {
  const isAuth = await isAuthenticated(request);
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  
  if (isDashboardRoute && !isAuth) {
    // Redirect unauthenticated users trying to access dashboard routes to the login page.
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
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
};
