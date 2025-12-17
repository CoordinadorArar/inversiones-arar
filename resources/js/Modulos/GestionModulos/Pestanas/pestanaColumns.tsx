/**
 * Definiciones de columnas para tabla de pestañas.
 * 
 * Define columnas para la tabla de pestañas usando @tanstack/react-table: ID, nombre, ruta completa y jerarquía.
 * Incluye celdas personalizadas con badges, íconos y estilos condicionales basados en estado del módulo.
 * Usa componentes UI para badges e íconos, y lógica para mostrar jerarquía y módulos eliminados.
 * Se integra con React para tablas de pestañas via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-12
 */

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PestanaInterface } from "./types/pestanaInterface";
import { FileText, AlertTriangle, ChevronRight } from "lucide-react";

// Aquí se definen las columnas activas para la tabla de pestañas.
export const PestanaColumns: ColumnDef<PestanaInterface>[] = [
    // Aquí se define la columna de ID, no ocultable.
    {
        accessorKey: "id",
        header: "ID",
        enableHiding: false,
    },
    // Aquí se define la columna de nombre con ícono y estilo.
    {
        accessorKey: "nombre",
        header: "Nombre",
        cell: ({ row }) => {
            const nombre = row.original.nombre;
            return (
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{nombre}</span>
                </div>
            );
        },
    },
    // Aquí se define la columna de ruta completa con badge condicional si módulo eliminado.
    {
        accessorKey: "ruta_completa",
        header: "Ruta Completa",
        cell: ({ row }) => {
            const ruta = row.original.ruta_completa;
            const moduloEliminado = row.original.modulo_eliminado;

            if (moduloEliminado) {
                return (
                    <Badge variant="outline">
                        <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                        <span className="text-xs text-muted-foreground font-mono line-through">
                            {ruta}
                        </span>
                    </Badge>
                );
            }
            // Aquí se muestra la ruta con estilo monoespaciado.
            return (
                <Badge className="bg-primary/15 text-primary text-xs font-mono border-primary/30">
                    {ruta}
                </Badge>
            );
        },
    },
    // Aquí se define la columna de jerarquía con partes separadas por flechas.
    {
        accessorKey: "jerarquia",
        header: "Jerarquía",
        cell: ({ row }) => {
            const jerarquia = row.original.jerarquia;
            const moduloEliminado = row.original.modulo_eliminado;

            if (moduloEliminado) {
                return (
                    <Badge className="bg-red-500/10 text-red-700 border-red-500/20 gap-1.5">
                        <AlertTriangle className="h-3 w-3" />
                        Módulo eliminado
                    </Badge>
                );
            }

            const parts = jerarquia.split(">");

            return (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {parts.map((p, i) => (
                        <span key={i} className="flex items-center gap-1">
                            <span>{p.trim()}</span>
                            {i < parts.length - 1 && (
                                <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                            )}
                        </span>
                    ))}
                </div>
            );
        },
    },
];

// Aquí se define un objeto vacío para columnas inactivas
export const PestanaInactiveColumns = {};