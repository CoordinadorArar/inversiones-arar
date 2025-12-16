import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ModuloAsignacionInterface, PestanaAsignacionInterface, RolSimpleInterface } from "../types/controlAccesoInterface";

interface UseControlAccesoGestionProps {
  roles: RolSimpleInterface[];
  itemsIniciales: ModuloAsignacionInterface[] | PestanaAsignacionInterface[];
  initialRolId?: number | null;
  tipo: "modulos" | "pestanas";
}

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

  // const selectedRol = roles.find((r) => r.id === selectedRolId);

  const navigateTo = (url: string) => {
    window.history.pushState({}, "", url);
  };

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