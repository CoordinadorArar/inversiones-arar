/**
 * Hook personalizado useModuloGestion.
 * 
 * Maneja la lógica de negocio para gestión de módulos: selección, creación, edición, eliminación.
 * Incluye manejo de permisos, navegación, estado de formulario y llamadas a API.
 * Usa useState, useEffect y useMemo para gestionar estado reactivo.
 * Se integra con React para gestión de módulos via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-11
 */

import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { ModuloInterface } from "../types/moduloInterface";
import { ModuloFormData } from "../types/moduloForm.types";

/**
 * Interfaz para las props del hook useModuloGestion.
 * Define los parámetros necesarios para configurar el hook de gestión de módulos.
 */
interface UseModuloGestionProps {
  modulosIniciales: ModuloInterface[]; // Lista inicial de módulos desde el backend.
  permisos: string[]; // Lista de permisos del usuario.
  initialMode?: "idle" | "create" | "edit"; // Modo inicial.
  initialModuloId?: number | null; // ID inicial del módulo seleccionado.
}

/**
 * Hook useModuloGestion.
 * 
 * Gestiona estado de módulos, permisos, navegación y operaciones CRUD.
 * Proporciona handlers para interacciones de UI y llamadas a API.
 * 
 * @param {UseModuloGestionProps} props - Props del hook.
 * @returns {Object} Objeto con estado y handlers para gestión de módulos.
 */
export function useModuloGestion({
  modulosIniciales,
  permisos,
  initialMode = "idle",
  initialModuloId = null,
}: UseModuloGestionProps) {
  // Aquí se usa useToast para mostrar notificaciones.
  const { toast } = useToast();

  // Aquí se calculan permisos basados en la lista proporcionada.
  const puedeCrear = permisos.includes("crear");
  const puedeEditar = permisos.includes("editar");
  const puedeEliminar = permisos.includes("eliminar");

  // Aquí se usa useState para almacenar la lista de módulos (actualizable).
  const [modulos, setModulos] = useState<ModuloInterface[]>(modulosIniciales);

  // Aquí se usa useState para el ID del módulo seleccionado.
  const [selectedModuloId, setSelectedModuloId] = useState<number | null>(initialModuloId);

  // Aquí se usa useState para el modo actual (idle, create, edit).
  const [mode, setMode] = useState<"idle" | "create" | "edit">(initialMode);

  // Aquí se usa useState para errores del formulario.
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Aquí se encuentra el módulo seleccionado basado en el ID.
  const selectedModulo = modulos.find((m) => m.id === selectedModuloId);

  // Aquí se usa useMemo para generar opciones de módulos para el selector (solo recalcula si modulos cambia).
  const moduloOptions = useMemo(
    () =>
      modulos.map((modulo) => ({
        value: modulo.id.toString(),
        label: `${modulo.nombre} (${modulo.ruta_completa})`,
      })),
    [modulos]
  );

  // Aquí se determina si el formulario está deshabilitado (modo idle).
  const isFormDisabled = mode === "idle";

  // Función helper para navegación usando history API.
  const navigateTo = (url: string, state: any = {}) => {
    window.history.pushState(state, "", url);
  };

  // Aquí se usa useEffect para manejar navegación con popstate (botón atrás/adelante).
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

  /**
   * Handler para seleccionar un módulo en el dropdown.
   * Cambia modo a edit y navega a la ruta de edición.
   * 
   * @param {string | number} value - ID del módulo seleccionado.
   */
  const handleSelectModulo = (value: string | number) => {
    const id = Number(value);
    setSelectedModuloId(id);
    setMode("edit");
    setFormErrors({});
    navigateTo(route("modulo.edit", id));
  };

  /**
   * Handler para crear un nuevo módulo.
   * Cambia modo a create y navega a la ruta de creación.
   */
  const handleCreateNew = () => {
    setSelectedModuloId(null);
    setMode("create");
    setFormErrors({});
    navigateTo(route("modulo.create"));
  };

  /**
   * Handler para cancelar la operación actual.
   * Resetea estado y navega a la ruta de gestión.
   */
  const handleCancel = () => {
    setMode("idle");
    setSelectedModuloId(null);
    setFormErrors({});
    navigateTo(route("modulo.gestion"));
  };

  /**
   * Handler para submit del formulario (crear/editar).
   * Valida permisos, hace llamada a API y actualiza estado local.
   * 
   * @param {ModuloFormData} data - Datos del formulario.
   */
  const handleSubmit = async (data: ModuloFormData) => {
    // Aquí se valida permisos antes de proceder.
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
      // Aquí se determina la URL y método basado en el modo.
      const url =
        mode === "create"
          ? route("modulo.store")
          : route("modulo.update", selectedModuloId);

      // Aquí se prepara el payload, convirtiendo permisos_extra a array.
      const payload = {
        ...data,
        permisos_extra: data.permisos_extra
          ? data.permisos_extra.split(",").map((p) => p.trim()).filter(Boolean)
          : [],
      };

      // Aquí se hace la llamada a API con fetch.
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
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

      // Aquí se muestra toast de éxito.
      toast({
        title: mode === "create" ? "Módulo creado" : "Módulo actualizado",
        description: responseData.message,
        variant: "success",
      });

      // Aquí se actualiza el estado local de módulos y navega según el modo.
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
      // Aquí se maneja errores en el submit.
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  /**
   * Handler para eliminar un módulo.
   * Valida permisos, hace llamada a API y actualiza estado local.
   */
  const handleDelete = async () => {
    if (!selectedModuloId || !puedeEliminar) return;

    try {
      // Aquí se hace la llamada a API para eliminar.
      const response = await fetch(route("modulo.destroy", selectedModuloId), {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN":
            document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Error al eliminar");
      }

      // Aquí se muestra toast de éxito.
      toast({
        title: "Módulo eliminado",
        description: responseData.message,
        variant: "success",
      });

      // Aquí se actualiza el estado local: remueve el módulo, resetea selección y navega.
      setModulos((prev) => prev.filter((m) => m.id !== selectedModuloId));
      setSelectedModuloId(null);
      setMode("idle");
      navigateTo(route("modulo.gestion"));
    } catch (error: any) {
      // Aquí se maneja errores en la eliminación.
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Aquí se retorna el objeto con estado y handlers para usar en el componente.
  return {
    modulos, // Lista actual de módulos.
    selectedModuloId, // ID del módulo seleccionado.
    selectedModulo, // Objeto del módulo seleccionado.
    mode, // Modo actual (idle, create, edit).
    formErrors, // Errores del formulario.
    isFormDisabled, // Indica si el formulario está deshabilitado.
    moduloOptions, // Opciones para el selector de módulos.
    puedeCrear, // Booleano: si puede crear.
    puedeEditar, // Booleano: si puede editar.
    puedeEliminar, // Booleano: si puede eliminar.
    handleSelectModulo, // Handler para seleccionar módulo.
    handleCreateNew, // Handler para crear nuevo.
    handleCancel, // Handler para cancelar.
    handleSubmit, // Handler para submit.
    handleDelete, // Handler para eliminar.
  };
}