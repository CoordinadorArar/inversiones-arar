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

interface PestanaFormProps {
  mode: "create" | "edit";
  initialData?: Partial<PestanaFormData>;
  disabled?: boolean;
  modulos: ModuloDisponibleInterface[];
  onSubmit: (data: PestanaFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCancel: () => void;
  externalErrors?: Record<string, string>;
  moduloEliminado?: boolean | null;
}

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

  const { handleRutaKeyDown, handlePermisosExtraKeyDown } = useHandleKeyDown();

  const changes = useFormChanges(initialData || {}, data);
  const { toast } = useToast();

  const getInputClass = (field: keyof typeof data) => {
    return (
      (changes[field] && mode === "edit" ? "border-primary/50 " : "") +
      (errors[field] ? "border-destructive" : "")
    );
  };

  const [openModulo, setOpenModulo] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const moduloSeleccionado = modulos.find((m) => m.id === data.modulo_id);

  const hasCriticalChanges =
    mode === "edit" && (changes.ruta || changes.modulo_id);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    if (mode === "edit" && hasCriticalChanges) {
      setShowWarningDialog(true);
      setPendingSubmit(true);
      return;
    }

    if (mode === "create") {
      setShowWarningDialog(true);
      setPendingSubmit(true);
      return;
    }

    handleSubmit(e);
  };

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

  const handleWarningCancel = () => {
    setShowWarningDialog(false);
    setPendingSubmit(false);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Nombre */}
        <div className="space-y-2">
          <Label
            htmlFor="nombre"
            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${changes.nombre && mode === "edit" ? "text-primary" : ""
              }`}
          >
            Nombre de la Pestaña
          </Label>
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
            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${(changes.ruta || changes.modulo_id) && mode === "edit" ? "text-primary" : ""
              }`}
          >
            Ruta de la Pestaña
          </Label>

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
          <Label htmlFor="permisos_extra">Permisos Extra (opcional)</Label>
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
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          {!disabled && (
            <>
              {mode === "edit" && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  disabled={processing}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              )}

              <div className="flex-1" />

              <Button type="button" variant="outline" onClick={onCancel} disabled={processing}>
                <X className="h-4 w-4" />
                Cancelar
              </Button>

              <Button type="submit" disabled={processing || disabled}>
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

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        processing={processing}
        itemName={`La pestaña «${data.nombre}» será eliminada del sistema.`}
      />

      {/* Diálogo de confirmación de warning */}
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