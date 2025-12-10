/**
 * Columnas para la tabla de módulos usando TanStack Table.
 * Incluye personalización de celdas con íconos dinámicos, badges para tipos y padres.
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ModuloInterface } from "./types/moduloInterface";
import { EmptyBadge } from "@/Components/EmptyBadge";
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
            const tieneHijos = row.original.tiene_hijos;
            const moduloPadre = row.original.modulo_padre;
            // Aquí se renderiza el nombre con ícono según tipo: FolderTree para padre con hijos, FolderOpen para hijo, AppWindow para independiente.
            return (
                <div className="flex items-center gap-2">
                    {(esPadre && tieneHijos) ? (
                        <FolderTree className="h-4 w-4 text-primary" />
                    ) : (!esPadre && moduloPadre) ? (
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    ): (                        
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
                <Badge variant="outline" className="">
                    <DynamicIcon name={icono} className="!h-4 !w-4" />                    
                </Badge>
            );
        },
    },
    {
        accessorKey: "ruta",
        header: "Ruta",
        cell: ({ row }) => {
            const ruta = row.original.ruta;
            // Aquí se muestra la ruta con estilo monoespaciado y muted.
            return <span className="text-xs font-mono text-muted-foreground">{ruta}</span>;
        },
    },
    {
        accessorKey: "modulo_padre",
        header: "Padre",
        cell: ({ row }) => {
            const padre = row.original.modulo_padre;
            // Aquí se muestra el padre como badge si existe, o EmptyBadge si no.
            return padre ? (
                <Badge className="bg-primary/15 text-primary border-primary/30">
                    {padre.nombre}
                </Badge>
            ) : (
                <EmptyBadge />
            );
        },
    },
    {
        accessorKey: "tiene_hijos",
        header: "Tipo",
        cell: ({ row }) => {
            const esPadre = row.original.es_padre;
            const tieneHijos = row.original.tiene_hijos;
            const cantidadHijos = row.original.cantidad_hijos;
            const moduloPadre = row.original.modulo_padre;

            // Aquí se determina el tipo: Padre con cantidad de hijos, Hijo o Independiente, y se renderiza como badge.
            if (esPadre && tieneHijos) {
                return (
                    <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                        Padre ({cantidadHijos} hijos)
                    </Badge>
                );
            } else if (!esPadre && moduloPadre) {
                return (
                    <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                        Hijo
                    </Badge>
                );
            } else {
                return (
                    <Badge className="bg-gray-500/10 text-gray-700 border-gray-500/20">
                        Independiente
                    </Badge>
                );
            }
        },
    },
];

export const ModuloInactiveColumns = {}; // Aquí se define un objeto vacío para columnas inactivas, por si se necesita extender.
