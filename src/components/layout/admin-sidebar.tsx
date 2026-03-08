'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Paintbrush,
  User,
  LogOut,
  Home,
  Building,
  Calendar,
  Shield,
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

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/artworks', icon: Paintbrush, label: 'Artworks' },
  { href: '/admin/artists', icon: User, label: 'Artists' },
  { href: '/admin/businesses', icon: Building, label: 'Businesses' },
  { href: '/admin/events', icon: Calendar, label: 'Events' },
];

export default function AdminSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would handle signout
    console.log("Logging out...");
    router.push('/');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold font-headline text-lg group-data-[collapsible=icon]:hidden">
              Admin Hub
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
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
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
           <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://picsum.photos/seed/admin/100/100" alt="Admin User" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-semibold text-sidebar-accent-foreground">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-background md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold font-headline">
              {navItems.find(item => pathname.startsWith(item.href))?.label || 'Admin'}
            </h1>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
