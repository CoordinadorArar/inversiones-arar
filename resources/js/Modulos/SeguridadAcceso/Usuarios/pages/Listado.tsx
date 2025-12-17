/**
 * Componente UsuariosListado.
 * 
 * Vista de listado de usuarios dentro del módulo "Seguridad y Acceso".
 * Usa TabsLayout para navegación por pestañas, DataTable para mostrar usuarios.
 * Incluye columnas personalizadas con badges para roles y estados.
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { UsuarioColumns, UsuarioInactiveColumns } from "../usuarioColumns";
import { TabInterface } from "@/Types/tabInterface";
import { UsuarioInterface } from "../types/usuarioInterface";
import HelpManualButton from "@/Components/HelpManualButton";
import { RolInterface } from "../../Roles/types/rolInterface";

/**
 * Interfaz para las props del componente UsuariosListado.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
export interface UsuarioListadoProps {
  tabs: TabInterface[]; // Pestañas accesibles del módulo.
  usuarios: UsuarioInterface[]; // Lista de usuarios a mostrar.
  roles: RolInterface[]; // Lista de roles disponibles.
  moduloNombre: string; // Nombre del módulo para el header.
}

/**
 * Componente principal para la página de Listado de Usuarios.
 * Renderiza tabla con usuarios usando DataTable y columnas personalizadas.
 * Envuelto en TabsLayout para navegación.
 * 
 * @param {UsuarioListadoProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function UsuariosListado({
  usuarios,
  tabs,
  moduloNombre,
}: UsuarioListadoProps) {
  return (
    // Aquí se usa TabsLayout para envolver la página con navegación de pestañas y header del módulo.
    <TabsLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >
      <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-5">
            Listado de Usuarios
            {/* Aquí se incluye HelpManualButton para acceder al manual. */}
            <HelpManualButton
              url="/docs/Manual-Usuarios-Listado.pdf"
              variant="muted"
            />
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          {/* Aquí se usa DataTable para renderizar la tabla con columnas personalizadas y búsqueda. */}
          <DataTable
            columns={UsuarioColumns}
            data={usuarios}
            searchPlaceholder="Buscar usuarios..."
            initialColumnVisibility={UsuarioInactiveColumns}
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
UsuariosListado.layout = (page: any) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);
