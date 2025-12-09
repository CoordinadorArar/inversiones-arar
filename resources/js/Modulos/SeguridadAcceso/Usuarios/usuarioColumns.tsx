/**
 * Define columnas para la tabla de usuarios usando TanStack Table.
 * Incluye personalización de celdas con badges para roles y estados.
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UsuarioInterface } from "./types/usuarioInterface";
import { EmptyBadge } from "@/Components/EmptyBadge";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

export const UsuarioColumns: ColumnDef<UsuarioInterface>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: false,
  },
  {
    accessorKey: "numero_documento",
    header: "Documento",
    cell: ({ row }) => {
      const documento = row.original.numero_documento;
      return (
        <Badge variant="outline" className="font-mono text-xs">
          {documento}
        </Badge>
      );
    },
  },
  {
    accessorKey: "nombre_completo",
    header: "Nombre Completo",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email;
      return <span className="text-sm text-muted-foreground">{email}</span>;
    },
  },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ row }) => {
      const rol = row.original.rol;
      return rol ? (
        <Badge className="bg-primary/15 text-primary border-primary/30">
          {rol.nombre}
        </Badge>
      ) : (
        <EmptyBadge />
      );
    },
  },
  {
    accessorKey: "bloqueado_at",
    header: "Estado",
    cell: ({ row }) => {
      const bloqueado = row.original.bloqueado_at;
      return bloqueado ? (
        <Badge className="bg-red-500/10 text-red-700 border-red-500/20 font-medium gap-1.5">
          <LockKeyhole className="h-3.5 w-3.5" />
          Bloqueado
        </Badge>
      ) : (
        <Badge className="bg-green-500/10 text-green-700 border-green-500/20 font-medium gap-1.5">
          <LockKeyholeOpen className="h-3.5 w-3.5" />
          Activo
        </Badge>
      );
    },
  },
];

export const UsuarioInactiveColumns = {};