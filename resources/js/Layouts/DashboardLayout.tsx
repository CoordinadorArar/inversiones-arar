import { DashboardHeader } from "@/Components/Dashboard/Header";
import { DashboardSidebar } from "@/Components/Dashboard/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  header?: string;
}

export function DashboardLayout({ children, header }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen grid grid-cols-[auto_1fr] w-full bg-background">
        <DashboardSidebar />

        <div className="flex flex-col">
          <DashboardHeader title={header} />

          <main className="flex-1 p-6 bg-muted/40 shadow-[inset_2px_2px_4px_0_rgb(0_0_0_/_0.05)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}