/**
 * Componente EmpresaSwitches
 * 
 * Renderiza los switches booleanos con descripciones y badges
 * de campos requeridos cuando se activan.
 * 
 * Props:
 * - data: Datos del formulario
 * - onChange: Callback para actualizar switches
 * - disabled: Deshabilitar todos los switches
 * 
 * @author Yariangel Aray
 * @date 2025-12-01
 */

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { EmpresaFormData, SWITCH_DESCRIPTIONS } from "./empresaForm.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmpresaSwitchesProps {
  data: EmpresaFormData;
  onChange: (field: keyof EmpresaFormData, value: boolean) => void;
  disabled?: boolean;
}

export function EmpresaSwitches({
  data,
  onChange,
  disabled = false,
}: EmpresaSwitchesProps) {
  const switches = [
    "mostrar_en_header",
    "mostrar_en_empresas",
    "mostrar_en_portafolio",
    "permitir_pqrsd",
  ] as const;

  return (
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
                Estos ajustes determinan dónde se mostrará la empresa en el
                sitio público
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {switches.map((switchKey) => {
          const config = SWITCH_DESCRIPTIONS[switchKey];
          const isActive = data[switchKey];

          return (
            <div
              key={switchKey}
              className={`p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={switchKey}
                      className="cursor-pointer m-0"
                    >
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

                  {/* Mostrar campos requeridos si hay */}
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
                            {field.replace(/_/g, " ")}
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