import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserDropdownProps } from "../header.types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { Link } from "@inertiajs/react";
/**
 * Componente: UserDropdown
 * Dropdown del usuario con opciones de perfil y logout
 */
export const UserDropdown = ({ user }: UserDropdownProps) => {
  const { email, datos_completos } = user;
  const nombre = (
    datos_completos.nombres.split(" ")[0] + " " + 
    datos_completos.apellidos.split(" ")[0]
  ).toLowerCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="Usuario" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-min p-2 bg-background/95 backdrop-blur-sm" 
        align="end"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col py-1 px-2">
            <p className="text-sm font-semibold capitalize">{nombre}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <DropdownMenuSeparator />
        </DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link 
            href={route('profile')} 
            className="flex items-center cursor-pointer py-2 px-4 hover:bg-primary/5 transition-colors"
          >
            <User className="mr-3 h-4 w-4 text-primary" />
            <span>Mi Perfil</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="hover:!bg-destructive/10">
          <Link
            href={route("logout")}
            className="flex items-center cursor-pointer text-destructive focus:text-destructive py-2 px-4 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4 text-destructive" />
            <span className="font-medium">Cerrar Sesión</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
