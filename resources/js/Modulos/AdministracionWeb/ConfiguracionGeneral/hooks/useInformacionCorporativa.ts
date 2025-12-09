/**
 * Hook useInformacionCorporativa.
 * 
 * Maneja la lógica del formulario de Información Corporativa: estado del formulario,
 * validaciones con Zod, subida de imágenes, envío de datos y manejo de errores.
 * Se usa en componentes de formulario para gestionar la configuración corporativa.
 * 
 * @author Yariangel Aray
 * @date 2025-12-04
 */
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import {
    InformacionCorporativaFormData,
    informacionCorporativaSchema,
} from "../types/configuracionForm.types";
import { ConfiguracionContacto, ConfiguracionImages } from "../types/configuracionInterface";

/**
 * Interfaz para las props del hook useInformacionCorporativa.
 * Define los datos iniciales de configuración y permisos.
 * 
 * @typedef {Object} UseInformacionCorporativaProps
 * @property {{contact: ConfiguracionContacto, images: ConfiguracionImages}} configuracion - Datos iniciales de configuración.
 * @property {boolean} puedeEditar - Indica si el usuario puede editar.
 * @property {Record<string, string>} [externalErrors] - Errores externos opcionales.
 */

interface UseInformacionCorporativaProps {
    configuracion: {
        contact: ConfiguracionContacto;
        images: ConfiguracionImages;
    };
    puedeEditar: boolean;
    externalErrors?: Record<string, string>;
}
/**
 * Hook personalizado para gestionar el formulario de Información Corporativa.
 * Incluye manejo de archivos, validaciones y envío a la API.
 * 
 * @param {UseInformacionCorporativaProps} props - Props del hook.
 * @returns {Object} Objeto con estado, errores, previews y handlers.
 */
export function useInformacionCorporativa({
    configuracion,
    puedeEditar,
    externalErrors = {},
}: UseInformacionCorporativaProps) {
    // Aquí se usa useToast para mostrar notificaciones de éxito/error al usuario.
    const { toast } = useToast();

    // Valores iniciales del formulario basados en la configuración.
    const initialFormData: InformacionCorporativaFormData = {
        email: configuracion.contact.email || "",
        telefono: configuracion.contact.telefono || "",
        ubicacion: configuracion.contact.ubicacion || "",
        ubicacion_detalles: configuracion.contact["ubicacion.detalles"] || "",
        ubicacion_url: configuracion.contact["ubicacion.url"] || "",
        logo: null,
        icono: null,
    };

    // Aquí se usa useState para manejar el estado de los datos del formulario.
    const [formData, setFormData] = useState(initialFormData);
    // Aquí se usa useState para manejar previews de imágenes subidas.
    const [previews, setPreviews] = useState({
        logo: configuracion.images.logo || null,
        icono: configuracion.images.icono || null,
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
     * Handler: Actualiza un campo de texto del formulario y limpia errores.
     * 
     * @param {keyof InformacionCorporativaFormData} field - Nombre del campo.
     * @param {string} value - Nuevo valor.
     */
    const handleChange = (field: keyof InformacionCorporativaFormData, value: string) => {
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
     * Handler: Maneja la selección de un archivo y genera preview.
     * 
     * @param {File} file - Archivo seleccionado.
     * @param {"logo" | "icono"} field - Campo del archivo.
     */
    const handleFileChange = (file: File, field: "logo" | "icono") => {
        setFormData((prev) => ({ ...prev, [field]: file }));
        setPreviews((prev) => ({
            ...prev,
            [field]: URL.createObjectURL(file),
        }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    /**
     * Handler: Remueve un archivo y su preview.
     * 
     * @param {"logo" | "icono"} field - Campo del archivo a remover.
     */
    const handleFileRemove = (field: "logo" | "icono") => {
        setFormData((prev) => ({ ...prev, [field]: null }));
        setPreviews((prev) => ({ ...prev, [field]: null }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    /**
     * Handler: Envía el formulario con validación y subida de archivos.
     * Valida permisos, usa Zod para validaciones y envía via fetch.
     * 
     * @param {React.FormEvent} e - Evento del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!puedeEditar) {
            toast({
                title: "Error",
                description: "No tienes permiso para editar la configuración.",
                variant: "destructive",
            });
            return;
        }

        // Aquí se valida el formulario con Zod antes del envío.
        const validation = informacionCorporativaSchema.safeParse({
            email: formData.email,
            telefono: formData.telefono,
            ubicacion: formData.ubicacion,
            ubicacion_detalles: formData.ubicacion_detalles,
            ubicacion_url: formData.ubicacion_url,
        });

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

        // Aquí se prepara FormData para enviar archivos y datos.
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value || "");
        });

        try {
            // Aquí se envía la petición a la API usando fetch.
            const response = await fetch(route("update-corporativa"), {
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
                title: "Información Guardada",
                description: data.message || "La configuración se ha guardado correctamente.",
                variant: "success",
            });
            // Aquí se recarga la página para reflejar cambios.
            router.reload({ only: ["configuracion"] });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Error al guardar la configuración",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        previews,
        errors,
        isSubmitting,
        handleChange,
        handleFileChange,
        handleFileRemove,
        handleSubmit,
    };
}
