import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { PestanaInterface } from "../types/pestanaInterface";
import { PestanaFormData } from "../types/pestanaForm.types";

interface UsePestanaGestionProps {
    pestanasIniciales: PestanaInterface[];
    permisos: string[];
    initialMode?: "idle" | "create" | "edit";
    initialPestanaId?: number | null;
}

export function usePestanaGestion({
    pestanasIniciales,
    permisos,
    initialMode = "idle",
    initialPestanaId = null,
}: UsePestanaGestionProps) {
    const { toast } = useToast();

    const puedeCrear = permisos.includes("crear");
    const puedeEditar = permisos.includes("editar");
    const puedeEliminar = permisos.includes("eliminar");

    const [pestanas, setPestanas] = useState<PestanaInterface[]>(pestanasIniciales);
    const [selectedPestanaId, setSelectedPestanaId] = useState<number | null>(initialPestanaId);
    const [mode, setMode] = useState<"idle" | "create" | "edit">(initialMode);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const selectedPestana = pestanas.find((p) => p.id === selectedPestanaId);

    const pestanaOptions = useMemo(
        () =>
            pestanas.map((pestana) => ({
                value: pestana.id.toString(),
                label: `${pestana.nombre} (${pestana.ruta_completa})`,
            })),
        [pestanas]
    );

    const isFormDisabled = mode === "idle";

    const navigateTo = (url: string, state: any = {}) => {
        window.history.pushState(state, "", url);
    };

    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;

            if (path.includes("/crear")) {
                setMode("create");
                setSelectedPestanaId(null);
                setFormErrors({});
            } else if (path.includes("/gestion/")) {
                const idMatch = path.match(/\/gestion\/(\d+)/);
                if (idMatch) {
                    const id = Number(idMatch[1]);
                    setMode("edit");
                    setSelectedPestanaId(id);
                    setFormErrors({});
                }
            } else {
                setMode("idle");
                setSelectedPestanaId(null);
                setFormErrors({});
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const handleSelectPestana = (value: string | number) => {
        const id = Number(value);
        setSelectedPestanaId(id);
        setMode("edit");
        setFormErrors({});
        navigateTo(route("pestana.edit", id));
    };

    const handleCreateNew = () => {
        setSelectedPestanaId(null);
        setMode("create");
        setFormErrors({});
        navigateTo(route("pestana.create"));
    };

    const handleCancel = () => {
        setMode("idle");
        setSelectedPestanaId(null);
        setFormErrors({});
        navigateTo(route("pestana.gestion"));
    };

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
                permisos_extra: permisosArray.length > 0 ? permisosArray : null,  // <-- Envía null si el array está vacío
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
                // Éxito: Actualiza array local y muestra toast.
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
                // Errores de validación: setea en estado.
                setFormErrors(responseData.errors || {});

                toast({
                    title: "Error de validación",
                    description: "Revisa los campos marcados e intenta de nuevo",
                    variant: "destructive",
                });
            } else if (response.status === 403) {
                // Sin permisos.
                toast({
                    title: "Acceso denegado",
                    description: responseData.error || "No tienes permisos para esta acción",
                    variant: "destructive",
                });
            } else {
                // Otros errores.
                toast({
                    title: "Error",
                    description: responseData.error || "Intenta de nuevo más tarde",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            // Aquí se maneja errores en el submit.
            console.error("Error:", error);  // Log para debugging (como en empresas).
            toast({
                title: "Error de conexión",
                description: "Revisa tu conexión e intenta de nuevo",
                variant: "destructive",
            });
        }
    };


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
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

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