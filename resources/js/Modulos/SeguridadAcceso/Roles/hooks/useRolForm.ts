/**
 * Hook useRolForm.
 * 
 * Maneja el estado y lógica de un formulario para crear o editar roles.
 * Incluye validación con Zod, manejo de errores, submit, y funciones auxiliares para inputs.
 * Usa useState y useEffect para gestionar estado reactivo.
 * Se integra con React para formularios via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-17
 */

import { useState, useEffect } from "react";
import { z } from "zod";
import { RolFormData, rolSchema } from "../types/rolForm.types";

/**
 * Datos iniciales por defecto para el formulario de roles.
 */
const INITIAL_DATA: RolFormData = {
  nombre: "",
  abreviatura: "",
};

/**
 * Interfaz para las props del hook useRolForm.
 * Define los parámetros necesarios para configurar el hook de formulario de roles.
 */
interface UseRolFormProps {
    mode: "create" | "edit"; // Modo del formulario (crear o editar).
    initialData?: Partial<RolFormData>; // Datos iniciales opcionales para el formulario.
    onSubmit: (data: RolFormData) => Promise<void>; // Callback para manejar el submit del formulario.
    onCancel: () => void; // Callback para manejar el cancelar.
    externalErrors?: Record<string, string>; // Errores externos opcionales para mostrar.
    processing?: boolean; // Indica si el formulario está procesando.
}

/**
 * Hook useRolForm.
 * 
 * Gestiona el estado del formulario de roles: datos, errores, procesamiento.
 * Proporciona handlers para cambios, submit, cancelar y validaciones con Zod.
 * Incluye scroll a errores y reset de formulario en creación exitosa.
 * 
 * @param {UseRolFormProps} props - Props del hook.
 * @returns {Object} Objeto con estado y handlers para el formulario.
 */
export function useRolForm({ mode, initialData, onSubmit, onCancel, externalErrors = {}, processing = false }: UseRolFormProps) {
    // Aquí se usa useState para almacenar los datos del formulario, inicializados con datos por defecto y opcionales.
    const [data, setData] = useState<RolFormData>({
        ...INITIAL_DATA,
        ...initialData,
    });

    // Aquí se usa useState para almacenar errores de validación como un objeto clave-valor.
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Aquí se usa useEffect para actualizar errores cuando cambian los errores externos (ej: del servidor).
    useEffect(() => {
        if (Object.keys(externalErrors).length > 0) {
            setErrors(externalErrors);
            scrollToFirstError(externalErrors);
        }
    }, [externalErrors]);

    // Aquí se usa useEffect para resetear datos y errores cuando cambian los datos iniciales o el modo.
    useEffect(() => {
        setData({
            ...INITIAL_DATA,
            ...initialData,
        });
        setErrors({});
    }, [initialData, mode]);

    /**
     * Función auxiliar para hacer scroll al primer campo con error.
     * Mejora la UX al enfocar errores.
     * 
     * @param {Record<string, string>} errorObj - Objeto de errores.
     */
    const scrollToFirstError = (errorObj: Record<string, string>) => {
        const firstErrorField = Object.keys(errorObj)[0];
        document.getElementById(firstErrorField)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    /**
     * Handler para cambios en campos del formulario.
     * Actualiza el estado de datos y elimina errores específicos si existen.
     * 
     * @param {keyof RolFormData} field - Nombre del campo que cambió.
     * @param {string} value - Nuevo valor del campo.
     */
    const handleChange = (field: keyof RolFormData, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));

        // Aquí se elimina el error del campo específico al cambiarlo (para feedback inmediato).
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    /**
     * Handler para submit del formulario.
     * Valida con Zod, maneja errores, llama al callback onSubmit y resetea en creación exitosa.
     * 
     * @param {React.FormEvent} e - Evento del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Aquí se valida el formulario con Zod antes de submit.
        const result = rolSchema.safeParse(data);

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

        // Aquí se llama al callback onSubmit con los datos validados.
        const submitResult = await onSubmit(result.data);
        if (submitResult?.reset && mode === "create") {
            // Aquí se resetea el formulario en creación exitosa.
            setData(INITIAL_DATA);
        }
    };

    /**
     * Handler para cancelar el formulario.
     * Limpia errores, resetea datos y llama al callback onCancel.
     */
    const handleCancelClick = () => {
        setErrors({});
        setData(INITIAL_DATA);
        onCancel();
    };

    // Aquí se retorna el objeto con estado y handlers para usar en el componente.
    return {
        data,
        errors,
        handleChange,
        handleSubmit,
        handleCancelClick,
        processing,
    };
}