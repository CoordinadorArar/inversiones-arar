/**
 * Componente React para la página de contácto (contact).
 * Se monta vía Inertia desde ContactController@index. Usa PublicLayout para estructura común.
 * Muestra información de contacto de la empresa y un formulario de contácto.
 * 
 * @author Yariangel Aray
 * @version 1.0
 * @date 2025-11-14
 */

import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Send, LoaderCircle, MessageSquare, User, Building2 } from 'lucide-react';
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

interface FormData {
    subject: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    message: string;
    acceptsPolicy: boolean;
}

const LIMITS = {
    subject: 50,
    name: 30,
    company: 100,
    email: 50,
    phone: 15,
    message: 500,
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
                <section className="relative pb-20 pt-28 bg-gradient-to-br from-primary/30 via-background to-secondary overflow-hidden">

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Header mejorado */}
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                                Contáctanos
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Nuestro equipo está disponible para atender tus necesidades y responder
                                todas tus preguntas. Te responderemos en nuestra disponibilidad de tiempo.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {/* Info de contacto - Columna izquierda */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Tarjetas de contacto mejoradas */}
                                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40 overflow-hidden py-0">

                                    <CardContent className="relative p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0  transition-transform shadow-lg">
                                                    <Mail className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-2 text-foreground">Correo Electrónico</h3>
                                                <a
                                                    href="mailto:asistente@inversionesarar.com"
                                                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group/link"
                                                >
                                                    asistente@inversionesarar.com
                                                    <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40 overflow-hidden py-0">

                                    <CardContent className="relative p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 transition-transform shadow-lg">
                                                    <Phone className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-2 text-foreground">Teléfono</h3>
                                                <a
                                                    href="tel:6076985203"
                                                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group/link"
                                                >
                                                    607 698 5203
                                                    <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40 overflow-hidden py-0">
                                    <CardContent className="relative p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 transition-transform shadow-lg">
                                                <MapPin className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-2 text-foreground">Ubicación</h3>
                                                <a
                                                    href="https://maps.app.goo.gl/mm8MPxAzZs99BV1D8"
                                                    target='_blank'
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-muted-foreground hover:text-primary transition-colors hover:text-primary"
                                                >
                                                    <span className="block mb-1">Km 2 • Torre Uno • Oficina 206</span>
                                                    <span className="block mb-1">Ecoparque Empresarial Natura</span>
                                                    <span className="block font-medium">
                                                        Floridablanca, Santander - Colombia
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Horario de atención */}
                                <Card className="py-0 bg-gradient-to-br from-primary/70 to-primary shadow-lg border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-xl mb-4 text-white tracking-wide drop-shadow-sm">
                                            Horario de Atención
                                        </h3>

                                        <div className="space-y-3 text-sm">

                                            <div className="flex justify-between items-center">
                                                <span className="text-orange-50/90">Lunes a Viernes</span>
                                                <span className="font-semibold text-white drop-shadow-sm">
                                                    8:00 AM – 5:00 PM
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-orange-50/90">Sábados</span>
                                                <span className="font-semibold text-white drop-shadow-sm">
                                                    8:00 AM – 12:00 PM
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t border-white/20">
                                                <span className="text-orange-50/90">Domingos</span>
                                                <span className="font-semibold text-red-50 drop-shadow-sm">
                                                    Cerrado
                                                </span>
                                            </div>

                                        </div>
                                    </CardContent>
                                </Card>

                            </div>

                            {/* Formulario - Columna derecha (más ancha) */}
                            <div className="lg:col-span-2">
                                <Card className="shadow-xl border-primary/20 overflow-hidden py-0">
                                    <CardContent className="p-6 md:p-8">
                                        {/* Header del formulario */}
                                        <div className="pb-8">
                                            <h2 className="text-2xl font-bold text-primary mb-2">Envíanos un mensaje</h2>
                                            <p className="text-sm text-muted-foreground">
                                                Completa el formulario y nos pondremos en contacto contigo lo antes posible
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                            {/* Grid de campos */}
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Asunto */}
                                                <div className="md:col-span-2 space-y-2">
                                                    <Label htmlFor="subject" className='flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                        <MessageSquare className="w-4 h-4 text-primary" />
                                                        Asunto
                                                    </Label>
                                                    <Input
                                                        id="subject"
                                                        placeholder="¿De qué trata tu consulta?"
                                                        value={data.subject}
                                                        onChange={e => setData({ ...data, subject: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            handleTextKeyDown(e);
                                                            handleLimit(e, data.subject, LIMITS.subject);
                                                        }}
                                                        className={`h-11 ${errors.subject ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={LIMITS.subject}
                                                    />
                                                    <div className="relative">
                                                        <InputError className='absolute top-0 !-mt-1' message={errors.subject} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.subject.length}/{LIMITS.subject}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Nombre */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className='flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                        <User className="w-4 h-4 text-primary" />
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
                                                        className={`h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={LIMITS.name}
                                                    />
                                                    <div className="relative">
                                                        <InputError className='absolute top-0 !-mt-1' message={errors.name} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.name.length}/{LIMITS.name}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className='flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                        <Mail className="w-4 h-4 text-primary" />
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
                                                        className={`h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={LIMITS.email}
                                                    />
                                                    <div className="relative">
                                                        <InputError className='absolute top-0 !-mt-1' message={errors.email} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.email.length}/{LIMITS.email}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Teléfono */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className='flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                        <Phone className="w-4 h-4 text-primary" />
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
                                                        className={`h-11 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={LIMITS.phone}
                                                    />
                                                    <div className="relative">
                                                        <InputError className='absolute top-0 !-mt-1' message={errors.phone} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.phone.length}/{LIMITS.phone}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Empresa */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="company" className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-primary" />
                                                        Empresa (Opcional)
                                                    </Label>
                                                    <Input
                                                        id="company"
                                                        placeholder="Tu empresa"
                                                        value={data.company}
                                                        onChange={e => setData({ ...data, company: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            handleNumberTextKeyDown(e);
                                                            handleLimit(e, data.company, LIMITS.company);
                                                        }}
                                                        className={`h-11 ${errors.company ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={LIMITS.company}
                                                    />
                                                    <div className="relative">
                                                        <InputError className='absolute top-0 !-mt-1' message={errors.company} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.company.length}/{LIMITS.company}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mensaje */}
                                            <div className="space-y-2">
                                                <Label htmlFor="message" className='flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                    <MessageSquare className="w-4 h-4 text-primary" />
                                                    Mensaje
                                                </Label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="Cuéntanos en qué podemos ayudarte..."
                                                    rows={6}
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
                                                    <InputError className='absolute top-0 !-mt-1' message='{errors.message}' />
                                                    <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                        {data.message.length}/{LIMITS.message}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Checkbox de políticas */}
                                            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10 !mt-8">
                                                <Checkbox
                                                    id="acceptsPolicy"
                                                    checked={data.acceptsPolicy}
                                                    onCheckedChange={(checked) => setData({ ...data, acceptsPolicy: checked as boolean })}
                                                    className={errors.acceptsPolicy ? "border-destructive" : "border-primary"}
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor="acceptsPolicy"
                                                        className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        Acepto la{' '}
                                                        <a
                                                            href="docs/Politica-Privacidad.pdf"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline font-semibold"
                                                        >
                                                            política de privacidad
                                                        </a>
                                                        {' '}y el tratamiento de mis datos personales
                                                    </label>
                                                    {errors.acceptsPolicy && (
                                                        <InputError className='absolute top-0 !-mt-1' message={errors.acceptsPolicy} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Botón envío */}
                                            <Button
                                                type="submit"
                                                className="w-full text-base font-semibold group"
                                                size="lg"
                                                disabled={processing || !data.acceptsPolicy}
                                            >
                                                {processing ? (
                                                    <>
                                                        Enviando mensaje
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
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}