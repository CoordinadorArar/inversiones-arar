import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import {
    EmpresaFormData,
    EMPRESA_INITIAL_DATA,
    createEmpresaSchema,
} from "../types/empresaForm.types";

/**
 * Interface para las props del hook useEmpresaForm.
 * Define los parámetros necesarios para configurar el comportamiento del formulario.
 */
interface UseEmpresaFormProps {
    mode: "create" | "edit";  // Modo del formulario: creación o edición.
    initialData?: Partial<EmpresaFormData>;  // Datos iniciales opcionales para prellenar.
    disabled?: boolean;  // Si el formulario está deshabilitado (ej. durante carga).
    onSubmit: (data: EmpresaFormData) => Promise<void>;  // Callback para enviar datos validados.
    onDelete?: () => Promise<void>;  // Callback opcional para eliminar (solo en edit).
    externalErrors?: Record<string, string>;  // Errores del backend para integrar.
}

/**
 * Hook personalizado useEmpresaForm.
 * 
 * Maneja toda la lógica del formulario de empresas: estado, validaciones, efectos y handlers.
 * Usa Zod para validaciones dinámicas y React hooks para estado y efectos.
 * 
 * Beneficios: Separa lógica de UI, facilita pruebas y reutilización.
 */
export function useEmpresaForm({
    mode,
    initialData,
    disabled = false,
    onSubmit,
    onDelete,
    externalErrors = {},
}: UseEmpresaFormProps) {
    // ============================================================================
    // ESTADOS PRINCIPALES
    // ============================================================================
    // Estado para los datos del formulario: combina valores iniciales con datos proporcionados.
    const [data, setData] = useState<EmpresaFormData>({
        ...EMPRESA_INITIAL_DATA,  // Valores por defecto.
        ...initialData,  // Sobrescribe con datos iniciales si existen.
    });

    // Estado para errores: almacena mensajes de error por campo (locales o externos).
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estado para indicar si hay un proceso en curso (envío o eliminación).
    const [processing, setProcessing] = useState(false);

    // Estado para controlar la visibilidad del diálogo de eliminación.
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Ref para el primer input: permite hacer focus automáticamente.
    const firstInputRef = useRef<HTMLInputElement>(null);

    // ============================================================================
    // EFECTOS (useEffect)
    // ============================================================================

    // Efecto: Hace focus en el primer input solo cuando se crea una empresa nueva y no está deshabilitado.
    // Mejora UX al dirigir la atención del usuario inmediatamente.
    useEffect(() => {
        if (!disabled && mode === "create") {
            firstInputRef.current?.focus();
        }
    }, [disabled, mode]);

    // Efecto: Actualiza errores cuando llegan del backend (externalErrors).
    // Integra errores de validación del servidor y hace scroll al primer error.
    useEffect(() => {
        if (Object.keys(externalErrors).length > 0) {
            setErrors(externalErrors);  // Sobrescribe errores locales con externos.
            scrollToFirstError(externalErrors);  // UX: Scroll automático al error.
        }
    }, [externalErrors]);

    // Efecto: Actualiza datos del formulario cuando cambian los initialData (ej. al cambiar de empresa en edit).
    // Asegura que el formulario refleje los datos correctos.
    useEffect(() => {
        if (mode === "edit" || mode === "create") {
            setData({
                ...EMPRESA_INITIAL_DATA,  // Reinicia con valores por defecto.
                ...initialData,  // Aplica datos nuevos.
            });
        }
    }, [initialData]);

    // ============================================================================
    // FUNCIONES HELPER (Auxiliares)
    // ============================================================================

    /**
     * Función helper: Hace scroll suave al primer campo con error.
     * Mejora la experiencia de usuario al destacar errores automáticamente.
     * 
     * @param errorObj - Objeto con errores por campo.
     */
    const scrollToFirstError = (errorObj: Record<string, string>) => {
        const firstErrorField = Object.keys(errorObj)[0];  // Toma el primer campo con error.
        document.getElementById(firstErrorField)?.scrollIntoView({
            behavior: "smooth",  // Animación suave.
            block: "center",  // Centra el campo en la vista.
        });
    };

    // ============================================================================
    // HANDLERS (Manejadores de eventos)
    // ============================================================================

    /**
     * Handler: Actualiza un campo específico del formulario.
     * Limpia el error del campo si existía, para feedback inmediato.
     * 
     * @param field - Nombre del campo a actualizar.
     * @param value - Nuevo valor (string, boolean, File o null).
     */
    const handleChange = (
        field: keyof EmpresaFormData,
        value: string | boolean | File | null
    ) => {
        setData((prev) => ({ ...prev, [field]: value }));  // Actualiza estado.

        // Si había un error en este campo, lo limpia al modificar.
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];  // Elimina error específico.
                return newErrors;
            });
        }
    };

    /**
     * Handler: Maneja la selección de un nuevo logo.
     * Lee el archivo como Data URL para preview y actualiza estado.
     * 
     * @param file - Archivo de imagen seleccionado.
     */
    const handleLogoChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setData((prev) => ({
                ...prev,
                logo: file,  // Archivo real para envío.
                logo_preview: reader.result as string,  // Preview en base64.
            }));
        };
        reader.readAsDataURL(file);  // Convierte a Data URL.
    };

    /**
     * Handler: Remueve el logo actual.
     * Resetea campos relacionados con el logo.
     */
    const handleLogoRemove = () => {
        setData((prev) => ({
            ...prev,
            logo: null,  // Sin archivo.
            logo_preview: null,  // Sin preview.
        }));
    };

    /**
     * Handler: Maneja el envío del formulario.
     * Valida con Zod, hace scroll a errores si falla, y llama a onSubmit si pasa.
     * 
     * @param e - Evento del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Previene recarga de página.
        setErrors({});  // Limpia errores previos.

        // Crea esquema de validación dinámico basado en datos (ej. campos requeridos por switches).
        const schema = createEmpresaSchema(data);
        const result = schema.safeParse(data);  // Valida sin lanzar excepciones.

        if (!result.success) {
            // Si falla validación, extrae errores de Zod.
            const newErrors: Record<string, string> = {};
            if (result.error instanceof z.ZodError) {
                result.error.issues.forEach((err) => {
                    if (err.path.length > 0) {
                        newErrors[err.path[0].toString()] = err.message;  // Mapea a string.
                    }
                });
            }
            setErrors(newErrors);  // Actualiza estado de errores.
            scrollToFirstError(newErrors);  // UX: Scroll al primer error.
            return;  // Detiene envío.
        }

        // Si pasa validación, inicia procesamiento y llama a callback.
        setProcessing(true);
        try {
            await onSubmit(data);  // Envía datos al backend.
        } catch (error) {
            console.error("Error al guardar:", error);  // Log para debugging.
        } finally {
            setProcessing(false);  // Siempre resetea estado.
        }
    };

    /**
     * Handler: Abre el diálogo de confirmación de eliminación.
     */
    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    /**
     * Handler: Cierra el diálogo de eliminación sin confirmar.
     */
    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
    };

    /**
     * Handler: Confirma la eliminación de la empresa.
     * Llama a onDelete y cierra el diálogo.
     */
    const handleDeleteConfirm = async () => {
        if (!onDelete) return;  // Si no hay callback, no hace nada.

        setProcessing(true);  // Indica carga.
        try {
            await onDelete();  // Ejecuta eliminación.
            setShowDeleteDialog(false);  // Cierra diálogo.
        } catch (error) {
            console.error("Error al eliminar:", error);  // Log para debugging.
        } finally {
            setProcessing(false);  // Resetea estado.
        }
    };

    // ============================================================================
    // RETORNO DEL HOOK
    // ============================================================================
    // Devuelve un objeto con todos los estados, refs y handlers necesarios para el componente.
    return {
        // Estados para renderizar UI.
        data,  // Datos del formulario.
        errors,  // Errores por campo.
        processing,  // Indicador de carga.
        showDeleteDialog,  // Visibilidad del diálogo.

        // Refs para acceso directo a elementos DOM.
        firstInputRef,  // Para focus automático.

        // Handlers para eventos del formulario.
        handleChange,  // Cambio genérico de campos.
        handleLogoChange,  // Selección de logo.
        handleLogoRemove,  // Remoción de logo.
        handleSubmit,  // Envío del formulario.
        handleDeleteClick,  // Abrir diálogo de eliminación.
        handleDeleteCancel,  // Cancelar eliminación.
        handleDeleteConfirm,  // Confirmar eliminación.
    };
}
