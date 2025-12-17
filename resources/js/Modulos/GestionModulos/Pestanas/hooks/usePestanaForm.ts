/**
 * Hook usePestanaForm.
 * 
 * Hook personalizado para manejar la lógica del formulario de pestañas.
 * Gestiona estado de datos, errores, procesamiento y operaciones CRUD.
 * Sincroniza datos iniciales y errores externos del backend con el estado local.
 * Proporciona handlers para cambios, envío, eliminación y validaciones.
 * Implementa limpieza automática de errores al cambiar campos o modo de formulario.
 * 
 * @author Yariangel Aray
 * @date 2025-12-12
 */

import { useState, useEffect } from "react";
import { PestanaFormData, PESTANA_INITIAL_DATA } from "../types/pestanaForm.types";

/**
 * Interfaz para las props del hook usePestanaForm.
 * Define la configuración y callbacks necesarios para el formulario.
 */
interface UsePestanaFormProps {
  mode: "create" | "edit"; // Modo de operación del formulario.
  initialData?: Partial<PestanaFormData>; // Datos iniciales para poblar el formulario.
  disabled?: boolean; // Estado de deshabilitación del formulario.
  onSubmit: (data: PestanaFormData) => Promise<void>; // Callback asíncrono para enviar datos.
  onDelete?: () => Promise<void>; // Callback asíncrono opcional para eliminar pestaña.
  externalErrors?: Record<string, string>; // Errores provenientes del backend.
}

/**
 * Hook personalizado para gestionar el formulario de pestañas.
 * Maneja estado, validaciones, sincronización con props y operaciones async.
 * 
 * @param {UsePestanaFormProps} props - Configuración del hook.
 * @returns {Object} Estado y handlers del formulario.
 */
export function usePestanaForm({
  mode,
  initialData,
  disabled = false,
  onSubmit,
  onDelete,
  externalErrors = {},
}: UsePestanaFormProps) {

  // Aquí se inicializa el estado de datos del formulario combinando valores por defecto e iniciales.
  const [data, setData] = useState<PestanaFormData>({
    ...PESTANA_INITIAL_DATA,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Aquí se sincronizan errores externos del backend con el estado local.
  useEffect(() => {
    if (Object.keys(externalErrors).length > 0) {
      setErrors(externalErrors);
    }
  }, [externalErrors]);

  // Aquí se actualizan los datos cuando cambian las props de initialData.
  useEffect(() => {
    if (initialData) {
      setData({
        ...PESTANA_INITIAL_DATA,
        ...initialData,
      });
    }
  }, [initialData]);

  // Aquí se limpian los errores al cambiar el modo o los datos iniciales.
  useEffect(() => {
    setErrors({});
  }, [mode, initialData]);

  /**
   * Maneja cambios en los campos del formulario.
   * Actualiza el estado de datos y limpia errores del campo modificado.
   * 
   * @param {keyof PestanaFormData} field - Campo del formulario a actualizar.
   * @param {any} value - Nuevo valor del campo.
   */
  const handleChange = (field: keyof PestanaFormData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));

    // Aquí se elimina el error del campo cuando el usuario lo modifica.
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Maneja el envío del formulario.
   * Previene envío si está deshabilitado o procesando, ejecuta callback de submit.
   * 
   * @param {React.FormEvent} e - Evento del formulario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled || processing) return;

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
   * Abre el diálogo de confirmación para eliminar pestaña.
   */
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  /**
   * Cancela la operación de eliminación y cierra el diálogo.
   */
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  /**
   * Confirma y ejecuta la eliminación de la pestaña.
   * Cierra el diálogo tras completar la operación exitosamente.
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

  // Aquí se retornan estados y handlers para uso en el componente de formulario.
  return {
    data,
    errors,
    processing,
    showDeleteDialog,
    handleChange,
    handleSubmit,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    setErrors,
  };
}