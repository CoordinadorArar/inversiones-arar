import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { CircleUserRound, House, Mail, Building2 } from 'lucide-react';

export default function Header() {
    const links = [
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
    
    return (
        <header className=' fixed top-0 left-1/2 -translate-x-1/2 z-50 container mx-auto mt-4'>
            <div className='bg-white/90 backdrop-blur-md rounded-xl border shadow-sm mx-6 px-6 py-1 flex items-center justify-between'>
                <Link href={route('home')} className='h-full hover:opacity-80 transition-opacity'>
                    <img src="images/icono-arar.png" alt="icono" className='h-9' />
                </Link>

                <nav className='flex items-center gap-1'>
                    {links.map((link, index) => (
                        <Link 
                            key={index}
                            href={route(link.ref)}
                        >
                            <Button variant='ghost' className='gap-2'>
                                <link.icon />
                                {link.name}
                            </Button>
                        </Link>
                    ))}
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