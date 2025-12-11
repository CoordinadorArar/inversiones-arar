import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    ModuloFormData,
    MODULO_INITIAL_DATA,
    moduloSchema,
} from "../types/moduloForm.types";

interface UseModuloFormProps {
    mode: "create" | "edit";
    initialData?: Partial<ModuloFormData>;
    disabled?: boolean;
    onSubmit: (data: ModuloFormData) => Promise<void>;
    externalErrors?: Record<string, string>;
}

export function useModuloForm({
    mode,
    initialData,
    disabled = false,
    onSubmit,
    externalErrors = {},
}: UseModuloFormProps) {
    const { toast } = useToast();

    const [data, setData] = useState<ModuloFormData>({
        ...MODULO_INITIAL_DATA,
        ...initialData,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (Object.keys(externalErrors).length > 0) {
            setErrors(externalErrors);
        }
    }, [externalErrors]);

    useEffect(() => {
        if (initialData) {
            setData({
                ...MODULO_INITIAL_DATA,
                ...initialData,
            });
        }
    }, [initialData]);

    useEffect(() => {
        setErrors({});
    }, [mode, initialData]);

    const handleChange = (field: keyof ModuloFormData, value: any) => {
        setData((prev) => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleEsPadreChange = (checked: boolean) => {
        handleChange("es_padre", checked);
        if (checked) {
            handleChange("modulo_padre_id", null);
            handleChange("permisos_extra", "");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (disabled || processing) return;

        if (!data.ruta.startsWith("/")) {
            setErrors((prev) => ({
                ...prev,
                ruta: "La ruta debe empezar con /",
            }));
            return;
        }

        const validation = moduloSchema.safeParse(data);

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

    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End', 'Control', 'Alt', 'Shift'];

    // función para permisos extra: solo letras minúsculas, guiones bajos y comas
    const handlePermisosExtraKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = /^[a-z_,]$/;
        if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    };

    // función para ruta de módulo: solo letras minúsculas, números, guiones y /
    const handleRutaModuloKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = /^[a-z0-9\-/]$/;
        if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    };


    return {
        data,
        errors,
        processing,
        handleChange,
        handleEsPadreChange,
        handleSubmit,
        handlePermisosExtraKeyDown,
        handleRutaModuloKeyDown
    };
}