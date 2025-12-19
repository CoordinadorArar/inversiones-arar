/**
 * Types compartidos entre componentes públicos.
 * 
 * Propósito: Centralizar interfaces y tipos reutilizables para mantener
 * consistencia de tipos a través de la aplicación.
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Props base para secciones hero
 */
export interface HeroSectionProps {
  title: string | ReactNode;
  description: string | ReactNode;
  variant?: 'default' | 'with-overflow';
}

/**
 * Props base para secciones CTA
 */
export interface CTASectionProps {
  title: string | ReactNode;
  description: string | ReactNode;
  buttonText?: string;
  buttonHref: string;
  variant?: 'horizontal' | 'vertical';
}

/**
 * Props genéricas para CarouselSection
 */
export interface CarouselSectionProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  gridCols?: string;
  showDots?: boolean;
  itemsPerSlide?: number;
  className?: string;
}

/**
 * Estructura de una empresa
 */
export interface Empresa {
  id: number;
  razon_social: string;
  logo_url?: string;
  tipo_empresa: string;
  descripcion: string;
  sitio_web: string;
}

/**
 * Estructura de un cliente
 */
export interface Cliente {
  razon_social: string;
  logo_url?: string;
  tipo_empresa?: string;
}

/**
 * Estructura de un servicio
 */
export interface Servicio {
  nombre: string;
  icono: LucideIcon;
  descripcion: string;
}