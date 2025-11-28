import { Link } from "@inertiajs/react";
import { MenuItemLinkProps } from "../menu.types";
import { useActiveRoute } from "../hooks";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "lucide-react/dynamic";

/**
 * Componente: MenuItemLink
 * Componente reutilizable para renderizar cualquier item de menú (simple o subitem)
 * Maneja toda la lógica de estilos, estados activos y navegación
 */

export const MenuItemLink = ({ 
  url, 
  icon, 
  title, 
  collapsed = false,
  isSubItem = false 
}: MenuItemLinkProps) => {
  const { isActive } = useActiveRoute();
  return (
    <Link
      href={url}
      className={cn(
        "flex items-center gap-2 transition-all duration-300 rounded-md",
        // Estilos específicos para subitems (padding y tamaño de texto)
        isSubItem ? "w-full px-3 py-1.5 text-sm" : "",
        // Estilos cuando está activo
        isActive(url)
          ? `bg-primary/10 text-primary font-medium hover:!text-primary hover:!bg-primary/15 ${
              isSubItem 
                ? "border-r-2 border-primary" 
                : !collapsed && "border-r-4 border-primary"
            }`
          : "hover:bg-muted"
      )}
      onClick={e => {
        if (isActive(url)) e.preventDefault();
      }}
    >
      <DynamicIcon name={icon} className="h-4 w-4" />
      {/* Para items principales, solo mostrar texto si no está colapsado */}
      {/* Para subitems, siempre mostrar el texto */}
      {(isSubItem || !collapsed) && (
        <span className={!isSubItem ? "font-medium" : ""}>{title}</span>
      )}
    </Link>
  );
};