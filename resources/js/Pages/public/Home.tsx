/**
 * Componente React para la página de inicio (home).
 * Se monta vía Inertia desde HomeController@index. Usa PublicLayout para estructura común.
 * Muestra información sobre la empresa
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-12
 */

import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Building2, ArrowRight, Lightbulb, TrendingUp, Eye } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function Home() {

    return (
        // PublicLayout: Envuelve la página con header/footer.
        <PublicLayout>
            {/* Head: Establece título de la página en el navegador. */}
            <Head title="Inicio" />
            <main>
                {/* Sección hero */}
                <section className="pb-10 pt-28 bg-gradient-to-br from-primary/30 via-accent/20 to-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                    Inversiones Arar
                                </h1>
                                <p className="text-base md:text-lg text-muted-foreground mb-8">
                                    Holding empresarial con más de 20 años de experiencia, comprometido con el crecimiento
                                    sostenible y el desarrollo económico de la región Santander.
                                </p>
                                <div className="flex flex-wrap gap-4">

                                    <Link href={route('companies')}>
                                        <Button>
                                            Conoce nuestras empresas
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button variant="outline" asChild>
                                        <a href="#nosotros">Sobre nosotros</a>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <img
                                    src="images/logo-arar.png"
                                    alt="Inversiones Arar"
                                    className="w-full max-w-md h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección de estadísticas */}
                {/* <section className="py-10 border-y">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">
                                    <AnimatedCounter value={10} suffix="+" />
                                </div>
                                <div className="text-sm text-muted-foreground">Años de experiencia</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">
                                    <AnimatedCounter value={5} suffix="+" />
                                </div>
                                <div className="text-sm text-muted-foreground">Empresas activas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">
                                    <AnimatedCounter value={200} suffix="+" />
                                </div>
                                <div className="text-sm text-muted-foreground">Colaboradores</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">
                                    <AnimatedCounter value={4} suffix="+" />
                                </div>
                                <div className="text-sm text-muted-foreground">Sectores industriales</div>
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* Sección de características: Tres tarjetas con íconos y texto. */}
                <section className="py-10 border-y bg-secondary">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="border-0 shadow-sm py-2 hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Building2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">Portafolio Diversificado</h3>
                                    <p className="text-muted-foreground">
                                        Gestionamos empresas en diversos sectores estratégicos, creando sinergias
                                        y oportunidades de crecimiento sostenible.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm py-2 hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Target className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">Gestión Estratégica</h3>
                                    <p className="text-muted-foreground">
                                        Implementamos las mejores prácticas de gobernanza corporativa y gestión
                                        empresarial en todas nuestras operaciones.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm py-2 hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Users className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">Desarrollo de Talento</h3>
                                    <p className="text-muted-foreground">
                                        Invertimos en el desarrollo profesional de nuestros colaboradores,
                                        fomentando un ambiente de crecimiento continuo.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Sección Sobre Nosotros */}
                <section id="nosotros" className="py-20 bg-gradient-to-b from-primary/10 via-secondary/30 to-secondary/30 scroll-mt-5">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-center text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                Sobre Nosotros
                            </h2>
                            <div className="max-w-3xl mx-auto space-y-4 text-center mb-16">
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                    Inversiones Arar S.A.S. es un <span className="text-foreground font-semibold">holding empresarial</span> con sede en Floridablanca, Santander,
                                    con más de <span className="text-primary font-semibold">20 años de trayectoria</span> en la gestión y desarrollo de empresas líderes
                                    en diversos sectores de la economía colombiana.
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Ubicados en el Ecoparque Empresarial Natura, nos dedicamos a actividades inmobiliarias
                                    y a la administración estratégica de un portafolio diversificado de empresas en los
                                    sectores de seguros, manufactura, servicios financieros y desarrollo inmobiliario.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                <Card className="group border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/80">
                                    <CardContent className="p-8">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                                <Target className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors mt-2">
                                                Misión
                                            </h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Crear valor sostenible a través de la gestión eficiente de un portafolio
                                            diversificado de empresas, promoviendo la <span className="text-foreground font-medium">excelencia operativa</span>,
                                            la <span className="text-foreground font-medium">innovación</span> y el compromiso con nuestros colaboradores y comunidades.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="group border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/80">
                                    <CardContent className="p-8">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                                <Eye className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors mt-2">
                                                Visión
                                            </h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Ser reconocidos como un <span className="text-foreground font-medium">holding empresarial líder</span> en Colombia,
                                            referente en gestión corporativa, <span className="text-foreground font-medium">desarrollo sostenible</span> y
                                            generación de oportunidades para todos nuestros grupos de interés.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <Card className="group border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                                    <CardContent className="p-6 text-center">
                                        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mb-4">
                                            <Lightbulb className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Innovación</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Impulsamos la transformación digital y la mejora continua en todos nuestros procesos.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="group border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                                    <CardContent className="p-6 text-center">
                                        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mb-4">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Crecimiento</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Buscamos el desarrollo sostenible y la expansión estratégica de nuestro portafolio.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="group border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                                    <CardContent className="p-6 text-center">
                                        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mb-4">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Solidez</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Más de 20 años de experiencia respaldan nuestra gestión empresarial.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección CTA: Llamada a acción con gradiente, título y botón a contacto. */}
                <section className="relative py-10 overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-background text-primary-foreground">
                    <div className="container relative mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                                ¿Interesado en trabajar con nosotros?
                            </h2>
                            <p className="text-base opacity-95">
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
        </PublicLayout>
    );
}