/**
 * Componente RolCombobox.
 * 
 * Combobox para selección de rol con búsqueda: muestra lista de roles disponibles,
 * permite filtrar por nombre, resalta selección con check.
 * Usa popover para dropdown y command para lista filtrable.
 * Se integra con React para formularios de usuarios via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
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
import { useState } from "react";
import { RolInterface } from "../types/usuarioInterface";
import { UsuarioFormData } from "../types/usuarioForm.types";

/**
 * Interfaz para las props del componente RolCombobox.
 * Define los parámetros necesarios para configurar el combobox de roles.
 */
interface RolComboboxProps {
    roles: RolInterface[]; // Lista de roles disponibles.
    clases: string; // Clases CSS adicionales para el botón.
    value: number | null; // ID del rol seleccionado.
    handleChange: (field: keyof UsuarioFormData, value: any) => void; // Callback para cambiar valor.
    disabled?: boolean; // Indica si el combobox está deshabilitado.
    error?: string; // Mensaje de error opcional.
    hasChanges?: boolean; // Indica si hay cambios para resaltar.
}
/**
 * Componente RolCombobox.
 * 
 * Renderiza combobox para selección de rol con búsqueda y filtrado.
 * Maneja estado de apertura y selección con useState.
 * 
 * @param {RolComboboxProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export function RolCombobox({
    roles,
    clases,
    value,
    handleChange,
    disabled = false,
    error,
    hasChanges = false,
}: RolComboboxProps) {

    // Aquí se usa useState para manejar si el combobox está abierto.
    const [openRolCombobox, setOpenRolCombobox] = useState(false);

    // Rol seleccionado: Encuentra el rol por ID para mostrar nombre.
    const selectedRol = roles.find((r) => r.id == value);

    // Modo creación: Combobox con búsqueda: Usa Popover para dropdown con Command para lista.
    return (
        <div className="space-y-2">
            <Label
                htmlFor="rol_id"
                className={`flex items-center gap-2  after:text-red-500 after:content-['*'] ${hasChanges ? "text-primary" : ""
                    }`}
            >
                Rol
            </Label>
            {/* Aquí se usa Popover para el dropdown del combobox. */}
            <Popover open={openRolCombobox} onOpenChange={setOpenRolCombobox}>
                <PopoverTrigger asChild>
                    {/* Aquí se usa Button como trigger del popover, mostrando rol seleccionado o placeholder. */}
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openRolCombobox}
                        disabled={disabled}
                        className={`w-full !mt-0 justify-between ${clases}`}
                    >
                        {selectedRol ? selectedRol.nombre : "Seleccionar rol..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    {/* Aquí se usa Command para la lista de roles con input de búsqueda. */}
                    <Command>
                        <CommandInput placeholder="Buscar rol..." />
                        <CommandList>
                            {/* Aquí se usa CommandEmpty si no hay resultados. */}
                            <CommandEmpty>No se encontraron roles.</CommandEmpty>
                            {/* Aquí se usa CommandGroup para agrupar roles. */}
                            <CommandGroup>
                                {roles.map((rol) => (
                                    // Aquí se usa CommandItem para cada rol, con check si seleccionado.
                                    <CommandItem
                                        key={rol.id}
                                        value={rol.nombre}                                        
                                        onSelect={() => {
                                            handleChange("rol_id", Number(rol.id));
                                            setOpenRolCombobox(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value == rol.id ? "opacity-100" : "opacity-0"
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
            {/* Aquí se muestra InputError si hay error. */}
            <InputError message={error} />
        </div>
    );
}
