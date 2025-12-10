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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  UsuarioFormData,
  USUARIO_INITIAL_DATA,
  usuarioSchemaBase,
} from "../types/usuarioForm.types";

interface UseUsuarioFormProps {
  mode: "create" | "edit";
  initialData?: Partial<UsuarioFormData>;
  disabled?: boolean;
  onSubmit: (data: UsuarioFormData) => Promise<void>;
  externalErrors?: Record<string, string>;
  dominios: string[];
}

export function useUsuarioForm({
  mode,
  initialData,
  disabled = false,
  onSubmit,
  externalErrors = {},
  dominios
}: UseUsuarioFormProps) {
  const { toast } = useToast();

  // Estado del formulario
  const [data, setData] = useState<UsuarioFormData>({
    ...USUARIO_INITIAL_DATA,
    ...initialData,    
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [usuarioYaRegistrado, setUsuarioYaRegistrado] = useState(false);

  // Refinamiento del schema: Valida que el dominio del email esté en la lista de dominios permitidos    
  const usuarioSchema = usuarioSchemaBase
    .refine(
      (data) => {
        // Extrae dominio: ej. "usuario@empresa.com" -> "empresa.com"
        const domain = data.email.split('@')[1];
        
        // Verifica si el dominio está en la lista autorizada
        return dominios.includes(domain);
      },
      {
        // Mensaje de error.
        message: "El correo electrónico debe pertenecer a una empresa autorizada.",
        path: ["email"],
      }
    )

  // Sincronizar errores externos
  useEffect(() => {
    if (Object.keys(externalErrors).length > 0) {
      setErrors(externalErrors);
    }
  }, [externalErrors]);

  // Sincronizar datos iniciales
  useEffect(() => {
    if (initialData) {
      setData({
        ...USUARIO_INITIAL_DATA, ...initialData,        
      });
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

  // Handler para selección de documento
  const handleDocumentoSelect = (documento: string, nombre: string, yaExiste: boolean) => {
    if (yaExiste) {
      setUsuarioYaRegistrado(true);
      setErrors((prev) => ({
        ...prev,
        numero_documento: "Este usuario ya está registrado en la web",
      }));
      handleChange("numero_documento", documento);
      handleChange("nombre_completo", "");
    } else {
      setUsuarioYaRegistrado(false);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.numero_documento;
        return newErrors;
      });
      handleChange("numero_documento", documento);
      handleChange("nombre_completo", nombre);
    }
  };

  // Validar y enviar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled || processing) return;

    // Validar usuario ya registrado
    if (usuarioYaRegistrado && mode === "create") {
      setErrors((prev) => ({
        ...prev,
        numero_documento: "No puedes crear un usuario que ya está registrado",
      }));
      return;
    }

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
    usuarioYaRegistrado,
    handleChange,
    handleDocumentoSelect,
    handleSubmit,
  };
}