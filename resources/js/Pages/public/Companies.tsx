/**
 * Componente React para la página de compañías (companies).
 * Se monta vía Inertia desde CompaniesController@index. Usa PublicLayout para estructura común.
 * Muestra las empresas y sus enlaces a sus páginas principales.
 * 
 * REFACTORIZACIÓN v2.0:
 * - HeroSection modularizado y reutilizable
 * - CarouselSection genérico para grid/carrusel
 * - CompanyCard extraído a componente separado
 * - Mejor separación de responsabilidades
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @date 2025-11-14
 * @updated 2025-12-18 - Refactorización modular
 */

import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import HeroSection from './partials/HeroSection';
import CarouselSection from './partials/CarouselSection';
import CompanyCard from './partials/CompanyCard';

// Interface para la estructura de empresa
interface Empresa {
    id: number;
    razon_social: string;
    logo_url?: string;
    tipo_empresa: string;
    descripcion: string;
    sitio_web: string;
}

interface CompaniesProps {
    empresas: Empresa[];
}

export default function Companies({ empresas }: CompaniesProps) {
    return (
        <>
            <Head title="Compañías" />
            <main>
                {/* Hero Section: Título y descripción de la página */}
                <HeroSection
                    title="Nuestras Empresas"
                    description="Un portafolio diversificado de empresas líderes en sus respectivos sectores, trabajando juntas por un futuro sostenible y próspero."
                    variant="with-overflow"
                />

                {/* Sección de empresas: Grid desktop / Carrusel mobile */}
                <section className="py-10 bg-secondary/30 border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <CarouselSection
                            items={empresas}
                            renderItem={(empresa) => <CompanyCard empresa={empresa} />}
                            gridCols="md:grid-cols-2 lg:grid-cols-3"
                            showDots={true}
                            itemsPerSlide={1}
                        />
                    </div>
                </section>

                {/* Banner informativo */}
                <section className="py-12 bg-gradient-to-t from-background via-primary/5 to-primary/10 border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <p className="text-lg md:text-xl font-medium text-foreground">
                                Únete a más de <span className="text-primary font-bold">500+ profesionales</span> que están construyendo el futuro en nuestras empresas.
                                Encuentra tu próxima oportunidad laboral en sectores innovadores.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

// Layout para Inertia: Envuelve en PublicLayout
Companies.layout = (page) => (
    <PublicLayout children={page} />
);