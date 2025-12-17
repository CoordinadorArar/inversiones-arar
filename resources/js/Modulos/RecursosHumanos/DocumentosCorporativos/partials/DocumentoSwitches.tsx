/**
 * Componente DocumentoSwitches.
 * 
 * Renderiza switches para configurar la visibilidad del documento: mostrar en dashboard y footer.
 * Incluye tooltips informativos, badges de estado activo y lista de campos requeridos cuando activado.
 * Usa componentes UI para switches, tooltips y badges con estilos condicionales.
 * Se integra con React para gestión de configuraciones via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DocumentoFormData, SWITCH_DESCRIPTIONS } from "../types/documentoForm.types";

/**
 * Interfaz para las props del componente DocumentoSwitches.
 * Define los datos del formulario y callback para cambios en switches.
 */
interface DocumentoSwitchesProps {
  data: DocumentoFormData; // Datos actuales del formulario.
  onChange: (field: keyof DocumentoFormData, value: boolean) => void; // Callback para cambios en switches.
  disabled?: boolean; // Indica si los switches están deshabilitados.
}

/**
 * Componente DocumentoSwitches.
 * 
 * Renderiza una sección con switches para visibilidad, cada uno con descripción, tooltip y campos requeridos.
 * Aplica estilos condicionales basados en el estado activo del switch.
 * 
 * @param {DocumentoSwitchesProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export function DocumentoSwitches({
  data,
  onChange,
  disabled = false,
}: DocumentoSwitchesProps) {
  // Aquí se define la lista de switches a renderizar.
  const switches = ["mostrar_en_dashboard", "mostrar_en_footer"] as const;

  return (
    // Aquí se renderiza el contenedor principal con espacio para switches.
    <div className="space-y-4">
      
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold">Configuración de Visibilidad</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                Estos ajustes determinan dónde se mostrará el documento
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      
      <div className="grid gap-4 md:grid-cols-2">
        {switches.map((switchKey) => {
          // Aquí se obtiene la configuración del switch desde SWITCH_DESCRIPTIONS.
          const config = SWITCH_DESCRIPTIONS[switchKey];
          const isActive = data[switchKey];

          return (
            // Aquí se renderiza cada switch con borde y fondo condicional.
            <div
              key={switchKey}
              className={`p-4 rounded-lg border-2 transition-all ${isActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
                }`}
            >
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor={switchKey} className="cursor-pointer m-0">
                      {config.label}
                    </Label>
                    {isActive && (
                      <Badge variant="default" className="text-xs">
                        Activo
                      </Badge>
                    )}
                  </div>

                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {config.description}
                  </p>

                  
                  {isActive && config.requiredFields.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-primary mb-2">
                        Campos requeridos:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {config.requiredFields.map((field) => (
                          <Badge
                            key={field}
                            variant="outline"
                            className="text-xs bg-primary/20 border-primary/50"
                          >
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Switch
                  id={switchKey}
                  checked={isActive}
                  onCheckedChange={(checked) => onChange(switchKey, checked)}
                  disabled={disabled}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}