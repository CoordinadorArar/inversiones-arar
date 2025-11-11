/**
 * Componente React para la página de contacto. Muestra info de contacto y formulario para enviar mensajes
 * Envía datos vía fetch a ContactController@store, maneja validaciones, errores y toasts.
 * Usa PublicLayout para estructura, validaciones de teclado desde keydownValidations.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-11
 */

import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Send, LoaderCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { handleEmailKeyDown, handleMessagesKeyDown, handleNumberKeyDown, handleNumberTextKeyDown, handleTextKeyDown } from '@/lib/keydownValidations';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

// Interfaz para datos del formulario: Define estructura de state.
interface FormData {
    subject: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    message: string;
    acceptsPolicy: boolean;
}

export default function Contact() {

    // Estado: Datos del formulario, errores de validación, y flag de procesamiento.
    const [data, setData] = useState<FormData>({
        subject: "",
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
        acceptsPolicy: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});  // Errores desde backend.
    const [processing, setProcessing] = useState(false);  // Loading durante envío.

    const { toast } = useToast(); // Hook para notificaciones.

    // handleSubmit: Envía formulario vía fetch POST a 'contact.store'.
    // Maneja éxito (toast + reset), errores 422 (muestra en inputs), otros errores (toast).
    // Usa CSRF token de meta tag. Limpia errores previos.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setProcessing(true);
        setErrors({});  // Limpia errores previos        
        try {
            const response = await fetch(route('contact.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (response.ok) {
                // Éxito: Toast de éxito y reset del formulario.
                toast({
                    title: "¡Mensaje enviado!",
                    description: "Nos pondremos en contacto contigo pronto.",
                    variant: "success",
                });
                setData({  // Reset manual
                    subject: "",
                    name: "",
                    company: "",
                    email: "",
                    phone: "",
                    message: "",
                    acceptsPolicy: false,
                });
            } else if (response.status === 422) {
                // Errores de validación: Mapea a state errors para mostrar en inputs.
                setErrors(result.errors || {});
            } else {
                // Errores generales: Toast destructivo.
                toast({
                    title: "Error al enviar",
                    description: result.error || "Intenta de nuevo más tarde.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            // Error de red: Toast destructivo.
            toast({
                title: "Error de conexión",
                description: "Revisa tu conexión e intenta de nuevo.",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <PublicLayout>
            {/* Head: Establece título de la página en el navegador. */}
            <Head title="Contacto" />
            <main className="flex-1">
                {/* Sección hero: Título y descripción. */}
                <section className="pb-20 pt-40 bg-gradient-to-br from-primary/20 via-background to-white">
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

                {/* Sección de info y formulario: Grid con dos columnas. */}
                <section className="py-20 border-t bg-accent/40">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Info de contacto: Tarjetas con email, teléfono y ubicación. */}
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
                                                <a
                                                    href="mailto:asistente@inversionesarar.com"
                                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    asistente@inversionesarar.com
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
                                                <a
                                                    href="tel:6076985203"
                                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
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
                                                    target='_blank'
                                                    rel="noopener noreferrer"
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

                            {/* Formulario de contacto: Campos con validaciones, errores y envío. */}
                            <Card className='py-0'>
                                <CardContent className="p-6">
                                    <h3 className="text-2xl text-primary font-bold mb-6">Envíanos un mensaje</h3>
                                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                        {/* Asunto */}
                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                Asunto
                                            </Label>
                                            <Input
                                                id="subject"
                                                placeholder="Asunto de tu consulta"
                                                onKeyDown={handleTextKeyDown}
                                                value={data.subject}
                                                onChange={e => setData({ ...data, subject: e.target.value })}
                                                className={errors.subject ? "border-destructive focus-visible:ring-destructive" : ""}
                                            />
                                            {errors.subject && (
                                                <p className="text-sm font-semibold text-destructive">{errors.subject}</p>
                                            )}
                                        </div>

                                        {/* Nombre */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                Nombre completo
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Tu nombre"
                                                onKeyDown={handleTextKeyDown}
                                                value={data.name}
                                                onChange={e => setData({ ...data, name: e.target.value })}
                                                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                                            />
                                            {errors.name && (
                                                <p className="text-sm font-semibold text-destructive">{errors.name}</p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                Correo electrónico
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                onKeyDown={handleEmailKeyDown}
                                                placeholder="tu@email.com"
                                                value={data.email}
                                                onChange={e => setData({ ...data, email: e.target.value })}
                                                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                            />
                                            {errors.email && (
                                                <p className="text-sm font-semibold text-destructive">{errors.email}</p>
                                            )}
                                        </div>

                                        {/* Teléfono */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                Teléfono
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                onKeyDown={handleNumberKeyDown}
                                                placeholder="+573001234567"
                                                value={data.phone}
                                                onChange={e => setData({ ...data, phone: e.target.value })}
                                                className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                                            />
                                            {errors.phone && (
                                                <p className="text-sm font-semibold text-destructive">{errors.phone}</p>
                                            )}
                                        </div>

                                        {/* Empresa (opcional) */}
                                        <div className="space-y-2">
                                            <Label htmlFor="company">Empresa (Opcional)</Label>
                                            <Input
                                                id="company"
                                                placeholder="Tu empresa"
                                                onKeyDown={handleNumberTextKeyDown}
                                                value={data.company}
                                                onChange={e => setData({ ...data, company: e.target.value })}
                                                className={errors.company ? "border-destructive focus-visible:ring-destructive" : ""}
                                            />
                                            {errors.company && (
                                                <p className="text-sm font-semibold text-destructive">{errors.company}</p>
                                            )}
                                        </div>

                                        {/* Mensaje */}
                                        <div className="space-y-2">
                                            <Label htmlFor="message" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                Mensaje
                                            </Label>
                                            <Textarea
                                                id="message"
                                                placeholder="¿En qué podemos ayudarte?"
                                                rows={5}
                                                value={data.message}
                                                onKeyDown={handleMessagesKeyDown}
                                                onChange={e => setData({ ...data, message: e.target.value })}
                                                className={errors.message ? "border-destructive focus-visible:ring-destructive" : ""}
                                            />
                                            {errors.message && (
                                                <p className="text-sm font-semibold text-destructive">{errors.message}</p>
                                            )}
                                        </div>

                                        {/* Checkbox de políticas */}
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Checkbox
                                                id="acceptsPolicy"
                                                checked={data.acceptsPolicy}
                                                onCheckedChange={(checked) => setData({ ...data, acceptsPolicy: checked as boolean })}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label
                                                    htmlFor="acceptsPolicy"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    Acepto la{' '}
                                                    <a
                                                        href="docs/Politica-Privacidad.pdf"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        política de privacidad
                                                    </a>
                                                </label>
                                                {errors.acceptsPolicy && (
                                                    <p className="text-sm font-semibold text-destructive">{errors.acceptsPolicy}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botón envío: Deshabilitado si está procesando o no acepta política. */}
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            size="lg"
                                            disabled={processing || !data.acceptsPolicy}
                                        >
                                            {processing ? (
                                                <>
                                                    Enviando
                                                    <LoaderCircle className="ml-2 h-5 w-5 animate-spin" />
                                                </>
                                            ) : (
                                                <>
                                                    Enviar mensaje
                                                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
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