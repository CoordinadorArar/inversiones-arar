// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

// Interface para items del menu (subitems).
export interface MenuItem {
  title: string;  // Título del item.
  url: string;  // URL.
  icon: string;  // Ícono (string para DynamicIcon).
}

// Interface para padres del menu (con subitems).
export interface MenuParent {
  title: string;  // Título del grupo padre.
  url: string;  // URL del padre.
  icon: string;  // Ícono del padre.
  items?: MenuItem[];  // Array de subitems.
}

export interface MenuItemLinkProps {
  url: string;
  icon: string;
  title: string;
  collapsed?: boolean;
  isSubItem?: boolean;
}

export interface DynamicMenuItemProps {
  item: MenuParent;
  collapsed: boolean;
  openGroups: string[];
  toggleGroup: (title: string) => void;
  openPopover: string | null;
  setOpenPopover: (title: string | null) => void;
}
export interface CollapsedMenuItemProps {
  item: MenuParent;
  openPopover: string | null;
  setOpenPopover: (title: string | null) => void;
}
export interface ExpandedMenuItemProps {
  item: MenuParent;
  openGroups: string[];
  toggleGroup: (title: string) => void;
}

/**
 * Props del componente principal DashboardSidebar
 */
export interface DashboardSidebarProps {
  menu: MenuParent[];
  openGroups: string[];
  setOpenGroups: (groups: string[] | ((prev: string[]) => string[])) => void;
}
