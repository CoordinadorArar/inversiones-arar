/**
 * Componente ModuloForm.
 * 
 * Formulario para crear o editar módulos: incluye campos para nombre, ícono, checkbox padre,
 * combobox padre, ruta, permisos extra. Maneja validaciones, cambios, submit y eliminación.
 * Usa hooks personalizados para lógica de formulario y cambios.
 * Se integra con React para formularios de módulos via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-11
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import InputError from "@/Components/InputError";
import { Save, X, Plus, FolderTree, Trash2, AlertCircle } from "lucide-react";
import { ModuloFormData, MODULO_LIMITS, moduloSchema } from "../types/moduloForm.types";
import { ModuloPadreInterface } from "../types/moduloInterface";
import { handleTextKeyDown } from "@/lib/keydownValidations";
import { useFormChanges } from "@/hooks/use-form-changes";
import { useModuloForm } from "../hooks/useModuloForm";
import { cn } from "@/lib/utils";
import { useState } from "react";
import IconPicker from "@/Components/IconPicker";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/Components/ui/input-group";
import { DeleteDialog } from "@/Components/DeleteDialog";
import { ConfirmDialogModulo } from "./ConfirmDialogModulo";
import { ModuloPadreCombobox } from "./ModuloPadreCombobox";
import { useToast } from "@/hooks/use-toast";
import { useHandleKeyDown } from "../../hooks/useHandleKeyDown";

/**
 * Interfaz para las props del componente ModuloForm.
 * Define los parámetros necesarios para configurar el formulario de módulos.
 */
interface ModuloFormProps {
    mode: "create" | "edit"; // Modo del formulario (crear o editar).
    initialData?: Partial<ModuloFormData>; // Datos iniciales opcionales.
    disabled?: boolean; // Indica si el formulario está deshabilitado.
    modulosPadre: ModuloPadreInterface[]; // Lista de módulos padre disponibles.
    onSubmit: (data: ModuloFormData) => Promise<void>; // Callback para submit.
    onDelete?: () => Promise<void>; // Callback opcional para eliminación.
    onCancel: () => void; // Callback para cancelar.
    externalErrors?: Record<string, string>; // Errores externos opcionales.
    padreEliminado?: boolean;  // Flag para indicar si el padre fue eliminado
}

/**
 * Componente ModuloForm.
 * 
 * Renderiza formulario completo para módulos con campos dinámicos y validaciones.
 * Maneja estado de warning dialog con useState y delega lógica a hooks.
 * Incluye botones de acción y diálogos para eliminación y confirmación.
 * 
 * @param {ModuloFormProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export function ModuloForm({
    mode,
    initialData,
    disabled = false,
    modulosPadre,
    onSubmit,
    onDelete,
    onCancel,
    externalErrors = {},
    padreEliminado = false,
}: ModuloFormProps) {
    // Aquí se usa el hook personalizado para manejar datos, errores y lógica del formulario.
    const {
        data,
        errors,
        processing,
        showDeleteDialog,
        handleChange,
        handleEsPadreChange,
        handleSubmit,
        handleDeleteClick,
        handleDeleteCancel,
        handleDeleteConfirm,
        setErrors
    } = useModuloForm({
        mode,
        initialData,
        disabled,
        onSubmit,
        onDelete,
        externalErrors,
    });

    const { handleRutaKeyDown, handlePermisosExtraKeyDown } = useHandleKeyDown();

    // Aquí se usa hook para detectar cambios en el formulario.
    const changes = useFormChanges(initialData || {}, data);

    // Aquí se usa useToast para mostrar errores de validación.
    const { toast } = useToast();

    // Función helper para clases CSS basadas en cambios y errores.
    const getInputClass = (field: keyof typeof data) => {
        return (
            (changes[field] && mode === "edit" ? "border-primary/50 " : "") +
            (errors[field] ? "border-destructive" : "")
        );
    };

    // Aquí se usa useState para manejar el diálogo de warning.
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false);

    // Módulo padre seleccionado: Encuentra por ID para mostrar en ruta.
    const moduloPadreSeleccionado = modulosPadre.find(
        (m) => m.id == data.modulo_padre_id
    );

    // Flag para cambios críticos en edición.
    const hasCriticalChanges = mode === "edit" && (
        changes.ruta ||
        changes.modulo_padre_id ||
        changes.es_padre
    );

    // Handler para submit: Muestra warning si es necesario.
    // Se agregó validación con Zod AL INICIO para evitar mostrar alerta si hay errores.
    // Valida primero, si falla, muestra errores inmediatamente. Si pasa, decide sobre alerta.
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Aquí se hace la validación con Zod ANTES de mostrar la alerta.
        const validation = moduloSchema.safeParse(data);
        if (!validation.success) {
            const zodErrors: Record<string, string> = {};
            validation.error.issues.forEach((err) => {
                if (err.path[0]) {
                    zodErrors[err.path[0].toString()] = err.message;
                }
            });

            setErrors(zodErrors)
            toast({
                title: "Errores de validación",
                description: "Por favor, corrige los errores en el formulario",
                variant: "destructive",
            });
            return;
        }

        // Si la validación pasa, entonces decide sobre la alerta.
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

        // Si no hay alerta, submit directamente (sin re-validar en el hook).
        handleSubmit(e);
    };

    // Handler para confirmar warning.
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

    // Handler para cancelar warning.
    const handleWarningCancel = () => {
        setShowWarningDialog(false);
        setPendingSubmit(false);
    };

    return (
        <>
            <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Nombre e Ícono */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="nombre"
                            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${changes.nombre && mode === "edit" ? "text-primary" : ""
                                }`}
                        >
                            Nombre del Módulo
                        </Label>
                        <Input
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            onKeyDown={handleTextKeyDown}
                            maxLength={MODULO_LIMITS.nombre}
                            disabled={disabled}
                            className={getInputClass("nombre")}
                            placeholder="Ej: Usuarios"
                        />
                        <div className="relative">
                            <InputError message={errors.nombre} />
                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                {data.nombre.length}/{MODULO_LIMITS.nombre}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="icono"
                            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${changes.icono && mode === "edit" ? "text-primary" : ""
                                }`}
                        >
                            Ícono
                        </Label>
                        <IconPicker
                            value={data.icono}
                            onChange={(icono) => handleChange("icono", icono)}
                            disabled={disabled}
                            className={getInputClass('icono')}
                        />
                        <InputError message={errors.icono} />
                    </div>
                </div>

                {/* Checkbox Es Padre */}
                <div className="p-3 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5">
                    <Checkbox
                        id="es_padre"
                        checked={data.es_padre}
                        onCheckedChange={handleEsPadreChange}
                        disabled={disabled}
                        className="border-primary/80"
                    />

                    <div>
                        <Label
                            htmlFor="es_padre"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 p-0 m-0">
                            <FolderTree className="h-4 w-4 text-primary" />
                            Módulo padre
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                            Los módulos padre sirven como contenedores para agrupar otros módulos. No tienen
                            página propia ni permisos extra.
                        </p>
                    </div>
                </div>

                {/* Combo Módulo Padre (solo si NO es padre) */}
                {!data.es_padre && (
                    <ModuloPadreCombobox
                        modulosPadre={modulosPadre}
                        value={data.modulo_padre_id}
                        handleChange={handleChange}
                        disabled={disabled}
                        hasChanges={changes.modulo_padre_id && mode == "edit"}
                        error={errors.modulo_padre_id}
                        className={getInputClass("modulo_padre_id")}
                        padreEliminado={padreEliminado}
                    />
                )}

                {/* Ruta con InputGroup */}
                <div className="space-y-2">
                    <Label
                        htmlFor="ruta"
                        className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${(changes.ruta || changes.modulo_padre_id) && mode === "edit" ? "text-primary" : ""
                            }`}
                    >
                        Ruta del Módulo
                    </Label>

                    {moduloPadreSeleccionado ? (
                        <div className="flex items-stretch">
                            <InputGroup
                                className={`${(changes.ruta || changes.modulo_padre_id) && mode == "edit"
                                    ? "has-[[data-slot=input-group-control]]:border-primary/50"
                                    : ""
                                    }`}
                            >
                                <InputGroupAddon className="text-primary">
                                    {moduloPadreSeleccionado.ruta}
                                </InputGroupAddon>
                                <InputGroupInput
                                    id="ruta"
                                    value={data.ruta}
                                    onChange={(e) => handleChange("ruta", e.target.value.replace(/ /g, '-'))}
                                    onKeyDown={handleRutaKeyDown}
                                    maxLength={MODULO_LIMITS.ruta}
                                    disabled={disabled}
                                    className={cn("!pl-0.5 !pb-1.5", getInputClass("ruta"))}
                                    placeholder="/usuarios"
                                />
                            </InputGroup>
                        </div>
                    ) : (
                        <Input
                            id="ruta"
                            value={data.ruta}
                            onChange={(e) => handleChange("ruta", e.target.value.replace(/ /g, '-'))}
                            onKeyDown={handleRutaKeyDown}
                            maxLength={MODULO_LIMITS.ruta}
                            disabled={disabled}
                            className={getInputClass("ruta")}
                            placeholder="/seguridad"
                        />
                    )}

                    <div className="relative">
                        {errors.ruta ? (
                            <InputError message={errors.ruta} />
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                La ruta debe empezar con / y solo contener letras minúsculas, números y guiones
                            </p>
                        )}

                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.ruta.length}/{MODULO_LIMITS.ruta}
                        </span>
                    </div>
                </div>

                {/* Permisos Extra (solo si NO es padre) */}
                {!data.es_padre && (
                    <div className="space-y-2">
                        <Label htmlFor="permisos_extra">Permisos Extra (opcional)</Label>
                        <Input
                            id="permisos_extra"
                            value={data.permisos_extra}
                            onChange={(e) => handleChange("permisos_extra", e.target.value.replace(/ /g, '_'))}
                            onKeyDown={handlePermisosExtraKeyDown}
                            disabled={disabled}
                            className={getInputClass("permisos_extra")}
                            placeholder="bloquear,aprobar_factura"
                        />
                        {errors.permisos_extra ? (
                            <InputError message={errors.permisos_extra} />
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Separar permisos con comas. Usar guión bajo (_) para permisos con más de
                                una palabra. Ej: bloquear,restaurar_password. Si el módulo tiene pestañas,
                                se recomienda asignar los permisos a la pestaña específica.
                            </p>
                        )}
                    </div>
                )}

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
                                        {processing ? "Creando..." : "Crear Módulo"}
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

            {/* Diálogo de eliminación */}
            <DeleteDialog
                open={showDeleteDialog}
                onOpenChange={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                processing={processing}
                itemName={`El módulo «${data.nombre}» será eliminado permanentemente. Asegúrese de inhabilitar todas las rutas relacionadas en el código. Si es un módulo padre, sus submódulos dejarán de ser visibles en el sidebar hasta que se les asigne un nuevo padre.`}
            />

            {/* Diálogo de confirmación de warning */}
            <ConfirmDialogModulo
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
