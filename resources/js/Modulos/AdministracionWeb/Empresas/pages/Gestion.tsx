/**
 * Página EmpresaGestion.
 * 
 * Gestión completa de empresas: select con búsqueda para seleccionar empresa a editar,
 * botón para crear nueva, formulario que se habilita/deshabilita según acción y permisos.
 * Modo crear/editar con validaciones condicionales, usando hook personalizado para lógica.
 * Se integra con React via Inertia para mostrar y editar empresas.
 * 
 * @author Yariangel Aray
 * @date 2025-12-01
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { SearchableSelect } from "@/Components/SearchableSelect";
import { EMPRESA_INITIAL_DATA } from "../types/empresaForm.types";
import { Button } from "@/Components/ui/button";
import { FilePlus, Pencil, Plus } from "lucide-react";
import { EmpresaForm } from "../partials/EmpresaForm";
import { Label } from "@/components/ui/label";
import { EmpresaInterface } from "../types/empresaInterface";
import { useEmpresaGestion } from "../hooks/useEmpresaGestion";
import { useMemo } from "react";
import HelpManualButton from "@/Components/HelpManualButton";
import { TabInterface } from "@/Types/tabInterface";

/**
 * Interfaz para las props del componente EmpresaGestion.
 * Define la estructura de datos pasados desde el backend via Inertia.
 * 
 * @typedef {Object} EmpresaGestionProps
 * @property {TabInterface[]} tabs - Pestañas accesibles del módulo.
 * @property {EmpresaInterface[]} empresas - Lista de empresas disponibles.
 * @property {string} moduloNombre - Nombre del módulo para el header.
 * @property {string[]} permisos - Permisos del usuario para la pestaña.
 */
interface EmpresaGestionProps {
  tabs: TabInterface[];
  empresas: EmpresaInterface[];
  moduloNombre: string;
  permisos: string[];
}
/**
 * Componente principal para la página de Gestión de Empresas.
 * Renderiza select para elegir empresa, botón para crear nueva y formulario condicional,
 * manejando estado via hook personalizado y permisos.
 * 
 * @param {EmpresaGestionProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function EmpresaGestion({
  empresas: empresasBack,
  tabs,
  moduloNombre,
  permisos
}: EmpresaGestionProps) {

  // Aquí se usa el hook useEmpresaGestion para manejar estado, permisos y operaciones CRUD.
  const {
    selectedEmpresaId,
    mode,
    formErrors,
    selectedEmpresa,
    isFormDisabled,
    empresaOptions,
    puedeCrear,
    puedeEditar,
    puedeEliminar,
    handleSelectEmpresa,
    handleCreateNew,
    handleCancel,
    handleSubmit,
    handleDelete,
  } = useEmpresaGestion({
    empresasIniciales: empresasBack,
    permisos
  });

  // Aquí se usa useMemo para calcular datos iniciales del formulario basados en modo y empresa seleccionada.
  const formInitialData = useMemo(() => {
    if (mode === "edit" && selectedEmpresa) {
      return {
        id_siesa: selectedEmpresa.id_siesa || "",
        razon_social: selectedEmpresa.razon_social,
        siglas: selectedEmpresa.siglas || "",
        tipo_empresa: selectedEmpresa.tipo_empresa || "",
        descripcion: selectedEmpresa.descripcion || "",
        sitio_web: selectedEmpresa.sitio_web || "",
        dominio: selectedEmpresa.dominio || "",
        logo: null,
        logo_preview: selectedEmpresa.logo_url || null,
        mostrar_en_header: selectedEmpresa.mostrar_en_header,
        mostrar_en_empresas: selectedEmpresa.mostrar_en_empresas,
        mostrar_en_portafolio: selectedEmpresa.mostrar_en_portafolio,
        permitir_pqrsd: selectedEmpresa.permitir_pqrsd,
      };
    }

    return EMPRESA_INITIAL_DATA;
  }, [mode, selectedEmpresa]);

  return (
    // Aquí se usa ModuleLayout para envolver la página con navegación de pestañas y header del módulo.
    <ModuleLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >
      <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-5">
            Gestión de Empresas
            {/* Aquí se incluye HelpManualButton para acceder al manual de gestión de empresas. */}
            <HelpManualButton
              url="/docs/Manual-Empresas-Gestion.pdf"
              variant="muted"
            />
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-6">
          {/* Sección de selección: Contiene select para elegir empresa y botón para crear nueva. */}
          <div>
            <div className={`grid gap-4 items-end${puedeCrear ? ' md:grid-cols-[1fr_auto]' : ''}`}>
              {/* Select de empresas */}
              <div>
                <Label>Seleccionar empresa para editar</Label>

                {puedeEditar ? (
                  <>
                    {/* Aquí se usa SearchableSelect para buscar y seleccionar empresa a editar. */}
                    <SearchableSelect
                      options={empresaOptions}
                      value={selectedEmpresaId || ""}
                      onValueChange={handleSelectEmpresa}
                      placeholder="Buscar empresa..."
                      searchPlaceholder="Escribir para buscar..."
                      emptyText="No se encontraron empresas"
                    />
                  </>
                ) : (
                  <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10 w-full">
                    <p className="text-sm text-destructive">
                      No tienes permiso para editar empresas
                    </p>
                  </div>
                )}
              </div>

              {/* Botón crear */}
              {puedeCrear && (
                <Button
                  onClick={handleCreateNew}
                  disabled={mode === "create"}
                  className="w-full md:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Empresa
                </Button>
              )}
            </div>

            {/* Indicador de modo: Muestra si está en crear o editando una empresa específica. */}
            {mode !== "idle" && (
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  {mode === "create" ? (
                    <span className="flex gap-2 items-center">
                      <FilePlus className="h-4 w-4" />
                      Modo: Crear nueva empresa
                    </span>
                  ) : (
                    <span className="flex gap-2 items-center">
                      <Pencil className="h-4 w-4" />
                      Modo: Editando {selectedEmpresa?.razon_social}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Formulario: Se habilita/deshabilita según permisos y modo. */}
          <div className="flex-1 relative">
            <div
              className={`transition-opacity duration-300 ${isFormDisabled ? "opacity-50 pointer-events-none" : ""
                }`}
            >
              {(puedeCrear || puedeEditar) && (
                <>
                  {/* Aquí se usa EmpresaForm para renderizar el formulario de empresa con validaciones. */}
                  < EmpresaForm
                    mode={mode === "create" ? "create" : "edit"}
                    initialData={formInitialData}
                    disabled={isFormDisabled}
                    onSubmit={handleSubmit}
                    onDelete={mode === "edit" && puedeEliminar ? handleDelete : undefined}
                    onCancel={handleCancel}
                    externalErrors={formErrors}
                  />
                </>
              )}
            </div>

            {/* Mensaje cuando está bloqueado: Muestra instrucciones o mensaje de permisos. */}
            {isFormDisabled && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                <div className="bg-background/90 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center sm:max-w-sm">
                  {!puedeCrear && !puedeEditar ? (
                    <div className="space-y-2">
                      <p className="text-destructive font-medium">Sin permisos</p>
                      <p className="text-sm text-muted-foreground">
                        No tienes permisos para crear ni editar empresas
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {puedeEditar ? "Selecciona una empresa para editar" : ""}
                      {puedeEditar && puedeCrear ? " o c" : "C"}
                      {puedeCrear ? "rea una nueva para comenzar" : ""}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
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
EmpresaGestion.layout = (page) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);
