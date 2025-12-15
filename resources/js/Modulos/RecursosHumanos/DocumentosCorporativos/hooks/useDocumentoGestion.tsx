import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentoCorporativoInterface } from "../types/documentoInterface";
import { DocumentoFormData } from "../types/documentoForm.types";

interface UseDocumentoGestionProps {
  documentosIniciales: DocumentoCorporativoInterface[];
  permisos: string[];
  initialMode?: "idle" | "create" | "edit";
  initialDocumentoId?: number | null;
}

export function useDocumentoGestion({
  documentosIniciales,
  permisos,
  initialMode = "idle",
  initialDocumentoId = null,
}: UseDocumentoGestionProps) {
  const { toast } = useToast();

  const puedeCrear = permisos.includes("crear");
  const puedeEditar = permisos.includes("editar");
  const puedeEliminar = permisos.includes("eliminar");

  const [documentos, setDocumentos] = useState<DocumentoCorporativoInterface[]>(documentosIniciales);
  const [selectedDocumentoId, setSelectedDocumentoId] = useState<number | null>(initialDocumentoId);
  const [mode, setMode] = useState<"idle" | "create" | "edit">(initialMode);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedDocumento = documentos.find((d) => d.id === selectedDocumentoId);

  const documentoOptions = useMemo(
    () =>
      documentos.map((documento) => ({
        value: documento.id.toString(),
        label: documento.nombre,
      })),
    [documentos]
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

  const handleSelectDocumento = (value: string | number) => {
    const id = Number(value);
    setSelectedDocumentoId(id);
    setMode("edit");
    setFormErrors({});
    navigateTo(route("documento.edit", id));
  };

  const handleCreateNew = () => {
    setSelectedDocumentoId(null);
    setMode("create");
    setFormErrors({});
    navigateTo(route("documento.create"));
  };

  const handleCancel = () => {
    setMode("idle");
    setSelectedDocumentoId(null);
    setFormErrors({});
    navigateTo(route("documento.gestion"));
  };

  const handleSubmit = async (data: DocumentoFormData) => {
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
      const url =
        mode === "create"
          ? route("documento.store")
          : route("documento.update", selectedDocumentoId);

      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("icono", data.icono || "");
      formData.append("mostrar_en_dashboard", data.mostrar_en_dashboard ? "1": "0" );
      formData.append("mostrar_en_footer", data.mostrar_en_footer ? "1": "0" );

      if (data.archivo) {
        formData.append("archivo", data.archivo);
      }

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

        // Actualiza array local en lugar de recargar página.
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedDocumentoId || !puedeEliminar) return;

    try {
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

      toast({
        title: "Documento eliminado",
        description: responseData.message,
        variant: "success",
      });

      setDocumentos((prev) => prev.filter((d) => d.id !== selectedDocumentoId));
      setSelectedDocumentoId(null);
      setMode("idle");
      navigateTo(route("documento.gestion"));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    documentos,
    selectedDocumentoId,
    selectedDocumento,
    mode,
    formErrors,
    isFormDisabled,
    documentoOptions,
    puedeCrear,
    puedeEditar,
    puedeEliminar,
    handleSelectDocumento,
    handleCreateNew,
    handleCancel,
    handleSubmit,
    handleDelete,
  };
}