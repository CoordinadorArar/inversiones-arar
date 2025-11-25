/**
 * Componente React para el header fijo. Incluye logo, navegación con botones y dropdown para Gestión Humana, y botón a Intranet.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 2.0 (Se realizo compatibilidad con responsivo y mejoras en usabilidad)
 * @date 2025-11-18
 */

import { Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { CircleUserRound, House, Mail, Building2, Users, NotebookText, CircleAlert, Briefcase, ChevronRight, Menu, ChevronLeft, Play } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useRef, useEffect } from 'react';
// Definir interfaz para el tipo Empresa
interface Empresa {
    id: number;     // ID de la empresa (id_siesa).
    name: string;   // Nombre de la empresa (razon_social).
}
// Definir interfaz para el estado de la empresa seleccionada
type SelectedEmpresa = Empresa | null;
// Definir tipo para los elementos del array 'pages' 
type PageItem = {
    name: string;   // Nombre del enlace.
    ref: string;    // Nombre de ruta (para route()).
    icon: React.ComponentType<{ className?: string }>; // Tipo para iconos de Lucide
};

export default function Header({empresas}) {
    // Estados para modales y selección.
    const [showAutogestion, setShowAutogestion] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const [selectedEmpresa, setSelectedEmpresa] = useState<SelectedEmpresa>(null); // Empresa seleccionada en dropdown.
    const videoRef = useRef<HTMLVideoElement>(null);

    // Enlaces principales en el nav 
    const pages: PageItem[] = [
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

    // Obtener la ruta actual para resaltar el enlace activo
    const currentRoute = route().current() || '';

    // Manejar el click en una empresa
    const handleEmpresaClick = (empresa: Empresa, e: Event) => {
        e.preventDefault();
        setSelectedEmpresa(empresa);
        setShowVideoModal(true);
    };

    // Redirigir a Gestión Humana
    const handleContinuar = () => {
        if (selectedEmpresa) {
            window.open(
                `http://gh.inversionesarar.com:8900/AuthAG/LoginFormAG?IdCia=${selectedEmpresa.id}&NroConexion=1`,
                '_blank',
                'noopener,noreferrer'
            );
            setShowVideoModal(false);
            setSelectedEmpresa(null);
        }
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setShowVideoModal(false);
        setSelectedEmpresa(null);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <>
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
                                        <DropdownMenuItem
                                            key={index}
                                            onSelect={(e) => handleEmpresaClick(empresa, e)}
                                        >
                                            <div className='cursor-pointer w-full capitalize flex items-center gap-2'>
                                                <Building2 className="text-primary" />
                                                {empresa.name.toLowerCase()}
                                            </div>
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
                                                <DropdownMenuItem
                                                    key={index}
                                                    onSelect={(e) => handleEmpresaClick(empresa, e)}
                                                >
                                                    <div className='cursor-pointer flex items-center gap-3 capitalize'>
                                                        <Building2 className="text-primary" />
                                                        <span className="flex-1">{empresa.name.toLowerCase()}</span>
                                                    </div>
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

            {/* Modal con Video */}
            <Dialog open={showVideoModal} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Play className="h-5 w-5 text-primary" />
                            Tutorial de Gestión Humana
                        </DialogTitle>
                        <DialogDescription>
                            Por favor, mira este video tutorial antes de continuar
                        </DialogDescription>
                    </DialogHeader>

                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            className="w-full h-full"
                            controls
                        >
                            <source src="videos/tutorial-gh.mp4" type="video/mp4" />
                            Tu navegador no soporta la reproducción de video.
                        </video>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCloseModal}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleContinuar}
                            className="w-full sm:w-auto"
                        >
                            Continuar a Gestión Humana
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}