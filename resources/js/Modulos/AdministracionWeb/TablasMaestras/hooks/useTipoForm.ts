/**
 * Hook useTipoForm
 * 
 * Maneja la lógica interna del formulario de tipos de identificación
 * Validaciones, estado local y handlers
 * 
 * @author Yariangel Aray
 * @date 2025-12-03
 */
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { TipoFormData, tipoSchema } from "../types/tipoForm.types";

const INITIAL_DATA: TipoFormData = {
  nombre: "",
  abreviatura: "",
};

interface UseTipoFormProps {
  mode: "create" | "edit";
  initialData?: Partial<TipoFormData>;
  onSubmit: (data: TipoFormData) => Promise<void>;
  onCancel: () => void;
  externalErrors?: Record<string, string>;
  processing?: boolean;
}

export function useTipoForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  externalErrors = {},
  processing = false,
}: UseTipoFormProps) {
  // Estado de datos del formulario
  const [data, setData] = useState<TipoFormData>({
    ...INITIAL_DATA,
    ...initialData,
  });

  // Estado de errores locales
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Ref para el primer input (focus automático)
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Efecto: Focus en el primer input al crear
  useEffect(() => {
    if (mode === "create") {
      firstInputRef.current?.focus();
    }
  }, [mode]);

  // Efecto: Actualizar errores externos
  useEffect(() => {
    if (Object.keys(externalErrors).length > 0) {
      setErrors(externalErrors);
      scrollToFirstError(externalErrors);
    }
  }, [externalErrors]);

  // Efecto: Actualizar datos cuando cambian initialData
  useEffect(() => {
    setData({
      ...INITIAL_DATA,
      ...initialData,
    });
    setErrors({});
  }, [initialData, mode]);

  /**
   * Scroll al primer error
   */
  const scrollToFirstError = (errorObj: Record<string, string>) => {
    const firstErrorField = Object.keys(errorObj)[0];
    document.getElementById(firstErrorField)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /**
   * Handler: Actualiza un campo del formulario
   */
  const handleChange = (field: keyof TipoFormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Handler: Envío del formulario
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
    await onSubmit(result.data);

    // Si es modo crear y no hay errores, resetear el formulario
    if (mode === "create" && Object.keys(errors).length === 0) {
      setData(INITIAL_DATA);
      firstInputRef.current?.focus();
    }
  };

  /**
   * Handler: Cancelar
   */
  const handleCancelClick = () => {
    setErrors({});
    setData(INITIAL_DATA);
    onCancel();
  };

  return {
    data,
    errors,
    firstInputRef,
    handleChange,
    handleSubmit,
    handleCancelClick,
    processing,
  };
}