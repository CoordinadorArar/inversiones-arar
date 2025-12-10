/**
 * Página ModulosListado.
 * 
 * Muestra listado de módulos en tabla con búsqueda y filtros: columnas con íconos,
 * tipos (padre/hijo/independiente), rutas y padres.
 * Usa DataTable para renderizar datos con columnas personalizadas.
 * Se integra con React via Inertia para mostrar módulos del sistema.
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { ModuloColumns, ModuloInactiveColumns } from "../moduloColumns";
import { TabInterface } from "@/Types/tabInterface";
import { ModuloInterface } from "../types/moduloInterface";

/**
 * Interfaz para las props del componente ModulosListado.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
interface ModuloListadoProps {
  tabs: TabInterface[]; // Pestañas accesibles del módulo.
  modulos: ModuloInterface[]; // Lista de módulos a mostrar.
  moduloNombre: string; // Nombre del módulo para el header.
}

/**
 * Componente principal para la página de Listado de Módulos.
 * Renderiza tabla con módulos usando DataTable y columnas personalizadas.
 * Envuelto en ModuleLayout para navegación.
 * 
 * @param {ModuloListadoProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function ModulosListado({
  modulos,
  tabs,
  moduloNombre,
}: ModuloListadoProps) {
  return (
    // Aquí se usa ModuleLayout para envolver la página con navegación de pestañas y header del módulo.
    <ModuleLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >
      <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
        <CardHeader>
          <CardTitle>Listado de Módulos</CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          {/* Aquí se usa DataTable para renderizar la tabla con columnas personalizadas y búsqueda. */}
          <DataTable
            columns={ModuloColumns}
            data={modulos}
            searchPlaceholder="Buscar módulos..."
            initialColumnVisibility={ModuloInactiveColumns}
          />
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}

/**
 * Layout del componente: Envuelve la página en DashboardLayout con header dinámico.
 * Se usa para renderizar el componente dentro del layout principal.
 * 
 * @param {any} page - Página a renderizar.
 * @returns {JSX.Element} Elemento JSX con layout aplicado.
 */
ModulosListado.layout = (page: any) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);