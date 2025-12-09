/**
 * Componente UsuarioForm
 * 
 * Formulario para crear/editar usuarios del sistema.
 * Características:
 * - Búsqueda de usuario por documento (fetch externo)
 * - Autocompletado de nombre al perder foco
 * - Combobox con búsqueda para seleccionar rol
 * - Validaciones con Zod
 * - Botones múltiples: Guardar, Bloquear/Desbloquear, Restaurar contraseña
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { Save, X, Plus, Lock, Unlock, KeyRound, Loader2 } from "lucide-react";
import { UsuarioFormData, USUARIO_LIMITS } from "../types/usuarioForm.types";
import { useUsuarioForm } from "../hooks/useUsuarioForm";
import { handleNumberKeyDown, handleEmailKeyDown } from "@/lib/keydownValidations";
import { RolInterface } from "../types/usuarioInterface";
import { useFormChanges } from "@/hooks/use-form-changes";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface UsuarioFormProps {
  mode: "create" | "edit";
  initialData?: Partial<UsuarioFormData>;
  disabled?: boolean;
  roles: RolInterface[];
  onSubmit: (data: UsuarioFormData) => Promise<void>;
  onBloquear?: () => Promise<void>;
  onDesbloquear?: () => Promise<void>;
  onRestaurarPassword?: () => Promise<void>;
  onCancel: () => void;
  externalErrors?: Record<string, string>;
  isUsuarioBloqueado?: boolean;
  isSubmitting?: boolean;
}

export function UsuarioForm({
  mode,
  initialData,
  disabled = false,
  roles,
  onSubmit,
  onBloquear,
  onDesbloquear,
  onRestaurarPassword,
  onCancel,
  externalErrors = {},
  isUsuarioBloqueado = false,
  isSubmitting = false,
}: UsuarioFormProps) {
  const {
    data,
    errors,
    processing,
    isSearchingDocument,
    firstInputRef,
    handleChange,
    handleSubmit,
    buscarPorDocumento,
  } = useUsuarioForm({
    mode,
    initialData,
    disabled,
    onSubmit,
    externalErrors,
  });

  const [openRolCombobox, setOpenRolCombobox] = useState(false);

  // Detecta cambios para resaltar campos modificados
  const changes = useFormChanges(initialData || {}, data);

  // Función para estilos condicionales
  const getInputClass = (field: keyof typeof data) => {
    return (
      (changes[field] && mode === "edit" ? "border-primary/50 " : "") +
      (errors[field] ? "border-destructive" : "")
    );
  };

  // Rol seleccionado
  const selectedRol = roles.find((r) => r.id === data.rol_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Documento y Email */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Número de Documento */}
        <div className="space-y-2">
          <Label
            htmlFor="numero_documento"
            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${
              changes.numero_documento && mode === "edit" ? "text-primary" : ""
            }`}
          >
            Número de Documento
          </Label>
          <div className="relative">
            <Input
              id="numero_documento"
              ref={firstInputRef}
              value={data.numero_documento}
              onChange={(e) => handleChange("numero_documento", e.target.value)}
              onKeyDown={handleNumberKeyDown}
              onBlur={(e) => buscarPorDocumento(e.target.value)}
              maxLength={USUARIO_LIMITS.numero_documento}
              disabled={disabled || mode === "edit" || isSearchingDocument}
              className={getInputClass("numero_documento")}
              placeholder="Ej: 1234567890"
            />
            {isSearchingDocument && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <div className="relative">
            <InputError message={errors.numero_documento} />
            <span className="text-xs text-muted-foreground absolute top-0 right-0">
              {data.numero_documento.length}/{USUARIO_LIMITS.numero_documento}
            </span>
          </div>
          {mode === "create" && (
            <p className="text-xs text-muted-foreground">
              El nombre se autocompletará al salir del campo
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${
              changes.email && mode === "edit" ? "text-primary" : ""
            }`}
          >
            Correo Electrónico
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onKeyDown={handleEmailKeyDown}
            maxLength={USUARIO_LIMITS.email}
            disabled={disabled}
            className={getInputClass("email")}
            placeholder="usuario@ejemplo.com"
          />
          <div className="relative">
            <InputError message={errors.email} />
            <span className="text-xs text-muted-foreground absolute top-0 right-0">
              {data.email.length}/{USUARIO_LIMITS.email}
            </span>
          </div>
        </div>
      </div>

      {/* Nombre Completo (autocompletado) */}
      <div className="space-y-2">
        <Label htmlFor="nombre_completo">Nombre Completo</Label>
        <Input
          id="nombre_completo"
          value={data.nombre_completo}
          disabled={true}
          className="bg-muted/50 cursor-not-allowed"
          placeholder={
            mode === "create"
              ? "Se autocompletará al ingresar el documento"
              : "Nombre del usuario"
          }
        />
        <p className="text-xs text-muted-foreground">
          Este campo se obtiene automáticamente de la base de datos externa
        </p>
      </div>

      {/* Rol (Combobox con búsqueda) */}
      <div className="space-y-2">
        <Label
          htmlFor="rol_id"
          className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${
            changes.rol_id && mode === "edit" ? "text-primary" : ""
          }`}
        >
          Rol
        </Label>
        <Popover open={openRolCombobox} onOpenChange={setOpenRolCombobox}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openRolCombobox}
              disabled={disabled}
              className={`w-full justify-between ${getInputClass("rol_id")}`}
            >
              {selectedRol ? selectedRol.nombre : "Seleccionar rol..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar rol..." />
              <CommandList>
                <CommandEmpty>No se encontraron roles.</CommandEmpty>
                <CommandGroup>
                  {roles.map((rol) => (
                    <CommandItem
                      key={rol.id}
                      value={rol.nombre}
                      onSelect={() => {
                        handleChange("rol_id", rol.id);
                        setOpenRolCombobox(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          data.rol_id === rol.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {rol.nombre}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <InputError message={errors.rol_id} />
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        {!disabled && (
          <>
            {/* Botones especiales (solo en modo edit) */}
            {mode === "edit" && (
              <div className="flex gap-2">
                {/* Bloquear/Desbloquear */}
                {isUsuarioBloqueado ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onDesbloquear}
                    disabled={processing || isSubmitting}
                  >
                    <Unlock className="h-4 w-4" />
                    Desbloquear
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onBloquear}
                    disabled={processing || isSubmitting}
                  >
                    <Lock className="h-4 w-4" />
                    Bloquear
                  </Button>
                )}

                {/* Restaurar contraseña */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onRestaurarPassword}
                  disabled={processing || isSubmitting}
                >
                  <KeyRound className="h-4 w-4" />
                  Restaurar Contraseña
                </Button>
              </div>
            )}

            <div className="flex-1" />

            {/* Cancelar */}
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={processing || isSubmitting}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>

            {/* Guardar/Crear */}
            <Button type="submit" disabled={processing || disabled || isSubmitting}>
              {mode === "create" ? (
                <>
                  <Plus className="h-4 w-4" />
                  {processing ? "Creando..." : "Crear Usuario"}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {processing ? "Guardando..." : "Guardar Cambios"}
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}