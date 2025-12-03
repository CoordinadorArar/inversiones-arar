/**
 * Página TiposIdentificaciones
 * 
 * Vista con tabla y formulario lateral para gestión de tipos
 * - Tabla en el lado izquierdo
 * - Formulario en el lado derecho (se muestra según permisos)
 * - Lógica de crear/editar integrada
 * 
 * @author Yariangel Aray
 * @date 2025-12-03
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { DeleteDialog } from "@/Components/DeleteDialog";
import HelpManualButton from "@/Components/HelpManualButton";
import { TipoIdentificacionInterface } from "../types/tipoInterface";
import { createTipoColumns } from "../columns/tipoColumns";
import { useTipoGestion } from "../hooks/useTipoGestion";
import { TipoForm } from "../partials/TipoForm";

interface TiposIdentificacionesProps {
  tabs: Array<{
    id: number;
    nombre: string;
    ruta: string;
  }>;
  tipos: TipoIdentificacionInterface[];
  moduloNombre: string;
  permisos: string[];
}

export default function TiposIdentificaciones({
  tipos: tiposIniciales,
  tabs,
  moduloNombre,
  permisos,
}: TiposIdentificacionesProps) {

  const {
    tipos,
    mode,
    editingTipo,
    formErrors,
    processing,
    showDeleteDialog,
    tipoToDelete,
    shouldShowForm,
    puedeCrear,
    puedeEditar,
    puedeEliminar,
    handleEdit,
    handleCancel,
    handleSubmit,
    handleDeleteClick,
    handleCancelDelete,
    handleConfirmDelete,
  } = useTipoGestion({
    tiposIniciales,
    permisos,
  });

  const columns = createTipoColumns({
    onEdit: handleEdit,
    onDelete: handleDeleteClick,
    permisos: { editar: puedeEditar, eliminar: puedeEliminar },
  });

  // Preparar datos iniciales del formulario
  const formInitialData =
    mode === "edit" && editingTipo
      ? {
          nombre: editingTipo.nombre,
          abreviatura: editingTipo.abreviatura,
        }
      : undefined;

  return (
    <>
      <ModuleLayout
        moduloNombre={moduloNombre}
        tabs={tabs}
        activeTab={window.location.pathname}
      >
        <div className={`grid gap-4 ${shouldShowForm ? 'lg:grid-cols-[1fr_320px]' : ''}`}>
          {/* Tabla */}
          <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-5">
                Listado de Tipos de Identificaciones
                <HelpManualButton
                  url="/docs/Manual-Tablas-Maestras.pdf"
                  variant="muted"
                />
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 flex flex-col">
              <DataTable
                columns={columns}
                data={tipos}
                searchPlaceholder="Buscar tipos de identificaciones..."
              />
            </CardContent>
          </Card>

          {/* Formulario lateral - Solo se muestra si hay permisos */}
          {shouldShowForm && (
            <Card className="py-4 h-min shadow border-none sticky top-16">
              <CardHeader>
                <CardTitle className="text-lg">
                  {mode === "create" ? "Crear Tipo" : "Editar Tipo"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TipoForm
                  mode={mode}
                  initialData={formInitialData}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  externalErrors={formErrors}
                  processing={processing}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </ModuleLayout>

      {/* Dialog de confirmación de eliminación */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={`El tipo «${tipoToDelete?.nombre}» será desactivado y dejará de estar disponible en el sistema.`}
        processing={processing}
      />
    </>
  );
}

TiposIdentificaciones.layout = (page) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);