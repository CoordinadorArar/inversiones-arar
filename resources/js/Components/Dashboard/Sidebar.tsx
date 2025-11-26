/**
 * Componente DashboardSidebar.
 * 
 * Propósito: Sidebar colapsable del dashboard con menu jerárquico (padres con subitems).
 * Cuando expandido: Usa Collapsible para dropdowns. Cuando colapsado: Usa Popover para mostrar subitems flotantes, con indicador visual de dropdown.
 * Incluye logo dinámico, item "Dashboard" fijo, y navegación con highlights activos.
 * 
 * Props:
 * - menu: Array de MenuParent[] (desde props compartidas).
 * - openGroups: Array de strings (grupos abiertos).
 * - setOpenGroups: Función para toggle grupos.
 * 
 * @author Yariangel Aray - Documentado y mejorado para colapsado.
 * @version 1.0
 * @date 2024-10-02
 */

import { ChevronDown, ChevronLeft, ChevronRight, Home } from "lucide-react"; // Agregado ChevronRight para indicador
import { DynamicIcon } from "lucide-react/dynamic";
import { Link } from "@inertiajs/react";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar, } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Interfaces para tipado (agregadas para mejor mantenibilidad)
interface MenuItem {
  title: string;
  url: string;
  icon: string; // Nombre del ícono para DynamicIcon
}

interface MenuParent {
  title: string;
  url: string;
  icon: string;
  items?: MenuItem[]; 
}

// Props del componente con tipado
interface DashboardSidebarProps {
  menu: MenuParent[];
  openGroups: string[];
  setOpenGroups: (groups: string[] | ((prev: string[]) => string[])) => void;
}

// Componente funcional DashboardSidebar con tipado.
export function DashboardSidebar({ menu, openGroups, setOpenGroups }: DashboardSidebarProps) {
  // Estado del sidebar: 'expanded' o 'collapsed'.
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  // Estado para controlar cuál popover está abierto (por título del item)
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  // Función para toggle grupos (solo cuando expandido).
  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  // Ruta actual para highlights.
  const currentRoute = route().current() || "";
  const isActive = (url: string) => currentRoute === url;

  // Render: Sidebar con collapsible="icon".
  return (
    <Sidebar collapsible="icon">
      {/* Logo: Cambia tamaño según colapsado/expandido. */}
      <div className="h-16 flex flex-col items-center justify-center">
        {collapsed ? (
          <img
            src="images/icono-arar.png"
            alt="Logo"
            className="transition-all duration-300 w-9"
          />
        ) : (
          <img
            src="images/logo-arar.png"
            alt="Logo"
            className="transition-all duration-300 w-36 mt-5"
          />
        )}
      </div>

      {/* Contenido del sidebar. */}
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Item fijo: Dashboard. */}
              <SidebarMenuButton asChild>
                <Link
                  href={route('dashboard')}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300 rounded-md",
                    isActive('dashboard')
                      ? `bg-primary/10 text-primary font-medium hover:!text-primary ${!collapsed && "hover:!bg-primary/15 border-r-4 border-primary"}`
                      : "hover:bg-muted"
                  )}
                >
                  <Home className="h-4 w-4" />
                  {!collapsed && <span className="font-medium">Dashboard</span>}
                </Link>
              </SidebarMenuButton>

              {/* Mapeo del menu dinámico. */}
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    // Si tiene subitems: Comportamiento diferente según colapsado.
                    collapsed ? (
                      // Colapsado: Usa Popover para mostrar subitems flotantes, con indicador visual.
                      <Popover
                        open={openPopover === item.title}
                        onOpenChange={(open) => setOpenPopover(open ? item.title : null)}
                      >
                        <PopoverTrigger asChild>
                          <SidebarMenuButton className="w-full transition-all duration-300 hover:bg-primary/10 rounded-md relative">
                            <DynamicIcon name={item.icon} className="h-4 w-4" />                        
                            {/* Indicador visual: ChevronRight que rota cuando el popover está abierto */}
                            <ChevronRight
                              className={cn(
                                "!h-3 !w-3 absolute -right-1 top-1/2 -translate-y-1/2 transition-transform duration-300 opacity-80",
                                openPopover === item.title && "rotate-180"
                              )}
                            />
                          </SidebarMenuButton>
                        </PopoverTrigger>
                        {/* PopoverContent: Menu flotante con subitems, animado suavemente. */}
                        <PopoverContent
                          side="right"
                          align="start"
                          sideOffset={8}
                          className="w-64 p-2 bg-background/95 backdrop-blur-sm border shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                        >
                          <div className="space-y-1">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.url}
                                href={`${item.url}${subItem.url}`}
                                className={cn(
                                  "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-all duration-200",
                                  isActive(`${item.url}${subItem.url}`)
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-muted"
                                )}
                              >
                                <DynamicIcon name={subItem.icon} className="h-4 w-4" />
                                <span>{subItem.title}</span>
                              </Link>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      // Expandido: Usa Collapsible con animación de slide vertical.
                      <Collapsible
                        open={openGroups.includes(item.title)}
                        onOpenChange={() => toggleGroup(item.title)}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full transition-all duration-300 hover:bg-primary/5 rounded-md">
                            <DynamicIcon name={item.icon} className="h-4 w-4" />
                            <span className="flex-1 font-medium whitespace-nowrap">{item.title}</span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-300",
                                openGroups.includes(item.title) && "rotate-180"
                              )}
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {/* CollapsibleContent: Animación suave de deslizamiento vertical */}
                        <CollapsibleContent
                          className={cn(
                            "pl-4 space-y-1 mt-1 overflow-hidden",
                            "data-[state=open]:animate-collapsible-down",
                            "data-[state=closed]:animate-collapsible-up"
                          )}
                        >
                          {item.items.map((subItem) => (
                            <SidebarMenuButton key={subItem.url} asChild>
                              <Link
                                href={`${item.url}${subItem.url}`}
                                className={cn(
                                  "flex items-center gap-2 w-full transition-all duration-300 rounded-md",
                                  isActive(`${item.url}${subItem.url}`)
                                    ? "bg-primary/10 text-primary font-medium hover:!text-primary hover:!bg-primary/15 border-r-2 border-primary pl-3"
                                    : "hover:bg-muted pl-4"
                                )}
                              >
                                <DynamicIcon name={subItem.icon} className="h-4 w-4" />
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  ) : (
                    // Sin subitems: Link directo siempre.
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url!}
                        className={cn(
                          "flex items-center gap-2 transition-all duration-300 rounded-md",
                          isActive(item.url!)
                            ? `bg-primary/10 text-primary font-medium hover:!text-primary ${!collapsed && "hover:!bg-primary/15 border-r-4 border-primary"}`
                            : "hover:bg-muted"
                        )}
                      >
                        <DynamicIcon name={item.icon} className="h-4 w-4" />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
