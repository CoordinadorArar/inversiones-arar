/**
 * Componente EmpresasListado.
 * 
 * Propósito: Vista de listado de empresas dentro del módulo "Administración Web".
 * Usa ModuleLayout para navegación por pestañas, DataTable para mostrar empresas con filtros/búsqueda.
 * Incluye columnas personalizadas con badges, modales de imagen y enlaces externos.
 * 
 * Props:
 * - tabs: Array de pestañas accesibles (id, nombre, ruta).
 * - empresas: Array de empresas (tipadas con EmpresaInterface).
 * - moduloNombre: Nombre del módulo para header.
 * 
 * Layout: Envuelto en DashboardLayout con header dinámico.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-27
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { EmpresaColumns, EmpresaInactiveColumns } from "../empresaColumns";
import { EmpresaInterface } from "../types/empresaInterface";
import { CircleHelp, CircleQuestionMark, HelpCircle } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import HelpManualButton from "@/Components/HelpManualButton";

// Interface para props del componente.
interface EmpresasListadoProps {
  tabs: Array<{
    id: number;
    nombre: string;
    ruta: string;
  }>;
  empresas: EmpresaInterface[];
  moduloNombre: string;
}

// Componente funcional EmpresasListado.
export default function EmpresasListado({ empresas, tabs, moduloNombre }: EmpresasListadoProps) {
  // Render: ModuleLayout con tabs, Card con DataTable.
  return (
    <ModuleLayout
      moduloNombre={moduloNombre}  // Nombre del módulo para navegación.
      tabs={tabs}  // Pestañas accesibles.
      activeTab={window.location.pathname}  // Tab activa basada en URL.
    >
      {/* Card contenedor con padding, flex col, shadow. */}
      <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
        {/* Header del card con título. */}
        <CardHeader>
          <CardTitle className="flex items-center gap-5">
            Listado de Empresas
            <HelpManualButton
              url="/docs/Manual-Empresas-Listado.pdf"
              variant="muted"
            />
          </CardTitle>
        </CardHeader>


        {/* Contenido: DataTable con columnas y datos. */}
        <CardContent className="flex-1">
          <DataTable
            columns={EmpresaColumns}  // Columnas definidas en empresaColumns.
            data={empresas}  // Datos de empresas.
            searchPlaceholder="Buscar empresas..."  // Placeholder para búsqueda.
            initialColumnVisibility={EmpresaInactiveColumns}  // Columnas ocultas por defecto.
          />
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}

// Layout para Inertia: Envuelve en DashboardLayout con header del módulo.
EmpresasListado.layout = (page) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);