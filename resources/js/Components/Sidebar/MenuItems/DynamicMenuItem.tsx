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
 * Componente: DynamicMenuItem
 * Decide qué tipo de item renderizar según tenga subitems y el estado del sidebar
 */
export const DynamicMenuItem = ({
  item,
  collapsed,
  openGroups,
  toggleGroup,
  openPopover,
  setOpenPopover
}: DynamicMenuItemProps) => {
  // Si no tiene subitems, renderiza un link simple usando MenuItemLink
  if (!item.items) {
    return (
      <SidebarMenuButton>
        <MenuItemLink
          url={item.url}
          icon={item.icon}
          title={item.title}
          collapsed={collapsed}
        />
      </SidebarMenuButton>
    );
  }

  // Si está colapsado, usa Popover
  if (collapsed) {
    return (
      <CollapsedMenuItemWithSubitems
        item={item}
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      />
    );
  }

  // Si está expandido, usa Collapsible
  return (
    <ExpandedMenuItemWithSubitems
      item={item}
      openGroups={openGroups}
      toggleGroup={toggleGroup}
    />
  );
};

/**
 * Componente: CollapsedMenuItemWithSubitems
 * Item con subitems cuando el sidebar está colapsado (usa Popover)
 */
const CollapsedMenuItemWithSubitems = ({
  item,
  openPopover,
  setOpenPopover
}: CollapsedMenuItemProps) => {
  const { hasActiveChild } = useActiveRoute();

  return (
    <Popover
      open={openPopover === item.title}
      onOpenChange={(open) => setOpenPopover(open ? item.title : null)}
    >
      <PopoverTrigger asChild>
        <SidebarMenuButton
          className={cn(
            "w-full transition-all duration-300 rounded-md relative",
            hasActiveChild(item) && "bg-primary/5"
          )}
        >
          <DynamicIcon name={item.icon} className="h-4 w-4" />
          <ChevronRight
            className={cn(
              "!h-3 !w-3 absolute -right-1 top-1/2 -translate-y-1/2 transition-transform duration-300 opacity-80",
              openPopover === item.title && "rotate-180"
            )}
          />
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-64 p-2 bg-background/95 backdrop-blur-sm border shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      >
        <div className="space-y-1">
          {item.items?.map((subItem) => (
            <SidebarMenuButton asChild>
              <MenuItemLink
                key={subItem.url}
                url={`${item.url}${subItem.url}`}
                icon={subItem.icon}
                title={subItem.title}
                isSubItem
              />
            </SidebarMenuButton>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/**
 * Componente: ExpandedMenuItemWithSubitems
 * Item con subitems cuando el sidebar está expandido (usa Collapsible)
 */

const ExpandedMenuItemWithSubitems = ({
  item,
  openGroups,
  toggleGroup
}: ExpandedMenuItemProps) => {
  const { hasActiveChild } = useActiveRoute();

  return (
    <Collapsible
      open={openGroups.includes(item.title)}
      onOpenChange={() => toggleGroup(item.title)}
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuButton
          className={cn(
            "w-full transition-all duration-300 rounded-md",
            hasActiveChild(item) && "bg-primary/5"
          )}
        >
          <DynamicIcon name={item.icon} className="h-4 w-4" />
          <span className="flex-1 font-medium whitespace-nowrap">{item.title}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              openGroups.includes(item.title) && "rotate-180"
            )}
          />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          "pl-4 space-y-1 mt-1 overflow-hidden",
          "data-[state=open]:animate-collapsible-down",
          "data-[state=closed]:animate-collapsible-up"
        )}
      >
        {item.items?.map((subItem) => (
          <SidebarMenuButton key={subItem.url} asChild>
            <MenuItemLink
              url={`${item.url}${subItem.url}`}
              icon={subItem.icon}
              title={subItem.title}
              isSubItem
            />
          </SidebarMenuButton>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};