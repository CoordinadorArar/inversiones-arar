/**
 * Define columnas para la tabla de empresas usando TanStack Table.
 * Incluye personalización de celdas con badges, botones, modales y enlaces.
 * Columnas inactivas por defecto para simplificar vista inicial.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-27
 */

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Globe, Image as ImageIcon } from "lucide-react"
import { useState } from "react"
import { EmpresaInterface } from "./types/empresaInterface"
import ImageModal from "@/Components/ImageModal"
import { EmptyBadge } from "@/Components/EmptyBadge"
import { ActionButton } from "@/Components/ActionButton"

/**
 * EmpresaColumns: Definición de columnas para la tabla.
 * 
 * Cada columna tiene accessorKey (propiedad de EmpresaInterface), header, y cell personalizada.
 * Incluye badges para estados, botones para acciones (visitar web, ver logo), y EmptyBadge para nulls.
 */
export const EmpresaColumns: ColumnDef<EmpresaInterface>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: false  // No se puede ocultar.
  },
  {
    accessorKey: "id_siesa",
    header: "ID Siesa",
    cell: ({ row }) => {
      const id_siesa = row.original.id_siesa;
      // Muestra badge si existe, sino EmptyBadge.
      return id_siesa ? (
        <Badge variant="outline" className="font-mono text-xs">
          {id_siesa}
        </Badge>
      ) : (
        <EmptyBadge />
      );
    },
  },
  {
    accessorKey: "razon_social",
    header: "Razón Social",  // Texto plano.
  },
  {
    accessorKey: "siglas",
    header: "Siglas",
    cell: ({ row }) => {
      const siglas = row.original.siglas;
      // Badge primary si existe, sino EmptyBadge.
      return siglas ? (
        <Badge className="text-primary font-mono bg-primary/15 border-0">
          {siglas}
        </Badge>
      ) : (
        <EmptyBadge />
      );
    },
  },
  {
    accessorKey: "tipo_empresa",
    header: "Tipo de Empresa",
    cell: ({ row }) => {
      const tipo = row.original.tipo_empresa;
      // Texto si existe, sino EmptyBadge.
      return tipo ? (
        <span className="text-sm">{tipo}</span>
      ) : (
        <EmptyBadge />
      );
    },
  },
  {
    accessorKey: "dominio",
    header: "Dominio",
    cell: ({ row }) => {
      const dominio = row.original.dominio;
      // Badge primary si existe, sino EmptyBadge.
      return dominio ? (
        <Badge variant='outline' className="bg-slate-50 font-mono">
          {dominio}
        </Badge>
      ) : (
        <EmptyBadge />
      );
    },
  },
  {
    accessorKey: "sitio_web",
    header: "Web",
    cell: ({ row }) => {
      const sitio = row.original.sitio_web;
      // Botón ActionButton para abrir la página de la empresa, sino EmptyBadge.
      if (!sitio) {
        return <EmptyBadge />;
      }
      return (
        <a
          href={sitio}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ActionButton
            icon={<Globe className="h-3.5 w-3.5" />}
            label="Visitar"
            variant="primary"
          />
        </a>
      );
    },
  },
  {
    accessorKey: "logo_url",
    header: "Logo",
    cell: ({ row }) => {
      const logoUrl = row.original.logo_url;
      const [open, setOpen] = useState(false);  // Estado para modal de imagen.
      // Botón para abrir ImageModal si existe logo, sino EmptyBadge.
      if (!logoUrl) {
        return <EmptyBadge />;
      }
      return (
        <>
          <ActionButton
            onClick={() => setOpen(true)}
            icon={<ImageIcon className="h-3.5 w-3.5" />}
            label="Ver"
            variant="primary"
          />
          <ImageModal
            open={open}
            onClose={() => setOpen(false)}
            src={"/storage/" + logoUrl}
          />
        </>
      );
    },
  },
  {
    accessorKey: 'mostrar_en_header',
    header: 'En header',
    cell: ({ row }) => {
      const value = row.original.mostrar_en_header;
      // Badge verde si true, gris si false.
      return (
        <Badge
          className={`
          ${value
              ? "bg-green-500/10 text-green-700 border-green-500/20"
              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
            } 
          font-medium
        `}
        >
          {value ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'mostrar_en_empresas',
    header: 'En página Empresas',
    cell: ({ row }) => {
      const value = row.original.mostrar_en_empresas;
      return (
        <Badge
          className={`
          ${value
              ? "bg-green-500/10 text-green-700 border-green-500/20"
              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
            } 
          font-medium
        `}
        >
          {value ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'mostrar_en_portafolio',
    header: 'En página Portafolio',
    cell: ({ row }) => {
      const value = row.original.mostrar_en_header;
      return (
        <Badge
          className={`
          ${value
              ? "bg-green-500/10 text-green-700 border-green-500/20"
              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
            } 
          font-medium
        `}
        >
          {value ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'permitir_pqrsd',
    header: 'Permitir PQRS',
    cell: ({ row }) => {
      const value = row.original.permitir_pqrsd;
      return (
        <Badge
          className={`
          ${value
              ? "bg-green-500/10 text-green-700 border-green-500/20"
              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
            } 
          font-medium
        `}
        >
          {value ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  }
]

/**
 * EmpresaInactiveColumns: Columnas ocultas por defecto en la tabla.
 * 
 * Simplifica la vista inicial ocultando flags booleanos (mostrar_*, permitir_*).
 * Usuario puede mostrarlas via toggle en DataTable.
 */
export const EmpresaInactiveColumns = {
  mostrar_en_header: false,      // Oculta por defecto.
  mostrar_en_empresas: false,
  mostrar_en_portafolio: false,
  permitir_pqrsd: false,
};