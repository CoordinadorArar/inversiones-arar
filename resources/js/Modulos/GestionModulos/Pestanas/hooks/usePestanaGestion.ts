/**
 * Hook usePestanaGestion.
 * 
 * Hook personalizado para manejar la lógica de gestión de pestañas en la página principal.
 * Gestiona estado de pestañas, modo de formulario, navegación y operaciones CRUD.
 * Sincroniza estado con URL mediante History API para mantener estado en navegación.
 * Valida permisos de usuario antes de ejecutar operaciones de crear, editar y eliminar.
 * Maneja comunicación con backend via fetch y actualiza estado local tras operaciones exitosas.
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */

import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { PestanaInterface } from "../types/pestanaInterface";
import { PestanaFormData } from "../types/pestanaForm.types";

/**
 * Interfaz para las props del hook usePestanaGestion.
 * Define la configuración inicial del gestor de pestañas.
 */
interface UsePestanaGestionProps {
    pestanasIniciales: PestanaInterface[]; // Lista inicial de pestañas del sistema.
    permisos: string[]; // Permisos del usuario actual.
    initialMode?: "idle" | "create" | "edit"; // Modo inicial del formulario.
    initialPestanaId?: number | null; // ID inicial de pestaña a editar.
}

/**
 * Hook personalizado para gestionar pestañas del sistema.
 * Maneja estado, navegación, permisos y operaciones CRUD con sincronización de URL.
 * 
 * @param {UsePestanaGestionProps} props - Configuración del hook.
 * @returns {Object} Estado, handlers y utilidades de gestión de pestañas.
 */
export function usePestanaGestion({
    pestanasIniciales,
    permisos,
    initialMode = "idle",
    initialPestanaId = null,
}: UsePestanaGestionProps) {
    const { toast } = useToast();

    // Aquí se validan permisos del usuario para operaciones del módulo.
    const puedeCrear = permisos.includes("crear");
    const puedeEditar = permisos.includes("editar");
    const puedeEliminar = permisos.includes("eliminar");

    const [pestanas, setPestanas] = useState<PestanaInterface[]>(pestanasIniciales);
    const [selectedPestanaId, setSelectedPestanaId] = useState<number | null>(initialPestanaId);
    const [mode, setMode] = useState<"idle" | "create" | "edit">(initialMode);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Aquí se obtiene la pestaña seleccionada del estado local.
    const selectedPestana = pestanas.find((p) => p.id === selectedPestanaId);

    // Aquí se transforman pestañas a opciones para el selector con memoización.
    const pestanaOptions = useMemo(
        () =>
            pestanas.map((pestana) => ({
                value: pestana.id.toString(),
                label: `${pestana.nombre} (${pestana.ruta_completa})`,
            })),
        [pestanas]
    );

    // Aquí se determina si el formulario debe estar deshabilitado.
    const isFormDisabled = mode === "idle";

    /**
     * Navega a una URL actualizando el historial del navegador.
     * Usado para sincronizar estado con URL sin recargar la página.
     * 
     * @param {string} url - URL destino de la navegación.
     * @param {any} state - Estado opcional a asociar con el historial.
     */
    const navigateTo = (url: string, state: any = {}) => {
        window.history.pushState(state, "", url);
    };

    // Aquí se configura listener para sincronizar estado con navegación del navegador.
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;

            // Aquí se detecta modo crear en la URL.
            if (path.includes("/crear")) {
                setMode("create");
                setSelectedPestanaId(null);
                setFormErrors({});
            } else if (path.includes("/gestion/")) {
                // Aquí se detecta modo editar con ID en la URL.
                const idMatch = path.match(/\/gestion\/(\d+)/);
                if (idMatch) {
                    const id = Number(idMatch[1]);
                    setMode("edit");
                    setSelectedPestanaId(id);
                    setFormErrors({});
                }
            } else {
                // Aquí se resetea a modo idle.
                setMode("idle");
                setSelectedPestanaId(null);
                setFormErrors({});
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    /**
     * Maneja la selección de una pestaña para editar.
     * Cambia el modo a edición y actualiza la URL.
     * 
     * @param {string | number} value - ID de la pestaña seleccionada.
     */
    const handleSelectPestana = (value: string | number) => {
        const id = Number(value);
        setSelectedPestanaId(id);
        setMode("edit");
        setFormErrors({});
        navigateTo(route("pestana.edit", id));
    };

    /**
     * Maneja la acción de crear nueva pestaña.
     * Resetea selección y cambia modo a creación.
     */
    const handleCreateNew = () => {
        setSelectedPestanaId(null);
        setMode("create");
        setFormErrors({});
        navigateTo(route("pestana.create"));
    };

    /**
     * Cancela la operación actual y vuelve al modo idle.
     * Limpia selección, errores y actualiza URL.
     */
    const handleCancel = () => {
        setMode("idle");
        setSelectedPestanaId(null);
        setFormErrors({});
        navigateTo(route("pestana.gestion"));
    };

    /**
     * Maneja el envío del formulario de pestaña.
     * Valida permisos, hace petición al backend y actualiza estado local.
     * Muestra notificaciones según el resultado de la operación.
     * 
     * @param {PestanaFormData} data - Datos del formulario a enviar.
     */
    const handleSubmit = async (data: PestanaFormData) => {
        // Aquí se valida permisos antes de proceder.
        if (!puedeCrear && mode === "create") {
            toast({
                title: "Sin permisos",
                description: "No tienes permiso para crear pestañas",
                variant: "destructive",
            });
            return;
        }

        if (!puedeEditar && mode === "edit") {
            toast({
                title: "Sin permisos",
                description: "No tienes permiso para editar pestañas",
                variant: "destructive",
            });
            return;
        }

        setFormErrors({});

        try {
            // Aquí se determina la URL y método basado en el modo.
            const url =
                mode === "create"
                    ? route("pestana.store")
                    : route("pestana.update", selectedPestanaId);

            // Aquí se prepara el payload, convirtiendo permisos_extra a array o null.
            const permisosArray = data.permisos_extra
                ? data.permisos_extra.split(",").map((p) => p.trim()).filter(Boolean)
                : [];

            // Aquí se prepara el payload, convirtiendo permisos_extra a array.
            const payload = {
                ...data,
                permisos_extra: permisosArray.length > 0 ? permisosArray : null,
            };

            // Aquí se hace la llamada a API con fetch.
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();

            if (response.ok) {
                // Aquí se maneja respuesta exitosa con toast y actualización de estado.
                toast({
                    title: mode === "create" ? "Pestaña creada" : "Pestaña actualizada",
                    description: responseData.message,
                    variant: "success",
                });

                // Aquí se actualiza el estado local de pestañas y navega según el modo.
                if (mode === "create") {
                    setPestanas((prev) => [responseData.pestana, ...prev]);

                    if (puedeEditar) {
                        setSelectedPestanaId(Number(responseData.pestana.id));
                        setMode("edit");
                        navigateTo(route("pestana.edit", responseData.pestana.id));
                    } else {
                        setMode("create");
                        navigateTo(route("pestana.create"));
                    }
                } else {
                    setPestanas((prev) =>
                        prev.map((p) => (p.id === responseData.pestana.id ? responseData.pestana : p))
                    );
                }
            } else if (response.status === 422) {
                // Aquí se manejan errores de validación del backend.
                setFormErrors(responseData.errors || {});

                toast({
                    title: "Error de validación",
                    description: "Revisa los campos marcados e intenta de nuevo",
                    variant: "destructive",
                });
            } else if (response.status === 403) {
                // Aquí se maneja error de permisos insuficientes.
                toast({
                    title: "Acceso denegado",
                    description: responseData.error || "No tienes permisos para esta acción",
                    variant: "destructive",
                });
            } else {
                // Aquí se manejan otros errores del servidor.
                toast({
                    title: "Error",
                    description: responseData.error || "Intenta de nuevo más tarde",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            // Aquí se maneja errores en el submit.
            console.error("Error:", error);
            toast({
                title: "Error de conexión",
                description: "Revisa tu conexión e intenta de nuevo",
                variant: "destructive",
            });
        }
    };

    /**
     * Maneja la eliminación de la pestaña seleccionada.
     * Valida permisos, hace petición DELETE al backend y actualiza estado local.
     * Navega a modo idle tras eliminación exitosa.
     */
    const handleDelete = async () => {
        if (!selectedPestanaId || !puedeEliminar) return;

        try {
            const response = await fetch(route("pestana.destroy", selectedPestanaId), {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                },
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Error al eliminar");
            }

            // Aquí se muestra notificación de éxito y actualiza estado local.
            toast({
                title: "Pestaña eliminada",
                description: responseData.message,
                variant: "success",
            });

            setPestanas((prev) => prev.filter((p) => p.id !== selectedPestanaId));
            setSelectedPestanaId(null);
            setMode("idle");
            navigateTo(route("pestana.gestion"));
        } catch (error: any) {
            // Aquí se maneja error en la eliminación.
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    // Aquí se retornan estados, handlers y utilidades para uso en el componente principal.
    return {
        pestanas,
        selectedPestanaId,
        selectedPestana,
        mode,
        formErrors,
        isFormDisabled,
        pestanaOptions,
        puedeCrear,
        puedeEditar,
        puedeEliminar,
        handleSelectPestana,
        handleCreateNew,
        handleCancel,
        handleSubmit,
        handleDelete,
    };
}