/**
 * Archivo AuditoriaColumns.tsx.
 * 
 * Propósito: Definición de columnas para la tabla de auditorías en DataTable.
 * Usa TanStack Table para renderizar celdas personalizadas con badges, popovers y modales.
 * Muestra info de auditoría: tabla afectada, acción, usuario, fecha, cambios.
 * 
 * Características:
 * - Badges temáticos para acciones (verde INSERT, azul UPDATE, rojo DELETE).
 * - Popover para detalles de usuario sin clutter.
 * - Modal para ver cambios detallados.
 * - EmptyBadge para valores nulos.
 * - ActionButton para interacciones.
 * 
 * Columnas: ID, Tabla, Registro Afectado, Acción, Usuario, Fecha, Cambios.
 * 
 * @author Yariangel Aray - Columnas para tabla de auditorías.
 * @version 1.0
 * @date 2025-12-02
 */


import { ColumnDef } from "@tanstack/react-table";  
import { Badge } from "@/components/ui/badge";  
import { Button } from "@/components/ui/button"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";  
import { AuditoriaInterface } from "./auditoriaInterface";  
import { Eye, NotebookTabs } from "lucide-react"; 
import { EmptyBadge } from "@/Components/EmptyBadge"; 
import { useState } from "react"; 
import { ActionButton } from "@/Components/ActionButton";  
import DetailsModal from "./partials/DetailsModal";  

// Definición de columnas para DataTable de auditorías.
export const AuditoriaColumns: ColumnDef<AuditoriaInterface>[] = [
    // Columna ID: Básica, muestra ID único, no ocultable.
    {
        accessorKey: "id",
        header: "ID",
        enableHiding: false  // No se puede ocultar en toggle de columnas.
    },

    // Columna Tabla: Muestra nombre de tabla afectada en badge outline.
    {
        accessorKey: "tabla_afectada",
        header: "Tabla",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-mono text-xs bg-slate-50">
                {row.original.tabla_afectada}  {/* Nombre de tabla en fuente mono. */}
            </Badge>
        ),
    },

    // Columna Registro Afectado: Muestra ID del registro en badge outline.
    {
        accessorKey: "id_registro_afectado",
        header: "Registro Afectado",
        cell: ({ row }) =>
            <Badge variant="outline" className="font-mono text-sm">
                {row.original.id_registro_afectado}  {/* ID en fuente mono. */}
            </Badge>
    },

    // Columna Acción: Badge con colores temáticos según tipo (INSERT/UPDATE/DELETE).
    {
        accessorKey: "accion",
        header: "Acción",
        cell: ({ row }) => {
            const accion = row.original.accion;
            // Mapa de colores: Verde para INSERT, azul UPDATE, rojo DELETE.
            const colores = {
                INSERT: "bg-green-500/10 text-green-700 border-green-500/20",
                UPDATE: "bg-blue-500/10 text-blue-700 border-blue-500/20",
                DELETE: "bg-red-500/10 text-red-700 border-red-500/20",
            };
            return (
                <Badge variant="outline" className={`font-medium ${colores[accion]}`}>
                    {accion}  {/* Texto de acción con colores. */}
                </Badge>
            );
        },
    },

    // Columna Usuario: Popover con detalles del usuario (ID, nombre, email, rol, cargo).
    {
        accessorKey: "usuario",
        header: "Usuario",
        cell: ({ row }) => {
            const usuario = row.original.usuario;
            if (!usuario) return <EmptyBadge />;  // Si no hay usuario, muestra EmptyBadge.

            return (
                <Popover>
                    {/* Trigger: Botón con nombre abreviado del usuario. */}
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-auto p-2 hover:bg-primary/5 font-medium text-primary"
                        >
                            {usuario.name.split(" ")[0]} {usuario.lastname.split(" ")[0]}  {/* Primer nombre + primer apellido. */}
                        </Button>
                    </PopoverTrigger>

                    {/* Content: Detalles del usuario en popover flotante. */}
                    <PopoverContent align="start" className="w-auto">
                        {/* Header: ID en badge, nombre/email. */}
                        <div className="border-b pb-4">
                            <Badge className="font-mono leading-none pt-1">
                                ID: {usuario.id}  {/* ID del usuario. */}
                            </Badge>
                            <div className="mt-2">
                                <h4 className="font-semibold text-base truncate">
                                    {usuario.name} {usuario.lastname}  {/* Nombre completo. */}
                                </h4>
                                <p className="text-sm text-muted-foreground truncate mt-0.5">
                                    {usuario.email}  {/* Email. */}
                                </p>
                            </div>
                        </div>

                        {/* Contenido: Rol y cargo en badges. */}
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground min-w-[60px]">Rol:</span>
                                <Badge
                                    variant="outline"
                                    className="bg-blue-500/10 text-blue-700 border-blue-500/20"
                                >
                                    {usuario.rol}  {/* Rol del usuario. */}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground min-w-[60px]">Cargo:</span>
                                <Badge
                                    variant="outline"
                                    className="bg-primary/10 text-primary border-primary/20 capitalize"
                                >
                                    {usuario.cargo.toLowerCase()}  {/* Cargo capitalizado. */}
                                </Badge>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            );
        },
    },

    // Columna Fecha: Básica, muestra fecha de auditoría.
    {
        accessorKey: "fecha",
        header: "Fecha",
    },

    // Columna Cambios: Botón que abre modal con detalles de cambios.
    {
        id: "cambios",  // ID custom (no accessorKey, ya que es derivado).
        header: "Cambios",
        cell: ({ row }) => {
            const auditoria = row.original;
            const [open, setOpen] = useState(false);  // Estado para abrir/cerrar modal.

            // Si no hay cambios, muestra EmptyBadge.
            if (!auditoria.cambios || auditoria.cambios.length === 0) {
                return <EmptyBadge />;
            }

            return (
                <>
                    {/* Botón ActionButton para abrir modal. */}
                    <ActionButton
                        onClick={() => setOpen(true)}
                        icon={<Eye className="h-3.5 w-3.5" />}
                        label="Ver Cambios"
                        variant="primary"
                    />
                    {/* Modal con detalles de cambios. */}
                    <DetailsModal
                        open={open}
                        onClose={() => setOpen(false)}
                        auditoria={auditoria}  // Pasa datos de auditoría al modal.
                    />
                </>
            );
        },
    },
];
