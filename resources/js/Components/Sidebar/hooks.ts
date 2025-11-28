import { MenuParent } from "./menu.types";

/**
 * Hook personalizado para manejo de rutas activas
 * Centraliza la lógica de verificación de rutas activas
 */
export const useActiveRoute = () => {
  const currentRoute = window.location.pathname || "";
  
  const isActive = (url: string) => {
    return currentRoute === url || currentRoute.includes(url);
  };
  
  const hasActiveChild = (item: MenuParent): boolean => {
    if (!item.items) return false;
    return item.items.some(subItem => currentRoute.includes(subItem.url));
  };
  
  return { isActive, hasActiveChild, currentRoute };
};