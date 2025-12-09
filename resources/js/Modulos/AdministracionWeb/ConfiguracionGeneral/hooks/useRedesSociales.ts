/**
 * Hook useRedesSociales.
 * 
 * Maneja la lógica del formulario de Redes Sociales: estado del formulario,
 * validaciones con Zod y envío de datos via JSON.
 * Se usa en componentes de formulario para gestionar las configuraciones de redes sociales.
 * 
 * @author Yariangel Aray
 * @date 2025-12-04
 */
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import {
    RedesSocialesFormData,
    redesSocialesSchema,
} from "../types/configuracionForm.types";
import { ConfiguracionRRSS } from "../types/configuracionInterface";

/**
 * Interfaz para las props del hook useRedesSociales.
 * Define los datos iniciales de configuración y permisos.
 * 
 * @typedef {Object} UseRedesSocialesProps
 * @property {{rrss: ConfiguracionRRSS}} configuracion - Datos iniciales de redes sociales.
 * @property {boolean} puedeEditar - Indica si el usuario puede editar.
 * @property {Record<string, string>} [externalErrors] - Errores externos opcionales.
 */
interface UseRedesSocialesProps {
    configuracion: {
        rrss: ConfiguracionRRSS;
    };
    puedeEditar: boolean;
    externalErrors?: Record<string, string>;
}
/**
 * Hook personalizado para gestionar el formulario de Redes Sociales.
 * Incluye validaciones, manejo de errores y envío a la API.
 * 
 * @param {UseRedesSocialesProps} props - Props del hook.
 * @returns {Object} Objeto con estado, errores y handlers.
 */
export function useRedesSociales({
    configuracion,
    puedeEditar,
    externalErrors = {},
}: UseRedesSocialesProps) {
    // Aquí se usa useToast para mostrar notificaciones de éxito/error al usuario.
    const { toast } = useToast();

    // Aquí se usa useState para manejar el estado de los datos del formulario, inicializado con la configuración.
    const [formData, setFormData] = useState<RedesSocialesFormData>({
        instagram: configuracion.rrss.instagram || "",
        facebook: configuracion.rrss.facebook || "",
        x: configuracion.rrss.x || "",
        linkedin: configuracion.rrss.linkedin || "",
    });

    // Aquí se usa useState para indicar si se está enviando el formulario.
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Aquí se usa useState para manejar errores del formulario.
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Aquí se usa useEffect para sincronizar errores externos con el estado local.
    useEffect(() => {
        if (Object.keys(externalErrors).length > 0) {
            setErrors(externalErrors);
        }
    }, [externalErrors]);

    /**
     * Handler: Actualiza un campo del formulario y limpia errores.
     * 
     * @param {keyof RedesSocialesFormData} field - Nombre del campo.
     * @param {string} value - Nuevo valor.
     */
    const handleChange = (field: keyof RedesSocialesFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    /**
     * Handler: Envía el formulario con validación y envío via JSON.
     * Valida permisos, usa Zod para validaciones y envía via fetch.
     * 
     * @param {React.FormEvent} e - Evento del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!puedeEditar) {
            toast({
                title: "Error",
                description: "No tienes permiso para editar las redes sociales.",
                variant: "destructive",
            });
            return;
        }

        // Aquí se valida el formulario con Zod antes del envío.
        const validation = redesSocialesSchema.safeParse(formData);

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
                description: "Por favor corrige los errores en el formulario.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value || "");
        });

        try {
            // Aquí se envía la petición a la API usando fetch con JSON.
            const response = await fetch(route("update-redes"), {
                method: "POST",
                headers: {
                    "Accept": "application/json",                    
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                }
                throw new Error(data.error || "Error al guardar");
            }

            toast({
                title: "Redes Sociales Guardadas",
                description: data.message || "Las redes sociales se han actualizado correctamente.",
                variant: "success",
            });
            // Aquí se recarga la página para reflejar cambios.
            router.reload({ only: ["configuracion"] });
        } catch (error: any) {
            console.error(error.message);
            toast({
                title: "Error",
                description: "Error al guardar las redes sociales",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
    };
}
