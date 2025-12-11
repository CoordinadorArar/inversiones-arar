/**
 * Archivo MenuItemLink.tsx.
 * 
 * Propósito: Componente reutilizable para renderizar links de items de menú.
 * Maneja navegación, estilos condicionales, estados activos y responsive.
 * Usado para items simples o subitems en el sidebar.
 * 
 * Características:
 * - Ícono dinámico via DynamicIcon.
 * - Estados activos via useActiveRoute (resalta link activo).
 * - Estilos condicionales: Activo (bg primary, border), hover, subitem (padding reducido).
 * - Responsive: Oculta texto en colapsado para items principales, siempre muestra en subitems.
 * - Navegación: Link de Inertia para SPA.
 * 
 * Props: url, icon, title, collapsed (opcional), isSubItem (opcional).
 * 
 * @author Yariangel Aray - Link reutilizable para menú.
 
 * @date 2025-11-28
 */

// Imports: Link de Inertia, tipos, hook para rutas activas, utils, ícono dinámico.
import { Link } from "@inertiajs/react";  // Para navegación SPA.
import { MenuItemLinkProps } from "../menu.types";  // Tipos para props.
import { useActiveRoute } from "../hooks";  // Hook para detectar ruta activa.
import { cn } from "@/lib/utils";  // Utilidad para clases condicionales.
import { DynamicIcon } from "lucide-react/dynamic";  // Ícono dinámico.

/**
 * Componente MenuItemLink.
 * 
 * Propósito: Renderiza un link de menú con ícono, título y estilos dinámicos.
 * Aplica clases basadas en estado activo, si es subitem, y si sidebar colapsado.
 * 
 * Lógica de estilos:
 * - Base: Flex, gap, padding, transition, rounded.
 * - Subitem: Padding reducido, texto pequeño.
 * - Activo: Bg primary, texto primary, border derecho (más grueso en no-subitem).
 * - Hover: Bg muted (si no activo).
 * - Responsive: Texto oculto en colapsado para items principales.
 * 
 * @param {MenuItemLinkProps} props
 * @returns JSX.Element
 */
export const MenuItemLink = ({ 
  url, 
  icon, 
  title, 
  collapsed = false,  // Por defecto false (expandido).
  isSubItem = false   // Por defecto false (item principal).
}: MenuItemLinkProps) => {
  // Hook para chequear si la URL es activa.
  const { isActive } = useActiveRoute();

  // Render: Link con clases condicionales y contenido dinámico.
  return (
    <Link
      href={url}  // URL para navegación.
      className={cn(
        "flex items-start gap-2 w-full p-[8px] transition-all duration-300 rounded-md ",
        // Estilos específicos para subitems (padding y tamaño de texto reducido).
        isSubItem ? "px-3 py-1.5 text-sm" : "",
        // Estilos cuando está activo: bg primary, texto primary, hover, border derecho.
        isActive(url)
          ? `bg-primary/10 text-primary font-medium hover:!text-primary hover:!bg-primary/15 ${
              isSubItem 
                ? "border-r-2 border-primary"  // Border fino para subitems.
                : !collapsed && "border-r-4 border-primary"  // Border grueso para principales si no colapsado.
            }`
          : "hover:bg-muted"  // Hover muted si no activo.
      )}
      onClick={e => {
        // Lógica opcional: Prevenir click si ya activo (comentado para permitir recarga si necesario).
        // if (isActive(url)) e.preventDefault();
      }}
    >
      {/* Ícono dinámico siempre visible. */}
      <DynamicIcon name={icon} className="h-4 w-4 min-w-4 mt-0.5" />
      
      {/* Texto: Para subitems siempre, para principales solo si no colapsado. */}
      {(isSubItem || !collapsed) && (
        <span className={!isSubItem ? "font-medium" : ""}>{title}</span>
      )}
    </Link>
  );
};
