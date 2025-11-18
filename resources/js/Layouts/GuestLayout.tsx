import { Link } from '@inertiajs/react';
import { Building2, CalendarDays, FileText, Users } from 'lucide-react';
import Copyright from '@/Components/Copyright';

// Props: children (contenido), showBrandPanel (mostrar panel derecho), maxWidth (ancho máximo del contenedor).
interface GuestLayoutProps {
    children: React.ReactNode;
    showBrandPanel?: boolean; // Para mostrar/ocultar el panel naranja
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'; // Ancho máximo
}

export default function GuestLayout({
    children,
    showBrandPanel = true,
    maxWidth = '5xl'
}: GuestLayoutProps) {

    // Mapa de clases Tailwind para maxWidth: Convierte prop a clase CSS.
    const maxWidthClasses = {
        'sm': 'max-w-sm',
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/30 via-background to-primary/30 p-4">

            {/* Contenedor principal: Fondo gradiente, centrado, padding. */}
            <div className={`w-full ${maxWidthClasses[maxWidth]} overflow-hidden rounded-2xl bg-background shadow-2xl`}>
                <div className={showBrandPanel ? "grid md:grid-cols-2" : ""}>
                    {/* Lado izquierdo: Logo, línea decorativa y children (contenido variable). */}
                    <div className="p-8 md:p-10 flex flex-col items-center">
                        {/* Logo: Enlace a home. */}
                        <Link href={route('home')}>
                            <img
                                src={`${route('home')}/images/logo-arar.png`}
                                alt="Arar Logo"
                                className='w-52'
                            />
                        </Link>
                        <div className='w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 mt-2 mb-3 rounded-[50%]'></div>
                        <div className="w-full">
                            {children}
                        </div>
                    </div>

                    {/* Lado derecho: Panel de branding (opcional, solo en md+). */}
                    {showBrandPanel && (
                        <div className="relative hidden md:block bg-gradient-to-br from-primary/65 to-primary p-12">
                            <div className="flex flex-col justify-end h-full text-background">
                                <div className="mb-8">
                                    <div className="animate-pulse w-24 h-24 bg-background/20 mx-auto rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                                        <Building2 size={54} />
                                    </div>
                                    <h2 className="text-4xl text-center font-bold mb-4">
                                        Intranet
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-background/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <Users size={20} />
                                        </div>
                                        <span className="text-orange-50">Gestión de Recursos Humanos</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-background/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <FileText size={20} />
                                        </div>
                                        <span className="text-orange-50">Documentos Corporativos</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-background/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <CalendarDays size={20} />
                                        </div>
                                        <span className="text-orange-50">Calendario y Eventos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Copyright className='absolute bottom-4 left-1/2 -translate-x-1/2' />
        </div>
    );
}