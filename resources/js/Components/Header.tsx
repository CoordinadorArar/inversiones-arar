import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { CircleUserRound, House, Mail, Building2, Users } from 'lucide-react';
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
            ref: 'login',
            icon: Building2
        },
    ]

    const linksGH = [
        {
            name: "Italo Colombiano de Baterías S.A.S",
            IdCia: 1,
        },
        {
            name: "Representaciones Ankal S.A.S",
            IdCia: 2,
        },
    ];

    return (
        <header className=' fixed top-0 left-1/2 -translate-x-1/2 z-50 container mx-auto mt-4'>
            <div className='bg-white/80 backdrop-blur-md rounded-xl border shadow-sm mx-6 px-6 py-1 flex items-center justify-between'>
                <Link href={route('home')} className='h-full hover:opacity-80 transition-opacity'>
                    <img src="images/icono-arar.png" alt="icono" className='h-9' />
                </Link>

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

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='gap-2'>
                                <Users />
                                Gestión Humana
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-64' sideOffset={5}>
                            {linksGH.map((link, index) => (
                                <DropdownMenuItem key={index} asChild>
                                    <a 
                                        href={`http://gh.inversionesarar.com:8900/AuthAG/LoginFormAG?IdCia=${link.IdCia}&NroConexion=1`}
                                        className='cursor-pointer w-full'
                                        target='_blank'
                                    >
                                        {link.name}
                                    </a>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                <Link href={route('login')}>
                    <Button className='gap-2 h-auto py-1 px-3'>
                        <CircleUserRound />
                        Intranet
                    </Button>
                </Link>
            </div>
        </header>
    )
}