/**
 * Hook useTipoForm.
 * 
 * Maneja la lógica interna del formulario de tipos: validaciones con Zod,
 * estado local de datos y errores, handlers para cambios y envío, y efectos para focus y errores externos.
 * Se usa en componentes de formulario para simplificar la gestión de estado y validaciones.
 * 
 * @author Yariangel Aray
 * @date 2025-12-03
 */
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { TipoFormData, tipoSchema } from "../types/tipoForm.types";

/**
 * Datos iniciales por defecto para el formulario de tipos.
 * Usados para resetear o inicializar el estado.
 */
const INITIAL_DATA: TipoFormData = {
  nombre: "",
  abreviatura: "",
};

/**
 * Interfaz para las props del hook useTipoForm.
 * Define los parámetros necesarios para configurar el comportamiento del formulario.
 * @typedef {Object} UseTipoFormProps
 * @property {"create" | "edit"} mode - Modo del formulario (crear o editar).
 * @property {Partial<TipoFormData>} [initialData] - Datos iniciales opcionales para prellenar el formulario.
 * @property {(data: TipoFormData) => Promise<void>} onSubmit - Función a llamar al enviar datos válidos.
 * @property {() => void} onCancel - Función a llamar al cancelar.
 * @property {Record<string, string>} [externalErrors] - Errores externos opcionales (ej. del backend).
 * @property {boolean} [processing] - Indica si hay un proceso en curso (ej. envío).
 */

interface UseTipoFormProps {
  mode: "create" | "edit";
  initialData?: Partial<TipoFormData>;
  onSubmit: (data: TipoFormData) => Promise<void>;
  onCancel: () => void;
  externalErrors?: Record<string, string>;
  processing?: boolean;
}

/**
 * Hook personalizado para gestionar el estado y lógica de un formulario de tipos de.
 * Incluye validación, manejo de errores y handlers para interacciones del usuario.
 */
export function useTipoForm({ mode, initialData, onSubmit, onCancel, externalErrors = {}, processing = false }: UseTipoFormProps) {
  // Aquí se usa useState para manejar el estado de los datos del formulario.
  const [data, setData] = useState<TipoFormData>({
    ...INITIAL_DATA,
    ...initialData,
  });

  // Aquí se usa useState para manejar errores locales del formulario.
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Aquí se usa useEffect para actualizar errores externos y hacer scroll al primer error.
  useEffect(() => {
    if (Object.keys(externalErrors).length > 0) {
      setErrors(externalErrors);
      scrollToFirstError(externalErrors);
    }
  }, [externalErrors]);

  // Solo resetear datos cuando cambia el modo o initialData
  // Resetear datos solo cuando mode o initialData cambian (no por errores)
  useEffect(() => {
    setData({
      ...INITIAL_DATA,
      ...initialData,
    });
    setErrors({});
  }, [initialData, mode]);

  /**
   * Función auxiliar: Hace scroll al primer campo con error.
   * Mejora la UX al mostrar errores visibles.
   * 
   * @param {Record<string, string>} errorObj - Objeto con errores.
   */
  const scrollToFirstError = (errorObj: Record<string, string>) => {
    const firstErrorField = Object.keys(errorObj)[0];
    document.getElementById(firstErrorField)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /**
   * Handler: Actualiza el valor de un campo del formulario y limpia errores locales.
   * Se llama en eventos de cambio de inputs.
   * 
   * @param {keyof TipoFormData} field - Nombre del campo a actualizar.
   * @param {string} value - Nuevo valor del campo.
   */
  const handleChange = (field: keyof TipoFormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Handler: Maneja el envío del formulario con validación usando Zod.
   * Previene envío si hay errores y llama a onSubmit con datos válidos.   
   * 
   * @param {React.FormEvent} e - Evento del formulario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validar con Zod
    const result = tipoSchema.safeParse(data);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      if (result.error instanceof z.ZodError) {
        result.error.issues.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
      }
      setErrors(newErrors);
      scrollToFirstError(newErrors);
      return;
    }

    // Llamar a onSubmit con datos validados
    const submitResult = await onSubmit(result.data);
    // Si devuelve reset, limpiar aquí
    if (submitResult?.reset && mode === "create") {
      setData(INITIAL_DATA);
    }
  };

  /**
   * Handler: Maneja la cancelación del formulario.
   * Resetea estado y llama a onCancel.
   */
  const handleCancelClick = () => {
    setErrors({});
    setData(INITIAL_DATA);
    onCancel();
  };

  return {
    data,
    errors,
    handleChange,
    handleSubmit,
    handleCancelClick,
    processing,
  };
}
