/**
 * Componente ModuloPadreCombobox.
 * 
 * Combobox para selección de módulo padre con búsqueda: muestra lista de módulos padre disponibles,
 * permite filtrar por nombre, resalta selección con check. Incluye opción para "sin padre".
 * Usa popover para dropdown y command para lista filtrable.
 * Se integra con React para formularios de módulos via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-11
 */

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, Check, ChevronsUpDown, Folder, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ModuloPadreInterface } from "../types/moduloInterface";
import { ModuloFormData } from "../types/moduloForm.types";

/**
 * Interfaz para las props del componente ModuloPadreCombobox.
 * Define los parámetros necesarios para configurar el combobox de módulos padre.
 */
interface ModuloPadreComboboxProps {
    modulosPadre: ModuloPadreInterface[]; // Lista de módulos padre disponibles.
    value: number | null; // ID del módulo padre seleccionado.
    handleChange: (field: keyof ModuloFormData, value: any) => void; // Callback para cambiar valor.
    disabled?: boolean; // Indica si el combobox está deshabilitado.
    hasChanges?: boolean; // Indica si hay cambios para resaltar.
    error?: string; // Mensaje de error opcional.
    className?: string;
    padreEliminado?: boolean;
}

/**
 * Componente ModuloPadreCombobox.
 * 
 * Renderiza combobox para selección de módulo padre con búsqueda y filtrado.
 * Incluye opción para "sin padre" y maneja estado de apertura con useState.
 * 
 * @param {ModuloPadreComboboxProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export function ModuloPadreCombobox({
    modulosPadre,
    value,
    handleChange,
    disabled = false,
    hasChanges = false,
    error,
    className = "",
    padreEliminado = false,
}: ModuloPadreComboboxProps) {
    // Aquí se usa useState para manejar si el combobox está abierto.
    const [open, setOpen] = useState(false);

    // Módulo padre seleccionado: Encuentra el módulo por ID para mostrar nombre.
    const selectedModulo = modulosPadre.find((m) => m.id == value);

    return (
        <div className="space-y-2">
            <Label htmlFor="modulo_padre_id" className={hasChanges ? "text-primary" : ""}>
                Módulo Padre (opcional)
            </Label>
            {/* Aviso si es huérfano */}
            {padreEliminado && (
                <div className="p-2 flex gap-2 items-center rounded-lg border border-destructive bg-destructive/15 text-red-700 text-sm font-medium">
                    <TriangleAlert className="h-4 w-4" />                    
                    El módulo padre original fue eliminado. Selecciona un nuevo padre o conviertalo en un módulo directo.
                </div>
            )}
            {/* Aquí se usa Popover para el dropdown del combobox. */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {/* Aquí se usa Button como trigger del popover, mostrando módulo seleccionado o placeholder. */}
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between",
                            !value && "text-muted-foreground",
                            className
                        )}
                        disabled={disabled}
                    >
                        {selectedModulo ? (
                            <span className="flex items-center gap-2">
                                <Folder className="h-4 w-4 text-primary" />
                                {selectedModulo.nombre}
                            </span>
                        ) : (
                            "Módulo directo (sin padre)"
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    {/* Aquí se usa Command para la lista de módulos con input de búsqueda. */}
                    <Command>
                        <CommandInput placeholder="Buscar módulo padre..." />
                        <CommandList>
                            {/* Aquí se usa CommandEmpty si no hay resultados. */}
                            <CommandEmpty>No se encontraron módulos padre</CommandEmpty>
                            {/* Aquí se usa CommandGroup para agrupar módulos. */}
                            <CommandGroup>
                                <CommandItem
                                    value="ninguno"
                                    onSelect={() => {
                                        handleChange("modulo_padre_id", null);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === null ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    Módulo directo (sin padre)
                                </CommandItem>
                                {modulosPadre.map((modulo) => (
                                    // Aquí se usa CommandItem para cada módulo, con check si seleccionado.
                                    <CommandItem
                                        key={modulo.id}
                                        value={modulo.nombre}
                                        onSelect={() => {
                                            handleChange("modulo_padre_id", modulo.id);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value == modulo.id ? "opacity-100" : "opacity-0"
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
            {/* Aquí se muestra InputError si hay error, o descripción si no. */}
            {error ? (
                <InputError message={error} />
            ) : (
                <p className="text-xs text-muted-foreground">
                    Si no seleccionas un padre, este será un módulo directo
                </p>
            )}
        </div>
    );
}