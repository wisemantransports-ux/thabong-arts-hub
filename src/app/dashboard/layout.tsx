import DashboardSidebar from "@/components/layout/dashboard-sidebar";

export const metadata = {
  title: "Artist Dashboard",
  description: "Manage your artworks and profile on Africa Arts Hub.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary">
      <DashboardSidebar>
        {children}
      </DashboardSidebar>
    </div>
  );
}
