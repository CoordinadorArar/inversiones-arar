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

import asekuraLogo from "@/assets/logos/asekura-logo.png";
import icbLogo from "@/assets/logos/icb-logo.png";
import ararFinancieraLogo from "@/assets/logos/arar-financiera-logo.png";
import promotoresLogo from "@/assets/logos/promotores-logo.png";
import ararInversionesLogo from "@/assets/logos/arar-inversiones-logo.png";

export default function Companies() {
    const empresas = [
        {
            nombre: "Inversiones Arar",
            sector: "Holding Empresarial",
            logo: ararInversionesLogo,
            descripcion: "Grupo empresarial que agrupa a diversas compañías de los sectores financiero, automotriz y de seguros, entre otros.",
            url: "https://inversionesarar.com/",
            id: 6
        },
        {
            nombre: "Arar Financiera",
            sector: "Servicios Financieros",
            logo: ararFinancieraLogo,
            descripcion: "Compañía que ofrece soluciones de crédito de libranza, especialmente diseñadas para pensionados, miembros de las Fuerzas Armadas y Policía.",
            url: "https://ararfinanciera.com/",
            id: 7
        },
        {
            nombre: "Asekura",
            sector: "Seguros",
            logo: asekuraLogo,
            descripcion: "Agencia de seguros que ofrece servicios de pólizas para hogar, salud, exequias, autos y más, brindando acompañamiento constante.",
            url: "https://asekura.co/",
            id: 8
        },
        {
            nombre: "Italo Colombiano de Baterias",
            sector: "Servicios Automotrices",
            logo: icbLogo,
            descripcion: "Especialistas en la venta y distribución de baterías automotrices (marca Faico), llantas, lubricantes y servicios de serviteca.",
            url: "https://bateriasfaico.com.co/",
            id: 1
        },
        {
            nombre: "Promotores del Oriente",
            sector: "Concesionario Automotriz",
            logo: promotoresLogo,
            descripcion: "Concesionario oficial del Grupo Volkswagen en los Santanderes, vendiendo marcas como VW, Audi, SEAT, CUPRA y Ducati, además de repuestos y taller.",
            url: "https://promotores.com.co/",
            id: 17
        },
    ];

    return (
        <PublicLayout>
            <Head title="Compañías" />
            <main>
                {/* Hero Section */}
                <section className="relative pb-16 pt-28 bg-gradient-to-br from-primary/30 via-accent/20 to-background overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-6 leading-tight">
                                Nuestras Empresas
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Un portafolio diversificado de empresas líderes en sus respectivos sectores,
                                trabajando juntas por un futuro sostenible y próspero.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Empresas Grid/Carousel */}
                <section className="py-16 bg-secondary/30 border-t">
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
                <section className="py-12 bg-gradient-to-r from-background via-primary/5 to-primary/20">
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
        </PublicLayout>
    );
}

// Componente de tarjeta de empresa
function CompanyCard({ empresa }: { empresa: any }) {
    return (
        <Card className="py-0 group w-full h-full overflow-hidden border border-primary/20 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 rounded-2xl bg-card">
            <CardContent className="p-6 flex flex-col h-full">
                {/* Header con logo y nombre */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative h-28 w-28 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 p-2 flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-md">
                        <img
                            src={empresa.logo}
                            alt={`Logo de ${empresa.nombre}`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors leading-tight">
                            {empresa.nombre}
                        </h3>
                        <span className="inline-block text-xs bg-primary/10 text-primary text-center font-medium px-2.5 py-1 rounded-full uppercase tracking-wide">
                            {empresa.sector}
                        </span>
                    </div>
                </div>

                {/* Descripción */}
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                    {empresa.descripcion}
                </p>

                {/* Botones - Stack vertical en todas las pantallas */}
                <div className="flex flex-col gap-2.5 w-full">
                    <a href={empresa.url} target='_blank' rel="noopener noreferrer" className="w-full">
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