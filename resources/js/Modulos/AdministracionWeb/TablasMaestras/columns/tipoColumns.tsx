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
import { TipoIdentificacionInterface } from "../types/tipoInterface";

interface TipoColumnsContext {
  onEdit: (id: number) => void;
  onDelete: (tipo: TipoIdentificacionInterface) => void;
  permisos: { editar: boolean; eliminar: boolean };
}

export const createTipoColumns = (
  context: TipoColumnsContext
): ColumnDef<TipoIdentificacionInterface>[] => {
  const baseColumns: ColumnDef<TipoIdentificacionInterface>[] = [
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
      cell: ({ row }) => (
        <Badge className="text-primary font-mono bg-primary/15 border-0">
          {row.original.abreviatura}
        </Badge>
      ),
    },
  ];

  // Solo agregar columna de acciones si tiene al menos un permiso
  if (context.permisos.editar || context.permisos.eliminar) {
    baseColumns.push({
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
                {context.permisos.editar && (
                  <DropdownMenuItem
                    onClick={() => context.onEdit(tipo.id)}
                    className="cursor-pointer"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </DropdownMenuItem>
                )}
                {context.permisos.eliminar && (
                  <DropdownMenuItem
                    onClick={() => context.onDelete(tipo)}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                    Eliminar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    });
  }

  return baseColumns;
};