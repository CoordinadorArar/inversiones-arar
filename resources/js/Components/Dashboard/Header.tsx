import { LogOut, User, Building2, Settings, Bell, Search } from "lucide-react";
import { Link } from "@inertiajs/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader({ title = "Portal Empresas" }) {
  return (
    <header className="h-14 border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0 sticky top-0 z-50">
      <div className="h-full pr-6 pl-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
          <div className="flex items-center gap-4">
            <div className="hidden sm:block h-6 w-px bg-border" />
            <h2 className="text-lg font-bold text-primary">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón de búsqueda */}
          <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-primary/10 transition-colors">
            <Search className="h-5 w-5" />
          </Button>

          {/* Botón de notificaciones */}
          <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
          </Button>

          {/* Dropdown de usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Usuario" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 bg-background/95 backdrop-blur-sm" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col py-1 px-2">
                  <p className="text-sm font-semibold">Usuario Demo</p>
                  <p className="text-xs text-muted-foreground">
                    usuario@empresa.com
                  </p>
                </div>
                <DropdownMenuSeparator />
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={route('profile.edit')} className="flex items-center cursor-pointer py-2 hover:bg-primary/5 transition-colors">
                  <User className="mr-3 h-4 w-4 text-primary" />
                  <span>Mi Perfil</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="hover:!bg-destructive/10">
                <Link
                  href={route("logout")}
                  className="flex items-center cursor-pointer text-destructive focus:text-destructive py-2 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4 text-destructive" />
                  <span className="font-medium">Cerrar Sesión</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}