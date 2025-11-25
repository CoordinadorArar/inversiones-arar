import { useState } from "react";
import { ChevronDown, Home } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { Link } from "@inertiajs/react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import IconPicker from "../IconPicker";

const menuItems = [
  {
    title: "Finanzas",
    icon: "dollar-sign",
    items: [
      { title: "Contabilidad", url: "/dashboard/contabilidad", icon: "file-text" },
      { title: "Reportes", url: "/dashboard/reportes", icon: "bar-chart-3" },
    ],
  },
  {
    title: "Recursos",
    icon: "package",
    items: [
      { title: "Inventario", url: "/dashboard/inventario", icon: "package" },
      { title: "Compras", url: "/dashboard/compras", icon: "shopping-cart" },
    ],
  },
  {
    title: "Equipo",
    url: "/dashboard/equipo",
    icon: "users",
  },
  {
    title: "Administración Web",
    url: "/dashboard/configuracion",
    icon: "user-cog",
  },
];

export function DashboardSidebar() {
  const [data, setData] = useState({
    icon: ""
  });

  const { state } = useSidebar();
  const [openGroups, setOpenGroups] = useState<string[]>(["Finanzas"]);
  const collapsed = state === "collapsed";

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const currentRoute = route().current() || "";

  const isActive = (url: string) => currentRoute === url;

  return (
    <Sidebar collapsible="icon">
      <div className="h-16 flex flex-col items-center justify-center ">
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
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupLabel>
            Menú Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuButton asChild>
                <Link
                  href={route('dashboard')}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300 rounded-md",
                    isActive('dashboard')
                      ? `bg-primary/10 text-primary font-medium hover:!text-primary ${!collapsed && " hover:!bg-primary/15 border-r-4 border-primary"}`
                      : "hover:bg-muted"
                  )}
                >
                  <Home className="h-4 w-4" />
                  {!collapsed && <span className="font-medium">Dashboard</span>}
                </Link>
              </SidebarMenuButton>

              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible
                      open={openGroups.includes(item.title)}
                      onOpenChange={() => toggleGroup(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full transition-all duration-300 hover:bg-primary/10 data-[state=open]:bg-primary/5">
                          <DynamicIcon name={item.icon} className="h-4 w-4" />
                          {!collapsed && (
                            <>
                              <span className="flex-1 font-medium">{item.title}</span>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform duration-300",
                                  openGroups.includes(item.title) &&
                                  "rotate-180"
                                )}
                              />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent className="pl-4 space-y-1 mt-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuButton key={subItem.url} asChild>
                              <Link
                                href={subItem.url}
                                className={cn(
                                  "flex items-center gap-2 w-full transition-all duration-300 rounded-md",
                                  isActive(subItem.url)
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
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url!}
                        className={cn(
                          "flex items-center gap-2 transition-all duration-300 rounded-md",
                          isActive(item.url!)
                            ? `bg-primary/10 text-primary font-medium hover:!text-primary ${!collapsed && " hover:!bg-primary/15 border-r-4 border-primary"}`
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
              <div>
                <label className="text-sm font-medium">Icono</label>
                <IconPicker value={data.icon} onChange={(icon) => setData('icon', icon)} />
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}