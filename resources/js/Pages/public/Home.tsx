import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Building2, ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <PublicLayout>
            <Head title="Inicio" />
            <main>
                <section className="pb-20 pt-40 bg-gradient-to-br from-primary/15 via-background to-white">
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
                                <Link href={route('login')}>
                                    <Button>
                                        Conoce nuestras empresas
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center justify-center">
                                <img
                                    src="/images/logo-arar.png"
                                    alt="Inversiones Arar"
                                    className="w-full max-w-md h-auto transform -translate-y-10"
                                />
                            </div>
                        </div>
                    </div>
                </section>

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

                <section className="relative py-10 overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-background text-primary-foreground">
                    <div className="container relative mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                                ¿Listo para colaborar?
                            </h2>
                            <p className="text-base opacity-95">
                                Siempre estamos buscando nuevas oportunidades de crecimiento y alianzas estratégicas.
                            </p>
                        </div>

                        <Link href={route('login')}>
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