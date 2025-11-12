/**
 * Componente React para el header fijo. Incluye logo, navegación con botones y dropdown para Gestión Humana, y botón a Intranet.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-11
 */

import { Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { CircleUserRound, House, Mail, Building2, Users, FileUser, NotebookText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Header() {
    const pages = [
        {
            name: 'Inicio',
            ref: 'home',
            icon: House
        },
        {
            name: 'Contacto',
            ref: 'contact',
            icon: Mail
        },
        {
            name: 'Empresas',
            ref: 'companies',
            icon: Building2
        },
    ]

    /**
     * 🔹 usePage().props:
     * Permite acceder a las props globales compartidas por Inertia desde Laravel.
     * 
     * - 'empresas' fue definida en AppServiceProvider con Inertia::share().
     * - Tipamos el valor para mayor claridad y autocompletado.
     */
    const { empresas } = usePage().props as unknown as {
        empresas: { id: number, name: string, }[]
    };

    return (
        // Header fijo.
        <header className=' fixed top-0 left-1/2 -translate-x-1/2 z-50 container mx-auto mt-4'>
            <div className='bg-white/80 backdrop-blur-md rounded-xl border shadow-sm mx-6 px-6 py-1 flex items-center justify-between'>
                {/* Logo: Enlace a home. */}
                <Link href={route('home')} className='h-full hover:opacity-80 transition-opacity'>
                    <img src="images/icono-arar.png" alt="icono" className='h-9' />
                </Link>

                {/* Navegación: Botones para páginas y dropdown para GH. */}
                <nav className='flex items-center gap-1'>
                    {pages.map((page, index) => (
                        <Link
                            key={index}
                            href={route(page.ref)}
                        >
                            <Button variant='ghost' className='gap-2'>
                                <page.icon />
                                {page.name}
                            </Button>
                        </Link>
                    ))}

                    {/* Dropdown Gestión Humana: Enlaces externos a sistema GH. */}
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='gap-2'>
                                <NotebookText />
                                Gestión Humana
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' sideOffset={5}>
                            {empresas.map((empresa, index) => (
                                <DropdownMenuItem key={index} asChild>
                                    <a
                                        href={`http://gh.inversionesarar.com:8900/AuthAG/LoginFormAG?IdCia=${empresa.id}&NroConexion=1`}
                                        className='cursor-pointer w-full capitalize'
                                        target='_blank'
                                    >
                                        {empresa.name.toLowerCase()}
                                    </a>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                <div className='flex gap-2'>
                    {/* Botón Intranet: Enlace a login. */}
                    <Link href={route('login')}>
                        <Button className='gap-2 h-auto py-1 px-3 hover:shadow-md transition-shadow'>
                            <CircleUserRound />
                            Intranet
                        </Button>
                    </Link>

                    {/* Botón GLPI: Enlace a login. */}
                    <a href='https://glpi.inversionesarar.com' target='_blank' rel='noopener'>
                        <Button 
                            className='gap-2 h-auto py-1 px-3 transition-shadow'
                            variant={'outline'}
                        >
                            <Users />
                            GLPI
                        </Button>
                    </a>

                </div>
            </div>
        </header>
    )
}