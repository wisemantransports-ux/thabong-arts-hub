import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Artist Dashboard",
  description: "Manage your artworks and profile on Africa Arts Hub.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/dashboard');
  }

  const { data: artist } = await supabase
    .from('artists')
    .select('role')
    .eq('user_id', user.id)
    .single();
  
  // A regular artist should not access admin pages, even if they type the URL
  if (artist?.role === 'admin') {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-secondary">
      <DashboardSidebar>
        {children}
      </DashboardSidebar>
    </div>
  );
}
