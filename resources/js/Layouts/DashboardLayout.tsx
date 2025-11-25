import { DashboardHeader } from "@/Components/Dashboard/Header";
import { DashboardSidebar } from "@/Components/Dashboard/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { usePage } from "@inertiajs/react";
import { PageProps } from '@inertiajs/core';
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  header?: string;
}

interface MenuItem {
  title: string;
  url: string | null;
  icon: string | null;
}
interface MenuParent {
  title: string;
  url: string | null;
  icon: string | null;
  items: MenuItem[];
}
interface PagePropsSidebar extends PageProps {
  menu: MenuParent[];
}
export function DashboardLayout({ children, header }: DashboardLayoutProps) {

  const menu: MenuParent[] = usePage<PagePropsSidebar>().props.menu;

  const [openGroups, setOpenGroups] = useState<string[]>([
    menu.find(item => item.items?.length > 0)?.title ?? ''
  ]);

  return (
    <SidebarProvider>
      <div className="min-h-screen grid grid-cols-[auto_1fr] w-full bg-background">
        <DashboardSidebar
          menu={menu}
          openGroups={openGroups}
          setOpenGroups={setOpenGroups}
        />

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