/**
 * Componente UsuarioForm.
 * 
 * Formulario para crear/editar usuarios del sistema: combobox con búsqueda dinámica de documentos (BD externa),
 * validación de usuarios ya registrados, autocompletado de nombre al seleccionar documento,
 * combobox para seleccionar rol, validaciones con Zod, botones múltiples: Guardar, Bloquear/Desbloquear, Restaurar contraseña.
 * Usa hook personalizado para lógica y componentes UI para inputs y comboboxes.
 * Se integra con React para gestionar usuarios via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { Save, X, Plus, Lock, Unlock, KeyRound, } from "lucide-react";
import { UsuarioFormData, USUARIO_LIMITS } from "../types/usuarioForm.types";
import { useUsuarioForm } from "../hooks/useUsuarioForm";
import { handleEmailKeyDown } from "@/lib/keydownValidations";
import { RolInterface } from "../types/usuarioInterface";
import { useFormChanges } from "@/hooks/use-form-changes";
import { DocumentoCombobox } from "./DocumentoCombobox";
import { RolCombobox } from "./RolCombobox";

/**
 * Interfaz para las props del componente UsuarioForm.
 * Define los parámetros necesarios para configurar el formulario.
 */
interface UsuarioFormProps {
  mode: "create" | "edit"; // Modo del formulario (crear o editar).
  initialData?: Partial<UsuarioFormData>; // Datos iniciales opcionales para prellenar.
  disabled?: boolean; // Indica si el formulario está deshabilitado.
  roles: RolInterface[]; // Lista de roles disponibles.
  onSubmit: (data: UsuarioFormData) => Promise<void>; // Función a llamar al enviar datos válidos.
  onBloquear?: () => Promise<void>; // Función opcional para bloquear usuario (solo en modo edit).
  onDesbloquear?: () => Promise<void>; // Función opcional para desbloquear usuario (solo en modo edit)
  onRestaurarPassword?: () => Promise<void>; // Función opcional para restaurar contraseña (solo en modo edit).
  onCancel: () => void; // Función a llamar al cancelar.
  externalErrors?: Record<string, string>;
  isUsuarioBloqueado?: boolean;
  isSubmitting?: boolean; // Indica si se está enviando el formulario.
  dominios: string[]; // Lista de dominios para validación.
  permisos: { puedeBloquear: boolean, puedeRestaurar: boolean } // Permisos para acciones especiales.
}
/**
 * Componente UsuarioForm.
 * 
 * Formulario principal para crear/editar usuarios.
 * Maneja validaciones condicionales, estados bloqueados y envío de datos.
 * 
 * @param {UsuarioFormProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
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
  dominios,
  permisos
}: UsuarioFormProps) {

  // Aquí se usa el hook useUsuarioForm para manejar toda la lógica del formulario: estado, validaciones, envío y selección de documento.
  const {
    data,
    errors,
    processing,
    usuarioYaRegistrado,
    handleChange,
    handleDocumentoSelect,
    handleSubmit,
  } = useUsuarioForm({
    mode,
    initialData,
    disabled,
    onSubmit,
    externalErrors,
    dominios
  });

  // Aquí se usa useFormChanges para detectar cambios en el formulario y resaltar campos modificados.
  const changes = useFormChanges(initialData || {}, data);

  // Función para estilos condicionales: resalta si cambió o hay error.
  const getInputClass = (field: keyof typeof data) => {
    return (
      (changes[field] && mode === "edit" ? "border-primary/50 " : "") +
      (errors[field] ? "border-destructive" : "")
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Documento y Email: Grid con dos inputs principales. */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Número de Documento con Combobox: Usa DocumentoCombobox para búsqueda dinámica. */}
        <DocumentoCombobox
          mode={mode}
          onChange={handleDocumentoSelect}
          value={data.numero_documento}
          disabled={disabled}
          error={errors.numero_documento}
          hasChanges={changes.numero_documento && mode === "edit"}
        />

        {/* Email: Input con validaciones de email. */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${changes.email && mode === "edit" ? "text-primary" : ""
              }`}
          >
            Correo Electrónico Empresarial
          </Label>
          {/* Aquí se usa Input para el campo de email con validaciones y contador de caracteres. */}
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

      {/* Nombre Completo (autocompletado): Input readonly que se llena al seleccionar documento. */}
      <div className="space-y-2">
        <Label htmlFor="nombre_completo">Nombre Completo</Label>
        {/* Aquí se usa Input readonly para mostrar el nombre autocompletado. */}
        <Input
          id="nombre_completo"
          value={data.nombre_completo}
          readOnly={true}
          className="bg-muted/50 cursor-not-allowed"
          placeholder={
            mode === "create"
              ? "Se autocompletará al seleccionar el documento"
              : "Nombre del usuario"
          }
        />
        <p className="text-xs text-muted-foreground">
          Este campo se obtiene automáticamente del sistema externo.
        </p>
      </div>

      {/* Rol (Combobox con búsqueda): Usa RolCombobox para seleccionar rol. */}
      <RolCombobox
        clases={getInputClass("rol_id")}
        roles={roles}
        handleChange={handleChange}
        value={data.rol_id}
        disabled={disabled}
        error={errors.rol_id}
        hasChanges={(changes.rol_id && mode === "edit")}
      />

      {/* Botones de acción: Guardar, Cancelar y botones especiales condicionales. */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        {!disabled && (
          <>
            {/* Botones especiales (solo en modo edit): Bloquear/Desbloquear y Restaurar contraseña. */}
            {mode === "edit" && (

              <div className="flex gap-2">
                {/* Bloquear/Desbloquear: Muestra botón según estado del usuario. */}
                {permisos.puedeBloquear ? (isUsuarioBloqueado ? (
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
                )) : ""}

                {/* Restaurar contraseña: Solo si tiene permiso. */}
                {permisos.puedeRestaurar && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onRestaurarPassword}
                    disabled={processing || isSubmitting}
                  >
                    <KeyRound className="h-4 w-4" />
                    Restaurar Contraseña
                  </Button>
                )}
              </div>
            )}

            <div className="flex-1" />

            {/* Cancelar: Botón para cancelar cambios. */}
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={processing || isSubmitting}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>

            {/* Guardar/Crear: Botón principal para enviar formulario. */}
            <Button
              type="submit"
              disabled={
                processing ||
                disabled ||
                isSubmitting ||
                (usuarioYaRegistrado && mode === "create")
              }
            >
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
