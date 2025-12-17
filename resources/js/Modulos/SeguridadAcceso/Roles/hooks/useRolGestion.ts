/**
 * Hook useRolGestion.
 * 
 * Maneja toda la lógica de estado y operaciones CRUD para roles.
 * Incluye gestión de estado, validaciones de permisos, llamadas API y toasts.
 * Se integra con React para gestión de roles via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-17
 */

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RolInterface } from "../types/rolInterface";
import { RolFormData } from "../types/rolForm.types";

/**
 * Interfaz para las props del hook useRolGestion.
 * Define los parámetros necesarios para configurar el hook de gestión de roles.
 */
interface UseRolGestionProps {
    rolesIniciales: RolInterface[]; // Lista inicial de roles.
    permisos: string[]; // Permisos del usuario en el módulo.
}

/**
 * Hook useRolGestion.
 * 
 * Gestiona el estado de roles, formulario, eliminación y operaciones CRUD via API.
 * Proporciona handlers para editar, cancelar, enviar y eliminar roles.
 * La validación se delega al componente para mejor UX.
 * 
 * @param {UseRolGestionProps} props - Props del hook.
 * @returns {Object} Objeto con estado y handlers para gestión de roles.
 */
export function useRolGestion({ rolesIniciales, permisos }: UseRolGestionProps) {
    const { toast } = useToast();

    // Aquí se determinan permisos del usuario basados en la lista de permisos.
    const puedeCrear = permisos.includes("crear");
    const puedeEditar = permisos.includes("editar");
    const puedeEliminar = permisos.includes("eliminar");

    // Aquí se usa useState para almacenar la lista de roles, inicializada con roles iniciales.
    const [roles, setRoles] = useState<RolInterface[]>(rolesIniciales);

    // Aquí se usa useState para almacenar el modo del formulario (crear o editar).
    const [mode, setMode] = useState<"create" | "edit">("create");

    // Aquí se usa useState para almacenar el ID del rol en edición.
    const [editingRolId, setEditingRolId] = useState<number | null>(null);

    // Aquí se usa useState para almacenar errores del formulario como objeto clave-valor.
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Aquí se usa useState para indicar si hay procesamiento en curso (ej: submit).
    const [processing, setProcessing] = useState(false);

    // Aquí se usa useState para controlar si mostrar el diálogo de eliminación.
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Aquí se usa useState para almacenar el rol a eliminar.
    const [rolToDelete, setRolToDelete] = useState<RolInterface | null>(null);

    // Aquí se encuentra el rol en edición basado en editingRolId.
    const editingRol = roles.find((rol) => rol.id === editingRolId);

    // Aquí se determina si mostrar el formulario basado en permisos y modo.
    const shouldShowForm = puedeCrear || (puedeEditar && mode === "edit");

    /**
     * Handler para iniciar edición de un rol.
     * Cambia modo a edit, establece ID de edición y limpia errores.
     * Hace scroll al formulario después de un delay.
     * 
     * @param {number} id - ID del rol a editar.
     */
    const handleEdit = (id: number) => {
        const rol = roles.find((r) => r.id === id);
        if (!rol || !puedeEditar) return;

        setEditingRolId(id);
        setMode("edit");
        setFormErrors({});

        // Aquí se hace scroll al formulario después de un delay para mejor UX.
        setTimeout(() => {
            document.getElementById('rol-form-container')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    /**
     * Handler para cancelar edición.
     * Limpia errores, resetea ID de edición y cambia a modo create.
     */
    const handleCancel = () => {
        setFormErrors({});
        setEditingRolId(null);
        setMode("create");
    };

    /**
     * Handler para submit del formulario.
     * Maneja crear o editar rol via API, actualiza estado y muestra toasts.
     * La validación se movió al componente para mejor UX.
     * 
     * @param {RolFormData} data - Datos del formulario.
     * @returns {Promise<{reset?: boolean}>} Objeto opcional para resetear formulario.
     */
    const handleSubmit = async (data: RolFormData) => {
        setProcessing(true);

        try {
            let response: Response;
            let url: string;
            let method: string;

            // Aquí se determina URL y método basado en modo.
            if (mode === "create") {
                url = route('rol.store');
                method = 'POST';
            } else if (mode === "edit" && editingRolId) {
                url = route('rol.update', editingRolId);
                method = 'PUT';                
            } else {
                throw new Error('Modo inválido');
            }

            response = await fetch(url, {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    nombre: data.nombre,
                    abreviatura: data.abreviatura,
                })
            });

            const result = await response.json();

            if (response.ok) {
                if (mode === "create") {
                    // Aquí se agrega nuevo rol al estado.
                    setRoles((prev) => [result.rol, ...prev]);
                    toast({
                        title: "Rol creado",
                        description: "El rol se ha creado correctamente",
                        variant: "success",
                    });
                    return { reset: true };
                } else {
                    // Aquí se actualiza rol existente en el estado.
                    setRoles((prev) =>
                        prev.map((rol) => (rol.id === result.rol.id ? result.rol : rol))
                    );
                    toast({
                        title: "Rol actualizado",
                        description: "Los cambios se han guardado correctamente",
                        variant: "success",
                    });

                    setEditingRolId(null);
                    setMode("create");
                }
                setFormErrors({});
            } else if (response.status === 422) {
                // Aquí se manejan errores de validación del servidor.
                setFormErrors(result.errors || {});
                toast({
                    title: "Error de validación",
                    description: "Revisa los campos marcados e intenta de nuevo",
                    variant: "destructive",
                });
            } else if (response.status === 403) {
                // Aquí se maneja acceso denegado.
                toast({
                    title: "Acceso denegado",
                    description: result.error || "No tienes permisos para esta acción",
                    variant: "destructive",
                });
            } else {
                // Aquí se maneja error genérico.
                toast({
                    title: "Error",
                    description: result.error || "Intenta de nuevo más tarde",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error de conexión",
                description: "Revisa tu conexión e intenta de nuevo",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    /**
     * Handler para iniciar eliminación de un rol.
     * Establece rol a eliminar y muestra diálogo.
     * 
     * @param {RolInterface} rol - Rol a eliminar.
     */
    const handleDeleteClick = (rol: RolInterface) => {
        if (!puedeEliminar) return;
        setRolToDelete(rol);
        setShowDeleteDialog(true);
    };

    /**
     * Handler para cancelar eliminación.
     * Cierra diálogo y limpia rol a eliminar.
     */
    const handleCancelDelete = () => {
        setShowDeleteDialog(false);
        setRolToDelete(null);
    };

    /**
     * Handler para confirmar eliminación.
     * Elimina rol via API, actualiza estado y muestra toast.
     */
    const handleConfirmDelete = async () => {
        if (!rolToDelete || !puedeEliminar) return;

        setProcessing(true);
        try {
            const response = await fetch(route('rol.destroy', rolToDelete.id), {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const result = await response.json();

            if (response.ok) {
                // Aquí se remueve rol del estado.
                setRoles((prev) => prev.filter((rol) => rol.id !== rolToDelete.id));

                if (editingRolId === rolToDelete.id) {
                    setEditingRolId(null);
                    if (puedeCrear) {
                        setMode("create");
                    }
                }

                toast({
                    title: "Rol eliminado",
                    description: "El rol se ha eliminado correctamente",
                    variant: "success",
                });
            } else if (response.status === 403) {
                // Aquí se maneja acceso denegado para eliminación.
                toast({
                    title: "Acceso denegado",
                    description: result.error || "No tienes permisos para eliminar",
                    variant: "destructive",
                });
            } else {
                // Aquí se maneja error al eliminar.
                toast({
                    title: "Error al eliminar",
                    description: result.error || "No se pudo eliminar el rol",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error de conexión",
                description: "Revisa tu conexión e intenta de nuevo",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
            setShowDeleteDialog(false);
            setRolToDelete(null);
        }
    };

    // Aquí se retorna el objeto con estado y handlers para usar en el componente.
    return {
        roles,
        mode,
        editingRolId,
        editingRol,
        formErrors,
        processing,
        showDeleteDialog,
        rolToDelete,
        shouldShowForm,
        puedeCrear,
        puedeEditar,
        puedeEliminar,
        handleEdit,
        handleCancel,
        handleSubmit,
        handleDeleteClick,
        handleCancelDelete,
        handleConfirmDelete,
    };
}
