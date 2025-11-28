import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, Image as ImageIcon } from "lucide-react"
import { useState } from "react"
import { EmpresaInterface } from "./interfaces"
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
]
