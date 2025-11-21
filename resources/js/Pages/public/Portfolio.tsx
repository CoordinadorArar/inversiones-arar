/**
 * Componente React para la página de portafolio.
 * Se monta vía Inertia desde PortfolioController@index. Usa PublicLayout para estructura común.
 * Muestra servicios especializados y clientes destacados de la empresa
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-18 
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Shield,
    Server,
    Calculator,
    Users,
    Heart,
    Scale,
    Building2,
    Briefcase
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import BadgeCustom from "@/Components/BadgeCustom";

export default function Portafolio({ clientes }) {
    // Lista de servicios ofrecidos por la empresa.
    const servicios = [
        {
            nombre: "Control Interno",
            icono: Shield,
            descripcion: "Gestión integral de riesgos y controles para garantizar la eficiencia operativa y el cumplimiento normativo."
        },
        {
            nombre: "Infraestructura y Tecnología",
            icono: Server,
            descripcion: "Soluciones tecnológicas innovadoras y gestión de infraestructura para optimizar procesos empresariales."
        },
        {
            nombre: "Contabilidad",
            icono: Calculator,
            descripcion: "Servicios contables especializados con enfoque en precisión, transparencia y cumplimiento fiscal."
        },
        {
            nombre: "Gestión Humana",
            icono: Users,
            descripcion: "Administración estratégica del talento humano, desarrollo organizacional y bienestar laboral."
        },
        {
            nombre: "SGSST",
            icono: Heart,
            descripcion: "Sistema de Gestión de Seguridad y Salud en el Trabajo para ambientes laborales seguros y saludables."
        },
        {
            nombre: "Jurídico",
            icono: Scale,
            descripcion: "Asesoría legal integral, gestión de contratos y representación jurídica corporativa."
        }
    ];

    return (

        // PublicLayout: Layout público con header/footer.
        <PublicLayout>
            {/* Head: Establece título de la página en navegador. */}
            <Head title="Portafolio" />
            {/* Main: Contenedor principal del contenido. */}
            <main>
                {/* Sección Hero: Introducción con título y descripción. */}
                <section className="pb-10 pt-28 bg-gradient-to-br from-primary/30 via-accent/20 to-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            {/* Título principal con gradiente de texto implícito. */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4">
                                Nuestro Portafolio
                            </h1>
                            {/* Descripción introductoria. */}
                            <p className="text-base md:text-lg text-muted-foreground">
                                Soluciones integrales y servicios especializados que impulsan el crecimiento
                                y la eficiencia de nuestras empresas asociadas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Sección Servicios: Muestra grid de servicios con íconos y descripciones. */}
                {/* Sección Servicios: Grid desktop / Carrusel mobile */}
                <section className="py-10 bg-secondary/30 border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Header asimétrico */}
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

                            {/* Desktop: Grid centrado - Mobile: Carrusel */}
                            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {servicios.map((servicio, index) => {
                                    const IconComponent = servicio.icono;
                                    return (
                                        <Card
                                            key={servicio.razon_social}
                                            className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 bg-card"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <CardContent className="p-6">
                                                <div className="mb-5 flex gap-4 items-center">
                                                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-white shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-500">
                                                        <IconComponent className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                        {servicio.razon_social}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {servicio.descripcion}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {/* Mobile: Carrusel horizontal con snap */}
                            <div className="md:hidden">
                                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4">
                                    {servicios.map((servicio, index) => {
                                        const IconComponent = servicio.icono;
                                        return (
                                            <div key={servicio.razon_social} className="snap-center shrink-0 w-[85vw] max-w-sm">
                                                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 bg-card h-full">
                                                    <CardContent className="p-6">
                                                        <div className="mb-5 flex gap-4 items-center">
                                                            <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-white shadow-md">
                                                                <IconComponent className="h-6 w-6" />
                                                            </div>
                                                            <h3 className="text-xl font-bold">
                                                                {servicio.razon_social}
                                                            </h3>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                            {servicio.descripcion}
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Indicador de scroll para servicios */}
                                <div className="flex justify-center gap-2 mt-4">
                                    {servicios.map((_, index) => (
                                        <div
                                            key={index}
                                            className="h-1.5 w-8 rounded-full bg-primary/20"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección Clientes: Grid desktop / Carrusel mobile (de 2 en 2) */}
                <section className="py-10 border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="max-w-6xl mx-auto">
                            {/* Header con diseño asimétrico */}
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

                            {/* Desktop: Grid 4 columnas */}
                            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {clientes.map((cliente, index) => (
                                    <ClientCard key={index} cliente={cliente}/>
                                ))}
                            </div>

                            {/* Mobile: Carrusel horizontal de 2 en 2 */}
                            <div className="md:hidden">
                                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pt-2 pb-4 scrollbar-hide -mx-4 px-4">
                                    {/* Agrupar clientes de 2 en 2 */}
                                    {Array.from({ length: Math.ceil(clientes.length / 2) }).map((_, groupIndex) => {
                                        const startIndex = groupIndex * 2;
                                        const clientesGrupo = clientes.slice(startIndex, startIndex + 2);

                                        return (
                                            <div key={groupIndex} className="snap-center shrink-0 w-[85vw] max-w-sm">
                                                <div className="grid grid-cols-2 gap-4">
                                                    {clientesGrupo.map((cliente, index) => (
                                                        <ClientCard key={index} cliente={cliente} />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Indicador de scroll para clientes */}
                                <div className="flex justify-center gap-2 mt-4">
                                    {Array.from({ length: Math.ceil(clientes.length / 2) }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="h-1.5 w-8 rounded-full bg-primary/20"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative py-10 overflow-hidden bg-gradient-to-b md:bg-gradient-to-l from-primary via-primary/90 to-background text-primary-foreground">
                    <div className="container relative mx-auto px-6 lg:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <Link href={route('contact')}>
                            <Button size="lg"
                                className="shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                Contáctanos
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                                ¿Interesado en nuestros servicios?
                            </h2>
                            <p className="text-base opacity-95">
                                Contáctanos para conocer cómo podemos ayudarte a alcanzar tus objetivos empresariales.
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
};

function ClientCard({ cliente }) {
    return (
        <Card
            className="group relative overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 bg-card"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[140px] md:min-h-[160px] relative">
                {cliente.logo_url ? (
                    <div className="relative mb-3 md:mb-4">
                        <img
                            src={cliente.logo_url}
                            alt={`Logo de ${cliente.razon_social}`}
                            className="h-12 md:h-16 w-auto object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                ) : (
                    <div className="h-12 w-12 rounded-xl md:h-16 md:w-16 md:rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                        <span className="text-lg md:text-2xl font-bold text-primary-foreground">
                            {cliente.razon_social.charAt(0)}
                        </span>
                    </div>
                )}
                <h3 className="text-sm md:text-base font-bold text-center mb-1.5 md:mb-2 group-hover:text-primary transition-colors capitalize">
                    {cliente.razon_social.toLowerCase()}
                </h3>
                {cliente.tipo_empresa && (
                    <Badge className="inline-block  text-xs bg-primary/10 text-primary text-center font-medium px-2 rounded-md capitalize tracking-wide">
                        {cliente.tipo_empresa.toLowerCase()}
                    </Badge>
                )}
            </CardContent>
        </Card>
    );
}