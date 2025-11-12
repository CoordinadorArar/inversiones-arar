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
import { Target, Users, Building2, ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import AnimatedCounter from "@/components/AnimatedCounter";

export default function Home() {

    return (
        // PublicLayout: Envuelve la página con header/footer.
        <PublicLayout>
            {/* Head: Establece título de la página en el navegador. */}
            <Head title="Inicio" />
            <main>
                {/* Sección hero */}
                <section className="pb-20 pt-40 bg-gradient-to-br from-primary/30 via-accent/20 to-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-primary">
                                    Inversiones Arar
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground mb-8">
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
                                    <Button  variant="outline" asChild>
                                        <a href="#nosotros">Sobre nosotros</a>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <img
                                    src="images/logo-arar.png"
                                    alt="Inversiones Arar"
                                    className="w-full max-w-md h-auto transform -translate-y-10"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección de estadísticas */}
                <section className="py-20 border-y">
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
                </section>

                {/* Sección de características: Tres tarjetas con íconos y texto. */}
                <section className="py-10 border-y bg-secondary">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="border-0 shadow-sm py-2">
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

                            <Card className="border-0 shadow-sm py-2">
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

                            <Card className="border-0 shadow-sm py-2">
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
                <section id="nosotros" className="py-20 bg-gradient-to-b from-primary/20 via-secondary/30 to-secondary/30 scroll-mt-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Sobre Nosotros</h2>

                            <div className="space-y-6 text-muted-foreground mb-12">
                                <p className="text-lg">
                                    Inversiones Arar S.A.S. es un holding empresarial con sede en Floridablanca, Santander,
                                    con más de 20 años de trayectoria en la gestión y desarrollo de empresas líderes
                                    en diversos sectores de la economía colombiana.
                                </p>
                                <p className="text-lg">
                                    Ubicados en el Ecoparque Empresarial Natura, nos dedicamos a actividades inmobiliarias
                                    y a la administración estratégica de un portafolio diversificado de empresas en los
                                    sectores de seguros, manufactura, servicios financieros y desarrollo inmobiliario.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <Card className="group border-2 py-0 border-primary/20 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-bold mb-4 text-primary">Misión</h3>
                                        <p className="text-muted-foreground">
                                            Crear valor sostenible a través de la gestión eficiente de un portafolio
                                            diversificado de empresas, promoviendo la excelencia operativa, la innovación
                                            y el compromiso con nuestros colaboradores y comunidades.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 py-0 border-primary/20 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-bold mb-4 text-primary">Visión</h3>
                                        <p className="text-muted-foreground">
                                            Ser reconocidos como un holding empresarial líder en Colombia, referente en
                                            gestión corporativa, desarrollo sostenible y generación de oportunidades
                                            para todos nuestros grupos de interés.
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
                                className="shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl1"
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