import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { EmpresaColumns, EmpresaInactiveColumns } from "./empresaColumns";

interface EmpresasListadoProps {
  tabs: Array<{
    id: number;
    nombre: string;
    ruta: string;
  }>;
  empresas: any[];
  moduloNombre: string;
}

export default function EmpresasListado({ empresas, tabs, moduloNombre }: EmpresasListadoProps) {
  return (
    <ModuleLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >

      <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Listado de Empresas</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 min-h-0 flex flex-col">
          <DataTable 
            columns={EmpresaColumns} 
            data={empresas}
            searchPlaceholder="Buscar empresas..."
            initialColumnVisibility={EmpresaInactiveColumns}
          />
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}

EmpresasListado.layout = (page) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);