/**
 * Componente React para la página de portafolio.
 * Se monta vía Inertia desde PortfolioController@index. Usa PublicLayout para estructura común.
 * Muestra servicios especializados y clientes destacados de la empresa.
 * 
 * REFACTORIZACIÓN v2.0:
 * - HeroSection y CTASection modularizados
 * - CarouselSection genérico para servicios y clientes
 * - ClientCard extraído a componente separado
 * - Datos de servicios centralizados en archivo separado
 * - Mejor separación de responsabilidades y reutilización
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @date 2025-11-18
 * @updated 2025-12-18 - Refactorización modular
 */

import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head } from "@inertiajs/react";
import { Briefcase, Building2 } from "lucide-react";
import BadgeCustom from "@/Components/BadgeCustom";
import { servicios } from "./data/servicios";
import HeroSection from "./partials/HeroSection";
import CarouselSection from "./partials/CarouselSection";
import CTASection from "./partials/CTASection";
import ClientCard from "./partials/ClientCard";

// Interface para la estructura de cliente
interface Cliente {
    razon_social: string;
    logo_url?: string;
    tipo_empresa?: string;
}

interface PortafolioProps {
    clientes: Cliente[];
}

export default function Portafolio({ clientes }: PortafolioProps) {
    return (
        <>
            <Head title="Portafolio" />
            <main>
                {/* Hero Section: Título y descripción de la página */}
                <HeroSection
                    title="Nuestro Portafolio"
                    description="Soluciones integrales y servicios especializados que impulsan el crecimiento y la eficiencia de nuestras empresas asociadas."
                />

                {/* Sección Servicios: Grid desktop / Carrusel mobile */}
                <section className="py-10 bg-secondary/30 border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Header de servicios */}
                            <div className="mb-10 max-w-2xl">
                                <BadgeCustom
                                    title="Servicios"
                                    icon={Briefcase}
                                    className='mb-4 sm:mb-6'
                                />
                                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                    Impulsamos tu éxito con{" "}
                                    <span className="text-primary">excelencia</span>
                                </h2>
                                <p className="text-muted-foreground">
                                    Portafolio completo de servicios especializados diseñados para garantizar
                                    el éxito sostenible de tu empresa.
                                </p>
                            </div>

                            {/* Grid/Carrusel de servicios */}
                            <CarouselSection
                                items={servicios}
                                renderItem={(servicio, index) => {
                                    const IconComponent = servicio.icono;
                                    return (
                                        <Card
                                            className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 bg-card h-full"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <CardContent className="p-6">
                                                <div className="mb-5 flex gap-4 items-center">
                                                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-white shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-500">
                                                        <IconComponent className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                        {servicio.nombre}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {servicio.descripcion}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                }}
                                gridCols="md:grid-cols-2 lg:grid-cols-3"
                                showDots={true}
                                itemsPerSlide={1}
                            />
                        </div>
                    </div>
                </section>

                {/* Sección Clientes: Grid desktop / Carrusel mobile (de 2 en 2) */}
                <section className="py-10 border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="max-w-6xl mx-auto">
                            {/* Header de clientes */}
                            <div className="mb-10 max-w-2xl">
                                <BadgeCustom
                                    title="Clientes"
                                    icon={Building2}
                                    className='mb-4 sm:mb-6'
                                />
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    Empresas que confían en{" "}
                                    <span className="text-primary">nosotros</span>
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    Organizaciones líderes que han transformado sus operaciones
                                    con nuestros servicios especializados.
                                </p>
                            </div>

                            {/* Grid/Carrusel de clientes */}
                            <CarouselSection
                                items={clientes}
                                renderItem={(cliente) => <ClientCard cliente={cliente} />}
                                gridCols="md:grid-cols-3 lg:grid-cols-4"
                                showDots={true}
                                itemsPerSlide={2}
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section: Llamado a la acción */}
                <CTASection
                    title="¿Interesado en nuestros servicios?"
                    description="Contáctanos para conocer cómo podemos ayudarte a alcanzar tus objetivos empresariales."
                    buttonText="Contáctanos"
                    buttonHref={route('contact')}
                    variant="right"
                />
            </main>
        </>
    );
}

// Layout para Inertia: Envuelve en PublicLayout
Portafolio.layout = (page) => (
    <PublicLayout children={page} />
);