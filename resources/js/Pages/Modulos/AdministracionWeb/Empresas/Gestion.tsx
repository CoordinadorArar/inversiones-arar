/**
 * Página EmpresaGestion
 * 
 * Gestión completa de empresas con:
 * - Select con búsqueda para seleccionar empresa a editar
 * - Botón para crear nueva empresa
 * - Formulario que se habilita/deshabilita según la acción
 * - Modo crear/editar con validaciones condicionales
 * 
 * @author Yariangel Aray
 * @date 2025-12-01
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { SearchableSelect, SearchableSelectOption } from "@/Components/SearchableSelect";
import { EMPRESA_INITIAL_DATA, EmpresaFormData } from "./empresaForm.types";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { FilePlus, Pencil, Plus } from "lucide-react";
import { EmpresaForm } from "./EmpresaForm";
import { Label } from "@/components/ui/label";
import { EmpresaInterface } from "./empresaInterface";

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

export default function EmpresaGestion({ empresas: empresasBack, tabs, moduloNombre, permisos }: EmpresaGestionProps) {
  const { toast } = useToast();

  // Verificar permisos
  const puedeCrear = permisos.includes("crear");
  const puedeEditar = permisos.includes("editar");
  const puedeEliminar = permisos.includes("eliminar");

  // Estados
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);
  const [empresas, setEmpresas] = useState<EmpresaInterface[]>(empresasBack);
  const [mode, setMode] = useState<"idle" | "create" | "edit">("idle");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Convertir empresas a opciones del select
  const empresaOptions: SearchableSelectOption[] = empresas.map((emp) => ({
    value: emp.id,
    label: `${emp.razon_social}${emp.siglas ? ` - (${emp.siglas})` : ""}`,
  }));

  // Obtener empresa seleccionada
  const selectedEmpresa = empresas.find((emp) => emp.id === selectedEmpresaId);

  // Handlers
  const handleSelectEmpresa = (id: string | number) => {
    setSelectedEmpresaId(Number(id));
    setMode("edit");
  };

  const handleCreateNew = () => {
    setSelectedEmpresaId(null);
    setMode("create");
  };

  const handleCancel = () => {
    setFormErrors({});
    setSelectedEmpresaId(null);
    setMode("idle");
  };

  const handleSubmit = async (data: EmpresaFormData) => {
    // Crear FormData para enviar archivo
    const formData = new FormData();

    // Agregar todos los campos
    Object.entries(data).forEach(([key, value]) => {
      if (key === "logo" && value instanceof File) {
        formData.append("logo", value);
      } else if (key === "logo_preview") {
        // No enviar preview
        return;
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {

      let response: Response;
      let url: string;
      let method: string;

      if (mode === "create") {
        url = route('empresa.store');
        method = 'POST';
      } else if (mode === "edit" && selectedEmpresaId) {
        url = route("empresa.update", selectedEmpresaId);
        method = 'POST'; // Laravel usa POST para updates con _method
        formData.append('_method', 'PUT'); // Para simular PUT en FormData
      } else {
        throw new Error('Modo inválido');
      }

      response = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Éxito
        if (mode === "create") {
          // Agregar la nueva empresa al array local y setear ID seleccionado
          setEmpresas?.((prev) => [...prev, result.empresa]);
          setSelectedEmpresaId(Number(result.empresa.id));          
          setMode("edit");
          toast({
            title: "Empresa creada",
            description: "La empresa se ha creado correctamente",
            variant: "success",
          });
        } else {
          setEmpresas?.((prev) =>
            prev.map((emp) => (emp.id === result.empresa.id ? result.empresa : emp))
          );
          toast({
            title: "Empresa actualizada",
            description: "Los cambios se han guardado correctamente",
            variant: "success",
          });
        }
      } else if (response.status === 422) {
        // Errores de validación
        setFormErrors(result.errors || {});
        toast({
          title: "Error de validación",
          description: "Revisa los campos marcados e intenta de nuevo",
          variant: "destructive",
        });
      } else if (response.status === 403) {
        // Sin permisos
        toast({
          title: "Acceso denegado",
          description: result.error || "No tienes permisos para esta acción",
          variant: "destructive",
        });
      } else {
        // Otros errores
        toast({
          title: "Error",
          description: result.error || "Intenta de nuevo más tarde",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error de conexión",
        description: "Revisa tu conexión e intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedEmpresaId) return;

    try {
      const response = await fetch(route("empresa.destroy", selectedEmpresaId), {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      const result = await response.json();
      if (response.ok) {
        // Éxito: Remover del array local y resetear
        setEmpresas?.((prev) => prev.filter((emp) => emp.id !== selectedEmpresaId));
        setSelectedEmpresaId(null);
        setMode("idle");

        toast({
          title: "Empresa eliminada",
          description: "La empresa se ha eliminado correctamente",
          variant: "success",
        });
      } else if (response.status === 403) {
        toast({
          title: "Acceso denegado",
          description: result.error || "No tienes permisos para eliminar",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error al eliminar",
          description: result.error || "No se pudo eliminar la empresa",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error de conexión",
        description: "Revisa tu conexión e intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  // Determinar si el formulario está deshabilitado
  const isFormDisabled = mode === "idle";

  // Preparar datos iniciales para el formulario
  const formInitialData: Partial<EmpresaFormData> =
    (mode === "edit" && selectedEmpresa)
      ? {
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
      }
      : EMPRESA_INITIAL_DATA;


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

        <CardContent className="flex-1 min-h-0 flex flex-col space-y-6 ">
          {/* Sección de selección */}
          <div>
            <div className={"grid gap-4 items-end" + `${puedeCrear ? ' md:grid-cols-[1fr_auto]' : ''}`}>
              {/* Select de empresas */}
              <div>
                <Label>
                  Seleccionar empresa para editar
                </Label>

                {puedeEditar ? (
                  <SearchableSelect
                    options={empresaOptions}
                    value={selectedEmpresaId || undefined}
                    onValueChange={handleSelectEmpresa}
                    placeholder="Buscar empresa..."
                    searchPlaceholder="Escribir para buscar..."
                    emptyText="No se encontraron empresas"
                    // disabled={mode === "create"}
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
                  {mode === "create"
                    ? (<span className="flex gap-2 items-center"><FilePlus className="h-4 w-4" /> Modo: Crear nueva empresa</span>)
                    : (<span className="flex gap-2 items-center"><Pencil className="h-4 w-4" /> Modo: Editando {selectedEmpresa?.razon_social}</span>)}
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
                      {puedeEditar
                        ? "Selecciona una empresa para editar"
                        : ""}
                      {puedeEditar && puedeCrear ? " o c" : "C"}
                      {puedeCrear
                        ? "rea una nueva para comenzar"
                        : ""}
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