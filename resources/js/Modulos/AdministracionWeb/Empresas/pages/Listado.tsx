/**
 * Componente EmpresasListado.
 * 
 * Propósito: Vista de listado de empresas dentro del módulo "Administración Web".
 * Usa TabsLayout para navegación por pestañas, DataTable para mostrar empresas con filtros/búsqueda.
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
import { TabsLayout } from "@/Layouts/TabsLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { EmpresaColumns, EmpresaInactiveColumns } from "../empresaColumns";
import { EmpresaInterface } from "../types/empresaInterface";
import HelpManualButton from "@/Components/HelpManualButton";
import { TabInterface } from "@/Types/tabInterface";

// Interface para props del componente.
interface EmpresasListadoProps {
  tabs: TabInterface[];
  empresas: EmpresaInterface[];
  moduloNombre: string;
}

// Componente funcional EmpresasListado.
export default function EmpresasListado({ empresas, tabs, moduloNombre }: EmpresasListadoProps) {
  // Render: TabsLayout con tabs, Card con DataTable.
  return (
    <TabsLayout
      moduloNombre={moduloNombre}  // Nombre del módulo para navegación.
      tabs={tabs}  // Pestañas accesibles.
      activeTab={window.location.pathname}  // Tab activa basada en URL.
    >
      {/* Card contenedor con padding, flex col, shadow. */}
      <Card className="py-4 sm:py-6 h-full flex flex-col shadow border-none gap-3 sm:gap-4">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-5">
            <span>Listado de Empresas</span>
            <HelpManualButton
              url="/docs/Manual-Empresas-Listado.pdf"
              variant="muted"
            />
          </CardTitle>
        </CardHeader>


        {/* Contenido: DataTable con columnas y datos. */}
        <CardContent className="flex-1 px-4 sm:px-6">
          <DataTable
            columns={EmpresaColumns}  // Columnas definidas en empresaColumns.
            data={empresas}  // Datos de empresas.
            searchPlaceholder="Buscar empresas..."  // Placeholder para búsqueda.
            initialColumnVisibility={EmpresaInactiveColumns}  // Columnas ocultas por defecto.
          />
        </CardContent>
      </Card>
    </TabsLayout>
  );
}

// Layout para Inertia: Envuelve en DashboardLayout con header del módulo.
EmpresasListado.layout = (page) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);