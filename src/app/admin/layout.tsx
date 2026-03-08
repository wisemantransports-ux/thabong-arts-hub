import AdminSidebar from "@/components/layout/admin-sidebar";

export const metadata = {
  title: "Admin Dashboard | Africa Arts Hub",
  description: "Manage the Africa Arts Hub platform.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary">
      <AdminSidebar>
        {children}
      </AdminSidebar>
    </div>
  );
}
