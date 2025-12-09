/**
 * Hook useUsuarioGestion
 * 
 * Maneja la lógica de gestión de usuarios (capa superior):
 * - Selección de usuario
 * - Modo (idle/create/edit)
 * - Permisos
 * - Acciones especiales: bloquear, desbloquear, restaurar contraseña
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

import { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { UsuarioInterface, RolInterface } from "../types/usuarioInterface";
import { UsuarioFormData } from "../types/usuarioForm.types";

interface UseUsuarioGestionProps {
  usuariosIniciales: UsuarioInterface[];
  roles: RolInterface[];
  permisos: string[];
}

export function useUsuarioGestion({
  usuariosIniciales,
  roles,
  permisos,
}: UseUsuarioGestionProps) {
  const { toast } = useToast();

  // Permisos
  const puedeCrear = permisos.includes("crear");
  const puedeEditar = permisos.includes("editar");
  const puedeEliminar = permisos.includes("eliminar");

  // Estados
  const [usuarios] = useState(usuariosIniciales);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(null);
  const [mode, setMode] = useState<"idle" | "create" | "edit">("idle");
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

  // Handlers de selección y modo
  const handleSelectUsuario = (value: string) => {
    const id = parseInt(value);
    setSelectedUsuarioId(id);
    setMode("edit");
    setFormErrors({});
  };

  const handleCreateNew = () => {
    setSelectedUsuarioId(null);
    setMode("create");
    setFormErrors({});
  };

  const handleCancel = () => {
    setMode("idle");
    setSelectedUsuarioId(null);
    setFormErrors({});
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
          ? route("usuarios.store")
          : route("usuarios.update", selectedUsuarioId);

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

      router.reload({ only: ["usuarios"] });
      handleCancel();
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
    if (!selectedUsuarioId || !puedeEditar) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(route("usuarios.bloquear", selectedUsuarioId), {
        method: "POST",
        headers: {
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

      router.reload({ only: ["usuarios"] });
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
    if (!selectedUsuarioId || !puedeEditar) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(route("usuarios.desbloquear", selectedUsuarioId), {
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

      router.reload({ only: ["usuarios"] });
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
    if (!selectedUsuarioId || !puedeEditar) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        route("usuarios.restaurar-password", selectedUsuarioId),
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
    puedeEliminar,

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