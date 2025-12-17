/**
 * Hook personalizado useControlAccesoGestion.
 * 
 * Maneja estado y lógica para asignación de módulos/pestañas a roles:
 * cambio de rol, carga dinámica de items, navegación por URL, manejo de errores.
 * Soporta tanto módulos como pestañas con tipo genérico.
 * Se integra con React para control de acceso.
 * 
 * @author Yariangel Aray
 * @date 2025-12-16
 */

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ModuloAsignacionInterface, PestanaAsignacionInterface, RolSimpleInterface } from "../types/controlAccesoInterface";

/**
 * Interfaz para las props del hook useControlAccesoGestion.
 * Define la configuración inicial para gestión de control de acceso.
 */
interface UseControlAccesoGestionProps {
  roles: RolSimpleInterface[]; // Lista de roles disponibles.
  itemsIniciales: ModuloAsignacionInterface[] | PestanaAsignacionInterface[]; // Items iniciales (módulos o pestañas).
  initialRolId?: number | null; // ID del rol inicial.
  tipo: "modulos" | "pestanas"; // Tipo de items a gestionar.
}

/**
 * Hook principal para gestión de control de acceso.
 * Maneja estado de rol seleccionado, items cargados, loading y navegación.
 * Proporciona funciones para cambiar rol y cargar items dinámicamente.
 * 
 * @param {UseControlAccesoGestionProps} props - Props del hook.
 * @returns {Object} Objeto con estado y funciones.
 * @property {number | null} selectedRolId - ID del rol seleccionado.
 * @property {ModuloAsignacionInterface[] | PestanaAsignacionInterface[]} items - Items cargados.
 * @property {boolean} loadingItems - Estado de carga.
 * @property {(rolId: number) => void} handleRolChange - Función para cambiar rol.
 * @property {(rolId: number) => Promise<void>} loadItemsForRol - Función para cargar items.
 */
export function useControlAccesoGestion({
  roles,
  itemsIniciales,
  initialRolId = null,
  tipo,
}: UseControlAccesoGestionProps) {
  const { toast } = useToast();

  const [selectedRolId, setSelectedRolId] = useState<number | null>(initialRolId);
  const [items, setItems] = useState<ModuloAsignacionInterface[] | PestanaAsignacionInterface[]>(itemsIniciales);
  const [loadingItems, setLoadingItems] = useState(false);

  // Función para navegar programáticamente.
  const navigateTo = (url: string) => {
    window.history.pushState({}, "", url);
  };

  // Efecto para manejar navegación del navegador (botón atrás/adelante).
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const rutaBase = tipo === "modulos" ? "/accesos-modulos/" : "/accesos-pestanas/";
      const rolMatch = path.match(new RegExp(`${rutaBase}(\\d+)`));

      if (rolMatch) {
        const rolId = Number(rolMatch[1]);
        setSelectedRolId(rolId);
        loadItemsForRol(rolId);
      } else {
        setSelectedRolId(null);
        setItems(itemsIniciales);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [itemsIniciales, tipo]);

  // Función para cargar items (módulos o pestañas) para un rol específico.
  const loadItemsForRol = async (rolId: number) => {
    setLoadingItems(true);
    const rutaCargar = tipo === "modulos"
      ? route("control-acceso.cargar-modulos", rolId)
      : route("control-acceso.cargar-pestanas", rolId);

    const dataKey = tipo === "modulos" ? "modulos" : "pestanas";

    try {
      const response = await fetch(rutaCargar, {
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data[dataKey]);
      } else {
        toast({
          title: "Error",
          description: `No se pudieron cargar ${tipo === "modulos" ? "los módulos" : "las pestañas"}`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoadingItems(false);
    }
  };

  // Función para manejar cambio de rol: actualiza estado, navega y carga items.
  const handleRolChange = (rolId: number) => {
    setSelectedRolId(rolId);
    const rutaRol = tipo === "modulos"
      ? route("control-acceso.modulos.rol", rolId)
      : route("control-acceso.pestanas.rol", rolId);

    navigateTo(rutaRol);
    loadItemsForRol(rolId);
  };

  return {
    selectedRolId,
    items,
    loadingItems,
    handleRolChange,
    loadItemsForRol
  };
}
