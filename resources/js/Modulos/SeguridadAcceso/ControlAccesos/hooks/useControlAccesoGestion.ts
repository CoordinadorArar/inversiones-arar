import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ModuloAsignacionInterface, RolSimpleInterface } from "../types/controlAccesoInterface";

interface UseControlAccesoGestionProps {
  roles: RolSimpleInterface[]; // Lista de roles
  modulosIniciales: ModuloAsignacionInterface[]; // Módulos iniciales (sin rol seleccionado)
  initialRolId?: number | null;
}

export function useControlAccesoGestion({
  roles,
  modulosIniciales,
  initialRolId = null,
}: UseControlAccesoGestionProps) {
  const { toast } = useToast();

  const [selectedRolId, setSelectedRolId] = useState<number | null>(initialRolId);
  const [modulos, setModulos] = useState<ModuloAsignacionInterface[]>(modulosIniciales);
  const [loadingModulos, setLoadingModulos] = useState(false);

  const selectedRol = roles.find((r) => r.id === selectedRolId);

  const navigateTo = (url: string) => {
    window.history.pushState({}, "", url);
  };

  // Sincroniza con URL
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const rolMatch = path.match(/\/accesos-modulos\/(\d+)/);
      if (rolMatch) {
        const rolId = Number(rolMatch[1]);
        setSelectedRolId(rolId);
        loadModulosForRol(rolId); // Carga módulos al cambiar URL
      } else {
        setSelectedRolId(null);
        setModulos(modulosIniciales); // Reset a iniciales
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [modulosIniciales]);

  // Función para cargar módulos dinámicamente por rol
  const loadModulosForRol = async (rolId: number) => {
    setLoadingModulos(true);
    try {
      const response = await fetch(route("control-acceso.cargar-modulos", rolId), {
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setModulos(data.modulos);
      } else {
        toast({ title: "Error", description: "No se pudieron cargar los módulos", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoadingModulos(false);
    }
  };

  const handleRolChange = (rolId: number) => {
    setSelectedRolId(rolId);
    navigateTo(route("control-acceso.modulos.rol", rolId)); // Cambia URL sin recargar
    loadModulosForRol(rolId); // Carga módulos
  };

  return {
    selectedRolId,
    selectedRol,
    modulos,
    loadingModulos,
    handleRolChange,
    loadModulosForRol
  };
}