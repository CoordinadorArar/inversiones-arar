/**
 * Columnas para la tabla de documentos corporativos usando TanStack Table.
 * Incluye personalización de celdas con íconos dinámicos, badges para visibilidad y enlace a archivos.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, EyeOff } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { DocumentoCorporativoInterface } from "./types/documentoInterface";
import { Button } from "@/components/ui/button";

/**
 * Definición de columnas activas para la tabla de documentos corporativos.
 * Incluye ID, nombre con ícono, visibilidad con badges y enlace al archivo.
 * 
 * @type {ColumnDef<DocumentoCorporativoInterface>[]}
 */
export const DocumentoColumns: ColumnDef<DocumentoCorporativoInterface>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: false, // Aquí se define que la columna ID no se puede ocultar.
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const nombre = row.original.nombre;
      const icono = row.original.icono;
      // Aquí se renderiza el nombre con ícono dinámico si existe.
      return (
        <div className="flex md:items-center gap-2">
          {icono && (
            <DynamicIcon name={icono} className="h-4 min-w-4 text-primary max-md:mt-1" />
          )}
          <span>{nombre}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "visibilidad",
    header: "Visibilidad",
    cell: ({ row }) => {
      const dashboard = row.original.mostrar_en_dashboard;
      const footer = row.original.mostrar_en_footer;

      if (!dashboard && !footer) {
        // Aquí se muestra ícono de no visible si no está en dashboard ni footer.
        return (
          <div className="flex items-center gap-1.5">
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">No visible</span>
          </div>
        );
      }

      // Aquí se muestran badges para dashboard y footer si están activos.
      return (
        <div className="flex flex-wrap gap-1">
          {dashboard && (
            <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20 text-xs">
              <Eye />
              Dashboard
            </Badge>
          )}
          {footer && (
            <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs">
              <Eye />
              Footer
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "archivo",
    header: "Archivo",
    cell: ({ row }) => {
      const rutaUrl = row.original.ruta;
      // Aquí se renderiza enlace al archivo en nueva pestaña con botón de link.
      return (
        <a
          href={"/storage/" + rutaUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="link" className="py-0 h-auto">
            <FileText className="h-3.5 w-3.5" />
            Ver documento
          </Button>
        </a>
      );
    },
  },
];

/**
 * Definición de columnas inactivas por defecto para la tabla de documentos corporativos.
 * Vacío, ya que todas las columnas están activas inicialmente.
 * 
 * @type {Object}
 */
export const DocumentoInactiveColumns = {}; 
