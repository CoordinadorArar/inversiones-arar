/**
 * Componente DocumentoCombobox.
 * 
 * Combobox para búsqueda dinámica de documentos en BD externa: muestra resultados con nombre,
 * indica si ya existe en usuarios, autocompleta nombre al seleccionar.
 * En modo edit muestra campo readonly; en create usa popover con búsqueda.
 * Usa hook personalizado para lógica de búsqueda y componentes UI para combobox.
 * Se integra con React para formularios de usuarios via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Check, ChevronsUpDown, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDocumentoSearch } from "../hooks/useDocumentSearch";

/**
 * Interfaz para las props del componente DocumentoCombobox.
 * Define los parámetros necesarios para configurar el combobox.
 */
interface DocumentoComboboxProps {
  mode: "create" | "edit"; // Modo del combobox (crear o editar).
  value: string; // Valor actual del documento seleccionado.
  onChange: (documento: string, nombre: string, yaExiste: boolean) => void; // Callback al seleccionar documento.
  disabled?: boolean; // Indica si el combobox está deshabilitado.
  error?: string; // Mensaje de error opcional.
  hasChanges?: boolean; // Indica si hay cambios para resaltar.
}
/**
 * Componente DocumentoCombobox.
 * 
 * Renderiza combobox para búsqueda de documentos o campo readonly según modo.
 * Maneja estados de búsqueda y selección con hook personalizado.
 * 
 * @param {DocumentoComboboxProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export function DocumentoCombobox({
  mode,
  value,
  onChange,
  disabled = false,
  error,
  hasChanges = false,
}: DocumentoComboboxProps) {

  // Aquí se usa el hook useDocumentoSearch para manejar búsqueda, opciones y selección.
  const {
    searchTerm,
    setSearchTerm,
    options,
    isSearching,
    isOpen,
    setIsOpen,
    handleSelect,
  } = useDocumentoSearch({ onSelect: onChange });

  // Si estamos en modo edición, solo mostrar el campo de lectura: Input readonly con estilo muted.
  if (mode === "edit") {
    return (
      <div className="space-y-2">
        <Label htmlFor="numero_documento">Número de Documento</Label>
        {/* Aquí se usa Input readonly para mostrar el documento en modo edit. */}
        <Input
          id="numero_documento"
          value={value}
          readOnly={true}
          className="bg-muted/50 cursor-not-allowed font-mono"
        />
      </div>
    );
  }

  // Modo creación: Combobox con búsqueda: Usa Popover para dropdown con Command para lista.
  return (
    <div className="space-y-2">
      <Label
        htmlFor="numero_documento"
        className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${hasChanges ? "text-primary" : ""
          }`}
      >
        Número de Documento
      </Label>

      {/* Aquí se usa Popover para el dropdown del combobox. */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          {/* Aquí se usa Button como trigger del popover, mostrando valor o placeholder. */}
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            disabled={disabled}
            className={`w-full !mt-0 justify-between ${error ? "border-destructive" : ""}`}
          >
            <span className={value ? "" : "text-muted-foreground"}>
              {value || "Buscar documento..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          {/* Aquí se usa Command para la lista de opciones con input de búsqueda. */}
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Escribe al menos 5 dígitos..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isSearching ? (
                // Aquí se muestra loading mientras busca.
                <div className="p-4 text-sm text-center text-muted-foreground flex gap-2 items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando...
                </div>
              ) : searchTerm.length < 5 ? (
                // Aquí se muestra mensaje si no hay suficientes caracteres.
                <div className="p-4 text-sm text-center text-muted-foreground">
                  Escribe al menos 5 dígitos para buscar
                </div>
              ) : options.length === 0 ? (
                // Aquí se usa CommandEmpty si no hay resultados.
                <CommandEmpty>
                  No se encontraron usuarios con contrato activo
                </CommandEmpty>
              ) : (
                // Aquí se usa CommandGroup para listar opciones.
                <CommandGroup>
                  {options.map((option) => (
                    // Aquí se usa CommandItem para cada opción, con check si seleccionado.
                    <CommandItem
                      key={option.documento}
                      value={option.documento}
                      onSelect={() => handleSelect(option)}
                      className={option.yaExiste ? "opacity-60" : ""}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            value === option.documento ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{option.documento}</div>
                          <div className="text-xs text-muted-foreground">
                            {option.nombre}
                          </div>
                        </div>
                        {option.yaExiste && (
                          // Aquí se muestra badge si ya existe.
                          <div className="flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            Ya registrado
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error ? (
        // Aquí se muestra InputError si hay error.
        <InputError message={error} />
      ) : (
        // Aquí se muestra ayuda si no hay error.
        <p className="text-xs text-muted-foreground">
          Busca por documento (mínimo 5 números). Solo aparecerán usuarios con contrato activo.
        </p>
      )}
    </div>
  );
}
