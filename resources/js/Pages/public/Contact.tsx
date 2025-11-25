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
} from '@/lib/keydownValidations';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import InputError from '@/Components/InputError';
import { z } from "zod";

/**
 * Interface FormData: Define la estructura de los datos del formulario de contacto.
 * 
 * Cada propiedad corresponde a un campo del form, con tipos específicos.
 * Se usa para tipar el estado 'data' y asegurar consistencia en TypeScript.
 */
interface FormData {
    subject: string;        // Asunto del mensaje (obligatorio, string).
    name: string;           // Nombre completo del remitente (obligatorio, string).
    company: string;        // Empresa del remitente (opcional, string).
    email: string;          // Correo electrónico (obligatorio, string válido como email).
    phone: string;          // Teléfono (obligatorio, string numérico).
    message: string;        // Mensaje del contacto (obligatorio, string).
    acceptsPolicy: boolean; // Checkbox para aceptar política (obligatorio true).
}

/**
 * Constante LIMITS: Define límites de caracteres para cada campo del formulario.
 * 
 * Se usa en validaciones de Zod y en handleLimit para prevenir input excesivo.
 * 'as const' asegura que sea tratado como literal, no como tipo amplio.
 */
const LIMITS = {
    subject: 50,
    name: 30,
    company: 100,
    email: 50,
    phone: 15,
    message: 500,
} as const;

/**
 * Schema contactSchema: Validación completa del formulario usando Zod.
 * 
 * Define reglas para cada campo: obligatorios, formatos, longitudes, regex.
 * Se usa en handleSubmit para validar antes de enviar.
 * Cada campo tiene mensajes de error personalizados.
 */
const contactSchema = z.object({
    // Campo subject: Obligatorio, solo letras/espacios, max 50 chars.
    subject: z.string()
        .trim()  // Elimina espacios al inicio/fin.
        .min(1, "Este campo es obligatorio")  // Debe tener al menos 1 char.
        .max(LIMITS.subject, `El asunto debe tener máximo ${LIMITS.subject} caracteres`)  // Max según LIMITS.
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras"),  // Regex para letras y espacios.

    // Campo name: Similar a subject, obligatorio, solo letras.
    name: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .max(LIMITS.name, `El nombre debe tener máximo ${LIMITS.name} caracteres`)
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras"),

    // Campo company: Opcional, max 100 chars, permite vacío.
    company: z.string()
        .trim()
        .max(LIMITS.company, `La empresa debe tener máximo ${LIMITS.company} caracteres`)
        .optional()  // No obligatorio.
        .or(z.literal('')),  // Permite string vacío.

    // Campo email: Obligatorio, formato email válido, max 50.
    email: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .email("Ingrese un correo electrónico válido")  // Valida formato email.
        .max(LIMITS.email, `El correo debe tener máximo ${LIMITS.email} caracteres`),

    // Campo phone: Obligatorio, solo números, min 7 max 15, permite + al inicio.
    phone: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .regex(/^\+?[0-9]+$/, "Ingrese un número de teléfono válido")  // Solo dígitos, opcional +.
        .min(7, "El teléfono debe tener al menos 7 dígitos")  // Mínimo lógico.
        .max(LIMITS.phone, `El teléfono debe tener máximo ${LIMITS.phone} caracteres`),

    // Campo message: Obligatorio, min 10 max 500 chars.
    message: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .min(10, "El mensaje debe tener al menos 10 caracteres")  // Mínimo para mensaje útil.
        .max(LIMITS.message, `El mensaje debe tener máximo ${LIMITS.message} caracteres`),

    // Campo acceptsPolicy: Booleano, debe ser true para pasar.
    acceptsPolicy: z.boolean()
        .refine(val => val === true, "Debes aceptar la política de privacidad"),  // Refine para mensaje custom.
});

export default function Contact() {
    // Estado para datos del formulario: inicializado con valores vacíos/default.
    // Se actualiza con setData en onChange de inputs.
    const [data, setData] = useState<FormData>({
        subject: "",       // Asunto vacío.
        name: "",          // Nombre vacío.
        company: "",       // Empresa vacía (opcional).
        email: "",         // Email vacío.
        phone: "",         // Teléfono vacío.
        message: "",       // Mensaje vacío.
        acceptsPolicy: false,  // Checkbox en false.
    });

    // Estado para errores: objeto con claves de campos y mensajes.
    // Se llena en validación Zod, se muestra en InputError.
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estado para processing: indica si está enviando (deshabilita form).
    // Se setea true en envío, false en finally.
    const [processing, setProcessing] = useState(false);
    // Hook toast: para notificaciones de éxito/error.
    const { toast } = useToast();

    /**
    * Función handleSubmit: Maneja envío del formulario.
    * 
    * Previene default, limpia errores, valida con Zod, envía fetch si válido.
    * Maneja respuestas: éxito (toast + reset), errores (setea errores o toast).
    * Catch para errores de red. Finally limpia processing.
    * 
    * @param e Evento de submit del form.
    */
    const handleSubmit = async (e: React.FormEvent) => {
        // Previene recarga de página.
        e.preventDefault();

        // Limpia errores previos.
        setErrors({});
        // Valida data con schema Zod.
        const result = contactSchema.safeParse(data);

        // Si validación falla.
        if (!result.success) {
            // Inicializa objeto para errores.
            const newErrors: Record<string, string> = {};
            // Verifica que error sea ZodError (seguridad).
            if (result.error instanceof z.ZodError) {
                // Itera issues y mapea a newErrors.
                result.error.issues.forEach((err) => {
                    // Si path tiene elementos, usa primero como clave.
                    if (err.path.length > 0) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
            }
            // Setea errores en estado.
            setErrors(newErrors);
            // Scroll al primer error.
            const firstErrorField = Object.keys(newErrors)[0];
            document.getElementById(firstErrorField)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            // Sale sin enviar.
            return;
        }

        // Si válido, activa processing.
        setProcessing(true);

        try {
            // Fetch POST a ruta contact.store.
            const response = await fetch(route('contact.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Envía JSON.
                    'Accept': 'application/json',        // Espera JSON.
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',  // Token CSRF.
                },
                body: JSON.stringify(data),  // Serializa data a JSON.
            });

            // Parsea respuesta.
            const result = await response.json();
            // Si OK (200).
            if (response.ok) {
                // Toast éxito.
                toast({
                    title: "¡Mensaje enviado!",
                    description: "Nos pondremos en contacto contigo pronto.",
                    variant: "success",
                });
                // Reset data a valores iniciales.
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
                // Errores backend: setea en estado.
                setErrors(result.errors || {});
            } else {
                // Otros errores: toast.
                toast({
                    title: "Error al enviar",
                    description: result.error || "Intenta de nuevo más tarde.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            // Error de conexión.
            toast({
                title: "Error de conexión",
                description: "Revisa tu conexión e intenta de nuevo.",
                variant: "destructive",
            });
        } finally {
            // Siempre desactiva processing.
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Contacto" />
            <main className="flex-1">
                {/* Hero Section - RESPONSIVE */}
                <section className="relative pb-8 md:pb-10 pt-24 md:pt-28 bg-gradient-to-br from-primary/30 via-accent/20 to-background overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-4 md:mb-6 leading-tight">
                                Contáctanos
                            </h1>
                            <p className="text-base md:text-lg text-muted-foreground">
                                Nuestro equipo está disponible para atender tus necesidades y responder
                                todas tus preguntas. Te responderemos en nuestra disponibilidad de tiempo.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Sección Principal - RESPONSIVE */}
                <section className="relative py-8 md:py-10 bg-secondary/30 border-t">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">                                            
                        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                            {/* Info de contacto - Columna izquierda */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Tarjetas de contacto mejoradas */}
                                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40 overflow-hidden">
                                    <CardContent className="relative p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="relative !mt-0">
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0  transition-transform shadow-lg">
                                                    <Mail className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-foreground">Correo Electrónico</h3>
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

                                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40 overflow-hidden">
                                    <CardContent className="relative p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="relative !mt-0">
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 transition-transform shadow-lg">
                                                    <Phone className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-foreground">Teléfono</h3>
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

                                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40 overflow-hidden">
                                    <CardContent className="relative p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 transition-transform shadow-lg">
                                                <MapPin className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-foreground mb-1">Ubicación</h3>
                                                <a
                                                    href="https://maps.app.goo.gl/mm8MPxAzZs99BV1D8"
                                                    target='_blank'
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                                >
                                                    <span className="block">Km 2 • Torre Uno • Oficina 206</span>
                                                    <span className="block">Ecoparque Empresarial Natura</span>
                                                    <span className="block font-medium">
                                                        Floridablanca, Santander - Colombia
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Horario de atención */}
                                <Card className="bg-gradient-to-br from-primary/70 to-primary shadow-lg border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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

                            {/* Formulario - Columna derecha (más ancha) - RESPONSIVE */}
                            <div className="lg:col-span-2">
                                <Card className="shadow-xl border-primary/20 overflow-hidden">
                                    <CardContent className="p-4 sm:p-6 md:p-8">
                                        {/* Header del formulario */}
                                        <div className="pb-6 md:pb-8">
                                            <h2 className="text-xl md:text-2xl font-bold text-primary mb-2">Envíanos un mensaje</h2>
                                            <p className="text-xs md:text-sm text-muted-foreground">
                                                Completa el formulario y nos pondremos en contacto contigo lo antes posible
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
                                            {/* Grid de campos */}
                                            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
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
                                                        onKeyDown={handleTextKeyDown}
                                                        className={`${errors.subject ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={LIMITS.subject}
                                                    />
                                                    <div className="relative !mt-0">
                                                        <InputError message={errors.subject} />
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
                                                        onKeyDown={handleTextKeyDown}
                                                        className={`${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={LIMITS.name}
                                                        autoComplete="name"
                                                    />
                                                    <div className="relative !mt-0">
                                                        <InputError message={errors.name} />
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
                                                        onKeyDown={handleEmailKeyDown}
                                                        className={`${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={LIMITS.email}
                                                        autoComplete="email"
                                                    />
                                                    <div className="relative !mt-0">
                                                        <InputError message={errors.email} />
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
                                                        onKeyDown={handleNumberKeyDown}
                                                        className={`${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={LIMITS.phone}
                                                        autoComplete="tel"
                                                    />
                                                    <div className="relative !mt-0">
                                                        <InputError message={errors.phone} />
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
                                                        onKeyDown={handleNumberTextKeyDown}
                                                        className={`${errors.company ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={LIMITS.company}
                                                    />
                                                    <div className="relative !mt-0">
                                                        <InputError message={errors.company} />
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
                                                    onKeyDown={handleMessagesKeyDown}
                                                    className={errors.message ? "border-destructive focus-visible:ring-destructive" : ""}
                                                    maxLength={LIMITS.message}
                                                />
                                                <div className="relative !mt-0">
                                                    <InputError message={errors.message} />
                                                    <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                        {data.message.length}/{LIMITS.message}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Checkbox de políticas */}
                                            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10 !mt-6 md:!mt-9">
                                                <Checkbox
                                                    id="acceptsPolicy"
                                                    checked={data.acceptsPolicy}
                                                    onCheckedChange={(checked) => setData({ ...data, acceptsPolicy: checked as boolean })}
                                                    className={errors.acceptsPolicy ? "border-destructive" : "border-primary"}
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor="acceptsPolicy"
                                                        className="text-xs md:text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
                                                        <InputError message={errors.acceptsPolicy} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Botón envío */}
                                            <Button
                                                type="submit"
                                                className="w-full text-sm md:text-base font-semibold group"
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
        </>
    );
}

Contact.layout = (page) => (
    <PublicLayout children={page}/>
)