/**
 * Componente DashboardHeader.
 * 
 * Propósito: Header fijo del dashboard con trigger de sidebar, título dinámico,
 * botones de búsqueda/notificaciones y dropdown de usuario con opciones de perfil/logout.
 * Usa backdrop blur para efecto visual, sticky top con z-50.
 * 
 * Props:
 * - title: String opcional el título principal de la vista.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-25
 */

import { LogOut, User, Building2, Settings, Bell, Search } from "lucide-react";
import { Link } from "@inertiajs/react"; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Componente funcional DashboardHeader.
export function DashboardHeader({ title, user:{email, datos_completos} }) {

  const nombre = (datos_completos.nombres.split(" ")[0] + " " + datos_completos.apellidos.split(" ")[0]).toLowerCase();

  // Render: Header sticky con border bottom, bg con backdrop blur.
  return (
    <header className="h-14 border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0 sticky top-0 z-50">
      {/* Contenedor principal: padding, flex justify-between, items-center. */}
      <div className="h-full pr-6 pl-4 flex items-center justify-between">
        {/* Lado izquierdo: Sidebar trigger + separador + título. */}
        <div className="flex items-center gap-3">
          {/* Trigger de sidebar: Hover con bg primary. */}
          <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
          
          {/* Separador vertical (hidden en sm) + título. */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block h-6 w-px bg-border" />  {/* Separador visual. */}
            <h2 className="text-lg font-bold text-primary">
              {title}  {/* Título dinámico pasado como prop. */}
            </h2>
          </div>
        </div>

        {/* Lado derecho: Botones de búsqueda/notificaciones + dropdown usuario. */}
        <div className="flex items-center gap-3">
          {/* Botón búsqueda: Hidden en md, hover bg primary. */}
          <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-primary/10 transition-colors">
            <Search className="h-5 w-5" />  {/* Ícono de búsqueda. */}
          </Button>

          {/* Botón notificaciones: Con badge rojo para indicar nuevas. */}
          <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
            <Bell className="h-5 w-5" />  {/* Ícono de campana. */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />  {/* Badge de notificación. */}
          </Button>

          {/* Dropdown de usuario: Trigger con avatar, menu con perfil/logout. */}
          <DropdownMenu>
            {/* Trigger: Botón con avatar, hover ring. */}
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Usuario" />  {/* Imagen opcional. */}
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
                    <User />  {/* Fallback con ícono User. */}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            {/* Contenido del dropdown: Align end, bg con backdrop. */}
            <DropdownMenuContent className="w-min p-2 bg-background/95 backdrop-blur-sm" align="end">
              {/* Label con info de usuario. */}
              <DropdownMenuLabel>
                <div className="flex flex-col py-1 px-2">
                  <p className="text-sm font-semibold capitalize">{nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {email}
                  </p>
                </div>
                <DropdownMenuSeparator />  {/* Separador. */}
              </DropdownMenuLabel>

              {/* Item: Mi Perfil - Link a profile. */}
              <DropdownMenuItem asChild>
                <Link href={route('profile')} className="flex items-center cursor-pointer py-2 px-4 hover:bg-primary/5 transition-colors">
                  <User className="mr-3 h-4 w-4 text-primary" />  {/* Ícono User. */}
                  <span>Mi Perfil</span>
                </Link>
              </DropdownMenuItem>

              {/* Item: Cerrar Sesión - Link a logout, estilo destructive. */}
              <DropdownMenuItem asChild className="hover:!bg-destructive/10">
                <Link
                  href={route("logout")}
                  className="flex items-center cursor-pointer text-destructive focus:text-destructive py-2 px-4 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4 text-destructive" />  {/* Ícono LogOut. */}
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
