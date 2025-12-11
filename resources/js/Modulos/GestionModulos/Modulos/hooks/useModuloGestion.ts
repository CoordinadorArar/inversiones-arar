import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { ModuloInterface } from "../types/moduloInterface";
import { ModuloFormData } from "../types/moduloForm.types";

interface UseModuloGestionProps {
  modulosIniciales: ModuloInterface[];
  permisos: string[];
  initialMode?: "idle" | "create" | "edit";
  initialModuloId?: number | null;
}

export function useModuloGestion({
  modulosIniciales,
  permisos,
  initialMode = "idle",
  initialModuloId = null,
}: UseModuloGestionProps) {
  const { toast } = useToast();

  const puedeCrear = permisos.includes("crear");
  const puedeEditar = permisos.includes("editar");

  const [modulos, setModulos] = useState<ModuloInterface[]>(modulosIniciales);
  const [selectedModuloId, setSelectedModuloId] = useState<number | null>(initialModuloId);
  const [mode, setMode] = useState<"idle" | "create" | "edit">(initialMode);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedModulo = modulos.find((m) => m.id === selectedModuloId);

  const moduloOptions = useMemo(
    () =>
      modulos.map((modulo) => ({
        value: modulo.id.toString(),
        label: `${modulo.nombre} (${modulo.ruta_completa})`,
      })),
    [modulos]
  );

  const isFormDisabled = mode === "idle";

  const navigateTo = (url: string, state: any = {}) => {
    window.history.pushState(state, "", url);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;

      if (path.includes("/crear")) {
        setMode("create");
        setSelectedModuloId(null);
        setFormErrors({});
      } else if (path.includes("/gestion/")) {
        const idMatch = path.match(/\/gestion\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          setMode("edit");
          setSelectedModuloId(id);
          setFormErrors({});
        }
      } else {
        setMode("idle");
        setSelectedModuloId(null);
        setFormErrors({});
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectModulo = (value: string | number) => {
    const id = Number(value);
    setSelectedModuloId(id);
    setMode("edit");
    setFormErrors({});
    navigateTo(route("modulo.edit", id));
  };

  const handleCreateNew = () => {
    setSelectedModuloId(null);
    setMode("create");
    setFormErrors({});
    navigateTo(route("modulo.create"));
  };

  const handleCancel = () => {
    setMode("idle");
    setSelectedModuloId(null);
    setFormErrors({});
    navigateTo(route("modulo.gestion"));
  };

  const handleSubmit = async (data: ModuloFormData) => {
    if (!puedeCrear && mode === "create") {
      toast({
        title: "Sin permisos",
        description: "No tienes permiso para crear módulos",
        variant: "destructive",
      });
      return;
    }

    if (!puedeEditar && mode === "edit") {
      toast({
        title: "Sin permisos",
        description: "No tienes permiso para editar módulos",
        variant: "destructive",
      });
      return;
    }

    setFormErrors({});

    try {
      const url =
        mode === "create"
          ? route("modulo.store")
          : route("modulo.update", selectedModuloId);

      // Convertir permisos_extra de string a array
      const payload = {
        ...data,
        permisos_extra: data.permisos_extra
          ? data.permisos_extra.split(",").map((p) => p.trim()).filter(Boolean)
          : [],
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN":
            document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors) {
          setFormErrors(responseData.errors);
        }
        throw new Error(responseData.error || "Error al guardar");
      }

      toast({
        title: mode === "create" ? "Módulo creado" : "Módulo actualizado",
        description: responseData.message,
        variant: "success",
      });

      if (mode === "create") {
        setModulos((prev) => [responseData.modulo, ...prev]);
        if (puedeEditar) {
          setSelectedModuloId(Number(responseData.modulo.id));
          setMode("edit");
          navigateTo(route("modulo.edit", responseData.modulo.id));
        } else {
          setMode("create");
          navigateTo(route("modulo.create"));
        }
      } else {
        setModulos((prev) =>
          prev.map((m) => (m.id === responseData.modulo.id ? responseData.modulo : m))
        );
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    modulos,
    selectedModuloId,
    selectedModulo,
    mode,
    formErrors,
    isFormDisabled,
    moduloOptions,
    puedeCrear,
    puedeEditar,
    handleSelectModulo,
    handleCreateNew,
    handleCancel,
    handleSubmit,
  };
}