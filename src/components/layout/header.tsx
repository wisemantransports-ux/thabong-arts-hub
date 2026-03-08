'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Palette, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { href: '/artworks', label: 'Artworks' },
  { href: '/artists', label: 'Artists' },
  { href: '/events', label: 'Events' },
  { href: '/businesses', label: 'Businesses' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  
  useEffect(() => {
    if (USE_MOCK_DATA) {
        setIsLoading(false);
        setSession(null); 
        return;
    }

    const supabase = createClient();
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isDashboard || isLoading) {
    return null; // Don't show the main header on dashboard pages or while loading
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Palette className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block">
            Thapong Visual Art Centre
          </span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          {session ? (
            <>
              <Button asChild>
                <Link href="/dashboard">Artist Dashboard</Link>
              </Button>
              {/* This is a simplified check. In a real app, you'd use roles from JWT */}
              <Button variant="outline" asChild>
                <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Artist Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Artist Sign Up</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="p-4 flex flex-col h-full">
                <Link href="/" className="flex items-center space-x-2 mb-8" onClick={() => setIsMobileMenuOpen(false)}>
                  <Palette className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">Thapong Visual Art Centre</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary',
                        pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-4 pt-8">
                  {session ? (
                    <>
                    <Button asChild size="lg">
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Artist Dashboard</Link>
                    </Button>
                     <Button asChild size="lg" variant="outline">
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                    </Button>
                     <form action="/auth/sign-out" method="post">
                        <Button type="submit" variant="ghost" className="w-full justify-start text-lg font-medium text-muted-foreground">Logout</Button>
                    </form>
                    </>
                  ) : (
                    <>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Artist Login</Link>
                      </Button>
                      <Button asChild size="lg">
                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Artist Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
