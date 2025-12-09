/**
 * Hook useUsuarioForm
 * 
 * Maneja la lógica del formulario de usuario:
 * - Estado del formulario
 * - Validaciones con Zod
 * - Búsqueda por documento (fetch externo)
 * - Autocompletado de nombre
 * - Envío de datos
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  UsuarioFormData,
  USUARIO_INITIAL_DATA,
  usuarioSchema,
} from "../types/usuarioForm.types";

interface UseUsuarioFormProps {
  mode: "create" | "edit";
  initialData?: Partial<UsuarioFormData>;
  disabled?: boolean;
  onSubmit: (data: UsuarioFormData) => Promise<void>;
  externalErrors?: Record<string, string>;
}

export function useUsuarioForm({
  mode,
  initialData,
  disabled = false,
  onSubmit,
  externalErrors = {},
}: UseUsuarioFormProps) {
  const { toast } = useToast();

  // Estado del formulario
  const [data, setData] = useState<UsuarioFormData>({
    ...USUARIO_INITIAL_DATA,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [isSearchingDocument, setIsSearchingDocument] = useState(false);

  // Sincronizar errores externos
  useEffect(() => {
    if (Object.keys(externalErrors).length > 0) {
      setErrors(externalErrors);
    }
  }, [externalErrors]);

  // Sincronizar datos iniciales cuando cambian
  useEffect(() => {
    if (initialData) {
      setData({ ...USUARIO_INITIAL_DATA, ...initialData });
    }
  }, [initialData]);

  // Handler para cambios en campos
  const handleChange = (field: keyof UsuarioFormData, value: any) => {
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

  // Validar y enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled || processing) return;

    // Validar con Zod
    const validation = usuarioSchema.safeParse(data);

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

  return {
    data,
    errors,
    processing,
    isSearchingDocument,
    handleChange,
    handleSubmit,
    setErrors,
  };
}