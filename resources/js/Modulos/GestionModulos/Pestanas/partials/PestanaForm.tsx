/**
 * Componente PestanaForm.
 * 
 * Formulario para crear y editar pestañas del sistema con validación en tiempo real.
 * Maneja campos nombre, módulo, ruta y permisos extra con validación de formato.
 * Incluye diálogos de confirmación para operaciones críticas y detección de cambios.
 * Muestra advertencias al modificar rutas o módulos en pestañas existentes.
 * Se integra con hooks personalizados para gestión de estado y validaciones.
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { PestanaFormData, PESTANA_LIMITS, pestanaSchema } from "../types/pestanaForm.types";
import { ModuloDisponibleInterface } from "../types/pestanaInterface";
import { handleTextKeyDown } from "@/lib/keydownValidations";
import { useFormChanges } from "@/hooks/use-form-changes";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/Components/ui/input-group";
import { DeleteDialog } from "@/Components/DeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { useHandleKeyDown } from "../../hooks/useHandleKeyDown";
import { usePestanaForm } from "../hooks/usePestanaForm";
import { ConfirmDialogPestana } from "./ConfirmDialogPestana";
import { ModuloDisponibleCombobox } from "./ModuloDisponibleCombobox";

/**
 * Interfaz para las props del componente PestanaForm.
 * Define la estructura de datos necesarios para el formulario de pestañas.
 */
interface PestanaFormProps {
  mode: "create" | "edit"; // Modo de operación del formulario.
  initialData?: Partial<PestanaFormData>; // Datos iniciales para poblar el formulario.
  disabled?: boolean; // Estado de deshabilitación del formulario.
  modulos: ModuloDisponibleInterface[]; // Lista de módulos disponibles para asignar.
  onSubmit: (data: PestanaFormData) => Promise<void>; // Callback para enviar datos del formulario.
  onDelete?: () => Promise<void>; // Callback opcional para eliminar pestaña.
  onCancel: () => void; // Callback para cancelar operación.
  externalErrors?: Record<string, string>; // Errores externos del backend.
  moduloEliminado?: boolean | null; // Indica si el módulo asociado fue eliminado.
}

/**
 * Componente de formulario para crear y editar pestañas.
 * Implementa validación en tiempo real, detección de cambios y confirmaciones.
 * Maneja estados de carga y errores con feedback visual al usuario.
 * 
 * @param {PestanaFormProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export function PestanaForm({
  mode,
  initialData,
  disabled = false,
  modulos,
  onSubmit,
  onDelete,
  onCancel,
  externalErrors = {},
  moduloEliminado = false,
}: PestanaFormProps) {
  // Aquí se usa el hook personalizado para manejar estado y lógica del formulario.
  const {
    data,
    errors,
    processing,
    showDeleteDialog,
    handleChange,
    handleSubmit,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    setErrors,
  } = usePestanaForm({
    mode,
    initialData,
    disabled,
    onSubmit,
    onDelete,
    externalErrors,
  });

  // Aquí se obtienen validadores de teclas para campos específicos.
  const { handleRutaKeyDown, handlePermisosExtraKeyDown } = useHandleKeyDown();

  // Aquí se detectan cambios en el formulario comparando con datos iniciales.
  const changes = useFormChanges(initialData || {}, data);
  const { toast } = useToast();

  /**
   * Genera clases CSS dinámicas para inputs según su estado.
   * Aplica estilos para cambios detectados y errores de validación.
   * 
   * @param {keyof typeof data} field - Campo del formulario a evaluar.
   * @returns {string} Clases CSS concatenadas.
   */
  const getInputClass = (field: keyof typeof data) => {
    return (
      (changes[field] && mode === "edit" ? "border-primary/50 " : "") +
      (errors[field] ? "border-destructive" : "")
    );
  };

  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // Aquí se busca el módulo seleccionado en la lista de módulos disponibles.
  const moduloSeleccionado = modulos.find((m) => m.id === data.modulo_id);

  // Aquí se determina si hay cambios críticos que requieren confirmación.
  const hasCriticalChanges =
    mode === "edit" && (changes.ruta || changes.modulo_id);

  /**
   * Maneja el envío del formulario con validación y confirmaciones.
   * Valida datos con Zod, muestra diálogos de advertencia para cambios críticos.
   * 
   * @param {React.FormEvent} e - Evento del formulario.
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí se valida el formulario usando el schema de Zod.
    const validation = pestanaSchema.safeParse(data);
    if (!validation.success) {
      const zodErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          zodErrors[err.path[0].toString()] = err.message;
        }
      });

      setErrors(zodErrors);
      toast({
        title: "Errores de validación",
        description: "Por favor, corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    // Aquí se muestra diálogo de advertencia si hay cambios críticos en edición.
    if (mode === "edit" && hasCriticalChanges) {
      setShowWarningDialog(true);
      setPendingSubmit(true);
      return;
    }

    // Aquí se muestra diálogo de advertencia al crear nueva pestaña.
    if (mode === "create") {
      setShowWarningDialog(true);
      setPendingSubmit(true);
      return;
    }

    handleSubmit(e);
  };

  /**
   * Confirma la operación tras advertencia y procede con el envío.
   * Crea evento sintético para ejecutar el handleSubmit del hook.
   */
  const handleWarningConfirm = () => {
    setShowWarningDialog(false);
    if (pendingSubmit) {
      const syntheticEvent = {
        preventDefault: () => { },
      } as React.FormEvent;
      handleSubmit(syntheticEvent);
      setPendingSubmit(false);
    }
  };

  /**
   * Cancela la operación tras diálogo de advertencia.
   * Resetea estados de confirmación pendiente.
   */
  const handleWarningCancel = () => {
    setShowWarningDialog(false);
    setPendingSubmit(false);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
        {/* Nombre */}
        <div className="space-y-2">
          <Label
            htmlFor="nombre"
            className={`flex items-center gap-2 text-sm sm:text-base after:text-red-500 after:content-['*'] ${changes.nombre && mode === "edit" ? "text-primary" : ""
              }`}
          >
            Nombre de la Pestaña
          </Label>
          {/* Aquí se renderiza el input de nombre con validación de longitud y caracteres. */}
          <Input
            id="nombre"
            value={data.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            onKeyDown={handleTextKeyDown}
            maxLength={PESTANA_LIMITS.nombre}
            disabled={disabled}
            className={getInputClass("nombre")}
            placeholder="Ej: Listado"
          />
          <div className="relative">
            <InputError message={errors.nombre} />
            <span className="text-xs text-muted-foreground absolute top-0 right-0">
              {data.nombre.length}/{PESTANA_LIMITS.nombre}
            </span>
          </div>
        </div>

        {/* Módulo */}
        {/* Aquí se renderiza el combobox para seleccionar módulo disponible. */}
        <ModuloDisponibleCombobox
          modulos={modulos}
          value={data.modulo_id}
          handleChange={handleChange}
          disabled={disabled}
          hasChanges={changes.modulo_id && mode === "edit"}
          error={errors.modulo_id}
          className={getInputClass("modulo_id")}
          moduloEliminado={moduloEliminado}
        />


        {/* Ruta con InputGroup */}
        <div className="space-y-2">
          <Label
            htmlFor="ruta"
            className={`flex items-center gap-2 text-sm sm:text-base after:text-red-500 after:content-['*'] ${(changes.ruta || changes.modulo_id) && mode === "edit" ? "text-primary" : ""
              }`}
          >
            Ruta de la Pestaña
          </Label>

          {/* Aquí se muestra InputGroup con prefijo de ruta si hay módulo seleccionado. */}
          {moduloSeleccionado ? (
            <div className="flex items-stretch">
              <InputGroup
                className={`${(changes.ruta || changes.modulo_id) && mode === "edit"
                  ? "has-[[data-slot=input-group-control]]:border-primary/50"
                  : ""
                  }`}
              >
                <InputGroupAddon className="text-primary">
                  {moduloSeleccionado.ruta_completa}
                </InputGroupAddon>
                <InputGroupInput
                  id="ruta"
                  value={data.ruta}
                  onChange={(e) =>
                    handleChange("ruta", e.target.value.replace(/ /g, "-"))
                  }
                  onKeyDown={handleRutaKeyDown}
                  maxLength={PESTANA_LIMITS.ruta}
                  disabled={disabled}
                  className={cn("!pl-0.5 !pb-1.5", getInputClass("ruta"))}
                  placeholder="/listado"
                />
              </InputGroup>
            </div>
          ) : (
            <Input
              id="ruta"
              value={data.ruta}
              onChange={(e) => handleChange("ruta", e.target.value.replace(/ /g, "-"))}
              onKeyDown={handleRutaKeyDown}
              maxLength={PESTANA_LIMITS.ruta}
              disabled={disabled}
              className={getInputClass("ruta")}
              placeholder="/listado"
            />
          )}

          <div className="relative">
            {errors.ruta ? (
              <InputError message={errors.ruta} />
            ) : (
              <p className="text-xs text-muted-foreground">
                La ruta debe empezar con / y solo contener letras minúsculas, números y
                guiones
              </p>
            )}

            <span className="text-xs text-muted-foreground absolute top-0 right-0">
              {data.ruta.length}/{PESTANA_LIMITS.ruta}
            </span>
          </div>
        </div>

        {/* Permisos Extra */}
        <div className="space-y-2">
          <Label htmlFor="permisos_extra" className="text-sm sm:text-base">Permisos Extra (opcional)</Label>
          {/* Aquí se renderiza input de permisos con reemplazo de espacios por guiones bajos. */}
          <Input
            id="permisos_extra"
            value={data.permisos_extra}
            onChange={(e) => handleChange("permisos_extra", e.target.value.replace(/ /g, "_"))}
            onKeyDown={handlePermisosExtraKeyDown}
            disabled={disabled}
            className={getInputClass("permisos_extra")}
            placeholder="bloquear,aprobar_factura"
          />
          {errors.permisos_extra ? (
            <InputError message={errors.permisos_extra} />
          ) : (
            <p className="text-xs text-muted-foreground">
              Separar permisos con comas. Usar guión bajo (_) para permisos con más de una
              palabra. Ej: bloquear,restaurar_password
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-4 border-t">
          {!disabled && (
            <>
              {/* Aquí se muestra botón de eliminar solo en modo edición con callback definido. */}
              {mode === "edit" && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  disabled={processing}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              )}

              <div className="hidden sm:block sm:flex-1" />

              <Button type="button" variant="outline" onClick={onCancel} disabled={processing} className="w-full sm:w-auto text-sm sm:text-base order-last sm:order-none">
                <X className="h-4 w-4" />
                Cancelar
              </Button>

              {/* Aquí se muestra botón de submit con texto dinámico según el modo. */}
              <Button type="submit" disabled={processing || disabled} className="w-full sm:w-auto text-sm sm:text-base">
                {mode === "create" ? (
                  <>
                    <Plus className="h-4 w-4" />
                    {processing ? "Creando..." : "Crear Pestaña"}
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

      {/* Aquí se muestra diálogo de confirmación para eliminación de pestaña. */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        processing={processing}
        itemName={`La pestaña «${data.nombre}» será eliminada del sistema.`}
      />

      {/* Diálogo de confirmación de warning */}
      {/* Aquí se muestra diálogo de advertencia para operaciones críticas. */}
      <ConfirmDialogPestana
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        onConfirm={handleWarningConfirm}
        onCancel={handleWarningCancel}
        mode={mode}
        hasCriticalChanges={hasCriticalChanges}
        changes={changes}
      />
    </>
  );

}