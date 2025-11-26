/**
 * Componente DashboardLayout.
 * 
 * Propósito: Layout principal para el dashboard admin, con sidebar colapsable y header.
 * Usa SidebarProvider para estado global de sidebar, renderiza menu dinámico desde props.
 * Estructura grid responsive: sidebar + contenido principal.
 * 
 * Props:
 * - children: Contenido a renderizar en main.
 * - header: Título para DashboardHeader.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-25
 */

import { DashboardHeader } from "@/Components/Dashboard/Header";  
import { DashboardSidebar } from "@/Components/Dashboard/Sidebar";  
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";  
import { usePage } from "@inertiajs/react";  
import { PageProps } from '@inertiajs/core'; 
import { useState } from "react";  

// Interface para props del componente.
interface DashboardLayoutProps {
  children: React.ReactNode;  // Contenido JSX a renderizar.
  header: string;  // Título opcional para el header.
}

// Interface para items del menu (subitems).
interface MenuItem {
  title: string;  // Título del item.
  url: string;  // URL.
  icon: string;  // Ícono (string para DynamicIcon).
}

// Interface para padres del menu (con subitems).
interface MenuParent {
  title: string;  // Título del grupo padre.
  url: string;  // URL del padre.
  icon: string;  // Ícono del padre.
  items?: MenuItem[];  // Array de subitems.
}

// Extiende PageProps.
interface PagePropsDashboard extends PageProps {
  menu: MenuParent[];  // Menu dinámico desde HandleInertiaRequests.
}

// Componente funcional DashboardLayout.
export function DashboardLayout({ children, header }: DashboardLayoutProps) {
  // Extraer menu de props compartidas via Inertia (ej. desde middleware).
  const menu: MenuParent[] = usePage<PagePropsDashboard>().props.menu;

  const user = usePage().props.auth.user;
  
  // Estado para grupos abiertos en sidebar (inicia con primer grupo que tenga items).
  const [openGroups, setOpenGroups] = useState<string[]>([
    menu.find(item => (item.items ?? []).length > 0)?.title ?? ''  // Abre primer grupo con subitems.
  ]);

  // Render: SidebarProvider envuelve todo para estado global.
  return (
    <SidebarProvider>
      {/* Grid layout: sidebar auto + contenido 1fr, full width, bg background. */}
      <div className="min-h-screen grid grid-cols-[auto_1fr] w-full bg-background">
        {/* Sidebar: Pasa menu, estado de grupos abiertos y setter. */}
        <DashboardSidebar
          menu={menu}
          openGroups={openGroups}
          setOpenGroups={setOpenGroups}
        />

        {/* Contenedor principal: flex col. */}
        <div className="flex flex-col">
          {/* Header: Pasa título. */}
          <DashboardHeader title={header} user={user}/>

          {/* Main: Contenido principal con padding, bg muted, shadow inset. */}
          <main className="flex-1 p-6 bg-muted/60 shadow-[inset_2px_2px_4px_0_rgb(0_0_0_/_0.05)]">
            {/* Contenedor max-width centrado. */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}  {/* Renderiza children (páginas del dashboard). */}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
