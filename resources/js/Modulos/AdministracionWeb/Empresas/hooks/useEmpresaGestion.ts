/**
 * Hook useEmpresaGestion
 * 
 * Maneja toda la lógica de estado y operaciones CRUD para la gestión de empresas.
 * Incluye permisos, selección, modos, envío con fetch, eliminación y navegación por URL.
 * 
 * @author Yariangel Aray
 * @date 2025-12-01
 */
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmpresaInterface } from "../types/empresaInterface";
import { EmpresaFormData } from "../types/empresaForm.types";
import { SearchableSelectOption } from "@/Components/SearchableSelect";

/**
 * Interface para las props del hook useEmpresaGestion.
 * Define los parámetros iniciales necesarios.
 */
interface UseEmpresaGestionProps {
  empresasIniciales: EmpresaInterface[];  // Empresas iniciales para el estado.
  permisos: string[];  // Permisos del usuario (ej. ["crear", "editar"]).
  initialMode?: 'idle' | 'create' | 'edit';
  initialEmpresaId?: number | null;
}

/**
 * Hook personalizado useEmpresaGestion.
 * 
 * Gestiona estado de empresas, permisos y operaciones CRUD con fetch.
 * Usa toasts para feedback y actualiza arrays locales para UX fluida.
 * Sincroniza URL con estado usando window.history.pushState.
 */
export function useEmpresaGestion({
  empresasIniciales,
  permisos,
  initialMode = 'idle',
  initialEmpresaId = null,
}: UseEmpresaGestionProps) {
  const { toast } = useToast();  // Hook para mostrar notificaciones.

  // ============================================================================
  // VERIFICACIÓN DE PERMISOS
  // ============================================================================
  // Verifica permisos basados en el array proporcionado.
  const puedeCrear = permisos.includes("crear");  // Permiso para crear empresas.
  const puedeEditar = permisos.includes("editar");  // Permiso para editar.
  const puedeEliminar = permisos.includes("eliminar");  // Permiso para eliminar.

  // ============================================================================
  // ESTADOS PRINCIPALES
  // ============================================================================
  // ID de la empresa seleccionada (null si ninguna).
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(initialEmpresaId);

  // Array de empresas: se actualiza localmente para evitar recargas.
  const [empresas, setEmpresas] = useState<EmpresaInterface[]>(empresasIniciales);

  // Modo actual: "idle" (sin acción), "create" (creando), "edit" (editando).
  const [mode, setMode] = useState<'idle' | 'create' | 'edit'>(initialMode);

  // Errores del formulario (del backend).
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ============================================================================
  // EFECTO: Sincronizar con cambios de navegación del navegador
  // ============================================================================
  useEffect(() => {
    const handlePopState = () => {
      // Cuando el usuario usa back/forward, sincronizar el estado con la URL
      const path = window.location.pathname;

      if (path.includes('/crear')) {
        setMode('create');
        setSelectedEmpresaId(null);
        setFormErrors({});
      } else if (path.includes('/editar/')) {
        const idMatch = path.match(/\/editar\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);
          setMode('edit');
          setSelectedEmpresaId(id);
          setFormErrors({});
        }
      } else {
        setMode('idle');
        setSelectedEmpresaId(null);
        setFormErrors({});
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ============================================================================
  // DATOS DERIVADOS
  // ============================================================================
  // Opciones para el select de búsqueda: mapea empresas a formato requerido.
  const empresaOptions: SearchableSelectOption[] = empresas.map((emp) => ({
    value: emp.id,
    label: `${emp.razon_social}${emp.siglas ? ` - (${emp.siglas})` : ""}`,  // Label con razón social y siglas opcionales.
  }));

  // Empresa seleccionada: encuentra por ID.
  const selectedEmpresa = empresas.find((emp) => emp.id === selectedEmpresaId);

  // Si el formulario está deshabilitado: solo en modo "idle".
  const isFormDisabled = mode === "idle";

  // ============================================================================
  // FUNCIÓN: Navegar y actualizar URL
  // ============================================================================
  const navigateTo = (url: string, state: any = {}) => {
    window.history.pushState(state, '', url);
  };

  // ============================================================================
  // HANDLERS (Manejadores de eventos)
  // ============================================================================

  /**
   * Handler: Selecciona una empresa para editar.
   * Cambia modo a "edit", limpia errores y navega a URL de edición.
   * 
   * @param id - ID de la empresa (string o number).
   */
  const handleSelectEmpresa = (id: string | number) => {
    const empresaId = Number(id);
    setFormErrors({});  // Limpia errores previos.
    setSelectedEmpresaId(empresaId);  // Convierte a number.
    setMode("edit");  // Cambia a modo edición.

    // Navega a la URL de edición
    navigateTo(route('empresa.edit', empresaId));
  };

  /**
   * Handler: Inicia creación de nueva empresa.
   * Resetea selección, cambia a modo "create" y navega a URL de crear.
   */
  const handleCreateNew = () => {
    setFormErrors({});  // Limpia errores.
    setSelectedEmpresaId(null);  // Sin selección.
    setMode("create");  // Modo creación.

    // Navega a la URL de crear
    navigateTo(route('empresa.create'));
  };

  /**
   * Handler: Cancela la operación actual.
   * Vuelve a "idle", limpia estado y navega a URL base.
   */
  const handleCancel = () => {
    setFormErrors({});  // Limpia errores.
    setSelectedEmpresaId(null);  // Sin selección.
    setMode("idle");  // Modo inactivo.

    // Navega a la URL base (gestión)
    navigateTo(route('empresa.gestion'));
  };

  /**
   * Handler: Envía el formulario (crear o actualizar).
   * Usa fetch con FormData, maneja respuestas y actualiza estado local.
   * 
   * @param data - Datos del formulario validados.
   */
  const handleSubmit = async (data: EmpresaFormData) => {
    // Prepara FormData para envío (incluye archivos).
    const formData = new FormData();

    // Agrega campos al FormData, manejando tipos especiales.
    Object.entries(data).forEach(([key, value]) => {
      if (key === "logo" && value instanceof File) {
        formData.append("logo", value);  // Archivo de logo.
      } else if (key === "logo_preview") {
        return;  // No enviar preview.
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");  // Booleanos como string.
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));  // Otros valores como string.
      }
    });

    try {
      let response: Response;
      let url: string;
      let method: string;

      // Configura URL y método según modo.
      if (mode === "create") {
        url = route('empresa.store');  // Ruta para crear.
        method = 'POST';
      } else if (mode === "edit" && selectedEmpresaId) {
        url = route("empresa.update", selectedEmpresaId);  // Ruta para actualizar.
        method = 'POST';
        formData.append('_method', 'PUT');  // Simula PUT con POST.
      } else {
        throw new Error('Modo inválido');  // Error si modo no válido.
      }

      // Fetch con headers CSRF y JSON.
      response = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',  // Espera JSON.
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',  // Token CSRF.
          'X-Requested-With': 'XMLHttpRequest',  // Para Laravel.
        },
        body: formData,  // Envía FormData.
      });

      const result = await response.json();  // Parsea respuesta.

      if (response.ok) {
        // Éxito: Actualiza array local y muestra toast.
        if (mode === "create") {
          // Agregar nueva empresa al array
          setEmpresas((prev) => [result.empresa, ...prev]);

          toast({
            title: "Empresa creada",
            description: "La empresa se ha creado correctamente",
            variant: "success",
          });

          if (puedeEditar) {
            // Si puede editar, cambiar a modo editar con la nueva empresa
            setSelectedEmpresaId(Number(result.empresa.id));
            setMode("edit");
            navigateTo(route('empresa.edit', result.empresa.id));
          } else {
            // Si no puede editar, mantener en modo crear
            setMode("create");
            navigateTo(route('empresa.create'));
          }
        } else {
          // Actualiza empresa existente en el array.
          setEmpresas((prev) =>
            prev.map((emp) => (emp.id === result.empresa.id ? result.empresa : emp))
          );

          toast({
            title: "Empresa actualizada",
            description: "Los cambios se han guardado correctamente",
            variant: "success",
          });

          // Mantener en modo editar con la misma empresa
          navigateTo(route('empresa.edit', result.empresa.id));
        }
      } else if (response.status === 422) {
        // Errores de validación: setea en estado.
        setFormErrors(result.errors || {});
        toast({
          title: "Error de validación",
          description: "Revisa los campos marcados e intenta de nuevo",
          variant: "destructive",
        });
      } else if (response.status === 403) {
        // Sin permisos.
        toast({
          title: "Acceso denegado",
          description: result.error || "No tienes permisos para esta acción",
          variant: "destructive",
        });
      } else {
        // Otros errores.
        toast({
          title: "Error",
          description: result.error || "Intenta de nuevo más tarde",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);  // Log para debugging.
      toast({
        title: "Error de conexión",
        description: "Revisa tu conexión e intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  /**
   * Handler: Elimina la empresa seleccionada.
   * Usa fetch DELETE, actualiza array local, resetea estado y navega a URL base.
   */
  const handleDelete = async () => {
    if (!selectedEmpresaId) return;  // Si no hay selección, no hace nada.

    try {
      // Fetch DELETE con headers.
      const response = await fetch(route("empresa.destroy", selectedEmpresaId), {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const result = await response.json();

      if (response.ok) {
        // Éxito: Remueve del array y resetea.
        setEmpresas((prev) => prev.filter((emp) => emp.id !== selectedEmpresaId));
        setSelectedEmpresaId(null);
        setMode("idle");

        toast({
          title: "Empresa eliminada",
          description: "La empresa se ha eliminado correctamente",
          variant: "success",
        });

        // Navega a la URL base después de eliminar
        navigateTo(route('empresa.gestion'));
      } else if (response.status === 403) {
        // Sin permisos.
        toast({
          title: "Acceso denegado",
          description: result.error || "No tienes permisos para eliminar",
          variant: "destructive",
        });
      } else {
        // Error al eliminar.
        toast({
          title: "Error al eliminar",
          description: result.error || "No se pudo eliminar la empresa",
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
    }
  };

  // ============================================================================
  // RETORNO DEL HOOK
  // ============================================================================
  // Devuelve estados, permisos y handlers para el componente padre.
  return {
    // Estados para renderizar UI.
    selectedEmpresaId,  // ID seleccionado.
    empresas,  // Array de empresas.
    mode,  // Modo actual.
    formErrors,  // Errores del formulario.
    selectedEmpresa,  // Empresa seleccionada.
    isFormDisabled,  // Si formulario está deshabilitado.
    empresaOptions,  // Opciones para select.

    // Permisos verificados.
    puedeCrear,  // Puede crear.
    puedeEditar,  // Puede editar.
    puedeEliminar,  // Puede eliminar.

    // Handlers para eventos.
    handleSelectEmpresa,  // Seleccionar empresa.
    handleCreateNew,  // Crear nueva.
    handleCancel,  // Cancelar.
    handleSubmit,  // Enviar formulario.
    handleDelete,  // Eliminar empresa.
  };
}