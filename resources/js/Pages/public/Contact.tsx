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
import { 
    handleEmailKeyDown, 
    handleMessagesKeyDown, 
    handleNumberKeyDown, 
    handleNumberTextKeyDown, 
    handleTextKeyDown,
    handleLimit 
} from '@/lib/keydownValidations';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import InputError from '@/Components/InputError';
import { z } from "zod";

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

// Constantes de límites
const LIMITS = {
    subject: 50,
    name: 30,
    company: 100,
    email: 50,
    phone: 15,
    message: 300,
} as const;

const contactSchema = z.object({
    subject: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .max(LIMITS.subject, `El asunto debe tener máximo ${LIMITS.subject} caracteres`)
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras"),
    name: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .max(LIMITS.name, `El nombre debe tener máximo ${LIMITS.name} caracteres`)
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras"),
    company: z.string()
        .trim()
        .max(LIMITS.company, `La empresa debe tener máximo ${LIMITS.company} caracteres`)
        .optional()
        .or(z.literal('')),
    email: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .email("Ingrese un correo electrónico válido")
        .max(LIMITS.email, `El correo debe tener máximo ${LIMITS.email} caracteres`),
    phone: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .regex(/^\+?[0-9]+$/, "Ingrese un número de teléfono válido")
        .min(7, "El teléfono debe tener al menos 7 dígitos")
        .max(LIMITS.phone, `El teléfono debe tener máximo ${LIMITS.phone} caracteres`),
    message: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .min(10, "El mensaje debe tener al menos 10 caracteres")
        .max(LIMITS.message, `El mensaje debe tener máximo ${LIMITS.message} caracteres`),
    acceptsPolicy: z.boolean()
        .refine(val => val === true, "Debes aceptar la política de privacidad"),
});

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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const { toast } = useToast();

    // handleSubmit: Envía formulario vía fetch POST a 'contact.store'.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = contactSchema.safeParse(data);

        if (!result.success) {
            const newErrors: Record<string, string> = {};

            if (result.error instanceof z.ZodError) {
                result.error.issues.forEach((err) => {
                    if (err.path.length > 0) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
            }
            
            setErrors(newErrors);
            
            // Scroll al primer error
            const firstErrorField = Object.keys(newErrors)[0];
            document.getElementById(firstErrorField)?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            return;
        }

        setProcessing(true);
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
                toast({
                    title: "¡Mensaje enviado!",
                    description: "Nos pondremos en contacto contigo pronto.",
                    variant: "success",
                });
                setData({
                    subject: "",
                    name: "",
                    company: "",
                    email: "",
                    phone: "",
                    message: "",
                    acceptsPolicy: false,
                });
            } else if (response.status === 422) {
                setErrors(result.errors || {});
            } else {
                toast({
                    title: "Error al enviar",
                    description: result.error || "Intenta de nuevo más tarde.",
                    variant: "destructive",
                });
            }
        } catch (error) {
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
            <Head title="Contacto" />
            <main className="flex-1">
                <section className="pb-20 py-28 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Info de contacto */}
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                                        Contacto
                                    </h1>
                                    <p className="text-muted-foreground text-lg mb-8">
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
                                                    <span className="block">Km 2 • Torre Uno • Oficina 206 - Ecoparque Empresarial Natura</span>
                                                    <span className="block">Floridablanca, Santander - Colombia</span>
                                                </a>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Formulario de contacto */}
                            <Card className='py-0 shadow-md'>
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
                                                value={data.subject}
                                                onChange={e => setData({ ...data, subject: e.target.value })}
                                                onKeyDown={(e) => {
                                                    handleTextKeyDown(e);
                                                    handleLimit(e, data.subject, LIMITS.subject);
                                                }}
                                                className={errors.subject ? "border-destructive focus-visible:ring-destructive" : ""}
                                                maxLength={LIMITS.subject}
                                            />
                                            <div className="relative">
                                                <InputError message={errors.subject} />
                                                <span className="absolute top-0 right-0 text-xs text-muted-foreground">
                                                    {data.subject.length}/{LIMITS.subject}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Nombre */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                Nombre completo
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Tu nombre"
                                                value={data.name}
                                                onChange={e => setData({ ...data, name: e.target.value })}
                                                onKeyDown={(e) => {
                                                    handleTextKeyDown(e);
                                                    handleLimit(e, data.name, LIMITS.name);
                                                }}
                                                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                                                maxLength={LIMITS.name}
                                            />
                                            <div className="relative">
                                                <InputError message={errors.name} />
                                                <span className="absolute top-0 right-0 text-xs text-muted-foreground">
                                                    {data.name.length}/{LIMITS.name}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                Correo electrónico
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="tu@email.com"
                                                value={data.email}
                                                onChange={e => setData({ ...data, email: e.target.value })}
                                                onKeyDown={(e) => {
                                                    handleEmailKeyDown(e);
                                                    handleLimit(e, data.email, LIMITS.email);
                                                }}
                                                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                                maxLength={LIMITS.email}
                                            />
                                            <div className="relative">
                                                <InputError message={errors.email} />
                                                <span className="absolute top-0 right-0 text-xs text-muted-foreground">
                                                    {data.email.length}/{LIMITS.email}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Teléfono */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                Teléfono
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+573001234567"
                                                value={data.phone}
                                                onChange={e => setData({ ...data, phone: e.target.value })}
                                                onKeyDown={(e) => {
                                                    handleNumberKeyDown(e);
                                                    handleLimit(e, data.phone, LIMITS.phone);
                                                }}
                                                className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                                                maxLength={LIMITS.phone}
                                            />
                                            <div className="relative">
                                                <InputError message={errors.phone} />
                                                <span className="absolute top-0 right-0 text-xs text-muted-foreground">
                                                    {data.phone.length}/{LIMITS.phone}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Empresa (opcional) */}
                                        <div className="space-y-2">
                                            <Label htmlFor="company">Empresa (Opcional)</Label>
                                            <Input
                                                id="company"
                                                placeholder="Tu empresa"
                                                value={data.company}
                                                onChange={e => setData({ ...data, company: e.target.value })}
                                                onKeyDown={(e) => {
                                                    handleNumberTextKeyDown(e);
                                                    handleLimit(e, data.company, LIMITS.company);
                                                }}
                                                className={errors.company ? "border-destructive focus-visible:ring-destructive" : ""}
                                                maxLength={LIMITS.company}
                                            />
                                            <div className="relative">
                                                <InputError message={errors.company} />
                                                <span className="absolute top-0 right-0 text-xs text-muted-foreground">
                                                    {data.company.length}/{LIMITS.company}
                                                </span>
                                            </div>
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
                                                onChange={e => setData({ ...data, message: e.target.value })}
                                                onKeyDown={(e) => {
                                                    handleMessagesKeyDown(e);
                                                    handleLimit(e, data.message, LIMITS.message);
                                                }}
                                                className={errors.message ? "border-destructive focus-visible:ring-destructive" : ""}
                                                maxLength={LIMITS.message}
                                            />
                                            <div className="relative">
                                                <InputError message={errors.message} />
                                                <span className="absolute top-0 right-0 text-xs text-muted-foreground">
                                                    {data.message.length}/{LIMITS.message}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Checkbox de políticas */}
                                        <div className="flex items-start space-x-2 pt-2">
                                            <Checkbox
                                                id="acceptsPolicy"
                                                checked={data.acceptsPolicy}
                                                onCheckedChange={(checked) => setData({ ...data, acceptsPolicy: checked as boolean })}
                                                className={errors.acceptsPolicy ? "border-destructive" : ""}
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
                                                    <InputError message={errors.acceptsPolicy} />
                                                )}
                                            </div>
                                        </div>

                                        {/* Botón envío */}
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