import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import InputError from "@/Components/InputError";
import { Save, X, Plus, Check, ChevronsUpDown, Folder, FolderTree } from "lucide-react";
import {
    ModuloFormData,
    MODULO_LIMITS,
} from "../types/moduloForm.types";
import { ModuloPadreInterface } from "../types/moduloInterface";
import { handleTextKeyDown } from "@/lib/keydownValidations";
import { useFormChanges } from "@/hooks/use-form-changes";
import { useModuloForm } from "../hooks/useModuloForm";
import { cn } from "@/lib/utils";
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
import { useState } from "react";
import IconPicker from "@/Components/IconPicker";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/Components/ui/input-group";

interface ModuloFormProps {
    mode: "create" | "edit";
    initialData?: Partial<ModuloFormData>;
    disabled?: boolean;
    modulosPadre: ModuloPadreInterface[];
    onSubmit: (data: ModuloFormData) => Promise<void>;
    onCancel: () => void;
    externalErrors?: Record<string, string>;
}

export function ModuloForm({
    mode,
    initialData,
    disabled = false,
    modulosPadre,
    onSubmit,
    onCancel,
    externalErrors = {},
}: ModuloFormProps) {

    const { data, errors, processing, handleChange, handleEsPadreChange, handleSubmit, handleRutaModuloKeyDown, handlePermisosExtraKeyDown } =
        useModuloForm({
            mode,
            initialData,
            disabled,
            onSubmit,
            externalErrors,
        });

    const changes = useFormChanges(initialData || {}, data);

    const getInputClass = (field: keyof typeof data) => {
        return (
            (changes[field] && mode === "edit" ? "border-primary/50 " : "") +
            (errors[field] ? "border-destructive" : "")
        );
    };

    const [openPadre, setOpenPadre] = useState(false);

    const moduloPadreSeleccionado = modulosPadre.find(
        (m) => m.id == data.modulo_padre_id
    );

    console.log(data, initialData)

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                        Este módulo es un módulo padre
                    </Label>
                    <p className="text-xs text-muted-foreground">
                        Los módulos padre sirven como contenedores para agrupar otros módulos. No tienen
                        página propia ni permisos extra.
                    </p>
                </div>
            </div>

            {/* Combo Módulo Padre (solo si NO es padre) */}
            {!data.es_padre && (
                <div className="space-y-2">
                    <Label htmlFor="modulo_padre_id">Módulo Padre (opcional)</Label>
                    <Popover open={openPadre} onOpenChange={setOpenPadre}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openPadre}
                                className={cn(
                                    "w-full justify-between",
                                    getInputClass("modulo_padre_id"),
                                    !data.modulo_padre_id && "text-muted-foreground"
                                )}
                                disabled={disabled}
                            >
                                {moduloPadreSeleccionado ? (
                                    <span className="flex items-center gap-2">
                                        <Folder className="h-4 w-4 text-primary" />
                                        {moduloPadreSeleccionado.nombre}
                                    </span>
                                ) : (
                                    "Módulo directo (sin padre)"
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Buscar módulo padre..." />
                                <CommandList>
                                    <CommandEmpty>No se encontraron módulos padre</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            value="ninguno"
                                            onSelect={() => {
                                                handleChange("modulo_padre_id", null);
                                                setOpenPadre(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    data.modulo_padre_id === null ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            Módulo directo (sin padre)
                                        </CommandItem>
                                        {modulosPadre.map((modulo) => (
                                            <CommandItem
                                                key={modulo.id}
                                                value={modulo.nombre}
                                                onSelect={() => {
                                                    handleChange("modulo_padre_id", modulo.id);
                                                    setOpenPadre(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        data.modulo_padre_id == modulo.id
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                <Folder className="h-4 w-4 mr-2 text-primary" />
                                                {modulo.nombre}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {errors.modulo_padre_id ? (

                        <InputError message={errors.modulo_padre_id} />
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            Si no seleccionas un padre, este será un módulo directo
                        </p>
                    )}
                </div>
            )}

            {/* Ruta con InputGroup */}
            <div className="space-y-2">
                <Label
                    htmlFor="ruta"
                    className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${changes.ruta && mode === "edit" ? "text-primary" : ""
                        }`}
                >
                    Ruta del Módulo
                </Label>

                {moduloPadreSeleccionado ? (
                    <div className="flex items-stretch">

                        <InputGroup className={`${changes.ruta && mode == "edit" ? "has-[[data-slot=input-group-control]]:border-primary/50" : ""}`}>
                            <InputGroupAddon className="text-primary">
                                {moduloPadreSeleccionado.ruta}
                            </InputGroupAddon>
                            <InputGroupInput
                                id="ruta"
                                value={data.ruta}
                                onChange={(e) => handleChange("ruta", e.target.value)}
                                onKeyDown={handleRutaModuloKeyDown}
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
                        onChange={(e) => handleChange("ruta", e.target.value)}
                        onKeyDown={handleRutaModuloKeyDown}
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
                        onChange={(e) => handleChange("permisos_extra", e.target.value)}
                        onKeyDown={handlePermisosExtraKeyDown}
                        disabled={disabled}
                        className={getInputClass("permisos_extra")}
                        placeholder="bloquear,restaurar_password"
                    />
                    {errors.permisos_extra ? (
                        <InputError message={errors.permisos_extra} />

                    ) : (
                        <p className="text-xs text-muted-foreground">
                            Separar permisos con comas. Usar guión bajo (_) para permisos con más de una
                            palabra. Ej: bloquear,restaurar_password. Si el módulo tiene pestañas se recomienda asignar los permisos a la pestaña especifica
                        </p>
                    )}
                </div>
            )}

            {/* Botones */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
                {!disabled && (
                    <>
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
    );
}