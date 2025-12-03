/**
 * Hook useTipoGestion
 * 
 * Maneja toda la lógica de estado y operaciones CRUD para tipos de identificación
 * Incluye lógica especial para mostrar/ocultar formulario según permisos
 * 
 * @author Yariangel Aray
 * @date 2025-12-03
 */
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TipoIdentificacionInterface } from "../types/tipoInterface";
import { TipoFormData } from "../types/tipoForm.types";

interface UseTipoGestionProps {
  tiposIniciales: TipoIdentificacionInterface[];
  permisos: string[];
}

export function useTipoGestion({ tiposIniciales, permisos }: UseTipoGestionProps) {
  const { toast } = useToast();

  // Verificar permisos
    const puedeCrear = permisos.includes("crear");
    const puedeEditar = permisos.includes("editar");
    const puedeEliminar = permisos.includes("eliminar");

  // Estados
  const [tipos, setTipos] = useState<TipoIdentificacionInterface[]>(tiposIniciales);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingTipoId, setEditingTipoId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tipoToDelete, setTipoToDelete] = useState<TipoIdentificacionInterface | null>(null);

  // Obtener tipo en edición
  const editingTipo = tipos.find((tipo) => tipo.id === editingTipoId);

  /**
 * Determina si el formulario debe mostrarse
 * - Si puede crear: siempre se muestra
 * - Si solo puede editar: se muestra solo cuando está editando
 */
  const shouldShowForm = puedeCrear || (puedeEditar && mode === "edit");

  /**
   * Inicia el modo de edición
   */
  const handleEdit = (id: number) => {
    const tipo = tipos.find((t) => t.id === id);
    if (!tipo || !puedeEditar) return;

    setEditingTipoId(id);
    setMode("edit");
    setFormErrors({});
  };

  /**
   * Cancela la edición y vuelve al modo crear (si puede crear)
   * o oculta el formulario (si solo puede editar)
   */
  const handleCancel = () => {
    setFormErrors({});
    setEditingTipoId(null);
    setMode("create");
  };

  /**
   * Maneja el envío del formulario (crear o actualizar)
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
        url = route('tipo-identificacion.store');
        method = 'POST';
      } else if (mode === "edit" && editingTipoId) {
        url = route("tipo-identificacion.update", editingTipoId);
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
            // Agregar el nuevo tipo
            setTipos((prev) => [result.tipo, ...prev]);
            toast({
              title: "Tipo creado",
              description: "El tipo de identificación se ha creado correctamente",
              variant: "success",
            });
            // Si puede crear, se queda en modo crear
            // El formulario se resetea automáticamente
          } else {
            // Actualizar el tipo existente
            setTipos((prev) =>
              prev.map((tipo) => (tipo.id === result.tipo.id ? result.tipo : tipo))
            );
            toast({
              title: "Tipo actualizado",
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
   * Inicia el proceso de eliminación
   */
  const handleDeleteClick = (tipo: TipoIdentificacionInterface) => {
    if (!puedeEliminar) return;
    setTipoToDelete(tipo);
    setShowDeleteDialog(true);
  };

  /**
   * Cancela la eliminación
   */
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setTipoToDelete(null);
  };

  /**
   * Confirma y ejecuta la eliminación
   */
  const handleConfirmDelete = async () => {
    if (!tipoToDelete || !puedeEliminar) return;

    setProcessing(true);
    try {
        const response = await fetch(route("tipo-identificacion.destroy", tipoToDelete.id), {
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
            title: "Tipo eliminado",
            description: "El tipo de identificación se ha eliminado correctamente",
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
            description: result.error || "No se pudo eliminar el tipo",
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