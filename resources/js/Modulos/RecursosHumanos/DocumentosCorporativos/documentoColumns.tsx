import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, EyeOff } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { DocumentoCorporativoInterface } from "./types/documentoInterface";

export const DocumentoColumns: ColumnDef<DocumentoCorporativoInterface>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: false,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const nombre = row.original.nombre;
      const icono = row.original.icono;
      return (
        <div className="flex items-center gap-2">
          {icono ? (
            <DynamicIcon name={icono} className="h-4 w-4 text-primary" />
          ) : (
            <FileText className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium">{nombre}</span>
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
        return (
          <div className="flex items-center gap-1.5">
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">No visible</span>
          </div>
        );
      }

      return (
        <div className="flex flex-wrap gap-1">
          {dashboard && (
            <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Dashboard
            </Badge>
          )}
          {footer && (
            <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs">
              <Eye className="h-3 w-3 mr-1" />
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
      const rutaUrl = row.original.ruta_url;
      return (
        <a
          href={rutaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1.5"
        >
          <FileText className="h-3.5 w-3.5" />
          Ver documento
        </a>
      );
    },
  },
];

export const DocumentoInactiveColumns = {};