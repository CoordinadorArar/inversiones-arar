/**
 * Componente HeroSection reutilizable.
 * 
 * Propósito: Sección hero compartida entre múltiples páginas públicas (Companies, Portafolio, etc).
 * Muestra un título principal y descripción con diseño consistente y responsivo.
 * 
 * Props:
 * - title: Título principal de la sección (string o ReactNode para texto con estilos)
 * - description: Descripción/subtítulo (string o ReactNode)
 * - variant: Estilo visual ('default' | 'with-overflow') - controla si tiene overflow-hidden
 * 
 * Características:
 * - Gradiente de fondo consistente (from-primary/30 via-accent/20 to-background)
 * - Padding responsivo (pt-28 para dejar espacio al header fijo)
 * - Contenedor max-w-3xl para legibilidad óptima
 * - Tipografía responsiva (3xl → 5xl)
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { ReactNode } from 'react';

interface HeroSectionProps {
  title: string | ReactNode;
  description: string | ReactNode;
  variant?: 'default' | 'with-overflow';
}

export default function HeroSection({
  title,
  description,
  variant = 'default'
}: HeroSectionProps) {
  return (
    <section
      className={`pb-10 pt-28 bg-gradient-to-br from-primary/30 via-accent/20 to-background ${variant === 'with-overflow' ? 'relative overflow-hidden' : ''
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Título principal con gradiente de texto */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4">
            {title}
          </h1>

          {/* Descripción/subtítulo */}
          <p className="text-base md:text-lg text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}