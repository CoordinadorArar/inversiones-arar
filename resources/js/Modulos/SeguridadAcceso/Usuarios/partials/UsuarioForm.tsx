/**
 * Componente UsuarioForm
 * 
 * Formulario para crear/editar usuarios del sistema.
 * Características:
 * - Combobox con búsqueda dinámica de documentos (BD externa)
 * - Validación de usuarios ya registrados
 * - Autocompletado de nombre al seleccionar documento
 * - Combobox con búsqueda para seleccionar rol
 * - Validaciones con Zod
 * - Botones múltiples: Guardar, Bloquear/Desbloquear, Restaurar contraseña
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { Save, X, Plus, Lock, Unlock, KeyRound, Loader2, AlertCircle } from "lucide-react";
import { UsuarioFormData, USUARIO_LIMITS } from "../types/usuarioForm.types";
import { useUsuarioForm } from "../hooks/useUsuarioForm";
import { handleEmailKeyDown } from "@/lib/keydownValidations";
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
import { useState, useEffect } from "react";

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

interface DocumentoOption {
  documento: string;
  nombre: string;
  yaExiste: boolean;
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
    handleChange,
    handleSubmit,
    setErrors,
  } = useUsuarioForm({
    mode,
    initialData,
    disabled,
    onSubmit,
    externalErrors,
  });

  // Estados para búsqueda de documentos
  const [searchTerm, setSearchTerm] = useState("");
  const [documentoOptions, setDocumentoOptions] = useState<DocumentoOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [openDocumentoCombobox, setOpenDocumentoCombobox] = useState(false);
  const [usuarioYaRegistrado, setUsuarioYaRegistrado] = useState(false);

  // Estado para rol combobox
  const [openRolCombobox, setOpenRolCombobox] = useState(false);

  // Detecta cambios para resaltar campos modificados
  const changes = useFormChanges(initialData || {}, data);

  // Función para buscar documentos
  const buscarDocumentos = async (term: string) => {
    if (term.length < 5) {
      setDocumentoOptions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        route("usuario.buscar-documentos", { search: term })
      );
      const responseData = await response.json();

      if (response.ok && responseData.resultados) {
        setDocumentoOptions(responseData.resultados);
      } else {
        setDocumentoOptions([]);
      }
    } catch (error) {
      console.error("Error buscando documentos:", error);
      setDocumentoOptions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 5) {
        buscarDocumentos(searchTerm);
      } else {
        setDocumentoOptions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Función para seleccionar un documento
  const handleSelectDocumento = (option: DocumentoOption) => {
    if (option.yaExiste) {
      // Si ya existe, marcar error y no permitir selección
      setUsuarioYaRegistrado(true);
      setErrors((prev) => ({
        ...prev,
        numero_documento: "Este usuario ya está registrado en la web",
      }));
      handleChange("numero_documento", option.documento);
      handleChange("nombre_completo", "");
    } else {
      // Si no existe, permitir selección
      setUsuarioYaRegistrado(false);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.numero_documento;
        return newErrors;
      });
      handleChange("numero_documento", option.documento);
      handleChange("nombre_completo", option.nombre);
    }
    setOpenDocumentoCombobox(false);
    setSearchTerm("");
  };

  // Función para estilos condicionales
  const getInputClass = (field: keyof typeof data) => {
    return (
      (changes[field] && mode === "edit" ? "border-primary/50 " : "") +
      (errors[field] ? "border-destructive" : "")
    );
  };

  // Rol seleccionado
  const selectedRol = roles.find((r) => r.id == data.rol_id);

  // Validar antes de submit
  const handleFormSubmit = (e: React.FormEvent) => {
    if (usuarioYaRegistrado && mode === "create") {
      e.preventDefault();
      setErrors((prev) => ({
        ...prev,
        numero_documento: "No puedes crear un usuario que ya está registrado",
      }));
      return;
    }
    handleSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Documento y Email */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Número de Documento con Combobox */}
        <div className="space-y-2">
          <Label
            htmlFor="numero_documento"
            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${
              changes.numero_documento && mode === "edit" ? "text-primary" : ""
            }`}
          >
            Número de Documento
          </Label>

          {mode === "create" ? (
            <>
              <Popover open={openDocumentoCombobox} onOpenChange={setOpenDocumentoCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openDocumentoCombobox}
                    disabled={disabled}
                    className={`w-full !mt-0 justify-between ${getInputClass("numero_documento")}`}
                  >
                    <span className={data.numero_documento ? "" : "text-muted-foreground"}>
                      {data.numero_documento || "Buscar documento..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Escribe al menos 5 dígitos..."
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                    <CommandList>
                      {isSearching ? (
                        <div className="p-4 text-sm text-center text-muted-foreground flex gap-2 items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Buscando...
                        </div>
                      ) : searchTerm.length < 5 ? (
                        <div className="p-4 text-sm text-center text-muted-foreground">
                          Escribe al menos 5 dígitos para buscar
                        </div>
                      ) : documentoOptions.length === 0 ? (
                        <CommandEmpty>
                          No se encontraron usuarios con contrato activo
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {documentoOptions.map((option) => (
                            <CommandItem
                              key={option.documento}
                              value={option.documento}
                              onSelect={() => handleSelectDocumento(option)}
                              className={option.yaExiste ? "opacity-60" : ""}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Check
                                  className={cn(
                                    "h-4 w-4",
                                    data.numero_documento === option.documento
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex-1">
                                  <div className="font-medium">{option.documento}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {option.nombre}
                                  </div>
                                </div>
                                {option.yaExiste && (
                                  <div className="flex items-center gap-1 text-xs text-destructive">
                                    <AlertCircle className="h-3 w-3" />
                                    Ya registrado
                                  </div>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Busca por documento (mínimo 5 números). Solo aparecerán usuarios con contrato activo.
              </p>
            </>
          ) : (
            <Input
              id="numero_documento"
              value={data.numero_documento}
              readOnly={true}
              className="bg-muted/50 cursor-not-allowed font-mono"
            />
          )}

          <InputError message={errors.numero_documento} />
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
              className={`w-full !mt-0 justify-between ${getInputClass("rol_id")}`}
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
                          data.rol_id == rol.id ? "opacity-100" : "opacity-0"
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