import { Link } from "@inertiajs/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { DashboardSidebarProps } from "./menu.types";
import { useActiveRoute } from "./hooks";
import { DynamicMenuItem } from "./MenuItems/DynamicMenuItem";
import { Home } from "lucide-react";

/**
 * Componente Principal: DashboardSidebar
 * 
 * Sidebar colapsable del dashboard con menú jerárquico.
 * Coordina todos los subcomponentes y maneja el estado global del sidebar.
 * 
 * @author Yariangel Aray - Refactorizado en componentes modulares
 
 * @date 2025-11-28
 */
export function DashboardSidebar({
  menu,
  openGroups,
  setOpenGroups
}: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => {
      // Si el grupo ya está abierto, cerrarlo
      if (prev.includes(title)) {
        return [];
      }
      // Si está cerrado, abrir solo este (cerrar todos los demás)
      return [title];
    });
  };

  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarLogo collapsed={collapsed} />

      <SidebarContent className="mt-2 overflow-y-auto sidebar-scroll">
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Item fijo: Dashboard */}
              <DashboardMenuItem collapsed={collapsed} />

              {/* Items dinámicos del menú */}
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <DynamicMenuItem
                    item={item}
                    collapsed={collapsed}
                    openGroups={openGroups}
                    toggleGroup={toggleGroup}
                    openPopover={openPopover}
                    setOpenPopover={setOpenPopover}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

/**
 * Componente: SidebarLogo
 * Renderiza el logo que cambia según el estado del sidebar (colapsado/expandido)
 */
const SidebarLogo = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <div className="h-16 flex flex-col items-center justify-center">
      {collapsed ? (
        <img
          src="/images/icono-arar.png"
          alt="Logo"
          className="transition-all duration-300 w-9"
        />
      ) : (
        <img
          src="/images/logo-arar.png"
          alt="Logo"
          className="transition-all duration-300 w-36 mt-5"
        />
      )}
    </div>
  );
};

/**
 * Componente: DashboardMenuItem
 * Item fijo del dashboard (Home)
 */
const DashboardMenuItem = ({ collapsed }: { collapsed: boolean }) => {
  const { isActive } = useActiveRoute();

  return (
    <SidebarMenuButton asChild>
      <Link
        href={route('dashboard')}
        className={cn(
          "flex items-center gap-2 transition-all duration-300 rounded-md whitespace-nowrap",
          isActive('/dashboard')
            ? `bg-primary/10 text-primary font-medium hover:!text-primary hover:!bg-primary/15 ${!collapsed && "border-r-4 border-primary"}`
            : "hover:bg-muted"
        )}
        onClick={e => {
          if (isActive('/dashboard')) e.preventDefault();
        }}
      >
        <Home className="h-4 w-4" />
        {!collapsed && <span className="font-medium">Dashboard</span>}
      </Link>
    </SidebarMenuButton>
  );
};