/**
 * Componente DocumentosGestion.
 * 
 * Página de gestión de documentos corporativos: permite crear, editar y eliminar documentos con formulario dinámico.
 * Incluye selector de documentos, validaciones de permisos, manejo de errores y estados de carga.
 * Usa hooks personalizados para lógica de gestión y form para operaciones CRUD.
 * Se integra con React via Inertia para gestión de documentos del sistema.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */

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
import HelpManualButton from "@/Components/HelpManualButton";

/**
 * Interfaz para las props del componente DocumentosGestion.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
export interface DocumentoGestionProps {
  tabs: TabInterface[]; // Pestañas accesibles del módulo.
  documentos: DocumentoCorporativoInterface[]; // Lista de documentos para selector.
  moduloNombre: string; // Nombre del módulo para el header.
  permisos: string[]; // Permisos del usuario en la pestaña.
  initialMode?: "idle" | "create" | "edit"; // Modo inicial del formulario.
  initialDocumentoId?: number | null; // ID de documento inicial para editar.
  error?: string; // Mensaje de error inicial.
}

/**
 * Componente principal para la página de Gestión de Documentos Corporativos.
 * Maneja estados de formulario, validaciones y operaciones CRUD via hooks.
 * Renderiza selector, formulario condicional y mensajes de estado.
 * 
 * @param {DocumentoGestionProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function DocumentosGestion({
  documentos: documentosBack,
  tabs,
  moduloNombre,
  permisos,
  initialMode = "idle",
  initialDocumentoId = null,
  error,
}: DocumentoGestionProps) {
  // Aquí se usa el hook personalizado para manejar lógica de gestión de documentos.
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

  // Aquí se calcula datos iniciales del formulario basados en modo y documento seleccionado.
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

  // Aquí se actualiza el mensaje de error cuando cambia la prop 'error'.
  useEffect(() => {
    setErrorMessage(error ?? null);
  }, [error]);

  // Aquí se limpia el error cuando el usuario interactúa (selecciona documento o crea nuevo).
  useEffect(() => {
    const userInteracted =
      (selectedDocumentoId && selectedDocumentoId !== initialDocumentoId) ||
      mode === "create";

    if (userInteracted) {
      setErrorMessage(null);
    }
  }, [selectedDocumentoId, mode, initialDocumentoId]);

  return (
    // Aquí se usa TabsLayout para envolver la página con navegación de pestañas y header del módulo.
    <TabsLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >
      <Card className="py-4 sm:py-6 h-full flex flex-col shadow border-none gap-3 sm:gap-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-5">
            Gestión de Documentos Corporativos
            {/* Aquí se incluye HelpManualButton para acceder al manual. */}
            <HelpManualButton
              url="/docs/Manual-Documentos-Gestion.pdf"
              variant="muted"
            />
          </CardTitle>          
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-6">
          <div>
            <div
              className={`grid gap-4 items-end${puedeCrear ? " md:grid-cols-[1fr_auto]" : ""
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

            {/* Aquí se muestra el mensaje de error si existe. */}
            {errorMessage && (
              <div className="p-3 rounded-lg border text-destructive border-destructive/50 bg-destructive/10 w-full mt-4 flex gap-2 items-center">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Aquí se muestra el indicador de modo (crear/editar) si no está en idle. */}
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
              className={`transition-opacity duration-300 ${isFormDisabled ? "opacity-50 pointer-events-none" : ""
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

            {/* Aquí se muestra overlay de instrucciones si el formulario está deshabilitado. */}
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

/**
 * Layout del componente: Envuelve la página en DashboardLayout con header dinámico.
 * Se usa para renderizar el componente dentro del layout principal.
 * 
 * @param {any} page - Página a renderizar.
 * @returns {JSX.Element} Elemento JSX con layout aplicado.
 */
DocumentosGestion.layout = (page: any) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);