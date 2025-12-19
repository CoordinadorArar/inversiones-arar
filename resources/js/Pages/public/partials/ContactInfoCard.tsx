/**
 * Componente ContactInfoCard.
 * 
 * Propósito: Tarjeta reutilizable para mostrar información de contacto.
 * Usado en la página de Contact para Email, Teléfono y Ubicación.
 * 
 * Props:
 * - icon: Componente de icono de lucide-react
 * - title: Título de la tarjeta (ej: "Correo Electrónico")
 * - content: Contenido principal a mostrar (texto o JSX)
 * - href: URL para link (opcional)
 * - showStatusDot: Mostrar punto verde de estado activo (default: false)
 * - target: Target del link (default: undefined, usar "_blank" para externos)
 * 
 * Características:
 * - Icono con gradiente de fondo
 * - Punto de estado verde opcional
 * - Hover effects suaves (shadow, border)
 * - Link con flecha animada en hover
 * - Totalmente accesible y responsivo
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ContactInfoCardProps {
    icon: LucideIcon;
    title: string;
    content: string | ReactNode;
    href?: string;
    showStatusDot?: boolean;
    target?: "_blank" | "_self" | "_parent" | "_top";
}

export default function ContactInfoCard({
    icon: Icon,
    title,
    content,
    href,
    showStatusDot = false,
    target
}: ContactInfoCardProps) {
    // Contenido a renderizar (con o sin link)
    const contentElement = href ? (
        <a
            href={href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group/link"
        >
            {content}
            <ArrowRight className="w-4 h-4 mt-0.5 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
        </a>
    ) : (
        <div className="text-sm text-muted-foreground">{content}</div>
    );

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40 overflow-hidden">
            <CardContent className="relative p-4">
                <div className="flex items-start gap-4">
                    {/* Icono con punto de estado opcional */}
                    <div className="relative">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 transition-transform shadow-lg">
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        {showStatusDot && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-1">{title}</h3>
                        {contentElement}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}