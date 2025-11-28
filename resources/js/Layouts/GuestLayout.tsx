import { Link } from '@inertiajs/react';
import { Building2, CalendarDays, FileText, Users } from 'lucide-react';
import Copyright from '@/Components/Copyright';

interface GuestLayoutProps {
    children: React.ReactNode;
    showBrandPanel?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export default function GuestLayout({
    children,
    showBrandPanel = true,
    maxWidth = '5xl'
}: GuestLayoutProps) {

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
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/30 via-background to-primary/30 p-3 sm:p-4 md:p-6">
            
            {/* Contenedor principal mejorado para mobile */}
            <div className={`w-full ${maxWidthClasses[maxWidth]} overflow-hidden rounded-xl sm:rounded-2xl bg-background shadow-xl sm:shadow-2xl`}>
                <div className={showBrandPanel ? "grid md:grid-cols-2" : ""}>
                    
                    {/* Panel izquierdo - Formulario */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center">
                        {/* Logo */}
                        <Link href={route('home')} className="">
                            <img
                                src="/images/logo-arar.png"
                                alt="Arar Logo"
                                className='w-44 md:w-52 transition-all'
                            />
                        </Link>
                        
                        {/* Línea decorativa */}
                        <div className='w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 mt-2 mb-4 sm:mb-5 rounded-[50%]'></div>
                        
                        {/* Contenido (formularios) */}
                        <div className="w-full">
                            {children}
                        </div>
                    </div>

                    {/* Panel derecho - Branding (solo desktop) */}
                    {showBrandPanel && (
                        <div className="relative hidden md:flex bg-gradient-to-br from-primary/65 to-primary p-8 lg:p-12">
                            <div className="flex flex-col justify-end h-full text-background w-full">
                                {/* Icono y título */}
                                <div className="mb-8">
                                    <div className="animate-pulse w-20 h-20 lg:w-24 lg:h-24 bg-background/20 mx-auto rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                                        <Building2 className="w-11 h-11 lg:w-14 lg:h-14" />
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl text-center font-bold mb-4">
                                        Intranet
                                    </h2>
                                </div>

                                {/* Features */}
                                <div className="space-y-3 lg:space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-9 h-9 lg:w-10 lg:h-10 bg-background/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <span className="text-orange-50 text-sm lg:text-base">Gestión de Recursos Humanos</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-9 h-9 lg:w-10 lg:h-10 bg-background/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="text-orange-50 text-sm lg:text-base">Documentos Corporativos</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-9 h-9 lg:w-10 lg:h-10 bg-background/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                                            <CalendarDays className="w-5 h-5" />
                                        </div>
                                        <span className="text-orange-50 text-sm lg:text-base">Calendario y Eventos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Copyright */}
            <Copyright className='absolute bottom-4' />
        </div>
    );
}