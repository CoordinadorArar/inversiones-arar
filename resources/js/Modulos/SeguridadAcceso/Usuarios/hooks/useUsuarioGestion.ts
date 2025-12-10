/**
 * Hook useUsuarioGestion.
 * 
 * Maneja la lógica de gestión de usuarios (capa superior):
 * - Selección de usuario
 * - Modo (idle/create/edit)
 * - Permisos
 * - Acciones especiales: bloquear, desbloquear, restaurar contraseña
 * - Navegación y sincronización con URL del navegador
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { UsuarioInterface, RolInterface } from "../types/usuarioInterface";
import { UsuarioFormData } from "../types/usuarioForm.types";

interface UseUsuarioGestionProps {
  usuariosIniciales: UsuarioInterface[];
  roles: RolInterface[];
  permisos: string[];
  initialMode?: 'idle' | 'create' | 'edit';
  initialUsuarioId?: number | null;
}

export function useUsuarioGestion({
  usuariosIniciales,
  roles,
  permisos,
  initialMode = 'idle',
  initialUsuarioId = null,
}: UseUsuarioGestionProps) {
  const { toast } = useToast();

  // Permisos
  const puedeCrear = permisos.includes("crear");
  const puedeEditar = permisos.includes("editar");
  const puedeBloquear = permisos.includes("bloquear");
  const puedeRestaurar = permisos.includes("restaurar_password");  

  // Estados
  const [usuarios, setUsuarios] = useState(usuariosIniciales);  // Actualizable localmente.
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(initialUsuarioId);
  const [mode, setMode] = useState<"idle" | "create" | "edit">(initialMode);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usuario seleccionado
  const selectedUsuario = usuarios.find((u) => u.id === selectedUsuarioId);

  // Opciones para el SearchableSelect
  const usuarioOptions = useMemo(
    () =>
      usuarios.map((usuario) => ({
        value: usuario.id.toString(),
        label: `${usuario.numero_documento} - ${usuario.nombre_completo}`,
      })),
    [usuarios]
  );

  // Formulario deshabilitado
  const isFormDisabled = mode === "idle" || (!puedeCrear && !puedeEditar);

  // Usuario está bloqueado
  const isUsuarioBloqueado = selectedUsuario?.bloqueado_at !== null;

  // Función: Navegar y actualizar URL.
  const navigateTo = (url: string, state: any = {}) => {
    window.history.pushState(state, '', url);
  };

  // Efecto: Sincronizar el estado del hook con los cambios de navegación del navegador (back/forward).
  // Esto asegura que si el usuario navega usando los botones del navegador, el estado se actualice correctamente.
  useEffect(() => {
    // Función que maneja el evento 'popstate' (cuando cambia el historial de navegación).
    const handlePopState = () => {
      // Obtiene la ruta actual de la URL.
      const path = window.location.pathname;

      // Si la URL incluye '/crear', cambia al modo de creación.
      if (path.includes('/crear')) {
        setMode('create');  // Establece modo crear.
        setSelectedUsuarioId(null);  // Limpia selección de usuario.
        setFormErrors({});  // Limpia errores del formulario.
      } 
      // Si la URL incluye '/gestion/' seguido de un ID, cambia al modo de edición con ese ID.
      else if (path.includes('/gestion/')) {
        // Usa regex para extraer el ID numérico de la URL (ej. /gestion/123).
        const idMatch = path.match(/\/gestion\/(\d+)/);
        if (idMatch) {
          const id = Number(idMatch[1]);  // Convierte el ID a número.
          setMode('edit');  // Establece modo editar.
          setSelectedUsuarioId(id);  // Selecciona el usuario por ID.
          setFormErrors({});  // Limpia errores.
        }
      } 
      // Si no coincide con crear o editar, vuelve al modo idle (sin acción).
      else {
        setMode('idle');  // Modo inactivo.
        setSelectedUsuarioId(null);  // Sin usuario seleccionado.
        setFormErrors({});  // Limpia errores.
      }
    };

    // Agrega el listener para el evento 'popstate'.
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup: Remueve el listener cuando el componente se desmonta o el efecto se vuelve a ejecutar.
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);  // Array vacío: el efecto solo se ejecuta una vez al montar el componente.

  // Handlers de selección y modo
  const handleSelectUsuario = (value: string | number) => {
    const id = Number(value);
    setSelectedUsuarioId(id);
    setMode("edit");
    setFormErrors({});
    // Navega a la URL de edición
    navigateTo(route('usuario.edit', id));
  };

  const handleCreateNew = () => {
    setSelectedUsuarioId(null);
    setMode("create");
    setFormErrors({});
    // Navega a la URL de crear
    navigateTo(route('usuario.create'));
  };

  const handleCancel = () => {
    setMode("idle");
    setSelectedUsuarioId(null);
    setFormErrors({});
    // Navega a la URL base (gestión)
    navigateTo(route('usuario.gestion'));
  };

  // Submit del formulario
  const handleSubmit = async (data: UsuarioFormData) => {
    if (!puedeCrear && mode === "create") {
      toast({
        title: "Sin permisos",
        description: "No tienes permiso para crear usuarios",
        variant: "destructive",
      });
      return;
    }

    if (!puedeEditar && mode === "edit") {
      toast({
        title: "Sin permisos",
        description: "No tienes permiso para editar usuarios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const url =
        mode === "create"
          ? route("usuario.store")
          : route("usuario.update", selectedUsuarioId);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN":
            document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors) {
          setFormErrors(responseData.errors);
        }
        throw new Error(responseData.error || "Error al guardar");
      }

      toast({
        title: mode === "create" ? "Usuario creado" : "Usuario actualizado",
        description: responseData.message,
        variant: "success",
      });

      // Actualiza array local en lugar de recargar página
      if (mode === "create") {
        setUsuarios((prev) => [responseData.usuario, ...prev]);
        if (puedeEditar) {
          setSelectedUsuarioId(Number(responseData.usuario.id));
          setMode("edit");
          navigateTo(route('usuario.edit', responseData.usuario.id));
        } else {
          setMode("create");
          navigateTo(route('usuario.create'));
        }
      } else {
        setUsuarios((prev) =>
          prev.map((u) => (u.id === responseData.usuario.id ? responseData.usuario : u))
        );
        // navigateTo(route('usuario.edit', responseData.usuario.id));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bloquear usuario
  const handleBloquear = async () => {
    if (!selectedUsuarioId || !puedeBloquear) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(route("usuario.bloquear", selectedUsuarioId), {
        method: "POST",
        headers: {
          "Accept":"application/json",
          "X-CSRF-TOKEN":
            document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al bloquear usuario");
      }

      toast({
        title: "Usuario bloqueado",
        description: data.message || "El usuario ha sido bloqueado correctamente",
        variant: "success",
      });

      // Actualiza array local
      setUsuarios((prev) =>
        prev.map((u) => (u.id === selectedUsuarioId ? { ...u, bloqueado_at: new Date().toISOString() } : u))
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Desbloquear usuario
  const handleDesbloquear = async () => {
    if (!selectedUsuarioId || !puedeBloquear) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(route("usuario.desbloquear", selectedUsuarioId), {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN":
            document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al desbloquear usuario");
      }

      toast({
        title: "Usuario desbloqueado",
        description: data.message || "El usuario ha sido desbloqueado correctamente",
        variant: "success",
      });

      // Actualiza array local
      setUsuarios((prev) =>
        prev.map((u) => (u.id === selectedUsuarioId ? { ...u, bloqueado_at: null } : u))
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Restaurar contraseña
  const handleRestaurarPassword = async () => {
    if (!selectedUsuarioId || !puedeRestaurar) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        route("usuario.restaurar-password", selectedUsuarioId),
        {
          method: "POST",
          headers: {
            "X-CSRF-TOKEN":
              document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
              "",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al restaurar contraseña");
      }

      toast({
        title: "Contraseña restaurada",
        description:
          data.message || "Se ha enviado un correo al usuario con su nueva contraseña",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Estados
    usuarios,
    selectedUsuarioId,
    selectedUsuario,
    mode,
    formErrors,
    isSubmitting,
    isFormDisabled,
    isUsuarioBloqueado,
    usuarioOptions,
    roles,

    // Permisos
    puedeCrear,
    puedeEditar,
    puedeBloquear,
    puedeRestaurar,

    // Handlers
    handleSelectUsuario,
    handleCreateNew,
    handleCancel,
    handleSubmit,
    handleBloquear,
    handleDesbloquear,
    handleRestaurarPassword,
  };
}
