/**
 * Componente React para la página de compañias (companies).
 * Se monta vía Inertia desde CompaniesController@index. Usa PublicLayout para estructura común.
 * Muestra las empresas y sus enlaces a sus páginas principales
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-14
 */

import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Globe, ExternalLink, Users } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function Companies({empresas}) {

    return (
        <>
            <Head title="Compañías" />
            <main>
                {/* Hero Section */}
                <section className="relative pb-10 pt-28 bg-gradient-to-br from-primary/30 via-accent/20 to-background overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4">
                                Nuestras Empresas
                            </h1>
                            <p className="text-base md:text-lg text-muted-foreground">
                                Un portafolio diversificado de empresas líderes en sus respectivos sectores,
                                trabajando juntas por un futuro sostenible y próspero.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Empresas Grid/Carousel */}
                <section className="py-10 bg-secondary/30 border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Desktop: Grid centrado - Mobile: Scroll horizontal */}
                        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                            {empresas.map((empresa, index) => (
                                <CompanyCard key={index} empresa={empresa} />
                            ))}
                        </div>

                        {/* Mobile: Horizontal scroll con snap */}
                        <div className="md:hidden">
                            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4">
                                {empresas.map((empresa, index) => (
                                    <div key={index} className="snap-center shrink-0 w-[85vw] max-w-sm">
                                        <CompanyCard empresa={empresa} />
                                    </div>
                                ))}
                            </div>
                            {/* Indicador de scroll */}
                            <div className="flex justify-center gap-2 mt-4">
                                {empresas.map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-1.5 w-8 rounded-full bg-primary/20"
                                    />
                                ))}
                            </div>
                        </div>
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

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}

// Componente de tarjeta de empresa
function CompanyCard({ empresa }) {
    return (
        <Card className="group w-full h-full overflow-hidden border border-primary/20 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 rounded-2xl bg-card">
            <CardContent className="p-6 flex flex-col h-full">
                {/* Header con logo y razon social */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative h-28 w-28 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 p-2 flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-md">
                        <img
                            src={empresa.logo_url}
                            alt={`Logo de ${empresa.razon_social}`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="capitalize text-xl font-bold mb-1 group-hover:text-primary transition-colors leading-tight">
                            {empresa.razon_social.toLowerCase()}
                        </h3>
                        <span className="inline-block  text-xs bg-primary/10 text-primary text-center font-medium px-2.5 py-1 rounded-md capitalize tracking-wide">
                            {empresa.tipo_empresa.toLowerCase()}
                        </span>
                    </div>
                </div>

                {/* Descripción */}
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                    {empresa.descripcion}
                </p>

                {/* Botones - Stack vertical en todas las pantallas */}
                <div className="flex flex-col gap-2.5 w-full">
                    <a href={empresa.sitio_web} target='_blank' rel="noopener noreferrer" className="w-full">
                        <Button
                            variant="default"
                            className="w-full flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all group/btn"
                        >
                            <Globe className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                            Sitio Web
                        </Button>
                    </a>
                    <a
                        href={`http://gh.inversionesarar.com:8900/AuthHv/LoginFormHVById?IdCia=${empresa.id}&NroConexion=1`}
                        target='_blank'
                        rel="noopener noreferrer"
                        className="w-full"
                    >
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all group/btn"
                        >
                            <Briefcase className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                            Consultar Vacantes
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}

Companies.layout = (page) => (
    <PublicLayout children={page}/>
)