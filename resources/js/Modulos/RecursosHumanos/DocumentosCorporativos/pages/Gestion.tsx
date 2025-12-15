import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { TabInterface } from "@/Types/tabInterface";
import { DocumentoCorporativoInterface } from "../types/documentoInterface";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, AlertCircle, FilePlus, Pencil } from "lucide-react";
import { SearchableSelect } from "@/Components/SearchableSelect";
import { useMemo, useState, useEffect } from "react";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { DOCUMENTO_INITIAL_DATA } from "../types/documentoForm.types";
import { DocumentoForm } from "../partials/DocumentoForm";
import { useDocumentoGestion } from "../hooks/useDocumentoGestion";

export interface DocumentoGestionProps {
  tabs: TabInterface[];
  documentos: DocumentoCorporativoInterface[];
  moduloNombre: string;
  permisos: string[];
  initialMode?: "idle" | "create" | "edit";
  initialDocumentoId?: number | null;
  error?: string;
}

export default function DocumentosGestion({
  documentos: documentosBack,
  tabs,
  moduloNombre,
  permisos,
  initialMode = "idle",
  initialDocumentoId = null,
  error,
}: DocumentoGestionProps) {
  const {
    selectedDocumentoId,
    mode,
    formErrors,
    selectedDocumento,
    isFormDisabled,
    documentoOptions,
    puedeCrear,
    puedeEditar,
    puedeEliminar,
    handleSelectDocumento,
    handleCreateNew,
    handleCancel,
    handleSubmit,
    handleDelete,
  } = useDocumentoGestion({
    documentosIniciales: documentosBack,
    permisos,
    initialMode,
    initialDocumentoId,
  });

  const formInitialData = useMemo(() => {
    if (mode === "edit" && selectedDocumento) {
      return {
        nombre: selectedDocumento.nombre,
        icono: selectedDocumento.icono || "",
        archivo: null,
        archivo_preview: "/storage/" + selectedDocumento.ruta,
        mostrar_en_dashboard: selectedDocumento.mostrar_en_dashboard,
        mostrar_en_footer: selectedDocumento.mostrar_en_footer,
      };
    }
    return DOCUMENTO_INITIAL_DATA;
  }, [mode, selectedDocumento]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(error ?? null);
  }, [error]);

  useEffect(() => {
    const userInteracted =
      (selectedDocumentoId && selectedDocumentoId !== initialDocumentoId) ||
      mode === "create";

    if (userInteracted) {
      setErrorMessage(null);
    }
  }, [selectedDocumentoId, mode, initialDocumentoId]);

  return (
    <TabsLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >
      <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
        <CardHeader>
          <CardTitle>Gestión de Documentos Corporativos</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-6">
          <div>
            <div
              className={`grid gap-4 items-end${
                puedeCrear ? " md:grid-cols-[1fr_auto]" : ""
              }`}
            >
              <div>
                <Label>Seleccionar documento para editar</Label>

                {puedeEditar ? (
                  <SearchableSelect
                    options={documentoOptions}
                    value={selectedDocumentoId?.toString() || ""}
                    onValueChange={handleSelectDocumento}
                    placeholder="Buscar documento..."
                    searchPlaceholder="Escribir para buscar..."
                    emptyText="No se encontraron documentos"
                  />
                ) : (
                  <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10 w-full">
                    <p className="text-sm text-destructive">
                      No tienes permiso para editar documentos
                    </p>
                  </div>
                )}
              </div>

              {puedeCrear && (
                <Button
                  onClick={handleCreateNew}
                  disabled={mode === "create"}
                  className="w-full md:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Documento
                </Button>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg border text-destructive border-destructive/50 bg-destructive/10 w-full mt-4 flex gap-2 items-center">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {mode !== "idle" && (
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">
                    {mode === "create" ? (
                      <span className="flex gap-2 items-center">
                        <FilePlus className="h-4 w-4" />
                        Modo: Crear nuevo documento
                      </span>
                    ) : (
                      <span className="flex gap-2 items-center">
                        <Pencil className="h-4 w-4" />
                        Modo: Editando {selectedDocumento?.nombre}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            <div
              className={`transition-opacity duration-300 ${
                isFormDisabled ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {(puedeCrear || puedeEditar) && (
                <DocumentoForm
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

            {isFormDisabled && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                <div className="bg-background/90 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center sm:max-w-sm">
                  {!puedeCrear && !puedeEditar ? (
                    <div className="space-y-2">
                      <p className="text-destructive font-medium">Sin permisos</p>
                      <p className="text-sm text-muted-foreground">
                        No tienes permisos para crear ni editar documentos
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {puedeEditar ? "Selecciona un documento para editar" : ""}
                      {puedeEditar && puedeCrear ? " o c" : "C"}
                      {puedeCrear ? "rea uno nuevo para comenzar" : ""}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsLayout>
  );
}

DocumentosGestion.layout = (page: any) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);