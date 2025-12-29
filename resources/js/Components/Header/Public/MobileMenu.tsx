import { useState } from "react";
import { MobileMenuProps } from "../header.types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Building2, ChevronLeft, ChevronRight, CircleUserRound, Menu, NotebookText, Users } from "lucide-react";
import { Link } from "@inertiajs/react";

/**
 * Componente: MobileMenu
 * Menú hamburguesa completo para móviles
 */
export const MobileMenu = ({ pages, currentRoute, empresas, onEmpresaClick }: MobileMenuProps) => {
  const [showAutogestion, setShowAutogestion] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="lg:hidden">
        <Button
          variant='outline'
          size='icon'
          className='border-primary/20 hover:border-primary/40 hover:bg-primary/5'
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' sideOffset={8}>
        {!showAutogestion ? (
          <>
            <DropdownMenuLabel className="text-primary">
              Navegación
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Enlaces principales */}
            {pages.map((page, index) => {
              const isActive = currentRoute === page.ref;
              const Icon = page.icon;

              return (
                <DropdownMenuItem key={index} asChild>
                  <Link
                    href={route(page.ref)}
                    className={`cursor-pointer flex items-center gap-3 py-2.5 ${
                      isActive ? 'bg-primary/10 text-primary font-semibold' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4 text-inherit" />
                    <span className="flex-1">{page.name}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-primary">
              Enlaces Externos
            </DropdownMenuLabel>

            <DropdownMenuItem asChild>
              {/* COMENTADO PORQUE SE IMPLEMENTA EL INICIO DE SESIÓN DE LA PÁGINA ORIGINAL */}
              {/* <Link
                href={route('login')}
                className='cursor-pointer flex items-center gap-3 py-2.5'
              >
                <CircleUserRound className="h-4 w-4" />
                <span className="flex-1">Intranet</span>
              </Link> */}
              <a
                href="https://www.inversionesarar.com/ModulosArar"
                className='cursor-pointer flex items-center gap-3 py-2.5'
              >
                <CircleUserRound className="h-4 w-4" />
                <span className="flex-1">Intranet</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <a
                href='https://glpi.inversionesarar.com'
                target='_blank'
                rel='noopener noreferrer'
                className='cursor-pointer flex items-center gap-3 py-2.5'
              >
                <Users className="h-4 w-4" />
                <span className="flex-1">GLPI</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setShowAutogestion(true);
              }}
              className="cursor-pointer bg-primary/5 hover:bg-primary/10"
            >
              <div className="flex items-center gap-3 py-1 w-full">
                <NotebookText className="h-4 w-4 text-primary" />
                <span className="flex-1 font-medium">Gestión Humana</span>
                <ChevronRight className="h-4 w-4 text-primary" />
              </div>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="text-primary flex items-center gap-2">
              <NotebookText className="h-4 w-4" />
              Gestión Humana
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Selecciona tu empresa
            </div>

            {empresas.map((empresa, index) => (
              <DropdownMenuItem
                key={index}
                onSelect={(e) => onEmpresaClick(empresa, e)}
              >
                <div className='cursor-pointer flex items-center gap-3 capitalize'>
                  <Building2 className="text-primary" />
                  <span className="flex-1">{empresa.name.toLowerCase()}</span>
                </div>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setShowAutogestion(false);
              }}
              className="cursor-pointer bg-muted/50 hover:bg-muted"
            >
              <div className="flex items-center gap-3 py-1 w-full">
                <ChevronLeft className="h-4 w-4" />
                <span className="flex-1 font-medium">Volver al menú</span>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};