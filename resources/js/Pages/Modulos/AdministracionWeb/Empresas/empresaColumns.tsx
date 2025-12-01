import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, Image as ImageIcon } from "lucide-react"
import { useState } from "react"
import { EmpresaInterface } from "./empresaInterface"
import ImageModal from "@/Components/ImageModal"
import { EmptyBadge } from "@/Components/EmptyBadge"
import { ActionButton } from "@/Components/ActionButton"

/**
 * Columnas tipadas para tabla de Empresas
 * Explicación:
 *  - accessorKey: propiedad de la interfaz que se muestra
 *  - header: nombre visible en la columna
 *  - cell: personalización de cada celda
 */

export const EmpresaColumns: ColumnDef<EmpresaInterface>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: false
  },
  {
    accessorKey: "id_siesa",
    header: "ID Siesa",
    cell: ({ row }) => {
      const id_siesa = row.original.id_siesa;

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
    header: "Razón Social",
  },
  {
    accessorKey: "siglas",
    header: "Siglas",
    cell: ({ row }) => {
      const siglas = row.original.siglas;
      return siglas ? (
        <Badge variant="default" className="text-primary bg-primary/15 border-0">
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
    enableSorting: true,
    cell: ({ row }) => {
      const tipo = row.original.tipo_empresa;
      return tipo ? (
        <span className="text-sm">{tipo}</span>
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
      const [open, setOpen] = useState(false);

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
            src={logoUrl}
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

export const EmpresaInactiveColumns = {
  mostrar_en_header: false,
  mostrar_en_empresas: false,
  mostrar_en_portafolio: false,
  permitir_pqrsd: false,
}