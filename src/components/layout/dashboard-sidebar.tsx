'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Paintbrush,
  User,
  LogOut,
  Home,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type Artist } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/artworks', icon: Paintbrush, label: 'My Artworks' },
  { href: '/dashboard/edit-profile', icon: User, label: 'Edit Profile' },
];

export default function DashboardSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPage = navItems.slice().reverse().find(item => pathname.startsWith(item.href));
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const fetchArtist = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: artistProfile } = await supabase
          .from('artists')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (artistProfile) {
          setArtist(artistProfile);
        }
      }
      setIsLoading(false);
    };

    fetchArtist();
  }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" />
            <span className="font-bold font-headline text-lg group-data-[collapsible=icon]:hidden">
              Artist Dashboard
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={currentPage?.href === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-2 flex-col gap-2">
          <form action="/auth/sign-out" method="post" className="w-full">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Back to Site">
                    <Link href="/">
                        <Home />
                        <span>Back to Site</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton type="submit" tooltip="Logout" className="w-full">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </form>
           <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent">
                {isLoading ? (
                  <>
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="group-data-[collapsible=icon]:hidden space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </>
                ) : artist ? (
                  <>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={artist.profile_image} alt={artist.name} />
                      <AvatarFallback>{artist.name?.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-semibold text-sidebar-accent-foreground">{artist.name}</p>
                        <p className="text-xs text-muted-foreground">{artist.email}</p>
                    </div>
                  </>
                ) : (
                   <div className="group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-semibold text-sidebar-accent-foreground">No Profile</p>
                        <p className="text-xs text-muted-foreground">Please update</p>
                    </div>
                )}
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-background md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold font-headline">
              {currentPage?.label || 'Dashboard'}
            </h1>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
