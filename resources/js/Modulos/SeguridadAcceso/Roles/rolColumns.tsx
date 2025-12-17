/**
 * Función para crear definiciones de columnas para la tabla de roles.
 * 
 * Define columnas dinámicas basadas en permisos y accesos: ID, nombre, abreviatura, accesos condicionales y acciones.
 * Incluye dropdowns para accesos a módulos/pestañas y acciones de editar/eliminar.
 * Usa @tanstack/react-table para columnas, componentes UI para dropdowns y badges, y Inertia para navegación.
 * Se integra con React para tablas de roles via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-17
 */

import { ColumnDef } from "@tanstack/react-table";
import { RolInterface } from "../types/rolInterface";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FolderTree, MoreVertical, AppWindow, LockKeyhole } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/Components/ui/badge";
import { Link } from "@inertiajs/react";

/**
 * Interfaz para las props de la función createRolColumns.
 * Define callbacks, permisos y flags para accesos.
 */
interface CreateRolColumnsProps {
    onEdit: (id: number) => void; // Callback para editar rol.
    onDelete: (rol: RolInterface) => void; // Callback para eliminar rol.
    permisos: { editar: boolean; eliminar: boolean }; // Permisos del usuario.
    tieneControlAccesos: boolean; // Si tiene control de accesos.
    tieneAccesosModulos: boolean; // Si tiene accesos a módulos.
    tieneAccesosPestanas: boolean; // Si tiene accesos a pestañas.
}

/**
 * Función para crear las columnas de la tabla de roles.
 * Construye array de columnas dinámicamente basado en permisos y accesos.
 * 
 * @param {CreateRolColumnsProps} props - Props para configurar las columnas.
 * @returns {ColumnDef<RolInterface>[]} Array de definiciones de columnas.
 */
export function createRolColumns({
    onEdit,
    onDelete,
    permisos,
    tieneControlAccesos,
    tieneAccesosModulos,
    tieneAccesosPestanas,
}: CreateRolColumnsProps): ColumnDef<RolInterface>[] {

    // Aquí se inicializa el array de columnas con las básicas.
    const columns: ColumnDef<RolInterface>[] = [
        // Aquí se define la columna de ID, no ocultable.
        {
            accessorKey: "id",
            header: "ID",
            enableHiding: false,
        },
        // Aquí se define la columna de nombre.
        {
            accessorKey: "nombre",
            header: "Nombre",
        },
        // Aquí se define la columna de abreviatura con badge personalizado.
        {
            accessorKey: "abreviatura",
            header: "Abreviatura",
            cell: ({ row }) => (
                <Badge className="text-primary font-mono bg-primary/15 border-0">
                    {row.original.abreviatura}
                </Badge>
            ),
        },
    ];

    // Aquí se agrega la columna "Accesos" condicionalmente si tiene control de accesos.
    if (tieneControlAccesos) {
        columns.push({
            id: "accesos",
            header: "Accesos",
            enableHiding: false,
            cell: ({ row }) => {
                const rol = row.original;
                const tieneAlgunAcceso = tieneAccesosModulos || tieneAccesosPestanas;

                if (!tieneAlgunAcceso) return null;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <LockKeyhole className="h-4 w-4" />
                                Ver Accesos
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {tieneAccesosModulos && (
                                <Link href={route('control-acceso.modulos.rol', rol.id)}>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                    >
                                        <FolderTree className="h-4 w-4 mr-2" />
                                        Accesos a Módulos
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            {tieneAccesosPestanas && (
                                <Link href={route('control-acceso.pestanas.rol', rol.id)}>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                    >
                                        <AppWindow className="h-4 w-4 mr-2" />
                                        Accesos a Pestañas
                                    </DropdownMenuItem>
                                </Link>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        });
    }

    // Aquí se agrega la columna de acciones si tiene permisos de editar o eliminar.
    if (permisos.editar || permisos.eliminar) {
        columns.push({
            id: "acciones",
            header: "",
            enableHiding: false,
            cell: ({ row }) => {
                const tipo = row.original;
                return (
                    <div className="w-full flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-primary/10"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {permisos.editar && (
                                    <DropdownMenuItem
                                        onClick={() => onEdit(tipo.id)}
                                        className="cursor-pointer"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Editar
                                    </DropdownMenuItem>
                                )}
                                {permisos.eliminar && (
                                    <DropdownMenuItem
                                        onClick={() => onDelete(tipo)}
                                        className="cursor-pointer text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                                        Eliminar
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div >
                );
            },
        });
    }

    return columns;
}