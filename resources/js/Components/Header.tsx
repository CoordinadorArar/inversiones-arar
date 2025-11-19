/**
 * Componente React para el header fijo. Incluye logo, navegación con botones y dropdown para Gestión Humana, y botón a Intranet.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-14
 */

import { Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { CircleUserRound, House, Mail, Building2, Users, NotebookText, CircleAlert, Briefcase, ChevronRight, Menu, ChevronLeft } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export default function Header() {

    const [showAutogestion, setShowAutogestion] = useState(false);

    // Enlaces principales en el nav 
    const pages = [
        {
            name: 'Inicio',
            ref: 'home',
            icon: House
        },
        {
            name: 'Portafolio',
            ref: 'portfolio',
            icon: Briefcase
        },
        {
            name: 'Empresas',
            ref: 'companies',
            icon: Building2
        },
        {
            name: 'Contacto',
            ref: 'contact',
            icon: Mail
        },
        {
            name: 'Denuncias',
            ref: 'pqrsd',
            icon: CircleAlert
        },
    ];

    const { empresas } = usePage().props as unknown as {
        empresas: { id: number, name: string }[]
    };

    // Obtener la ruta actual para resaltar el enlace activo
    const currentRoute = route().current() || '';

    return (
        <header className='fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full'>
            <div className='container mx-auto mt-4 px-4 '>
                <div className='bg-background/95 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-md transition-shadow px-4 sm:px-6 py-1 flex items-center justify-between'>
                    {/* Logo */}
                    <Link
                        href={route('home')}
                        className='h-full hover:opacity-80 transition-opacity flex-shrink-0'
                    >
                        <img
                            src="images/icono-arar.png"
                            alt="Inversiones Arar"
                            className='h-8 w-auto'
                        />
                    </Link>

                    {/* Navegación Principal */}
                    <nav className='hidden lg:flex items-center gap-1'>
                        {pages.map((page, index) => {
                            const isActive = currentRoute === page.ref;
                            const Icon = page.icon;

                            return (
                                <Link
                                    key={index}
                                    href={route(page.ref)}
                                >
                                    <Button
                                        variant={'ghost'}
                                        className={`gap-2 transition-all ${isActive
                                            ? 'text-primary'
                                            : 'hover:bg-primary/5'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {page.name}
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Botones Externos */}
                    <div className='flex items-center gap-2'>
                        {/* Dropdown Gestión Humana */}
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
                            <DropdownMenuContent align='end' sideOffset={8} >
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    Selecciona tu empresa
                                </div>
                                {empresas.map((empresa, index) => (
                                    <DropdownMenuItem key={index} asChild>
                                        <a
                                            href={`http://gh.inversionesarar.com:8900/AuthAG/LoginFormAG?IdCia=${empresa.id}&NroConexion=1`}
                                            className='cursor-pointer w-full capitalize flex items-center gap-2 py-2'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            <Building2 className="h-4 w-4 text-primary" />
                                            {empresa.name.toLowerCase()}
                                        </a>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Separador visual */}
                        <div className="hidden lg:block h-6 w-px bg-border"></div>

                        {/* Botón Intranet */}
                        <Link href={route('login')} className="hidden lg:block">
                            <Button className='gap-2 shadow-sm hover:shadow-md transition-all h-7 px-3'>
                                <CircleUserRound className="h-4 w-4" />
                                <span className="hidden sm:inline">Intranet</span>
                            </Button>
                        </Link>

                        {/* Botón GLPI */}
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

                        {/* Menú Hamburguesa (Solo Mobile) */}
                        <DropdownMenu >
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
                                                        className={`cursor-pointer flex items-center gap-3 py-2.5 ${isActive ? 'bg-primary/10 text-primary font-semibold' : ''
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

                                        {/* Intranet */}
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route('login')}
                                                className='cursor-pointer flex items-center gap-3 py-2.5'
                                            >
                                                <CircleUserRound className="h-4 w-4" />
                                                <span className="flex-1">Intranet</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        {/* GLPI */}
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

                                        {/* Botón para ir a Gestión Humana */}
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

                                        {/* Lista de empresas */}
                                        {empresas.map((empresa, index) => (
                                            <DropdownMenuItem key={index} asChild>
                                                <a
                                                    href={`http://gh.inversionesarar.com:8900/AuthAG/LoginFormAG?IdCia=${empresa.id}&NroConexion=1`}
                                                    className='cursor-pointer flex items-center gap-3 py-2.5 capitalize'
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    <Building2 className="h-4 w-4 text-primary" />
                                                    <span className="flex-1">{empresa.name.toLowerCase()}</span>
                                                </a>
                                            </DropdownMenuItem>
                                        ))}

                                        {/* Botón para volver */}
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
                    </div>
                </div>
            </div>
        </header>
    );
}