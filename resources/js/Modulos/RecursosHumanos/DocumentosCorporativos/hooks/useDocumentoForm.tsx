import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DocumentoFormData,
  DOCUMENTO_INITIAL_DATA,
  createDocumentoSchema,
} from "../types/documentoForm.types";

interface UseDocumentoFormProps {
  mode: "create" | "edit";
  initialData?: Partial<DocumentoFormData>;
  disabled?: boolean;
  onSubmit: (data: DocumentoFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  externalErrors?: Record<string, string>;
}

export function useDocumentoForm({
  mode,
  initialData,
  disabled = false,
  onSubmit,
  onDelete,
  externalErrors = {},
}: UseDocumentoFormProps) {
  const { toast } = useToast();

  const [data, setData] = useState<DocumentoFormData>({
    ...DOCUMENTO_INITIAL_DATA,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (Object.keys(externalErrors).length > 0) {
      setErrors(externalErrors);
    }
  }, [externalErrors]);

  useEffect(() => {
    if (initialData) {
      setData({
        ...DOCUMENTO_INITIAL_DATA,
        ...initialData,
      });
    }
  }, [initialData]);

  useEffect(() => {
    setErrors({});
  }, [mode, initialData]);

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

  const handleArchivoRemove = () => {
    setData((prev) => ({
      ...prev,
      archivo: null,
      archivo_preview: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled || processing) return;

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

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

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

  return {
    data,
    errors,
    processing,
    showDeleteDialog,
    handleChange,
    handleArchivoChange,
    handleArchivoRemove,
    handleSubmit,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    setErrors,
  };
}