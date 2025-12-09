/**
 * Componente UserDropdown.
 * 
 * Propósito: Dropdown interactivo para el usuario autenticado en el header.
 * Muestra avatar, nombre/email, y opciones de perfil/logout.
 * Usa Shadcn DropdownMenu para UI accesible y animada.
 * 
 * Props:
 * - user: Objeto con email y datos_completos (nombres, apellidos).
 * 
 * Características:
 * - Avatar con fallback (ícono User).
 * - Nombre formateado (primer nombre + primer apellido, en minúsculas).
 * - Enlaces: Perfil via Inertia Link, Logout via router.post.
 * - Estilos: Hover effects, backdrop blur, responsive.
 * 
 * @author Yariangel Aray - Dropdown de usuario para header.
 
 * @date 2025-11-28
 */

// Imports: Componentes UI, íconos, Inertia, tipos.
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";  // Dropdown de Shadcn.
import { UserDropdownProps } from "../header.types";  // Tipos para props.
import { Button } from "@/components/ui/button";  // Botón trigger.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";  // Avatar del usuario.
import { LogOut, User } from "lucide-react";  // Íconos para logout y fallback.
import { Link, router } from "@inertiajs/react";  // Link para navegación, router para POST.

/**
 * Componente funcional UserDropdown.
 * 
 * Renderiza dropdown con info del usuario y acciones.
 * 
 * @param {UserDropdownProps} props - Props con user.
 * @returns JSX.Element
 */
export const UserDropdown = ({ user }: UserDropdownProps) => {
  // Extrae email y datos_completos del user.
  const { email, info_corta } = user;
  
  // Formatea nombre: Primer nombre + primer apellido, en minúsculas.
  const nombre = (
    info_corta.nombres.split(" ")[0] + " " + 
    info_corta.apellidos.split(" ")[0]
  ).toLowerCase();

  // Render: DropdownMenu con trigger y content.
  return (
    <DropdownMenu>
      {/* Trigger: Botón con avatar, hover ring. */}
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
        >
          <Avatar className="h-8 w-8">
            {/* Fallback: Gradiente con ícono User si no hay imagen. */}
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* Content: Menu flotante con info y opciones. */}
      <DropdownMenuContent
        className="w-min p-2 bg-background/95 backdrop-blur-sm" 
        align="end"  // Alinea a la derecha.
      >
        {/* Label: Info del usuario (nombre capitalizado, email). */}
        <DropdownMenuLabel>
          <div className="flex flex-col py-1 px-2">
            <p className="text-sm font-semibold capitalize">{nombre}</p>  {/* Capitaliza nombre. */}
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <DropdownMenuSeparator />  {/* Separador. */}
        </DropdownMenuLabel>

        {/* Item: Mi Perfil - Link a route('profile'). */}
        <DropdownMenuItem asChild>
          <Link 
            href={route('profile')} 
            className="flex items-center cursor-pointer py-2 px-4 hover:bg-primary/5 transition-colors"
          >
            <User className="mr-3 h-4 w-4 text-primary" />  {/* Ícono User. */}
            <span>Mi Perfil</span>
          </Link>
        </DropdownMenuItem>

        {/* Item: Cerrar Sesión - Botón que hace POST a /logout. */}
        <DropdownMenuItem asChild className="hover:!bg-destructive/10">
          <button
            onClick={() => router.post('/logout')}  // POST para logout.       
            className="w-full flex items-center cursor-pointer text-destructive focus:text-destructive py-2 px-4 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4 text-destructive" />  {/* Ícono LogOut. */}
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
