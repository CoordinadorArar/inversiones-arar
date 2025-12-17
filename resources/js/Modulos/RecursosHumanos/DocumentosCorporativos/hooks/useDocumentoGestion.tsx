/**
 * Hook personalizado useDocumentoGestion.
 * 
 * Maneja la lógica de negocio para gestión de documentos corporativos: selección, creación, edición, eliminación.
 * Incluye manejo de permisos, navegación, estado de formulario y llamadas a API con archivos.
 * Usa useState, useEffect y useMemo para gestionar estado reactivo.
 * Se integra con React para gestión de documentos via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */

import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentoCorporativoInterface } from "../types/documentoInterface";
import { DocumentoFormData } from "../types/documentoForm.types";

/**
 * Interfaz para las props del hook useDocumentoGestion.
 * Define los parámetros necesarios para configurar el hook de gestión de documentos.
 */
interface UseDocumentoGestionProps {
  documentosIniciales: DocumentoCorporativoInterface[]; // Lista inicial de documentos desde el backend.
  permisos: string[]; // Lista de permisos del usuario.
  initialMode?: "idle" | "create" | "edit"; // Modo inicial.
  initialDocumentoId?: number | null; // ID inicial del documento seleccionado.
}

/**
 * Hook useDocumentoGestion.
 * 
 * Gestiona estado de documentos, permisos, navegación y operaciones CRUD con archivos.
 * Proporciona handlers para interacciones de UI y llamadas a API.
 * 
 * @param {UseDocumentoGestionProps} props - Props del hook.
 * @returns {Object} Objeto con estado y handlers para gestión de documentos.
 */
export function useDocumentoGestion({
  documentosIniciales,
  permisos,
  initialMode = "idle",
  initialDocumentoId = null,
}: UseDocumentoGestionProps) {
  // Aquí se usa useToast para mostrar notificaciones.
  const { toast } = useToast();

  // Aquí se calculan permisos basados en la lista proporcionada.
  const puedeCrear = permisos.includes("crear");
  const puedeEditar = permisos.includes("editar");
  const puedeEliminar = permisos.includes("eliminar");

  // Aquí se usa useState para almacenar la lista de documentos (actualizable).
  const [documentos, setDocumentos] = useState<DocumentoCorporativoInterface[]>(documentosIniciales);

  // Aquí se usa useState para el ID del documento seleccionado.
  const [selectedDocumentoId, setSelectedDocumentoId] = useState<number | null>(initialDocumentoId);

  // Aquí se usa useState para el modo actual (idle, create, edit).
  const [mode, setMode] = useState<"idle" | "create" | "edit">(initialMode);

  // Aquí se usa useState para errores del formulario.
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Aquí se encuentra el documento seleccionado basado en el ID.
  const selectedDocumento = documentos.find((d) => d.id === selectedDocumentoId);

  // Aquí se usa useMemo para generar opciones de documentos para el selector (solo recalcula si documentos cambia).
  const documentoOptions = useMemo(
    () =>
      documentos.map((documento) => ({
        value: documento.id.toString(),
        label: documento.nombre,
      })),
    [documentos]
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
        setSelectedDocumentoId(null);
        setFormErrors({});
      } else if (path.includes("/gestion/")) {
        const idMatch = path.match(/\/gestion\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          setMode("edit");
          setSelectedDocumentoId(id);
          setFormErrors({});
        }
      } else {
        setMode("idle");
        setSelectedDocumentoId(null);
        setFormErrors({});
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /**
   * Handler para seleccionar un documento en el dropdown.
   * Cambia modo a edit y navega a la ruta de edición.
   * 
   * @param {string | number} value - ID del documento seleccionado.
   */
  const handleSelectDocumento = (value: string | number) => {
    const id = Number(value);
    setSelectedDocumentoId(id);
    setMode("edit");
    setFormErrors({});
    navigateTo(route("documento.edit", id));
  };

  /**
   * Handler para crear un nuevo documento.
   * Cambia modo a create y navega a la ruta de creación.
   */
  const handleCreateNew = () => {
    setSelectedDocumentoId(null);
    setMode("create");
    setFormErrors({});
    navigateTo(route("documento.create"));
  };

  /**
   * Handler para cancelar la operación actual.
   * Resetea estado y navega a la ruta de gestión.
   */
  const handleCancel = () => {
    setMode("idle");
    setSelectedDocumentoId(null);
    setFormErrors({});
    navigateTo(route("documento.gestion"));
  };

  /**
   * Handler para submit del formulario (crear/editar).
   * Valida permisos, hace llamada a API con FormData para archivos y actualiza estado local.
   * 
   * @param {DocumentoFormData} data - Datos del formulario.
   */
  const handleSubmit = async (data: DocumentoFormData) => {

    // Aquí se valida permisos antes de proceder.
    if (!puedeCrear && mode === "create") {
      toast({
        title: "Sin permisos",
        description: "No tienes permiso para crear documentos",
        variant: "destructive",
      });
      return;
    }

    if (!puedeEditar && mode === "edit") {
      toast({
        title: "Sin permisos",
        description: "No tienes permiso para editar documentos",
        variant: "destructive",
      });
      return;
    }

    setFormErrors({});

    try {
      // Aquí se determina la URL y método basado en el modo.
      const url =
        mode === "create"
          ? route("documento.store")
          : route("documento.update", selectedDocumentoId);

      // Aquí se prepara el FormData para enviar archivos y datos.
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("icono", data.icono || "");
      formData.append("mostrar_en_dashboard", data.mostrar_en_dashboard ? "1": "0" );
      formData.append("mostrar_en_footer", data.mostrar_en_footer ? "1": "0" );

      if (data.archivo) {
        formData.append("archivo", data.archivo);
      }

      // Aquí se hace la llamada a API con fetch usando FormData.
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "X-CSRF-TOKEN":
            document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
        body: formData,
      });

      const responseData = await response.json();


      if (response.ok) {
        // Éxito: Actualiza array local y muestra toast.
        toast({
          title: mode === "create" ? "Documento creado" : "Documento actualizado",
          description: responseData.message,
          variant: "success",
        });

        // Aquí se actualiza el estado local de documentos y navega según el modo.
        if (mode === "create") {
          setDocumentos((prev) => [responseData.documento, ...prev]);
          if (puedeEditar) {
            setSelectedDocumentoId(Number(responseData.documento.id));
            setMode("edit");
            navigateTo(route("documento.edit", responseData.documento.id));
          } else {
            setMode("create");
            navigateTo(route("documento.create"));
          }
        } else {
          setDocumentos((prev) =>
            prev.map((d) => (d.id === responseData.documento.id ? responseData.documento : d))
          );
        }
      } else if (response.status === 422) {
        // Errores de validación: setea en estado.
        setFormErrors(responseData.errors || {});

        toast({
          title: "Error de validación",
          description: "Revisa los campos marcados e intenta de nuevo",
          variant: "destructive",
        });
      } else if (response.status === 403) {
        // Sin permisos.
        toast({
          title: "Acceso denegado",
          description: responseData.error || "No tienes permisos para esta acción",
          variant: "destructive",
        });
      } else {
        // Otros errores.
        toast({
          title: "Error",
          description: responseData.error || "Intenta de nuevo más tarde",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      // Aquí se maneja errores en el submit.
      console.error("Error:", error);  // Log para debugging (como en empresas).
      toast({
        title: "Error de conexión",
        description: "Revisa tu conexión e intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  /**
   * Handler para eliminar un documento.
   * Valida permisos, hace llamada a API y actualiza estado local.
   */
  const handleDelete = async () => {
    if (!selectedDocumentoId || !puedeEliminar) return;

    try {
      // Aquí se hace la llamada a API para eliminar.
      const response = await fetch(route("documento.destroy", selectedDocumentoId), {
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
        title: "Documento eliminado",
        description: responseData.message,
        variant: "success",
      });

      // Aquí se actualiza el estado local: remueve el documento, resetea selección y navega.
      setDocumentos((prev) => prev.filter((d) => d.id !== selectedDocumentoId));
      setSelectedDocumentoId(null);
      setMode("idle");
      navigateTo(route("documento.gestion"));
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
    documentos, // Lista actual de documentos.
    selectedDocumentoId, // ID del documento seleccionado.
    selectedDocumento, // Objeto del documento seleccionado.
    mode, // Modo actual (idle, create, edit).
    formErrors, // Errores del formulario.
    isFormDisabled, // Indica si el formulario está deshabilitado.
    documentoOptions, // Opciones para el selector de documentos.
    puedeCrear, // Booleano: si puede crear.
    puedeEditar, // Booleano: si puede editar.
    puedeEliminar, // Booleano: si puede eliminar.
    handleSelectDocumento, // Handler para seleccionar documento.
    handleCreateNew, // Handler para crear nuevo.
    handleCancel, // Handler para cancelar.
    handleSubmit, // Handler para submit.
    handleDelete, // Handler para eliminar.
  };
}