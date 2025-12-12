import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { TabInterface } from "@/Types/tabInterface";
import { PestanaColumns, PestanaInactiveColumns } from "../pestanaColumns";
import { PestanaInterface } from "../types/pestanaInterface";

export interface PestanaListadoProps {
  tabs: TabInterface[];
  pestanas: PestanaInterface[];
  moduloNombre: string;
}

export default function PestanasListado({
  pestanas,
  tabs,
  moduloNombre,
}: PestanaListadoProps) {
  return (
    <TabsLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >
      <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
        <CardHeader>
          <CardTitle>Listado de Pestañas</CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          <DataTable
            columns={PestanaColumns}
            data={pestanas}
            searchPlaceholder="Buscar pestañas..."
            initialColumnVisibility={PestanaInactiveColumns}
          />
        </CardContent>
      </Card>
    </TabsLayout>
  );
}

PestanasListado.layout = (page: any) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);