/**
 * Componente React para la página de compañias (companies).
 * Se monta vía Inertia desde HomeController@index. Usa PublicLayout para estructura común.
 * Muestra las empresas y sus enlaces a sus páginas principales
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-11
 */

import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Briefcase, Globe } from "lucide-react";
import { Button } from '@/components/ui/button';

import asekuraLogo from "@/assets/logos/asekura-logo.png";
import icbLogo from "@/assets/logos/icb-logo.png";
import ararFinancieraLogo from "@/assets/logos/arar-financiera-logo.png";
import promotoresLogo from "@/assets/logos/promotores-logo.png";
import ararInversionesLogo from "@/assets/logos/arar-inversiones-logo.png";
import faerLogo from "@/assets/logos/faer-logo.png";


export default function Companies() {

    const empresas = [
        {
            nombre: "Inversiones Arar", sector: "Holding Empresarial", logo: ararInversionesLogo,
            descripcion: "Grupo empresarial que agrupa a diversas compañías de los sectores financiero, automotriz y de seguros, entre otros.",
            url: "https://inversionesarar.com/"
        },
        {
            nombre: "Arar Financiera", sector: "Servicios Financieros", logo: ararFinancieraLogo,
            descripcion: "Compañía que ofrece soluciones de crédito de libranza, especialmente diseñadas para pensionados, miembros de las Fuerzas Armadas y Policía.",
            url: "https://ararfinanciera.com/"
        },
        {
            nombre: "Asekura", sector: "Seguros", logo: asekuraLogo,
            descripcion: "Agencia de seguros que ofrece servicios de pólizas para hogar, salud, exequias, autos y más, brindando acompañamiento constante.",
            url: "https://asekura.co/"
        },
        {
            nombre: "Italo Colombiano de Baterias", sector: "Servicios Automotrices", logo: icbLogo,
            descripcion: "Especialistas en la venta y distribución de baterías automotrices (marca Faico), llantas, lubricantes y servicios de serviteca.",
            url: "https://bateriasfaico.com.co/"
        },
        {
            nombre: "Promotores del Oriente", sector: "Concesionario Automotriz", logo: promotoresLogo,
            descripcion: "Concesionario oficial del Grupo Volkswagen en los Santanderes, vendiendo marcas como VW, Audi, SEAT, CUPRA y Ducati, además de repuestos y taller.",
            url: "https://promotores.com.co/"
        },
        {
            nombre: "Faer", sector: "Servicios Financieros (Fondo de Empleados)", logo: faerLogo,
            descripcion: "Fondo de Ahorro y Empleados (FAER) que ofrece servicios financieros como créditos y beneficios a sus afiliados.",
            url: "https://faer.com.co/"
        },
    ];



    return (
        // PublicLayout: Envuelve la página con header/footer.
        <PublicLayout>
            {/* Head: Establece título de la página en el navegador. */}
            <Head title="Compañias" />
            <main>
                {/* Sección hero */}
                <section className="pb-20 pt-40 bg-gradient-to-br from-primary/20 via-background to-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl text-primary font-bold mb-6">
                                Nuestras Empresas
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Un portafolio diversificado de empresas líderes en sus respectivos sectores,
                                trabajando juntas por un futuro sostenible.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Empresas Grid */}
                <section className="py-20 border-t bg-secondary">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-3 gap-6">
                            {empresas.map((empresa, index) => (
                                <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-card to-card/50 py-0">
                                    <CardContent className="p-6">
                                        <div className="flex gap-6 mb-4">
                                            <div className="h-32 w-32 flex-shrink-0 rounded-xl bg-primary/5 p-2 flex items-center justify-center transition-all group-hover:scale-105 group-hover:bg-primary/10 group-hover:shadow-lg">
                                                <img
                                                    src={empresa.logo}
                                                    alt={`Logo de ${empresa.nombre}`}
                                                    className="w-full h-full object-contain rounded-xl"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{empresa.nombre}</h3>
                                                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{empresa.sector}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                            {empresa.descripcion}
                                        </p>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="default"
                                                className="shadow-sm hover:shadow-md transition-shadow"
                                                onClick={() => window.open(empresa.url, '_blank')}
                                            >
                                                <Globe />
                                                Sitio Web                                                
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 hover:bg-primary/5 transition-colors"
                                            // onClick={() => window.open(empresa.trabajaConNosotros, '_blank')}
                                            >
                                                Trabaja con Nosotros
                                                <Briefcase className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </PublicLayout>
    );
}