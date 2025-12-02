/**
 * Página EmpresaGestion
 * 
 * Gestión completa de empresas con:
 * - Select con búsqueda para seleccionar empresa a editar
 * - Botón para crear nueva empresa
 * - Formulario que se habilita/deshabilita según la acción
 * - Modo crear/editar con validaciones condicionales
 * 
 * Lógica separada en useEmpresaGestion hook
 * 
 * @author Yariangel Aray
 * @date 2025-12-01
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { SearchableSelect } from "@/Components/SearchableSelect";
import { EMPRESA_INITIAL_DATA } from "./empresaForm.types";
import { Button } from "@/Components/ui/button";
import { FilePlus, Pencil, Plus } from "lucide-react";
import { EmpresaForm } from "./EmpresaForm";
import { Label } from "@/components/ui/label";
import { EmpresaInterface } from "./empresaInterface";
import { useEmpresaGestion } from "./hooks/useEmpresaGestion";
import { useMemo } from "react";

interface EmpresaGestionProps {
  tabs: Array<{
    id: number;
    nombre: string;
    ruta: string;
  }>;
  empresas: EmpresaInterface[];
  moduloNombre: string;
  permisos: string[];
}

export default function EmpresaGestion({
  empresas: empresasBack,
  tabs,
  moduloNombre,
  permisos
}: EmpresaGestionProps) {

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
    <ModuleLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >
      <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Gestión de Empresas</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 flex flex-col space-y-6">
          {/* Sección de selección */}
          <div>
            <div className={`grid gap-4 items-end${puedeCrear ? ' md:grid-cols-[1fr_auto]' : ''}`}>
              {/* Select de empresas */}
              <div>
                <Label>Seleccionar empresa para editar</Label>

                {puedeEditar ? (
                  <SearchableSelect
                    options={empresaOptions}
                    value={selectedEmpresaId || undefined}
                    onValueChange={handleSelectEmpresa}
                    placeholder="Buscar empresa..."
                    searchPlaceholder="Escribir para buscar..."
                    emptyText="No se encontraron empresas"
                  />
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

            {/* Indicador de modo */}
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

          {/* Formulario */}
          <div className="flex-1 min-h-0 relative">
            <div
              className={`transition-opacity duration-300 ${isFormDisabled ? "opacity-50 pointer-events-none" : ""
                }`}
            >
              {(puedeCrear || puedeEditar) && (
                <EmpresaForm
                  mode={mode === "create" ? "create" : "edit"}
                  initialData={formInitialData}
                  disabled={isFormDisabled}
                  onSubmit={handleSubmit}
                  onDelete={mode === "edit" && puedeEliminar ? handleDelete : undefined}
                  onCancel={handleCancel}
                  externalErrors={formErrors}
                />
              )}
            </div>

            {/* Mensaje cuando está bloqueado */}
            {isFormDisabled && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                <div className="bg-background/90 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center max-w-sm">
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

EmpresaGestion.layout = (page) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);