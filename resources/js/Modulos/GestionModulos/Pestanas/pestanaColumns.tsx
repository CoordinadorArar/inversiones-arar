import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PestanaInterface } from "./types/pestanaInterface";
import { EmptyBadge } from "@/Components/EmptyBadge";
import { FileText, AlertTriangle, ChevronRight } from "lucide-react";

export const PestanaColumns: ColumnDef<PestanaInterface>[] = [
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
            return (
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{nombre}</span>
                </div>
            );
        },
    },
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
    // {
    //     accessorKey: "permisos_extra",
    //     header: "Permisos Extra",
    //     cell: ({ row }) => {
    //         const permisos = row.original.permisos_extra;

    //         if (!permisos || permisos.length === 0) {
    //             return <EmptyBadge />;
    //         }

    //         return (
    //             <div className="flex flex-wrap gap-1">
    //                 {permisos.slice(0, 2).map((permiso, idx) => (
    //                     <Badge
    //                         key={idx}
    //                         variant="outline"
    //                         className="text-xs bg-orange-500/10 text-orange-700 border-orange-500/20"
    //                     >
    //                         {permiso}
    //                     </Badge>
    //                 ))}
    //                 {permisos.length > 2 && (
    //                     <Badge variant="outline" className="text-xs">
    //                         +{permisos.length - 2}
    //                     </Badge>
    //                 )}
    //             </div>
    //         );
    //     },
    // },
];

export const PestanaInactiveColumns = {};