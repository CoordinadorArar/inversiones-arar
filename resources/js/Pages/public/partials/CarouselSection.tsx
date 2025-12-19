/**
 * Componente CarouselSection genérico y reutilizable.
 * 
 * Propósito: Wrapper que maneja la lógica de carrusel mobile vs grid desktop.
 * Permite mostrar cualquier contenido en formato grid (desktop) o carrusel horizontal (mobile).
 * 
 * Props:
 * - items: Array de items a renderizar
 * - renderItem: Función que renderiza cada item
 * - gridCols: Configuración de columnas para grid desktop (ej: "md:grid-cols-2 lg:grid-cols-3")
 * - showDots: Mostrar indicadores de scroll (default: true)
 * - itemsPerSlide: Cantidad de items por slide en mobile (default: 1)
 * - className: Clases adicionales para el contenedor principal
 * 
 * Características:
 * - Grid centrado en desktop con columnas configurables
 * - Scroll horizontal con snap en mobile
 * - Indicadores de scroll (dots) opcionales
 * - Soporte para agrupar items (ej: 2 en 2 en mobile)
 * - Oculta scrollbar con CSS personalizado
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { ReactNode } from 'react';

interface CarouselSectionProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    gridCols?: string;
    showDots?: boolean;
    itemsPerSlide?: number;
    className?: string;
}

export default function CarouselSection<T>({
    items,
    renderItem,
    gridCols = "md:grid-cols-2 lg:grid-cols-3",
    showDots = true,
    itemsPerSlide = 1,
    className = ""
}: CarouselSectionProps<T>) {

    // Calcular número de slides para los dots
    const totalSlides = Math.ceil(items.length / itemsPerSlide);

    return (
        <div className={className}>
            {/* Desktop: Grid centrado */}
            <div className={`hidden md:grid ${gridCols} gap-6 place-items-center`}>
                {items.map((item, index) => renderItem(item, index))}
            </div>

            {/* Mobile: Carrusel horizontal con snap */}
            <div className="md:hidden">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4">
                    {itemsPerSlide === 1 ? (
                        // Modo simple: 1 item por slide
                        items.map((item, index) => (
                            <div key={index} className="snap-center shrink-0 w-[85vw] max-w-sm">
                                {renderItem(item, index)}
                            </div>
                        ))
                    ) : (
                        // Modo agrupado: múltiples items por slide
                        Array.from({ length: totalSlides }).map((_, slideIndex) => {
                            const startIndex = slideIndex * itemsPerSlide;
                            const slideItems = items.slice(startIndex, startIndex + itemsPerSlide);

                            return (
                                <div key={slideIndex} className="snap-center shrink-0 w-[85vw] max-w-sm">
                                    <div className={`grid grid-cols-${itemsPerSlide} gap-4`}>
                                        {slideItems.map((item, itemIndex) =>
                                            renderItem(item, startIndex + itemIndex)
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Indicadores de scroll (dots) */}
                {showDots && (
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <div
                                key={index}
                                className="h-1.5 w-8 rounded-full bg-primary/20"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Estilos para ocultar scrollbar */}
            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}