/**
 * Columnas para la tabla de módulos usando TanStack Table.
 * Incluye personalización de celdas con íconos dinámicos, badges para tipos y padres.
 * 
 * @author Yariangel Aray
 * @date 2025-12-10
 */

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ModuloInterface } from "./types/moduloInterface";
import { FolderTree, FolderOpen, AppWindow } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

export const ModuloColumns: ColumnDef<ModuloInterface>[] = [
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
            const esPadre = row.original.es_padre;
            const moduloPadre = row.original.modulo_padre_nombre;
            // Aquí se renderiza el nombre con ícono según tipo: FolderTree para padre con hijos, FolderOpen para hijo, AppWindow para independiente.
            return (
                <div className="flex items-center gap-2">
                    {(esPadre) ? (
                        <FolderTree className="h-4 w-4 text-primary" />
                    ) : (!esPadre && moduloPadre) ? (
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <AppWindow className="h-4 w-4 text-blue-700" />
                    )}
                    <span className={esPadre ? "font-semibold" : ""}>{nombre}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "icono",
        header: "Icono",
        cell: ({ row }) => {
            const icono = row.original.icono;
            // Aquí se renderiza el ícono dinámico usando DynamicIcon en un badge.
            return (
                <Badge variant="outline" className="py-1">
                    <DynamicIcon name={icono} className="!h-4 !w-4" />
                </Badge>
            );
        },
    },
    {
        accessorKey: "ruta",
        header: "Ruta Completa",
        cell: ({ row }) => {
            const ruta = row.original.ruta_completa;
            // Aquí se muestra la ruta con estilo monoespaciado y muted.
            return (
                <Badge className="bg-primary/15 text-primary text-xs font-mono border-primary/30">
                    {ruta}
                </Badge>
            );
            // return <span className="text-xs font-mono text-muted-foreground">{ruta}</span>;
        },
    },
    {
        accessorKey: "tiene_hijos",
        header: "Tipo",
        cell: ({ row }) => {
            const esPadre = row.original.es_padre;
            const cantidadHijos = row.original.cant_hijos;
            const moduloPadre = row.original.modulo_padre_nombre;
            const padreEliminado = row.original.padre_eliminado;

            // Aquí se determina el tipo: Padre con cantidad de hijos, Hijo o Independiente, y se renderiza como badge.
            if (esPadre) {
                return (
                    <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                        Módulo Padre ({cantidadHijos} hijos)
                    </Badge>
                );
            } else if (!esPadre && moduloPadre) {
                return (
                    <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                        Módulo Hijo de {moduloPadre}
                    </Badge>
                );
            } else if (padreEliminado) {  // Si padre eliminado, muestra badge especial
                return (
                    <Badge className="bg-red-500/10 text-red-700 border-red-500/20">
                        Módulo Hijo (Padre eliminado)
                    </Badge>
                );
            } else {
                return (
                    <Badge className="bg-gray-500/10 text-gray-700 border-gray-500/20">
                        Módulo Directo
                    </Badge>
                );
            }
        },
    },
];

export const ModuloInactiveColumns = {}; // Aquí se define un objeto vacío para columnas inactivas, por si se necesita extender.
