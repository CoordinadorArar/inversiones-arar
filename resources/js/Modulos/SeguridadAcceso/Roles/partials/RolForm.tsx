/**
 * Componente RolForm.
 * 
 * Formulario compacto para crear/editar roles.
 * Se muestra en el panel lateral con validaciones y indicadores de cambios.
 * 
 * @author Yariangel Aray
 * @date 2025-12-17
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { Plus, Save, X } from "lucide-react";
import { handleTextKeyDown } from "@/lib/keydownValidations";
import { useFormChanges } from "@/hooks/use-form-changes";
import { useRolForm } from "../hooks/useRolForm";
import { ROL_LIMITS, RolFormData } from "../types/rolForm.types";

/**
 * Interfaz para las props del componente RolForm.
 * Define la configuración del formulario.
 */
interface RolFormProps {
    mode: "create" | "edit"; // Modo del formulario.
    initialData?: Partial<RolFormData>; // Datos iniciales.
    onSubmit: (data: RolFormData) => Promise<any>; // Callback al enviar.
    onCancel: () => void; // Callback al cancelar.
    externalErrors?: Record<string, string>; // Errores externos.
    processing?: boolean; // Estado de procesamiento.
}

/**
 * Componente principal para el formulario de roles.
 * Maneja estado del formulario, validaciones y cambios via hooks.
 * Renderiza inputs con indicadores de cambios y botones de acción.
 * 
 * @param {RolFormProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export function RolForm({
    mode,
    initialData,
    onSubmit,
    onCancel,
    externalErrors = {},
    processing = false,
}: RolFormProps) {
    // Aquí se usa el hook personalizado para manejar lógica del formulario.
    const {
        data,
        errors,
        handleChange,
        handleSubmit,
        handleCancelClick,
    } = useRolForm({
        mode,
        initialData,
        onSubmit,
        onCancel,
        externalErrors,
        processing,
    });

    // Aquí se detectan cambios en el formulario para resaltar campos.
    const changes = useFormChanges(initialData || {}, data);

    // Aquí se calcula clases CSS para inputs basadas en cambios y errores.
    const getInputClass = (field: keyof typeof data) => {
        return (changes[field] && mode == "edit"
            ? "border-primary/50"
            : "")
            + " " +
            (errors[field]
                ? "border-destructive"
                : "");
    };

    // Aquí se calcula clases CSS para labels basadas en cambios.
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
                    maxLength={ROL_LIMITS.nombre}
                    disabled={processing}
                    className={getInputClass("nombre")}
                    placeholder="Ej: Administrador"
                />
                <div className="relative">
                    <InputError message={errors.nombre} />
                    <span className="text-xs text-muted-foreground absolute top-0 right-0">
                        {data.nombre.length}/{ROL_LIMITS.nombre}
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
                        // Solo letras, sin espacios.
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
                    maxLength={ROL_LIMITS.abreviatura}
                    disabled={processing}
                    className={getInputClass("abreviatura")}
                    placeholder="Ej: ADM"
                />
                <div className="relative">
                    <InputError message={errors.abreviatura} />
                    <span className="text-xs text-muted-foreground absolute top-0 right-0">
                        {data.abreviatura.length}/{ROL_LIMITS.abreviatura}
                    </span>
                </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-2 pt-4">
                {mode === "create" ? (
                    <Button type="submit" disabled={processing} className="w-full">
                        <Plus className="h-4 w-4" />
                        {processing ? "Creando..." : "Crear Rol"}
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