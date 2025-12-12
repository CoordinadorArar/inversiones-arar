/**
 * Hook personalizado useModuloForm.
 * 
 * Maneja el estado y lógica de un formulario para crear o editar módulos.
 * Incluye validación (ahora delegada al componente), manejo de errores, submit,
 * eliminación, y funciones auxiliares para inputs. Usa useState y useEffect
 * para gestionar estado reactivo. Se integra con React para formularios via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-11
 */

import { useState, useEffect } from "react";
import { ModuloFormData, MODULO_INITIAL_DATA } from "../types/moduloForm.types";

/**
 * Interfaz para las props del hook useModuloForm.
 * Define los parámetros necesarios para configurar el hook de formulario de módulos.
 */
interface UseModuloFormProps {
    mode: "create" | "edit"; // Modo del formulario (crear o editar).
    initialData?: Partial<ModuloFormData>; // Datos iniciales opcionales para el formulario.
    disabled?: boolean; // Indica si el formulario está deshabilitado.
    onSubmit: (data: ModuloFormData) => Promise<void>; // Callback para manejar el submit del formulario.
    onDelete?: () => Promise<void>; // Callback opcional para manejar la eliminación.
    externalErrors?: Record<string, string>; // Errores externos opcionales para mostrar.
}

/**
 * Hook useModuloForm.
 * 
 * Gestiona el estado del formulario de módulos: datos, errores, procesamiento, diálogo de eliminación.
 * Proporciona handlers para cambios, submit, eliminación y validaciones de teclado.
 * La validación con Zod se movió al componente principal para mejorar la UX.
 * 
 * @param {UseModuloFormProps} props - Props del hook.
 * @returns {Object} Objeto con estado y handlers para el formulario.
 */
export function useModuloForm({
    mode,
    initialData,
    disabled = false,
    onSubmit,
    onDelete,
    externalErrors = {},
}: UseModuloFormProps) {

    // Aquí se usa useState para almacenar los datos del formulario, inicializados con datos por defecto y opcionales.
    const [data, setData] = useState<ModuloFormData>({
        ...MODULO_INITIAL_DATA,
        ...initialData,
    });

    // Aquí se usa useState para almacenar errores de validación como un objeto clave-valor.
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Aquí se usa useState para indicar si el formulario está procesando (ej: submit en curso).
    const [processing, setProcessing] = useState(false);

    // Aquí se usa useState para controlar si mostrar el diálogo de eliminación.
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Aquí se usa useEffect para actualizar errores cuando cambian los errores externos (ej: del servidor).
    useEffect(() => {
        if (Object.keys(externalErrors).length > 0) {
            setErrors(externalErrors);
        }
    }, [externalErrors]);

    // Aquí se usa useEffect para resetear datos cuando cambian los datos iniciales (ej: al cambiar de modo).
    useEffect(() => {
        if (initialData) {
            setData({
                ...MODULO_INITIAL_DATA,
                ...initialData,
            });
        }
    }, [initialData]);

    // Aquí se usa useEffect para limpiar errores al cambiar de modo o datos iniciales.
    useEffect(() => {
        setErrors({});
    }, [mode, initialData]);

    /**
     * Handler para cambios en campos del formulario.
     * Actualiza el estado de datos y elimina errores específicos si existen.
     * 
     * @param {keyof ModuloFormData} field - Nombre del campo que cambió.
     * @param {any} value - Nuevo valor del campo.
     */
    const handleChange = (field: keyof ModuloFormData, value: any) => {
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
     * Handler para cambios en el checkbox "es_padre".
     * Actualiza el campo y resetea campos dependientes si se marca como padre.
     * 
     * @param {boolean} checked - Estado del checkbox.
     */
    const handleEsPadreChange = (checked: boolean) => {
        handleChange("es_padre", checked);
        if (checked) {
            // Aquí se resetean campos que no aplican a módulos padre.
            handleChange("modulo_padre_id", null);
            handleChange("permisos_extra", "");
        }
    };

    /**
     * Handler para submit del formulario.
     * Maneja el envío, establece procesamiento y llama al callback onSubmit.
     * La validación con Zod se movió al componente principal para mejor UX.
     * 
     * @param {React.FormEvent} e - Evento del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Aquí se previene submit si está deshabilitado o procesando.
        if (disabled || processing) return;

        // CAMBIO: La validación con Zod se movió al componente ModuloForm para ejecutarse antes de la alerta.
        // Código comentado para referencia:
        // const validation = moduloSchema.safeParse(data);
        // if (!validation.success) {
        //     const zodErrors: Record<string, string> = {};
        //     validation.error.issues.forEach((err) => {
        //         if (err.path[0]) {
        //             zodErrors[err.path[0].toString()] = err.message;
        //         }
        //     });
        //     setErrors(zodErrors);
        //     toast({
        //         title: "Errores de validación",
        //         description: "Por favor, corrige los errores en el formulario",
        //         variant: "destructive",
        //     });
        //     return;
        // }

        // Aquí se establece procesamiento y limpia errores antes de submit.
        setProcessing(true);
        setErrors({});

        try {
            // Aquí se llama al callback onSubmit con los datos validados.
            await onSubmit(data);
        } catch (error: any) {
            // Aquí se maneja errores en submit (ej: errores del servidor).
            console.error("Error en submit:", error);
        } finally {
            // Aquí se resetea el estado de procesamiento.
            setProcessing(false);
        }
    };

    /**
     * Handler para abrir el diálogo de eliminación.
     */
    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    /**
     * Handler para cancelar el diálogo de eliminación.
     */
    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
    };

    /**
     * Handler para confirmar la eliminación.
     * Llama al callback onDelete y cierra el diálogo.
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
        data,
        errors,
        processing,
        showDeleteDialog,
        handleChange,
        handleEsPadreChange,
        handleSubmit,
        handleDeleteClick,
        handleDeleteCancel,
        handleDeleteConfirm,
        setErrors, // CAMBIO: Expuesto para que el componente actualice errores directamente.
    };
}