/**
 * Componente React para la página de contacto (contact).
 * Se monta vía Inertia desde ContactController@index. Usa PublicLayout para estructura común.
 * Muestra información de contacto de la empresa y un formulario de contacto.
 * 
 * REFACTORIZACIÓN v2.0:
 * - HeroSection modularizado y reutilizable
 * - ContactInfoCard extraído para tarjetas de info (Email, Teléfono, Ubicación)
 * - ScheduleCard extraído para horario de atención
 * - Lógica del formulario extraída a useContactForm hook
 * - Schema y types centralizados en contactForm.types.ts
 * - Componente enfocado solo en UI/renderizado
 * - Mejor separación de responsabilidades y testabilidad
 * 
 * @author Yariangel Aray
 * @date 2025-11-14
 * @updated 2025-12-18 - Refactorización con hooks y types
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
import { handleEmailKeyDown, handleMessagesKeyDown, handleNumberKeyDown, handleNumberTextKeyDown, handleTextKeyDown } from '@/lib/keydownValidations';
import InputError from '@/Components/InputError';
import { ConfiguracionContacto } from '@/Types/configuracionInterface';
import { formatLandlinePhoneNumberCO } from '@/lib/formatUtils';
import { useContactForm } from './hooks/useContactForm';
import { CONTACT_LIMITS } from './types/contactForm.types';
import HeroSection from './partials/HeroSection';
import ContactInfoCard from './partials/ContactInfoCard';
import ScheduleCard from './partials/ScheduleCard';

export default function Contact({ contact }: { contact: ConfiguracionContacto }) {
    // Hook personalizado: maneja toda la lógica del formulario
    // (estado, validaciones, envío, errores)
    const {
        data,
        errors,
        processing,
        handleChange,
        handleSubmit,
    } = useContactForm();

    return (
        <>
            <Head title="Contacto" />
            <main className="flex-1">
                {/* Hero Section - Modularizado */}
                <HeroSection
                    title="Contáctanos"
                    description="Nuestro equipo está disponible para atender tus necesidades y responder todas tus preguntas. Te responderemos en nuestra disponibilidad de tiempo."
                    variant="with-overflow"
                />

                {/* Sección Principal - RESPONSIVE */}
                <section className="relative py-8 md:py-10 bg-secondary/30 border-t">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                            {/* Info de contacto - Columna izquierda */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Tarjetas de contacto - Modularizadas */}
                                {contact.email && (
                                    <ContactInfoCard
                                        icon={Mail}
                                        title="Correo Electrónico"
                                        content={contact.email}
                                        href={`mailto:${contact.email}`}
                                        showStatusDot={true}
                                    />
                                )}

                                {contact.telefono && (
                                    <ContactInfoCard
                                        icon={Phone}
                                        title="Teléfono"
                                        content={formatLandlinePhoneNumberCO(contact.telefono)}
                                        href={`tel:${contact.telefono}`}
                                        showStatusDot={true}
                                    />
                                )}

                                <ContactInfoCard
                                    icon={MapPin}
                                    title="Ubicación"
                                    content={
                                        <div>
                                            <span className="block whitespace-nowrap">{contact.ubicacion}</span>
                                            <span className="block font-medium">{contact['ubicacion.detalles']}</span>
                                        </div>
                                    }
                                    href={contact['ubicacion.url']}
                                    target="_blank"
                                />

                                {/* Horario de atención - Modularizado */}
                                <ScheduleCard />
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
                                                    <Label htmlFor="subject" className='flex items-center gap-2  after:text-red-500 after:content-["*"]'>
                                                        <MessageSquare className="w-4 h-4 text-primary" />
                                                        Asunto
                                                    </Label>
                                                    <Input
                                                        id="subject"
                                                        placeholder="¿De qué trata tu consulta?"
                                                        value={data.subject}
                                                        onChange={e => handleChange('subject', e.target.value)}
                                                        onKeyDown={handleTextKeyDown}
                                                        className={`${errors.subject ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={CONTACT_LIMITS.subject}
                                                    />
                                                    <div className="relative">
                                                        <InputError message={errors.subject} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.subject.length}/{CONTACT_LIMITS.subject}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Nombre */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className='flex items-center gap-2  after:text-red-500 after:content-["*"]'>
                                                        <User className="w-4 h-4 text-primary" />
                                                        Nombre completo
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        placeholder="Tu nombre"
                                                        value={data.name}
                                                        onChange={e => handleChange('name', e.target.value)}
                                                        onKeyDown={handleTextKeyDown}
                                                        className={`${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={CONTACT_LIMITS.name}
                                                        autoComplete="name"
                                                    />
                                                    <div className="relative">
                                                        <InputError message={errors.name} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.name.length}/{CONTACT_LIMITS.name}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className='flex items-center gap-2  after:text-red-500 after:content-["*"]'>
                                                        <Mail className="w-4 h-4 text-primary" />
                                                        Correo electrónico
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="tu@email.com"
                                                        value={data.email}
                                                        onChange={e => handleChange('email', e.target.value)}
                                                        onKeyDown={handleEmailKeyDown}
                                                        className={`${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={CONTACT_LIMITS.email}
                                                        autoComplete="email"
                                                    />
                                                    <div className="relative">
                                                        <InputError message={errors.email} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.email.length}/{CONTACT_LIMITS.email}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Teléfono */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className='flex items-center gap-2  after:text-red-500 after:content-["*"]'>
                                                        <Phone className="w-4 h-4 text-primary" />
                                                        Teléfono
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        placeholder="+573001234567"
                                                        value={data.phone}
                                                        onChange={e => handleChange('phone', e.target.value)}
                                                        onKeyDown={handleNumberKeyDown}
                                                        className={`${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={CONTACT_LIMITS.phone}
                                                        autoComplete="tel"
                                                    />
                                                    <div className="relative">
                                                        <InputError message={errors.phone} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.phone.length}/{CONTACT_LIMITS.phone}
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
                                                        onChange={e => handleChange('company', e.target.value)}
                                                        onKeyDown={handleNumberTextKeyDown}
                                                        className={`${errors.company ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                        maxLength={CONTACT_LIMITS.company}
                                                    />
                                                    <div className="relative">
                                                        <InputError message={errors.company} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.company.length}/{CONTACT_LIMITS.company}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mensaje */}
                                            <div className="space-y-2">
                                                <Label htmlFor="message" className='flex items-center gap-2  after:text-red-500 after:content-["*"]'>
                                                    <MessageSquare className="w-4 h-4 text-primary" />
                                                    Mensaje
                                                </Label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="Cuéntanos en qué podemos ayudarte..."
                                                    rows={6}
                                                    value={data.message}
                                                    onChange={e => handleChange('message', e.target.value)}
                                                    onKeyDown={handleMessagesKeyDown}
                                                    className={errors.message ? "border-destructive focus-visible:ring-destructive" : ""}
                                                    maxLength={CONTACT_LIMITS.message}
                                                />
                                                <div className="relative">
                                                    <InputError message={errors.message} />
                                                    <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                        {data.message.length}/{CONTACT_LIMITS.message}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Checkbox de políticas */}
                                            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10 !mt-6 md:!mt-9">
                                                <Checkbox
                                                    id="acceptsPolicy"
                                                    checked={data.acceptsPolicy}
                                                    onCheckedChange={(checked) => handleChange('acceptsPolicy', checked as boolean)}
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

// Layout para Inertia: Envuelve en PublicLayout
Contact.layout = (page) => (
    <PublicLayout children={page} />
);