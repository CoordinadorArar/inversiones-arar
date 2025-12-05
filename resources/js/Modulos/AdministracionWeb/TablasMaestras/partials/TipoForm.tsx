/**
 * Componente TipoForm
 * 
 * Formulario compacto para crear/editar tipos
 * Se muestra en el panel lateral
 * 
 * @author Yariangel Aray
 * @date 2025-12-03
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { Plus, Save, X } from "lucide-react";
import { TipoFormData, TIPO_LIMITS } from "../types/tipoForm.types";
import { useTipoForm } from "../hooks/useTipoForm";
import { handleTextKeyDown } from "@/lib/keydownValidations";
import { TipoInterface } from "../types/tipoInterface";
import { useFormChanges } from "@/hooks/use-form-changes";

interface TipoFormProps {
  mode: "create" | "edit";
  initialData?: Partial<TipoFormData>;
  onSubmit: (data: TipoFormData) => Promise<any>;
  onCancel: () => void;
  externalErrors?: Record<string, string>;
  processing?: boolean;
  placeholders?: {nombre:string; abreviatura:string};
}

export function TipoForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  externalErrors = {},
  processing = false,
  placeholders
}: TipoFormProps) {
  const {
    data,
    errors,
    handleChange,
    handleSubmit,
    handleCancelClick,
  } = useTipoForm({
    mode,
    initialData,
    onSubmit,
    onCancel,
    externalErrors,
    processing,
  });

  // Detecta cambios usando el hook
  const changes = useFormChanges(initialData || {}, data);

  // Función para estilos condicionales (resalta si cambió)
  const getInputClass = (field: keyof typeof data) => {
    return (changes[field] && mode == "edit" ? "border-primary/50" : errors[field] ? "border-destructive" : "");
  };

  // Función para clase del label (resalta solo si cambió)
  const getLabelClass = (field: keyof typeof data) => {
    return `flex items-center gap-2 after:text-red-500 after:content-["*"] ${changes[field] && mode == "edit" ? "text-primary font-medium" : ""}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div className="space-y-2">
        <Label
          htmlFor="nombre"          
          className={getLabelClass("nombre")}
        >
          Nombre
        </Label>
        <Input
          id="nombre"
          value={data.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          onKeyDown={handleTextKeyDown}
          maxLength={TIPO_LIMITS.nombre}
          disabled={processing}
          className={getInputClass("nombre")}
          placeholder={placeholders?.nombre || ''}
        />
        <div className="relative">
          <InputError message={errors.nombre} />
          <span className="text-xs text-muted-foreground absolute top-0 right-0">
            {data.nombre.length}/{TIPO_LIMITS.nombre}
          </span>
        </div>
      </div>

      {/* Abreviatura */}
      <div className="space-y-2">
        <Label
          htmlFor="abreviatura"
          className={getLabelClass("abreviatura")}
        >
          Abreviatura
        </Label>
        <Input
          id="abreviatura"
          value={data.abreviatura}
          onChange={(e) => handleChange("abreviatura", e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            // Solo letras, sin espacios
            const allowed = /^[a-zA-Z]$/;
            if (
              !allowed.test(e.key) &&
              !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'].includes(e.key) &&
              !e.ctrlKey &&
              !e.metaKey
            ) {
              e.preventDefault();
            }
          }}
          maxLength={TIPO_LIMITS.abreviatura}
          disabled={processing}
          className={getInputClass("abreviatura")}
          placeholder={placeholders?.abreviatura || ''}
        />
        <div className="relative">
          <InputError message={errors.abreviatura} />
          <span className="text-xs text-muted-foreground absolute top-0 right-0">
            {data.abreviatura.length}/{TIPO_LIMITS.abreviatura}
          </span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 pt-4">
        {mode === "create" ? (
          <Button type="submit" disabled={processing} className="w-full">
            <Plus className="h-4 w-4" />
            {processing ? "Creando..." : "Crear Tipo"}
          </Button>
        ) : (
          <>
            <Button type="submit" disabled={processing} className="w-full">
              <Save className="h-4 w-4" />
              {processing ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelClick}
              disabled={processing}
              className="w-full"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </>
        )}
      </div>
    </form>
  );
}