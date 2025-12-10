/**
 * Archivo de configuración de columnas para la tabla de tipos.
 * Define columnas base (ID, Nombre, Abreviatura) y una columna de acciones condicional
 * basada en permisos (editar/eliminar). Usa TanStack Table para renderizar la tabla.
 * Se usa en componentes de tabla para mostrar datos y acciones interactivas.
 * 
 * @author Yariangel Aray
 * @date 2025-12-03
 */
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { TipoInterface } from "../types/tipoInterface";

/**
 * Interfaz para el contexto de las columnas de tipos.
 * Define las funciones y permisos necesarios para las acciones en la tabla.
 */
interface TipoColumnsContext {
  onEdit: (id: number) => void; // Función a llamar para editar un tipo.
  onDelete: (tipo: TipoInterface) => void; // Función a llamar para eliminar un tipo.
  permisos: { editar: boolean; eliminar: boolean }; // Permisos del usuario para editar/eliminar.
}
/**
 * Función para crear las columnas de la tabla de tipos.
 * Incluye columnas base y una de acciones (si hay permisos), usando componentes UI para renderizar.
 * 
 * @param {TipoColumnsContext} context - Contexto con handlers y permisos.
 * @returns {ColumnDef<TipoInterface>[]} Array de definiciones de columnas para TanStack Table.
 */
export const createTipoColumns = (
  context: TipoColumnsContext
): ColumnDef<TipoInterface>[] => {
  // Columnas base: ID, Nombre y Abreviatura (siempre visibles).
  const baseColumns: ColumnDef<TipoInterface>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableHiding: false,
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "abreviatura",
      header: "Abreviatura",
      // Aquí se usa Badge para resaltar la abreviatura con estilo personalizado.
      cell: ({ row }) => (
        <Badge className="text-primary font-mono bg-primary/15 border-0">
          {row.original.abreviatura}
        </Badge>
      ),
    },
  ];

  // Solo agregar columna de acciones si tiene al menos un permiso (editar o eliminar).
  if (context.permisos.editar || context.permisos.eliminar) {
    baseColumns.push({
      id: "acciones",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const tipo = row.original;
        return (
          <div className="w-full flex justify-end">
            {/* Aquí se usa DropdownMenu para mostrar opciones de acciones (editar/eliminar). */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Aquí se usa Button como trigger del menú, con ícono de tres puntos. */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {context.permisos.editar && (
                  <>
                    {/* Aquí se usa DropdownMenuItem para la opción de editar, con ícono y handler. */}
                    <DropdownMenuItem
                      onClick={() => context.onEdit(tipo.id)}
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </DropdownMenuItem>
                  </>
                )}
                {context.permisos.eliminar && (
                  <>
                    {/* Aquí se usa DropdownMenuItem para la opción de eliminar, con estilo destructivo y handler. */}
                    <DropdownMenuItem
                      onClick={() => context.onDelete(tipo)}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                      Eliminar
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div >
        );
      },
    });
  }

  return baseColumns;
};