import { useState, useMemo } from "react";
import * as Icons from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

/**
 * 🔧 FUNCIÓN HELPER: Normaliza nombres de íconos
 * 
 * Convierte nombres como:
 * - "HomeIcon" → "home"
 * - "LucideHome" → "home"  
 * - "ArrowBigUp" → "arrow-big-up"
 * 
 * @param name - Nombre original del ícono desde lucide-react
 * @returns Nombre normalizado en kebab-case
 */
function normalizeIconName(name: string): string {
  // Quita prefijos/sufijos comunes
  const cleaned = name.replace(/^Lucide/i, "").replace(/Icon$/i, "");

  // Convierte PascalCase a kebab-case
  return cleaned
    .replace(/([a-z])([A-Z])/g, '$1-$2')        // Inserta '-' entre minúscula y mayúscula (ej: ArrowUp → Arrow-Up)
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')   // Maneja mayúsculas consecutivas (ej: XMLHttpRequest → XML-Http-Request, si aplica)
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')        // Inserta '-' antes de números (ej: Building2 → Building-2)
    .toLowerCase();                             // Todo en minúsculas
}

/**
 * 🔧 FUNCIÓN HELPER: Capitaliza primera letra de cada palabra
 * 
 * Convierte "arrow-big-up" → "Arrow Big Up" para mostrar bonito en el UI
 * 
 * @param str - String en kebab-case
 * @returns String con cada palabra capitalizada
 */
function toDisplayName(str: string): string {
  return str
    .split("-")                           // Separa por guiones ["arrow", "big", "up"]
    .map(word =>
      word.charAt(0).toUpperCase() +      // Primera letra mayúscula
      word.slice(1)                        // Resto en minúscula
    )
    .join(" ");                            // Une con espacios "Arrow Big Up"
}

interface IconPickerProps {
  value: string;                    // Valor actual del ícono (ej: "home")
  onChange: (value: string) => void; // Función que se ejecuta al seleccionar
  disabled?: boolean; // Indica si el combobox está deshabilitado.
  className?: string; // Mensaje de error opcional.
}

export default function IconPicker({ value, onChange, disabled = false, className = "" }: IconPickerProps) {
  const [open, setOpen] = useState(false);   // Controla si el popover está abierto
  const [search, setSearch] = useState("");  // Guarda el texto de búsqueda

  /**
   * 📋 LISTA DE ICONOS DISPONIBLES
   * 
   * Se ejecuta solo una vez al montar el componente (useMemo)
   * 1. Obtiene todos los nombres de íconos exportados por lucide-react
   * 2. Normaliza cada nombre (HomeIcon → home)
   * 3. Elimina duplicados con Set
   * 4. Filtra nombres vacíos o inválidos
   */
  const iconNames = useMemo(() => {
    try {
      const allIconNames = Object.keys(Icons)           // ["Home", "HomeIcon", "LucideHome", ...]
        .filter(name => typeof name === "string")       // Solo strings válidos
        .map(name => normalizeIconName(name))           // Normaliza: "home", "home", "home"    
        .filter(name => name.length > 0);                // Elimina strings vacíos

      // Elimina duplicados usando Set (home, home, home → home)
      return Array.from(new Set(allIconNames)).sort();  // Ordena alfabéticamente
    } catch (error) {
      console.error("❌ Error obteniendo nombres de íconos:", error);
      // Fallback: lista básica de íconos comunes si falla
      return ["heart", "star", "camera", "user", "home", "settings"];
    }
  }, []); // Array vacío = solo se ejecuta una vez

  /**
   * 🔍 ICONOS FILTRADOS POR BÚSQUEDA
   * 
   * Se recalcula cada vez que cambia `search` o `iconNames`
   * 1. Si no hay búsqueda, muestra los primeros 50 (rendimiento)
   * 2. Si hay búsqueda, filtra los que coincidan
   * 3. Limita a 50 resultados máximo (evita lag con muchos íconos)
   */
  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      return iconNames.slice(0, 50); // Primeros 50 si no hay búsqueda
    }

    try {
      const searchLower = search.toLowerCase();
      return iconNames
        .filter(name => name.includes(searchLower))  // Filtra por coincidencia
        .slice(0, 50);                                // Máximo 50 resultados
    } catch (error) {
      console.error("❌ Error en filtrado:", error);
      return [];
    }
  }, [iconNames, search]);

  // Nombre a mostrar en el botón (o placeholder si no hay selección)
  const displayName = value ? toDisplayName(value) : "Seleccionar ícono...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* 🔘 BOTÓN TRIGGER */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full !mt-0 justify-between ${className}`}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            {/* Muestra el ícono seleccionado (si existe) */}
            {value && <DynamicIcon name={value} className="h-4 w-4" />}

            {/* Nombre del ícono capitalizado o placeholder */}
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {displayName}
            </span>
          </div>

          {/* Icono de chevrones para indicar que es un selector */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* 📦 POPOVER CON LISTA DE ICONOS */}
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          {/* 🔍 Input de búsqueda */}
          <CommandInput
            placeholder="Buscar ícono..."
            value={search}
            onValueChange={setSearch}
          />

          {/* 📋 Lista de resultados */}
          <CommandList>
            {/* Mensaje si no hay resultados */}
            <CommandEmpty>No se encontraron íconos.</CommandEmpty>

            {/* Grupo de íconos filtrados */}
            <CommandGroup>
              {filteredIcons.map((iconName) => (
                <CommandItem
                  key={iconName}
                  value={iconName}
                  onSelect={() => {
                    // Si clickea el mismo ícono, lo deselecciona (lo pone vacío)
                    onChange(iconName === value ? "" : iconName);
                    setOpen(false); // Cierra el popover
                  }}
                >
                  {/* ✓ Check que aparece solo en el ícono seleccionado */}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === iconName ? "opacity-100" : "opacity-0"
                    )}
                  />

                  {/* 🎨 Ícono + Nombre */}
                  <DynamicIcon name={iconName} className="mr-2 h-4 w-4" />

                  {/* Nombre capitalizado para verse bonito */}
                  <span>{toDisplayName(iconName)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/**
  FORMA DE USO

  const [data, setData] = useState({
    icono: ""
  });

  <div>
    <label className="text-sm font-medium">Icono</label>
    <IconPicker value={data.icono} onChange={(icono) => setData('icono', icono)} />
  </div>
 */