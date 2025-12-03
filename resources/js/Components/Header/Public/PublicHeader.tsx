import { Briefcase, Building2, CircleAlert, Home, Mail } from "lucide-react";
import { useRef, useState } from "react";
import { Empresa, PageItem, PublicHeaderProps } from "../header.types";
import { VideoModal } from "./VideoModal";
import { MobileMenu } from "./MobileMenu";
import { ExternalLinks, GestionHumanaDropdown, Navigation } from "./DesktopMenu";
import { Link } from "@inertiajs/react";

/**
 * Componente: PublicHeader
 * Header público principal que orquesta todos los subcomponentes
 * 
 * @author Yariangel Aray - Refactorizado en componentes modulares
 
 * @date 2025-11-28
 */

export function PublicHeader({ empresas }: PublicHeaderProps) {
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const pages: PageItem[] = [
        { name: 'Inicio', ref: 'home', icon: Home },
        { name: 'Portafolio', ref: 'portfolio', icon: Briefcase },
        { name: 'Empresas', ref: 'companies', icon: Building2 },
        { name: 'Contacto', ref: 'contact', icon: Mail },
        { name: 'Denuncias', ref: 'pqrsd', icon: CircleAlert },
    ];

    const currentRoute = route().current() || '';

    const handleEmpresaClick = (empresa: Empresa, e: Event) => {
        e.preventDefault();
        setSelectedEmpresa(empresa);
        setShowVideoModal(true);
    };

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
                <div className='container mx-auto mt-4 px-4'>
                    <div className='bg-background/95 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-md transition-shadow px-4 sm:px-6 py-1 flex items-center justify-between'>

                        <Link
                            href={route('home')}
                            className='h-full hover:opacity-80 transition-opacity flex-shrink-0'
                        >
                            <img
                                src="/images/icono-arar.png"
                                alt="Inversiones Arar"
                                className='h-8 w-auto'
                            />
                        </Link>

                        <Navigation pages={pages} currentRoute={currentRoute} />

                        <div className='flex items-center gap-2'>
                            <GestionHumanaDropdown
                                empresas={empresas}
                                onEmpresaClick={handleEmpresaClick}
                            />

                            <ExternalLinks />

                            <MobileMenu
                                pages={pages}
                                currentRoute={currentRoute}
                                empresas={empresas}
                                onEmpresaClick={handleEmpresaClick}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <VideoModal
                isOpen={showVideoModal}
                onClose={handleCloseModal}
                onContinue={handleContinuar}
                videoRef={videoRef}
            />
        </>
    );
}