/**
 * Componente PestanasListado.
 * 
 * Muestra listado de pestañas en tabla con búsqueda y filtros: columnas con íconos,
 * módulos asociados, rutas y permisos.
 * Usa DataTable para renderizar datos con columnas personalizadas.
 * Se integra con React via Inertia para mostrar pestañas del sistema.
 * 
 * @author Yariangel Aray
 * @date 2025-12-12
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { TabInterface } from "@/Types/tabInterface";
import { PestanaColumns, PestanaInactiveColumns } from "../pestanaColumns";
import { PestanaInterface } from "../types/pestanaInterface";

/**
 * Interfaz para las props del componente PestanasListado.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
export interface PestanaListadoProps {
  tabs: TabInterface[]; // Pestañas accesibles del módulo.
  pestanas: PestanaInterface[]; // Lista de pestañas a mostrar.
  moduloNombre: string; // Nombre del módulo para el header.
}

/**
 * Componente principal para la página de Listado de Pestañas.
 * Renderiza tabla con pestañas usando DataTable y columnas personalizadas.
 * Envuelto en TabsLayout para navegación.
 * 
 * @param {PestanaListadoProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function PestanasListado({
  pestanas,
  tabs,
  moduloNombre,
}: PestanaListadoProps) {
  return (
    // Aquí se usa TabsLayout para envolver la página con navegación de pestañas y header del módulo.
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
          {/* Aquí se usa DataTable para renderizar la tabla con columnas personalizadas y búsqueda. */}
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

/**
 * Layout del componente: Envuelve la página en DashboardLayout con header dinámico.
 * Se usa para renderizar el componente dentro del layout principal.
 * 
 * @param {any} page - Página a renderizar.
 * @returns {JSX.Element} Elemento JSX con layout aplicado.
 */
PestanasListado.layout = (page: any) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);
