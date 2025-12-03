/**
 * HelpManualButton Component
 *
 * Componente reutilizable para mostrar un botón/ícono de ayuda
 * con tooltip integrado. Permite abrir un enlace a un manual o guía.
 *
 * Variantes disponibles:
 * - primary: botón circular con fondo suave y color primario (ideal para vistas principales)
 * - muted: ícono minimalista gris sin fondo (ideal para áreas más discretas del UI)
 *
 * Props:
 * @param {string} url - URL del manual a abrir en nueva pestaña.
 * @param {"primary" | "muted"} variant - Variante visual del componente.
 * @param {string} [ariaLabel] - Etiqueta accesible opcional para lectores de pantalla.
 *
 * Ejemplos de uso:
 * <HelpManualButton url="/docs/Manual-PQRSD.pdf" variant="primary" />
 * <HelpManualButton url="/docs/Manual-Empresas.pdf" variant="muted" />
 *
 * @author Yariangel Aray
 * @date 2025-12-03
 */

import { HelpCircle, CircleHelp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HelpManualButtonProps {
  url: string;
  variant: "primary" | "muted";
  ariaLabel?: string;
  className?: string;
}

export default function HelpManualButton({ url, variant, ariaLabel, className }: HelpManualButtonProps) {

  /**
   * Estilos y contenido según variante seleccionada
   */
  const config = {
    primary: {
      wrapperClass:
        "inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-all",
      icon: <HelpCircle className="h-4 w-4 text-primary" />,
      tooltip: <p className="text-sm">Ver manual de ayuda</p>,
    },
    muted: {
      wrapperClass:
        "inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-muted-foreground hover:text-foreground/80 transition-all",
      icon: <CircleHelp className="w-4 h-4" />,
      tooltip: "¿Necesitas ayuda?",
    },
  }[variant];

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel ?? "botón-de-ayuda"}
            className={cn(config.wrapperClass, className)}
          >
            {config.icon}
          </a>
        </TooltipTrigger>

        <TooltipContent>
          {config.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
