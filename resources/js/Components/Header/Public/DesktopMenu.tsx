import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Building2, CircleUserRound, NotebookText, Users } from "lucide-react";
import { GestionHumanaDropdownProps, NavigationProps } from "../header.types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

/**
 * Componente: Navigation
 * Navegación principal del header público (solo desktop)
 */

export const Navigation = ({ pages, currentRoute }: NavigationProps) => {
  return (
    <nav className='hidden lg:flex items-center gap-1'>
      {pages.map((page, index) => {
        const isActive = currentRoute === page.ref;
        const Icon = page.icon;

        return (
          <Link key={index} href={route(page.ref)}>
            <Button
              variant={'ghost'}
              className={`gap-2 transition-all ${
                isActive ? 'text-primary' : 'hover:bg-primary/5'
              }`}
            >
              <Icon className="h-4 w-4" />
              {page.name}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

/**
 * Componente: GestionHumanaDropdown
 * Dropdown de gestión humana para seleccionar empresa (solo desktop)
 */
export const GestionHumanaDropdown = ({ empresas, onEmpresaClick }: GestionHumanaDropdownProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="hidden lg:flex">
        <Button
          variant='outline'
          className='gap-2 border-primary/20 hover:border-primary/40 transition-all h-8 px-3'
        >
          <NotebookText className="h-4 w-4" />
          <span className="hidden sm:inline">Gestión Humana</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' sideOffset={8}>
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Selecciona tu empresa
        </div>
        {empresas.map((empresa, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={(e) => onEmpresaClick(empresa, e)}
          >
            <div className='cursor-pointer w-full capitalize flex items-center gap-2'>
              <Building2 className="text-primary" />
              {empresa.name.toLowerCase()}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * Componente: ExternalLinks
 * Botones de enlaces externos (Intranet, GLPI) - solo desktop
 */
export const ExternalLinks = () => {
  return (
    <>
      <div className="hidden lg:block h-6 w-px bg-border"></div>
      
      {/* COMENTADO PORQUE SE IMPLEMENTA EL INICIO DE SESIÓN DE LA PÁGINA ORIGINAL */}
      {/* <Link href={route('login')} className="hidden lg:block">
        <Button className='gap-2 shadow-sm hover:shadow-md transition-all h-7 px-3'>
          <CircleUserRound className="h-4 w-4" />
          <span className="hidden sm:inline">Intranet</span>
        </Button>
      </Link> */}

      <a href="https://www.inversionesarar.com/ModulosArar" className="hidden lg:block">
        <Button className='gap-2 shadow-sm hover:shadow-md transition-all h-7 px-3'>
          <CircleUserRound className="h-4 w-4" />
          <span className="hidden sm:inline">Intranet</span>
        </Button>
      </a>

      <a
        href='https://glpi.inversionesarar.com'
        target='_blank'
        rel='noopener noreferrer'
        className="hidden lg:block"
      >
        <Button
          variant='outline'
          className='gap-2 border-primary/20 hover:border-primary/40 transition-all h-7 px-3'
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">GLPI</span>
        </Button>
      </a>
    </>
  );
};

