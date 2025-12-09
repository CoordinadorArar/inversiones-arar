/**
 * Página UsuariosGestion
 * 
 * Gestión completa de usuarios:
 * - Select con búsqueda para seleccionar usuario a editar
 * - Botón para crear nuevo usuario
 * - Formulario que se habilita/deshabilita según acción y permisos
 * - Botones especiales: Bloquear/Desbloquear, Restaurar contraseña
 * - Autocompletado de nombre al buscar por documento
 * 
 * Lógica separada en useUsuarioGestion y useUsuarioForm hooks
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { SearchableSelect } from "@/Components/SearchableSelect";
import { Button } from "@/Components/ui/button";
import { FilePlus, Pencil, Plus, Lock, Unlock, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useUsuarioGestion } from "../hooks/useUsuarioGestion";
import { useEffect, useMemo, useState } from "react";
import { USUARIO_INITIAL_DATA } from "../types/usuarioForm.types";
import { UsuarioForm } from "../partials/UsuarioForm";
import { TabInterface } from "@/Types/tabInterface";
import { RolInterface, UsuarioInterface } from "../types/usuarioInterface";

export interface UsuarioGestionProps {
  tabs: TabInterface[];
  usuarios: UsuarioInterface[];
  roles: RolInterface[];
  moduloNombre: string;
  permisos: string[];
  initialMode?: 'idle' | 'create' | 'edit'; // Modo inicial desde URL
  initialUsuarioId?: number | null; // ID de empresa si viene desde URL
  error?: string | null;
}

export default function UsuariosGestion({
  usuarios: usuariosBack,
  tabs,
  moduloNombre,
  permisos,
  roles,
  initialMode = 'idle',
  initialUsuarioId = null,
  error
}: UsuarioGestionProps) {
  const {
    selectedUsuarioId,
    selectedUsuario,
    mode,
    formErrors,
    isFormDisabled,
    isUsuarioBloqueado,
    usuarioOptions,
    puedeCrear,
    puedeEditar,
    isSubmitting,
    handleSelectUsuario,
    handleCreateNew,
    handleCancel,
    handleSubmit,
    handleBloquear,
    handleDesbloquear,
    handleRestaurarPassword,
  } = useUsuarioGestion({
    usuariosIniciales: usuariosBack,
    roles,
    permisos,
    initialMode,
    initialUsuarioId,
  });

  // Datos iniciales del formulario según modo
  const formInitialData = useMemo(() => {
    if (mode === "edit" && selectedUsuario) {
      return {
        numero_documento: selectedUsuario.numero_documento,
        nombre_completo: selectedUsuario.nombre_completo,
        email: selectedUsuario.email,
        rol_id: selectedUsuario.rol_id,
      };
    }

    return USUARIO_INITIAL_DATA;
  }, [mode, selectedUsuario]);

  // Mantiene cualquier error que venga del backend
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cuando cambie la prop `error` (del backend), actualiza el mensaje
  useEffect(() => {
    setErrorMessage(error ?? null);
  }, [error]);

  // Si el usuario cambia algo -> limpia error
  useEffect(() => {
    const userInteracted =
      (selectedUsuarioId && selectedUsuarioId !== initialUsuarioId) ||
      mode === "create";

    if (userInteracted) {
      setErrorMessage(null);
    }
  }, [selectedUsuarioId, mode, initialUsuarioId]);

  return (
    <ModuleLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >
      <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-6">
          {/* Sección de selección */}
          <div>
            <div
              className={`grid gap-4 items-end${puedeCrear ? " md:grid-cols-[1fr_auto]" : ""
                }`}
            >
              {/* Select de usuarios */}
              <div>
                <Label>Seleccionar usuario para editar</Label>

                {puedeEditar ? (
                  <SearchableSelect
                    options={usuarioOptions}
                    value={selectedUsuarioId?.toString() || ""}
                    onValueChange={handleSelectUsuario}
                    placeholder="Buscar usuario..."
                    searchPlaceholder="Escribir para buscar..."
                    emptyText="No se encontraron usuarios"
                  />
                ) : (
                  <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10 w-full">
                    <p className="text-sm text-destructive">
                      No tienes permiso para editar usuarios
                    </p>
                  </div>
                )}
              </div>

              {/* Botón crear */}
              {puedeCrear && (
                <Button
                  onClick={handleCreateNew}
                  disabled={mode === "create"}
                  className="w-full md:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </Button>
              )}
            </div>

            {/* Muestra error si existe */}
            {errorMessage && (
              <div className="p-3 rounded-lg border text-destructive border-destructive/50 bg-destructive/10 w-full mt-4 flex gap-2 items-center">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Indicador de modo */}
            {mode !== "idle" && (
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">
                    {mode === "create" ? (
                      <span className="flex gap-2 items-center">
                        <FilePlus className="h-4 w-4" />
                        Modo: Crear nuevo usuario
                      </span>
                    ) : (
                      <span className="flex gap-2 items-center">
                        <Pencil className="h-4 w-4" />
                        Modo: Editando {selectedUsuario?.nombre_completo}
                      </span>
                    )}
                  </p>

                  {/* Badge de estado bloqueado */}
                  {mode === "edit" && selectedUsuario && (
                    <div className="flex items-center gap-2">
                      {isUsuarioBloqueado ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-700 border border-red-500/20">
                          <Lock className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Bloqueado</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-500/20">
                          <Unlock className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Activo</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Formulario */}
          <div className="flex-1 relative">
            <div
              className={`transition-opacity duration-300 ${isFormDisabled ? "opacity-50 pointer-events-none" : ""
                }`}
            >
              {(puedeCrear || puedeEditar) && (
                <UsuarioForm
                  mode={mode === "create" ? "create" : "edit"}
                  initialData={formInitialData}
                  disabled={isFormDisabled}
                  roles={roles}
                  onSubmit={handleSubmit}
                  onBloquear={mode === "edit" ? handleBloquear : undefined}
                  onDesbloquear={mode === "edit" ? handleDesbloquear : undefined}
                  onRestaurarPassword={
                    mode === "edit" ? handleRestaurarPassword : undefined
                  }
                  onCancel={handleCancel}
                  externalErrors={formErrors}
                  isUsuarioBloqueado={isUsuarioBloqueado}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

            {/* Mensaje cuando está bloqueado */}
            {isFormDisabled && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                <div className="bg-background/90 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center sm:max-w-sm">
                  {!puedeCrear && !puedeEditar ? (
                    <div className="space-y-2">
                      <p className="text-destructive font-medium">Sin permisos</p>
                      <p className="text-sm text-muted-foreground">
                        No tienes permisos para crear ni editar usuarios
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {puedeEditar ? "Selecciona un usuario para editar" : ""}
                      {puedeEditar && puedeCrear ? " o c" : "C"}
                      {puedeCrear ? "rea uno nuevo para comenzar" : ""}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}

UsuariosGestion.layout = (page: any) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);