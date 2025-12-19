/**
 * Componente CTASection reutilizable.
 * 
 * Propósito: Sección de Call-to-Action compartida entre páginas públicas.
 * Muestra un mensaje motivacional con botón de contacto.
 * 
 * Props:
 * - title: Título del CTA (pregunta o afirmación motivacional)
 * - description: Descripción complementaria del CTA
 * - buttonText: Texto del botón (default: "Contáctanos")
 * - buttonHref: URL de destino del botón
 * - variant: Dirección del gradiente ('horizontal' | 'vertical')
 * 
 * Características:
 * - Gradiente responsivo (vertical en mobile, horizontal en desktop)
 * - Botón con efectos hover (scale + shadow)
 * - Layout flexible (columna en mobile, fila en desktop)
 * - Overflow hidden para efectos visuales
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface CTASectionProps {
    title: string | ReactNode;
    description: string | ReactNode;
    buttonText?: string;
    buttonHref: string;
    variant?: 'left' | 'right';
}

export default function CTASection({
    title,
    description,
    buttonText = "Contáctanos",
    buttonHref,
    variant = 'left'
}: CTASectionProps) {
    const gradientClass = variant === 'left'
        ? 'bg-gradient-to-b md:bg-gradient-to-r from-primary via-primary/90 to-background'
        : 'bg-gradient-to-b md:bg-gradient-to-l from-primary via-primary/90 to-background';

    return (
        <section className={`relative py-10 overflow-hidden ${gradientClass} text-primary-foreground`}>
            <div className={"container relative mx-auto px-6 lg:px-12 flex flex-col items-center justify-between gap-8 text-center md:text-left " + 
            (variant === 'left' ? 'md:flex-row' : 'md:flex-row-reverse')
            }>
                {/* Texto motivacional */}
                <div className={variant === 'left' ? 'text-start' : 'text-end'}>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                        {title}
                    </h2>
                    <p className="text-sm sm:text-base opacity-90 mt-2">
                        {description}
                    </p>
                </div>

                {/* Botón de acción */}
                <Link href={buttonHref}>
                    <Button
                        size="lg"
                        className="shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        {buttonText}
                    </Button>
                </Link>
            </div>
        </section>
    );
}