/**
 * Componente React para la página de inicio (home) - VERSIÓN MEJORADA
 * Se monta vía Inertia desde HomeController@index. Usa PublicLayout para estructura común.
 * Muestra información sobre la empresa con diseño responsivo y moderno.
 * 
 * MEJORAS v2.0:
 * - Responsividad completa para mobile, tablet y desktop
 * - Animaciones sutiles y transiciones suaves
 * - Mejor jerarquía visual y espaciado
 * - Optimización de imágenes y textos
 * - Cards con efectos hover mejorados
 * 
 * @author Yariangel Aray
 
 * @date 2025-11-19
 */

import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Building2, ArrowRight, Lightbulb, TrendingUp, Eye, Sparkles, BadgeAlert } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { it } from 'node:test';
import BadgeCustom from '@/Components/BadgeCustom';

export default function Home() {

    const caracteristicas = [
        {
            title: "Portafolio Diversificado",
            description: "Gestionamos empresas en diversos sectores estratégicos, creando sinergias y oportunidades de crecimiento sostenible.",
            icon: Building2,
        },
        {
            title: "Gestión Estratégica",
            description: "Implementamos las mejores prácticas de gobernanza corporativa y gestión empresarial en todas nuestras operaciones.",
            icon: Target,
        },
        {
            title: "Desarrollo de Talento",
            description: "Invertimos en el desarrollo profesional de nuestros colaboradores, fomentando un ambiente de crecimiento continuo.",
            icon: Users,
        },
    ];

    const misionVision = [
        {
            title: "Misión",
            description: (
                <>
                    Crear valor sostenible a través de la gestión eficiente de un portafolio diversificado,
                    promoviendo la <span className="text-foreground font-medium">excelencia operativa</span>,
                    la <span className="text-foreground font-medium">innovación</span> y el compromiso con nuestros colaboradores.
                </>
            ),
            icon: Target,
        },
        {
            title: "Visión",
            description: (
                <>
                    Ser reconocidos como un <span className="text-foreground font-medium">holding empresarial líder</span> en Colombia,
                    referente en gestión corporativa, <span className="text-foreground font-medium">desarrollo sostenible</span> y
                    generación de oportunidades.
                </>
            ),
            icon: Eye,
        },
    ];

    const valores = [
        {
            title: "Innovación",
            description: "Impulsamos la transformación digital y la mejora continua.",
            icon: Lightbulb,
        },
        {
            title: "Crecimiento",
            description: "Desarrollo sostenible y expansión estratégica.",
            icon: TrendingUp,
        },
        {
            title: "Solidez",
            description: "Más de 20 años de experiencia respaldan nuestra gestión.",
            icon: Building2,
        },
    ]

    return (
        <>
            <Head title="Inicio" />
            <main>
                {/* Hero Section - Optimizado para mobile */}
                <section className="pb-10 pt-20 sm:pt-24 md:pt-28 bg-gradient-to-br from-primary/30 via-accent/20 to-background relative overflow-hidden">
                    {/* Patrón decorativo de fondo */}
                    <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(white,transparent_85%)]" />

                    <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                            {/* Contenido de texto */}
                            <div className="space-y-4 sm:space-y-6 text-center md:text-left">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                        Inversiones Arar
                                    </span>
                                </h1>

                                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
                                    Holding empresarial comprometido con el crecimiento sostenible y el desarrollo económico de la región Santander.
                                </p>

                                {/* Botones de acción */}
                                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center md:justify-start pt-2">
                                    <Link href={route('companies')}>
                                        <Button className='w-full sm:w-auto hover:scale-105 group'>
                                            Conoce nuestras empresas
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Button variant="outline" asChild className="w-full sm:w-auto">
                                        <a href="#nosotros">Sobre nosotros</a>
                                    </Button>
                                </div>
                            </div>

                            {/* Logo/Imagen */}
                            <div className="flex items-center justify-center order-first md:order-last">
                                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                                    <img
                                        src="/images/logo-arar.png"
                                        alt="Inversiones Arar"
                                        className="relative w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección de características - Grid responsivo mejorado */}
                <section className="py-10 border-y bg-secondary/30">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

                            {
                                caracteristicas.map((caracteristica, index) => (
                                    <Card key={index} className="group hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-card/80 backdrop-blur-sm">
                                        <CardContent className="p-6 sm:p-8">
                                            <div className="flex flex-row items-center gap-3 sm:gap-4 mb-4">
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                                    <caracteristica.icon className="h-6 w-6 text-primary-foreground" />
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">
                                                    {caracteristica.title}
                                                </h3>

                                            </div>
                                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                                {caracteristica.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))
                            }
                        </div>
                    </div>
                </section>

                {/* Sección Sobre Nosotros - Mejorada */}
                <section id="nosotros" className="pt-16 sm:pt-20 md:pt-24 pb-10 bg-gradient-to-b from-primary/5 via-secondary/20 to-secondary/30 relative overflow-hidden">

                    <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Header de sección */}
                            <div className="text-center mb-10 sm:mb-12">

                                <BadgeCustom
                                    title="Nuestra Historia"
                                    icon={Building2}
                                    className='mb-4 sm:mb-6'
                                />


                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                        Sobre Nosotros
                                    </span>
                                </h2>

                                <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
                                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                                        Inversiones Arar S.A.S. es un <span className="text-foreground font-semibold">holding empresarial</span> con sede en Floridablanca, Santander,
                                        con más de <span className="text-primary font-semibold">20 años de trayectoria</span> en la gestión y desarrollo de empresas líderes.
                                    </p>
                                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                                        Ubicados en el Ecoparque Empresarial Natura, nos dedicamos a actividades inmobiliarias
                                        y a la administración estratégica de un portafolio diversificado.
                                    </p>
                                </div>
                            </div>

                            {/* Misión y Visión - Grid responsivo */}
                            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">

                                {
                                    misionVision.map((item, index) => (
                                        <Card key={index} className="group border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-card to-card/80 relative overflow-hidden">
                                            {/* Efecto de brillo */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <CardContent className="p-6 sm:p-8 relative">
                                                <div className="flex flex-row items-center gap-3 sm:gap-4 mb-4">
                                                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                                        <item.icon className="h-7 w-7" />
                                                    </div>
                                                    <h3 className="text-2xl sm:text-3xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                            </div>

                            {/* Valores - Grid responsivo de 3 columnas */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                                {
                                    valores.map((valor, index) => (
                                        <Card key={index} className="group hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                                            <CardContent className="p-5 sm:p-6 text-center">
                                                <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground group-hover:scale-110 transition-transform duration-500 mb-3 sm:mb-4 shadow-lg">
                                                    <valor.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                                </div>
                                                <h4 className="font-bold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors">{valor.title}</h4>
                                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                                    {valor.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección CTA - Mejorada para mobile */}
                <section className="relative py-10 overflow-hidden bg-gradient-to-b md:bg-gradient-to-r from-primary via-primary/90 to-background text-primary-foreground">
                    <div className="container relative mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                                ¿Interesado en trabajar con nosotros?
                            </h2>
                            <p className="text-sm sm:text-base opacity-90 mt-2">
                                Si estás buscando oportunidades de colaboración o alianzas estratégicas, nos encantaría conocerte.
                            </p>
                        </div>

                        <Link href={route('contact')}>
                            <Button size="lg"
                                className="shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                Contáctanos
                            </Button>
                        </Link>
                    </div>
                </section>

            </main>
        </>
    );
}

Home.layout = (page) => (
    <PublicLayout children={page}/>
)