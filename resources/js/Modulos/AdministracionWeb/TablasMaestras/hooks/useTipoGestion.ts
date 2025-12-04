/**
 * Hook useTipoGestion.
 * 
 * Maneja toda la lógica de estado y operaciones CRUD para tipos:
 * incluye verificación de permisos, estados para modo y edición, y handlers para crear, editar y eliminar.
 * Actualiza la lista de tipos localmente tras operaciones exitosas y muestra toasts para feedback.
 * Se usa en componentes de gestión para centralizar la lógica de UI y API.
 * Es genérico: recibe rutas y tipo de dato como parámetros para reutilizarse en diferentes tablas maestras.
 * 
 * @author Yariangel Aray
 * @date 2025-12-04
 */
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TipoInterface } from "../types/tipoInterface"; // Usamos la interfaz común para todas
import { TipoFormData } from "../types/tipoForm.types";

/**
 * Interfaz para las props del hook useTipoGestion.
 * Define los datos iniciales, permisos y rutas necesarias para gestionar tipos.
 * 
 * @typedef {Object} UseTipoGestionProps
 * @property {TipoInterface[]} tiposIniciales - Lista inicial de tipos.
 * @property {string[]} permisos - Lista de permisos del usuario (ej. "crear", "editar").
 * @property {string} rutaBase - Ruta base para crear, actualizar o eliminar (ej. 'base.store', 'base.update', 'base.destroy').
 */
interface UseTipoGestionProps {
  tiposIniciales: TipoInterface[];
  permisos: string[];
  rutaBase: string;
}

/**
 * Hook personalizado para gestionar estado y operaciones CRUD de tipos.
 * Incluye lógica para mostrar/ocultar formulario según permisos y manejar interacciones con la API.
 * Genérico: usa la misma interfaz para todas las tablas maestras.
 */
export function useTipoGestion({ tiposIniciales, permisos, rutaBase }: UseTipoGestionProps) {
  // Aquí se usa useToast para mostrar notificaciones de éxito/error al usuario.
  const { toast } = useToast();

  // Verificar permisos: Determina si el usuario puede crear, editar o eliminar.
  const puedeCrear = permisos.includes("crear");
  const puedeEditar = permisos.includes("editar");
  const puedeEliminar = permisos.includes("eliminar");

  // Aquí se usa useState para manejar la lista de tipos (actualizada tras operaciones).
  const [tipos, setTipos] = useState<TipoInterface[]>(tiposIniciales);
  // Aquí se usa useState para manejar el modo del formulario (crear o editar).
  const [mode, setMode] = useState<"create" | "edit">("create");
  // Aquí se usa useState para almacenar el ID del tipo en edición.
  const [editingTipoId, setEditingTipoId] = useState<number | null>(null);
  // Aquí se usa useState para manejar errores del formulario.
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  // Aquí se usa useState para indicar si hay un proceso en curso (envío/eliminación).
  const [processing, setProcessing] = useState(false);
  // Aquí se usa useState para controlar la visibilidad del dialog de eliminación.
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // Aquí se usa useState para almacenar el tipo seleccionado para eliminar.
  const [tipoToDelete, setTipoToDelete] = useState<TipoInterface | null>(null);

  // Variable calculada: Obtiene el tipo actualmente en edición basado en editingTipoId.
  const editingTipo = tipos.find((tipo) => tipo.id === editingTipoId);

  /**
   * Determina si el formulario debe mostrarse.
   * - Si puede crear: siempre se muestra.
   * - Si solo puede editar: se muestra solo cuando está editando.
   * 
   * @returns {boolean} True si el formulario debe renderizarse.
   */
  const shouldShowForm = puedeCrear || (puedeEditar && mode === "edit");

  /**
   * Inicia el modo de edición para un tipo específico.
   * Verifica permisos antes de cambiar estados.
   * 
   * @param {number} id - ID del tipo a editar.
   */
  const handleEdit = (id: number) => {
    const tipo = tipos.find((t) => t.id === id);
    if (!tipo || !puedeEditar) return;

    setEditingTipoId(id);
    setMode("edit");
    setFormErrors({});

    if (true) {
      setTimeout(() => {
        const formElement = document.getElementById('tipo-form-container');
        if (formElement) {
          formElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100); // Pequeño delay para asegurar que el DOM se actualizó
    }
  };

  /**
   * Cancela la edición y resetea al modo crear (si puede crear) o oculta el formulario.
   */
  const handleCancel = () => {
    setFormErrors({});
    setEditingTipoId(null);
    setMode("create");
  };

  /**
   * Maneja el envío del formulario para crear o actualizar un tipo.
   * Envía datos a la API, actualiza la lista local y muestra feedback con toasts.
   * 
   * @param {TipoFormData} data - Datos validados del formulario.
   */
  const handleSubmit = async (data: TipoFormData) => {
    setProcessing(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {
      let response: Response;
      let url: string;
      let method: string;

      if (mode === "create") {
        url = route(`${rutaBase}.store`);
        method = 'POST';
      } else if (mode === "edit" && editingTipoId) {
        url = route(`${rutaBase}.update`, editingTipoId);
        method = 'POST';
        formData.append('_method', 'PUT');
      } else {
        throw new Error('Modo inválido');
      }

        response = await fetch(url, {
          method,
          headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          if (mode === "create") {
            // Agregar el nuevo tipo a la lista
            setTipos((prev) => [result.tipo, ...prev]);
            toast({
              title: "Elemento creado",
              description: "El elemento se ha creado correctamente",
              variant: "success",
            });
            // Si puede crear, se queda en modo crear
            // El formulario se resetea          
            return { reset: true };
          } else {
            // Actualizar el tipo existente en la lista
            setTipos((prev) =>
              prev.map((tipo) => (tipo.id === result.tipo.id ? result.tipo : tipo))
            );
            toast({
              title: "Elemento actualizado",
              description: "Los cambios se han guardado correctamente",
              variant: "success",
            });

            // Después de editar, vuelve al modo crear si puede crear
            // Si no puede crear, oculta el formulario
            setEditingTipoId(null);
            setMode("create");            
          }
          setFormErrors({});
        } else if (response.status === 422) {
          setFormErrors(result.errors || {});
          toast({
            title: "Error de validación",
            description: "Revisa los campos marcados e intenta de nuevo",
            variant: "destructive",
          });
        } else if (response.status === 403) {
          toast({
            title: "Acceso denegado",
            description: result.error || "No tienes permisos para esta acción",
            variant: "destructive",
          });
        } else {
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
   * Inicia el proceso de eliminación abriendo el dialog.
   * Verifica permisos antes de proceder.
   * 
   * @param {TipoInterface} tipo - Tipo a eliminar.
   */
  const handleDeleteClick = (tipo: TipoInterface) => {
    if (!puedeEliminar) return;
    setTipoToDelete(tipo);
    setShowDeleteDialog(true);
  };

  /**
   * Cancela la eliminación cerrando el dialog.
   */
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setTipoToDelete(null);
  };

  /**
   * Confirma y ejecuta la eliminación del tipo.
   * Envía petición a la API, actualiza la lista y muestra feedback.
   */
  const handleConfirmDelete = async () => {
    if (!tipoToDelete || !puedeEliminar) return;

    setProcessing(true);
    try {
        const response = await fetch(route(`${rutaBase}.destroy`, tipoToDelete.id), {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        const result = await response.json();

        if (response.ok) {
          setTipos((prev) => prev.filter((tipo) => tipo.id !== tipoToDelete.id));

          // Si estaba editando el tipo eliminado, resetea el formulario
          if (editingTipoId === tipoToDelete.id) {
            setEditingTipoId(null);
            if (puedeCrear) {
              setMode("create");
            }
          }

          toast({
            title: "Elemento eliminado",
            description: "El elemento se ha eliminado correctamente",
            variant: "success",
          });
        } else if (response.status === 403) {
          toast({
            title: "Acceso denegado",
            description: result.error || "No tienes permisos para eliminar",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error al eliminar",
            description: result.error || "No se pudo eliminar el elemento",
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
      setTipoToDelete(null);
    }
  };

  return {
    // Estados
    tipos,
    mode,
    editingTipoId,
    editingTipo,
    formErrors,
    processing,
    showDeleteDialog,
    tipoToDelete,
    shouldShowForm,

    // Permisos
    puedeCrear,
    puedeEditar,
    puedeEliminar,

    // Handlers
    handleEdit,
    handleCancel,
    handleSubmit,
    handleDeleteClick,
    handleCancelDelete,
    handleConfirmDelete,
  };
}