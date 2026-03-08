import AdminSidebar from "@/components/layout/admin-sidebar";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard | Africa Arts Hub",
  description: "Manage the Africa Arts Hub platform.",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/admin');
  }

  const { data: artist } = await supabase
    .from('artists')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (artist?.role !== 'admin') {
    // If the user is not an admin, send them to their regular dashboard
    redirect('/dashboard?message=You do not have permission to access the admin area.');
  }

  return (
    <div className="min-h-screen bg-secondary">
      <AdminSidebar>
        {children}
      </AdminSidebar>
    </div>
  );
}
