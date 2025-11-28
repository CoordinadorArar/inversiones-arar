import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardHeaderProps } from "../header.types";
import { UserDropdown } from "./UserDropdown";
import { NotificationsButton } from "./NotificationsButton";
import { SearchButton } from "./SearchButton";
/**
 * Componente: DashboardHeader
 * Header del dashboard con sidebar trigger, título y controles de usuario
 * 
 * @author Yariangel Aray - Refactorizado en componentes modulares
 * @version 2.0
 * @date 2025-11-28
 */
export function DashboardHeader({ title, user }: DashboardHeaderProps) {
  return (
    <header className="h-14 border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0 sticky top-0 z-50">
      <div className="h-full pr-6 pl-4 flex items-center justify-between">
        
        {/* Lado izquierdo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block h-6 w-px bg-border" />
            <h2 className="text-lg font-bold text-primary">{title}</h2>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex items-center gap-3">
          <SearchButton />
          <NotificationsButton />
          <UserDropdown user={user} />
        </div>
      </div>
    </header>
  );
}