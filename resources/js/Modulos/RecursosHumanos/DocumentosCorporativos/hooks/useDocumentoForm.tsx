/**
 * Hook personalizado useDocumentoForm.
 * 
 * Maneja la lógica de formulario para documentos corporativos: estado de datos, validaciones con Zod, manejo de archivos y diálogo de eliminación.
 * Incluye efectos para sincronizar errores externos y datos iniciales, y handlers para cambios en campos.
 * Usa useState y useEffect para gestionar estado reactivo y validaciones.
 * Se integra con React para gestión de formularios via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DocumentoFormData,
  DOCUMENTO_INITIAL_DATA,
  createDocumentoSchema,
} from "../types/documentoForm.types";

/**
 * Interfaz para las props del hook useDocumentoForm.
 * Define los parámetros necesarios para configurar el hook de formulario de documentos.
 */
interface UseDocumentoFormProps {
  mode: "create" | "edit"; // Modo del formulario: crear o editar.
  initialData?: Partial<DocumentoFormData>; // Datos iniciales para el formulario.
  disabled?: boolean; // Indica si el formulario está deshabilitado.
  onSubmit: (data: DocumentoFormData) => Promise<void>; // Callback para submit del formulario.
  onDelete?: () => Promise<void>; // Callback opcional para eliminación.
  externalErrors?: Record<string, string>; // Errores externos para mostrar.
}

/**
 * Hook useDocumentoForm.
 * 
 * Gestiona estado del formulario, validaciones, procesamiento y diálogo de eliminación.
 * Proporciona handlers para interacciones de UI y llamadas a callbacks.
 * 
 * @param {UseDocumentoFormProps} props - Props del hook.
 * @returns {Object} Objeto con estado y handlers para gestión del formulario.
 */
export function useDocumentoForm({
  mode,
  initialData,
  disabled = false,
  onSubmit,
  onDelete,
  externalErrors = {},
}: UseDocumentoFormProps) {
  // Aquí se usa useToast para mostrar notificaciones.
  const { toast } = useToast();

  // Aquí se usa useState para almacenar los datos del formulario.
  const [data, setData] = useState<DocumentoFormData>({
    ...DOCUMENTO_INITIAL_DATA,
    ...initialData,
  });

  // Aquí se usa useState para almacenar errores de validación.
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Aquí se usa useState para indicar si está procesando (submit o eliminación).
  const [processing, setProcessing] = useState(false);

  // Aquí se usa useState para controlar la visibilidad del diálogo de eliminación.
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Aquí se usa useEffect para sincronizar errores externos con el estado local.
  useEffect(() => {
    if (Object.keys(externalErrors).length > 0) {
      setErrors(externalErrors);
    }
  }, [externalErrors]);

  // Aquí se usa useEffect para actualizar datos iniciales cuando cambian.
  useEffect(() => {
    if (initialData) {
      setData({
        ...DOCUMENTO_INITIAL_DATA,
        ...initialData,
      });
    }
  }, [initialData]);

  // Aquí se usa useEffect para limpiar errores cuando cambia el modo o datos iniciales.
  useEffect(() => {
    setErrors({});
  }, [mode, initialData]);

  /**
   * Handler para cambios en campos del formulario.
   * Actualiza el estado y limpia errores del campo si existían.
   * 
   * @param {keyof DocumentoFormData} field - Campo que cambió.
   * @param {any} value - Nuevo valor del campo.
   */
  const handleChange = (field: keyof DocumentoFormData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Handler para cambios en el archivo.
   * Actualiza el estado del archivo y limpia errores si existían.
   * 
   * @param {File | null} file - Archivo seleccionado o null.
   */
  const handleArchivoChange = (file: File | null) => {
    setData((prev) => ({
      ...prev,
      archivo: file,
    }));

    if (errors.archivo) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.archivo;
        return newErrors;
      });
    }
  };

  /**
   * Handler para remover el archivo.
   * Resetea el archivo y preview en el estado.
   */
  const handleArchivoRemove = () => {
    setData((prev) => ({
      ...prev,
      archivo: null,
      archivo_preview: null,
    }));
  };

  /**
   * Handler para submit del formulario.
   * Valida con Zod, muestra errores si hay, y llama al callback onSubmit.
   * 
   * @param {React.FormEvent} e - Evento del formulario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled || processing) return;

    // Aquí se valida el formulario usando el esquema de Zod.
    const validation = createDocumentoSchema(data, mode).safeParse(data);

    if (!validation.success) {
      const zodErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          zodErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(zodErrors);

      toast({
        title: "Errores de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setErrors({});

    try {
      await onSubmit(data);
    } catch (error: any) {
      console.error("Error en submit:", error);
    } finally {
      setProcessing(false);
    }
  };

  /**
   * Handler para clic en eliminar.
   * Muestra el diálogo de confirmación.
   */
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  /**
   * Handler para cancelar eliminación.
   * Oculta el diálogo de confirmación.
   */
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  /**
   * Handler para confirmar eliminación.
   * Llama al callback onDelete y oculta el diálogo.
   */
  const handleDeleteConfirm = async () => {
    if (!onDelete) return;

    setProcessing(true);
    try {
      await onDelete();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setProcessing(false);
    }
  };

  // Aquí se retorna el objeto con estado y handlers para usar en el componente.
  return {
    data, // Datos actuales del formulario.
    errors, // Errores de validación.
    processing, // Indica si está procesando.
    showDeleteDialog, // Indica si mostrar diálogo de eliminación.
    handleChange, // Handler para cambios en campos.
    handleArchivoChange, // Handler para cambios en archivo.
    handleArchivoRemove, // Handler para remover archivo.
    handleSubmit, // Handler para submit.
    handleDeleteClick, // Handler para clic en eliminar.
    handleDeleteCancel, // Handler para cancelar eliminación.
    handleDeleteConfirm, // Handler para confirmar eliminación.
    setErrors, // Función para setear errores manualmente.
  };
}