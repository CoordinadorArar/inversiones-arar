/**
 * Componente ModuloDisponibleCombobox.
 * 
 * Combobox para selección de módulo disponible con búsqueda: muestra lista de módulos disponibles,
 * permite filtrar por nombre, resalta selección con check. Incluye aviso si el módulo fue eliminado.
 * Usa popover para dropdown y command para lista filtrable.
 * Se integra con React para formularios de pestañas via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2024-12-12
 */

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, Check, ChevronsUpDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ModuloDisponibleInterface } from "../types/pestanaInterface"; // Ajusta la ruta si es necesario
import { PestanaFormData } from "../types/pestanaForm.types"; // Ajusta la ruta si es necesario

/**
 * Interfaz para las props del componente ModuloDisponibleCombobox.
 * Define los parámetros necesarios para configurar el combobox de módulos disponibles.
 */
interface ModuloDisponibleComboboxProps {
    modulos: ModuloDisponibleInterface[]; // Lista de módulos disponibles.
    value: number | null; // ID del módulo seleccionado.
    handleChange: (field: keyof PestanaFormData, value: any) => void; // Callback para cambiar valor.
    disabled?: boolean; // Indica si el combobox está deshabilitado.
    hasChanges?: boolean; // Indica si hay cambios para resaltar.
    error?: string; // Mensaje de error opcional.
    className?: string; // Clase CSS adicional.
    moduloEliminado?: boolean | null; // Indica si el módulo original fue eliminado.
}

/**
 * Componente ModuloDisponibleCombobox.
 * 
 * Renderiza combobox para selección de módulo disponible con búsqueda y filtrado.
 * Incluye aviso si el módulo fue eliminado y maneja estado de apertura con useState.
 * 
 * @param {ModuloDisponibleComboboxProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export function ModuloDisponibleCombobox({
    modulos,
    value,
    handleChange,
    disabled = false,
    hasChanges = false,
    error,
    className = "",
    moduloEliminado = false,
}: ModuloDisponibleComboboxProps) {
    // Aquí se usa useState para manejar si el combobox está abierto.
    const [open, setOpen] = useState(false);

    // Módulo seleccionado: Encuentra el módulo por ID para mostrar nombre.
    const selectedModulo = modulos.find((m) => m.id === value);

    return (
        <div className="space-y-2">
            <Label htmlFor="modulo_id" className={hasChanges ? "text-primary" : ""}>
                Módulo al que pertenece
                <span className="text-red-500 ml-0.5">*</span>
            </Label>
            {/* Aviso si el módulo fue eliminado */}
            {moduloEliminado && (
                <div className="p-2 flex gap-2 items-center rounded-lg border border-destructive bg-destructive/15 text-red-700 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    El módulo original fue eliminado. Selecciona un nuevo módulo.
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
                                <FileText className="h-4 w-4 text-primary" />
                                {selectedModulo.nombre}
                            </span>
                        ) : (
                            "Seleccionar módulo"
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    {/* Aquí se usa Command para la lista de módulos con input de búsqueda. */}
                    <Command>
                        <CommandInput placeholder="Buscar módulo..." />
                        <CommandList>
                            {/* Aquí se usa CommandEmpty si no hay resultados. */}
                            <CommandEmpty>No se encontraron módulos</CommandEmpty>
                            {/* Aquí se usa CommandGroup para agrupar módulos. */}
                            <CommandGroup>
                                {modulos.map((modulo) => (
                                    // Aquí se usa CommandItem para cada módulo, con check si seleccionado.
                                    <CommandItem
                                        key={modulo.id}
                                        value={modulo.nombre}
                                        onSelect={() => {
                                            handleChange("modulo_id", modulo.id);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === modulo.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <FileText className="h-4 w-4 mr-2 text-primary" />
                                        {modulo.nombre}
                                        {modulo.padre_eliminado && (
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                (Padre eliminado)
                                            </span>
                                        )}
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
                    Solo se muestran módulos hijos o directos (no módulos padre)
                </p>
            )}
        </div>
    );
}