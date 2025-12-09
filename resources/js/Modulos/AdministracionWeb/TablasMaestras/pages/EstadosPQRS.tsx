/**
 * Página EstadosPQRS.
 * 
 * Vista con tabla y formulario lateral para gestión de estados de pqrs.
 * - Tabla en el lado izquierdo para listar estados.
 * - Formulario en el lado derecho (se muestra según permisos) para crear/editar.
 * - Lógica integrada para operaciones CRUD via hooks.
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
import { TipoInterface } from "../types/tipoInterface";
import { createTipoColumns } from "../columns/tipoColumns";
import { TipoForm } from "../partials/TipoForm";
import { useTipoPQRSGestion } from "../hooks/useTipoPQRSGestion";
import { useMemo } from "react";
import { Info, InfoIcon } from "lucide-react";
import { TabInterface } from "@/Types/tabInterface";
import { useEstadoPQRSGestion } from "../hooks/useEstadoPQRSGestion";

/**
 * Interfaz para las props del componente EstadosPQRS.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
interface EstadosPQRSProps {
  tabs: TabInterface[];
  estados: TipoInterface[];
  moduloNombre: string;
  permisos: string[];
}

/**
 * Componente principal para la página de Estados de PQRS.
 * Renderiza la tabla de estados y el formulario lateral condicionalmente, manejando estados via hook personalizado.
 */
export default function EstadosPQRS({ estados: estadosIniciales, tabs, moduloNombre, permisos }: EstadosPQRSProps) {

  // Aquí se usa el hook useTipoGestion para manejar estados y lógica de CRUD (crear, editar, eliminar).
  // Devuelve estados como estados, mode, permisos, y funciones para manejar eventos.
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
  } = useEstadoPQRSGestion({
    estadosIniciales,
    permisos,
  });

  // Aquí se crea la configuración de columnas para la tabla, pasando funciones de edición/eliminación y permisos.
  const columns = createTipoColumns({
    onEdit: handleEdit,
    onDelete: handleDeleteClick,
    permisos: { editar: puedeEditar, eliminar: puedeEliminar },
  });

  // Preparar datos iniciales del formulario: si está en modo edición, usa datos del estado seleccionado.
  // Usa useMemo para evitar recalculaciones innecesarias y que initialData "cambie" por errores.
  const formInitialData = useMemo(() => {
    if (mode === "edit" && editingTipo) {
      return {
        nombre: editingTipo.nombre,
        abreviatura: editingTipo.abreviatura,
      };
    }
    // Para modo crear, usa valores vacíos para que no marque cambios inicialmente
    return { nombre: "", abreviatura: "" };
  }, [mode, editingTipo]);


  return (
    <>
      {/* Aquí se usa ModuleLayout para envolver la página con navegación de pestañas y header del módulo. */}
      <ModuleLayout
        moduloNombre={moduloNombre}
        tabs={tabs}
        activeTab={window.location.pathname}
      >
        <div className={`h-full grid gap-4 ${shouldShowForm ? 'lg:grid-cols-[1fr_320px]' : ''}`}>
          {/* Sección de la tabla: Usa Card para contener el listado de estados. */}
          <Card className="py-6 flex flex-col shadow border-none gap-4 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-5">
                Listado de Estados de PQRS
                {/* Aquí se incluye HelpManualButton para acceder al manual de usuario. */}
                <HelpManualButton
                  url="/docs/Manual-Tablas-Maestras.pdf"
                  variant="muted"
                />
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 flex flex-col overflow-auto">
              {/* Aquí se usa DataTable para renderizar la tabla con columnas dinámicas y búsqueda. */}
              <DataTable
                columns={columns}
                data={tipos}
                searchPlaceholder="Buscar estados de PQRS..."
              />
            </CardContent>
          </Card>
          {/* Sección del formulario lateral: Solo se muestra si el usuario tiene permisos para crear/editar. */}
          {shouldShowForm && (
            <div>
              <Card id="tipo-form-container" className="py-4 h-min shadow border-none sticky top-16">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {mode === "create" ? "Crear Estado" : "Editar Estado"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Aquí se usa TipoForm para manejar el formulario de creación/edición, con validaciones y envío. */}
                  <TipoForm
                    mode={mode}
                    initialData={formInitialData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    externalErrors={formErrors}
                    processing={processing}
                    placeholders={{ nombre: "Ej: Cancelado", abreviatura: "Ej: C" }}
                  />
                </CardContent>
              </Card>
              <p className="mt-6 text-xs text-muted-foreground text-center">
                <Info className="h-4 w-4 mr-2 float-left" />
                La información gestionada en este módulo es <b>sensible</b> y puede afectar el <b>funcionamiento</b> del sistema.
                Antes de modificar o eliminar un registro, verifica que no esté asociado a <b>otros procesos, validaciones</b> o
                <b> módulos operativos</b>. Realiza los cambios con precaución ya que pueden <b>impactar</b> en flujos, reglas de negocios o datos ya registrados.
              </p>
            </div>
          )}
        </div>
      </ModuleLayout>
      {/* Sección del dialog de eliminación: Usa DeleteDialog para confirmar la eliminación de un estado. */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={`El estado «${tipoToDelete?.nombre}» será desactivado y dejará de estar disponible en el sistema.`}
        processing={processing}
      />
    </>
  );
}

/**
 * Layout del componente: Envuelve la página en DashboardLayout con header dinámico.
 * Se usa para renderizar el componente dentro del layout principal.
 */
EstadosPQRS.layout = (page) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);