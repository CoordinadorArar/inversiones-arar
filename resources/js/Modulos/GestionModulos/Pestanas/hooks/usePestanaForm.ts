import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  PestanaFormData,
  PESTANA_INITIAL_DATA,
  pestanaSchema,
} from "../types/pestanaForm.types";

interface UsePestanaFormProps {
  mode: "create" | "edit";
  initialData?: Partial<PestanaFormData>;
  disabled?: boolean;
  onSubmit: (data: PestanaFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  externalErrors?: Record<string, string>;
}

export function usePestanaForm({
  mode,
  initialData,
  disabled = false,
  onSubmit,
  onDelete,
  externalErrors = {},
}: UsePestanaFormProps) {
  const { toast } = useToast();

  const [data, setData] = useState<PestanaFormData>({
    ...PESTANA_INITIAL_DATA,
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
        ...PESTANA_INITIAL_DATA,
        ...initialData,
      });
    }
  }, [initialData]);

  useEffect(() => {
    setErrors({});
  }, [mode, initialData]);

  const handleChange = (field: keyof PestanaFormData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

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
    handleSubmit,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    setErrors,
  };
}