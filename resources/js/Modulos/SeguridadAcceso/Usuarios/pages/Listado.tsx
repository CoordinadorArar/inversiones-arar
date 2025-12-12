/**
 * Página UsuariosListado
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
import { RolInterface, UsuarioInterface } from "../types/usuarioInterface";
import HelpManualButton from "@/Components/HelpManualButton";

export interface UsuarioListadoProps {
  tabs: TabInterface[];
  usuarios: UsuarioInterface[];
  roles: RolInterface[];
  moduloNombre: string;
}

export default function UsuariosListado({
  usuarios,
  tabs,
  moduloNombre,
}: UsuarioListadoProps) {
  return (
    <TabsLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >
      <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-5">
            Listado de Usuarios
            {/* Aquí se incluye HelpManualButton para acceder al manual de gestión de empresas. */}
            <HelpManualButton
              url="/docs/Manual-Usuarios-Listado.pdf"
              variant="muted"
            />
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
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

UsuariosListado.layout = (page: any) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);