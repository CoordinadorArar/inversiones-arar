/**
 * Hook personalizado useContactForm
 * 
 * Maneja toda la lógica del formulario de contacto: estado, validaciones,
 * envío al backend y manejo de errores.
 * 
 * Beneficios: Separa lógica de UI, facilita pruebas y mantenimiento.
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
    ContactFormData,
    CONTACT_INITIAL_DATA,
    contactSchema,
} from "../types/contactForm.types";

/**
 * Interface para las props del hook useContactForm.
 * Define los parámetros necesarios para configurar el comportamiento del formulario.
 */
interface UseContactFormProps {
    onSuccess?: () => void;  // Callback opcional tras envío exitoso.
    externalErrors?: Record<string, string>;  // Errores del backend para integrar.
}

/**
 * Hook personalizado useContactForm.
 * 
 * Encapsula toda la lógica del formulario de contacto:
 * - Estado del formulario (data, errors, processing)
 * - Validación con Zod
 * - Envío al backend con fetch
 * - Manejo de errores (locales y del servidor)
 * - Reset del formulario tras éxito
 * - Toast notifications para feedback
 */
export function useContactForm({
    onSuccess,
    externalErrors = {},
}: UseContactFormProps = {}) {
    // ============================================================================
    // ESTADOS PRINCIPALES
    // ============================================================================
    
    // Estado para los datos del formulario: inicializado con valores vacíos/default.
    // Se actualiza con setData en onChange de inputs.
    const [data, setData] = useState<ContactFormData>(CONTACT_INITIAL_DATA);

    // Estado para errores: objeto con claves de campos y mensajes.
    // Se llena en validación Zod o errores del backend, se muestra en InputError.
    const [errors, setErrors] = useState<Record<string, string>>(externalErrors);

    // Estado para processing: indica si está enviando (deshabilita form).
    // Se setea true en envío, false en finally.
    const [processing, setProcessing] = useState(false);

    // Hook toast: para notificaciones de éxito/error.
    const { toast } = useToast();

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
     * @param value - Nuevo valor (string o boolean).
     */
    const handleChange = (
        field: keyof ContactFormData,
        value: string | boolean
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
     * Handler: Resetea el formulario a valores iniciales.
     * Usado tras envío exitoso.
     */
    const resetForm = () => {
        setData(CONTACT_INITIAL_DATA);
        setErrors({});
    };

    /**
     * Handler: Maneja el envío del formulario.
     * 
     * Flujo:
     * 1. Previene default y limpia errores previos
     * 2. Valida con Zod
     * 3. Si falla validación: setea errores y hace scroll
     * 4. Si pasa: envía fetch POST al backend
     * 5. Maneja respuestas: éxito (toast + reset), errores (setea errores o toast)
     * 6. Catch para errores de red
     * 7. Finally limpia processing
     * 
     * @param e - Evento del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        // Previene recarga de página.
        e.preventDefault();

        // Limpia errores previos.
        setErrors({});

        // Valida data con schema Zod.
        const result = contactSchema.safeParse(data);

        // Si validación falla.
        if (!result.success) {
            // Inicializa objeto para errores.
            const newErrors: Record<string, string> = {};
            
            // Verifica que error sea ZodError (seguridad).
            if (result.error instanceof z.ZodError) {
                // Itera issues y mapea a newErrors.
                result.error.issues.forEach((err) => {
                    // Si path tiene elementos, usa primero como clave.
                    if (err.path.length > 0) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
            }
            
            // Setea errores en estado.
            setErrors(newErrors);
            
            // Scroll al primer error.
            scrollToFirstError(newErrors);
            
            // Sale sin enviar.
            return;
        }

        // Si válido, activa processing.
        setProcessing(true);

        try {
            // Fetch POST a ruta contact.store.
            const response = await fetch(route('contact.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Envía JSON.
                    'Accept': 'application/json',        // Espera JSON.
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',  // Token CSRF.
                },
                body: JSON.stringify(data),  // Serializa data a JSON.
            });

            // Parsea respuesta.
            const result = await response.json();
            
            // Si OK (200).
            if (response.ok) {
                // Toast éxito.
                toast({
                    title: "¡Mensaje enviado!",
                    description: "Nos pondremos en contacto contigo pronto.",
                    variant: "success",
                });
                
                // Reset form a valores iniciales.
                resetForm();
                
                // Callback opcional de éxito.
                onSuccess?.();
                
            } else if (response.status === 422) {
                // Errores de validación backend: setea en estado.
                setErrors(result.errors || {});
                scrollToFirstError(result.errors || {});
                
            } else {
                // Otros errores: toast.
                toast({
                    title: "Error al enviar",
                    description: result.error || "Intenta de nuevo más tarde.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            // Error de conexión.
            console.error("Error de conexión:", error);
            toast({
                title: "Error de conexión",
                description: "Revisa tu conexión e intenta de nuevo.",
                variant: "destructive",
            });
        } finally {
            // Siempre desactiva processing.
            setProcessing(false);
        }
    };

    // ============================================================================
    // RETORNO DEL HOOK
    // ============================================================================
    
    /**
     * Devuelve un objeto con todos los estados y handlers necesarios para el componente.
     * Esto permite que el componente UI solo se enfoque en renderizar.
     */
    return {
        // Estados para renderizar UI.
        data,          // Datos actuales del formulario.
        errors,        // Errores por campo.
        processing,    // Indicador de carga.
        
        // Handlers para eventos del formulario.
        handleChange,  // Cambio genérico de campos.
        handleSubmit,  // Envío del formulario.
        resetForm,     // Reset manual (opcional).
    };
}