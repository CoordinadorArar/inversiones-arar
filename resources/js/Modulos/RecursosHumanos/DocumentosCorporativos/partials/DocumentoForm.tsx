import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { handleTextKeyDown } from "@/lib/keydownValidations";
import { useFormChanges } from "@/hooks/use-form-changes";
import { DeleteDialog } from "@/Components/DeleteDialog";
import IconPicker from "@/Components/IconPicker";
import { DocumentoSwitches } from "./DocumentoSwitches";
import { DOCUMENTO_LIMITS, DocumentoFormData } from "../types/documentoForm.types";
import { useDocumentoForm } from "../hooks/useDocumentoForm";
import { FileUpload } from "./FileUpload";

interface DocumentoFormProps {
    mode: "create" | "edit";
    initialData?: Partial<DocumentoFormData>;
    disabled?: boolean;
    onSubmit: (data: DocumentoFormData) => Promise<void>;
    onDelete?: () => Promise<void>;
    onCancel: () => void;
    externalErrors?: Record<string, string>;
}

export function DocumentoForm({
    mode,
    initialData,
    disabled = false,
    onSubmit,
    onDelete,
    onCancel,
    externalErrors = {},
}: DocumentoFormProps) {
    const {
        data,
        errors,
        processing,
        showDeleteDialog,
        handleChange,
        handleArchivoChange,
        handleArchivoRemove,
        handleSubmit,
        handleDeleteClick,
        handleDeleteCancel,
        handleDeleteConfirm,
    } = useDocumentoForm({
        mode,
        initialData,
        disabled,
        onSubmit,
        onDelete,
        externalErrors,
    });

    const changes = useFormChanges(initialData || {}, data);

    const getInputClass = (field: keyof typeof data) => {
        return (
            (changes[field] && mode === "edit" ? "border-primary/50 " : "") +
            (errors[field] ? "border-destructive" : "")
        );
    };

    const iconoRequerido = data.mostrar_en_dashboard || data.mostrar_en_footer;

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="nombre"
                            className={`flex items-center gap-2  after:text-red-500 after:content-['*'] ${changes.nombre && mode === "edit" ? "text-primary" : ""
                                }`}
                        >
                            Nombre del Documento
                        </Label>
                        <Input
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            onKeyDown={handleTextKeyDown}
                            maxLength={DOCUMENTO_LIMITS.nombre}
                            disabled={disabled}
                            className={getInputClass("nombre")}
                            placeholder="Ej: Manual Sagrilaft"
                        />
                        <div className="relative">
                            <InputError message={errors.nombre} />
                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                {data.nombre.length}/{DOCUMENTO_LIMITS.nombre}
                            </span>
                        </div>
                    </div>

                    {/* Ícono */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="icono"
                            className={`flex items-center gap-2 ${iconoRequerido ? " after:text-red-500 after:content-['*']" : ""
                                } ${changes.icono && mode === "edit" ? "text-primary" : ""}`}
                        >
                            Ícono {!iconoRequerido && "(opcional)"}
                        </Label>
                        <IconPicker
                            value={data.icono}
                            onChange={(icono) => handleChange("icono", icono)}
                            disabled={disabled}
                            className={getInputClass("icono")}
                        />
                        <InputError message={errors.icono} />
                    </div>
                </div>
                {/* Nombre */}

                {/* Archivo */}
                <FileUpload
                    value={data.archivo}
                    preview={data.archivo_preview}
                    onChange={handleArchivoChange}
                    onRemove={handleArchivoRemove}
                    disabled={disabled}
                    error={errors.archivo}
                    required={mode === "create"}
                    label="Archivo del Documento"
                />

                {/* Switches de Visibilidad */}
                <DocumentoSwitches
                    data={data}
                    onChange={handleChange}
                    disabled={disabled}
                />

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

                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={processing}
                            >
                                <X className="h-4 w-4" />
                                Cancelar
                            </Button>

                            <Button type="submit" disabled={processing || disabled}>
                                {mode === "create" ? (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        {processing ? "Creando..." : "Crear Documento"}
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
                itemName={`El documento «${data.nombre}» será bajado del sistema.`}
            />
        </>
    );
}