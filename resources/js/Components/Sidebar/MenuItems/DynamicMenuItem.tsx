/**
 * Archivo DynamicMenuItem.tsx.
 * 
 * Propósito: Componentes para renderizar items dinámicos del menú en el sidebar.
 * Maneja navegación jerárquica: items simples (links) o con subitems (desplegables).
 * Adapta comportamiento según estado del sidebar (colapsado vs expandido).
 * 
 * Componentes incluidos:
 * - DynamicMenuItem: Decide el tipo de render.
 * - CollapsedMenuItemWithSubitems: Usa Popover para subitems flotantes cuando colapsado.
 * - ExpandedMenuItemWithSubitems: Usa Collapsible para subitems inline cuando expandido.
 * 
 * Características:
 * - Íconos dinámicos via DynamicIcon.
 * - Estados activos via useActiveRoute (resalta items/hijos activos).
 * - Animaciones suaves (rotate, fade, slide).
 * - Responsive: Popover para colapsado, Collapsible para expandido.
 * 
 * Dependencias: Hooks (useActiveRoute), tipos (menu.types), UI (Popover, Collapsible, etc.).
 * 
 * @author Yariangel Aray - Items dinámicos para menú jerárquico.
 * @version 1.0
 * @date 2025-11-28
 */

import { useActiveRoute } from "../hooks";
import { CollapsedMenuItemProps, DynamicMenuItemProps, ExpandedMenuItemProps } from "../menu.types";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "lucide-react/dynamic";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MenuItemLink } from "./MenuItemLink";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible";
import { SidebarMenuButton } from "@/components/ui/sidebar";

/**
 * Componente DynamicMenuItem.
 * 
 * Propósito: Punto de entrada para renderizar un item del menú.
 * Decide el tipo de componente basado en: ¿tiene subitems? ¿sidebar colapsado?
 * 
 * Lógica:
 * - Sin subitems: Renderiza MenuItemLink simple.
 * - Con subitems + colapsado: Usa CollapsedMenuItemWithSubitems (Popover).
 * - Con subitems + expandido: Usa ExpandedMenuItemWithSubitems (Collapsible).
 * 
 * Props: item (datos del menú), collapsed (estado sidebar), openGroups/toggleGroup (para expandido), openPopover/setOpenPopover (para colapsado).
 * 
 * @param {DynamicMenuItemProps} props
 * @returns JSX.Element
 */
export const DynamicMenuItem = ({
  item,
  collapsed,
  openGroups,
  toggleGroup,
  openPopover,
  setOpenPopover
}: DynamicMenuItemProps) => {
  // Si no tiene subitems, renderiza un link simple usando MenuItemLink.
  if (!item.items) {
    return (
      <SidebarMenuButton asChild>
        <MenuItemLink
          url={item.url}
          icon={item.icon}
          title={item.title}
          collapsed={collapsed}
        />
      </SidebarMenuButton>
    );
  }

  // Si está colapsado, usa Popover para subitems flotantes.
  if (collapsed) {
    return (
      <CollapsedMenuItemWithSubitems
        item={item}
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      />
    );
  }

  // Si está expandido, usa Collapsible para subitems inline.
  return (
    <ExpandedMenuItemWithSubitems
      item={item}
      openGroups={openGroups}
      toggleGroup={toggleGroup}
    />
  );
};

/**
 * Componente CollapsedMenuItemWithSubitems.
 * 
 * Propósito: Renderiza item con subitems cuando el sidebar está colapsado.
 * Usa Popover para mostrar subitems en un menú flotante a la derecha.
 * Incluye ícono de flecha que rota al abrir, y resalta si tiene hijo activo.
 * 
 * Animaciones: Popover con fade/zoom/slide, flecha rota 180°.
 * 
 * Props: item (datos), openPopover/setOpenPopover (estado del popover).
 * 
 * @param {CollapsedMenuItemProps} props
 * @returns JSX.Element
 */
const CollapsedMenuItemWithSubitems = ({
  item,
  openPopover,
  setOpenPopover
}: CollapsedMenuItemProps) => {
  // Hook para detectar si el item tiene un hijo activo (para resaltar).
  const { hasActiveChild } = useActiveRoute();

  // Render: Popover con trigger (botón con ícono/flecha) y content (subitems).
  return (
    <Popover
      open={openPopover === item.title}  // Abre si este item está seleccionado.
      onOpenChange={(open) => setOpenPopover(open ? item.title : null)}  // Actualiza estado.
    >
      {/* Trigger: Botón del sidebar con ícono y flecha. */}
      <PopoverTrigger asChild>
        <SidebarMenuButton
          className={cn(
            "w-full transition-all duration-300 rounded-md relative",
            hasActiveChild(item) && "bg-primary/5"  // Resalta si tiene hijo activo.
          )}
        >
          <DynamicIcon name={item.icon} className="h-4 w-4" />  {/* Ícono dinámico. */}
          <ChevronRight
            className={cn(
              "!h-3 !w-3 absolute -right-1 top-1/2 -translate-y-1/2 transition-transform duration-300 opacity-80",
              openPopover === item.title && "rotate-180"  // Rota flecha al abrir.
            )}
          />
        </SidebarMenuButton>
      </PopoverTrigger>

      {/* Content: Menú flotante con subitems, animado. */}
      <PopoverContent
        side="right"  // Aparece a la derecha.
        align="start"  // Alinea al inicio.
        sideOffset={8}  // Offset de 8px.
        className="w-64 p-2 bg-background/95 backdrop-blur-sm border shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      >
        {/* Lista de subitems con espacio vertical. */}
        <div className="space-y-1">
          {item.items?.map((subItem) => (
            <SidebarMenuButton asChild>
              <MenuItemLink
                key={subItem.url}
                url={`${item.url}${subItem.url}`}  // Concatena URLs padre+hijo.
                icon={subItem.icon}
                title={subItem.title}
                isSubItem  // Marca como subitem para estilos.
              />
            </SidebarMenuButton>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/**
 * Componente ExpandedMenuItemWithSubitems.
 * 
 * Propósito: Renderiza item con subitems cuando el sidebar está expandido.
 * Usa Collapsible para mostrar/ocultar subitems inline con animación.
 * Incluye ícono de flecha que rota, y resalta si tiene hijo activo.
 * 
 * Animaciones: Collapsible con slide down/up, flecha rota 180°.
 * 
 * Props: item (datos), openGroups/toggleGroup (estado de grupos abiertos).
 * 
 * @param {ExpandedMenuItemProps} props
 * @returns JSX.Element
 */
const ExpandedMenuItemWithSubitems = ({
  item,
  openGroups,
  toggleGroup
}: ExpandedMenuItemProps) => {
  // Hook para detectar si el item tiene un hijo activo.
  const { hasActiveChild } = useActiveRoute();

  // Render: Collapsible con trigger (botón con ícono/título/flecha) y content (subitems).
  return (
    <Collapsible
      open={openGroups.includes(item.title)}  // Abre si grupo está en openGroups.
      onOpenChange={() => toggleGroup(item.title)}  // Toggle al cambiar.
    >
      {/* Trigger: Botón que abre/cierra el collapsible. */}
      <CollapsibleTrigger asChild>
        <SidebarMenuButton
          className={cn(
            "w-full transition-all duration-300 rounded-md",
            hasActiveChild(item) && "bg-primary/5"  // Resalta si tiene hijo activo.
          )}
        >
          <DynamicIcon name={item.icon} className="h-4 w-4" />  {/* Ícono dinámico. */}
          <span className="flex-1 font-medium whitespace-nowrap">{item.title}</span>  {/* Título. */}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              openGroups.includes(item.title) && "rotate-180"  // Rota flecha al abrir.
            )}
          />
        </SidebarMenuButton>
      </CollapsibleTrigger>

      {/* Content: Subitems con indentación y animación. */}
      <CollapsibleContent
        className={cn(
          "pl-4 space-y-1 mt-1 overflow-hidden",
          "data-[state=open]:animate-collapsible-down",  // Animación al abrir.
          "data-[state=closed]:animate-collapsible-up"   // Animación al cerrar.
        )}
      >
        {/* Mapea subitems con MenuItemLink. */}
        {item.items?.map((subItem) => (
          <SidebarMenuButton key={subItem.url} asChild>
            <MenuItemLink
              url={`${item.url}${subItem.url}`}  // Concatena URLs.
              icon={subItem.icon}
              title={subItem.title}
              isSubItem  // Marca como subitem.
            />
          </SidebarMenuButton>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
