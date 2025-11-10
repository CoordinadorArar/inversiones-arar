import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";


export default function Contact() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar el formulario
        console.log("Formulario enviado");
    };
    return (
        <PublicLayout>
            <Head title="Contácto" />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="pb-20 pt-40 bg-gradient-to-br from-primary/15 via-background to-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                                Contacto
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Estamos aquí para atender tus consultas. No dudes en ponerte en contacto con nosotros.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Info & Form */}
                <section className="py-20 border-t bg-accent/40">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Contact Information */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Información de Contacto</h2>
                                    <p className="text-muted-foreground mb-8">
                                        Nuestro equipo está disponible para atender tus necesidades y responder
                                        todas tus preguntas.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <Card className='py-0'>
                                        <CardContent className="flex items-start gap-4 p-6">
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Mail className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Correo Electrónico</h3>
                                                <a href="mailto:asistente@inversionesarar.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                    info@inversionesarar.com
                                                </a>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className='py-0'>
                                        <CardContent className="flex items-start gap-4 p-6">
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Phone className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Teléfono</h3>
                                                <a href="tel:6076985203" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                    607 698 5203
                                                </a>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className='py-0'>
                                        <CardContent className="flex items-start gap-4 p-6">
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Ubicación</h3>
                                                <a
                                                    href="https://maps.app.goo.gl/mm8MPxAzZs99BV1D8"
                                                    target='_blanck'
                                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <span className="block">Km 2 • Torre Uno • Oficina 206</span>
                                                    <span className="block">Ecoparque Empresarial Natura</span>
                                                    <span className="block">Floridablanca, Santander</span>
                                                    <span className="block">Colombia</span>
                                                </a>

                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-2xl text-primary font-bold mb-6">Envíanos un mensaje</h3>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nombre" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>Nombre completo <span ></span></Label>
                                            <Input id="nombre" placeholder="Tu nombre" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>Correo electrónico</Label>
                                            <Input id="email" type="email" placeholder="tu@email.com" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="empresa" >Empresa (Opcional)</Label>
                                            <Input id="empresa" placeholder="Tu empresa" />
                                        </div>

                                        <div className="space-y-2" >
                                            <Label htmlFor="mensaje" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>Mensaje</Label>
                                            <Textarea
                                                id="mensaje"
                                                placeholder="¿En qué podemos ayudarte?"
                                                rows={5}
                                                required
                                            />
                                        </div>

                                        <Button type="submit" className="w-full" size="lg">
                                            Enviar Mensaje
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}