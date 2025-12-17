/**
 * Componente PestanasGestion.
 * 
 * Página de gestión de pestañas: permite crear, editar y eliminar pestañas con formulario dinámico.
 * Incluye selector de pestañas, validaciones de permisos, manejo de errores y estados de carga.
 * Usa hooks personalizados para lógica de gestión y form para operaciones CRUD.
 * Se integra con React via Inertia para gestión de pestañas del sistema.
 * 
 * @author Yariangel Aray
 * @date 2025-12-12
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { TabInterface } from "@/Types/tabInterface";
import { PestanaInterface, ModuloDisponibleInterface } from "../types/pestanaInterface";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, AlertCircle, FilePlus, Pencil } from "lucide-react";
import { SearchableSelect } from "@/Components/SearchableSelect";
import { useMemo, useState, useEffect } from "react";
import HelpManualButton from "@/Components/HelpManualButton";
import { PESTANA_INITIAL_DATA } from "../types/pestanaForm.types";
import { PestanaForm } from "../partials/PestanaForm";
import { usePestanaGestion } from "../hooks/usePestanaGestion";

/**
 * Interfaz para las props del componente PestanasGestion.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
export interface PestanaGestionProps {
    tabs: TabInterface[]; // Pestañas accesibles del módulo.
    pestanas: PestanaInterface[]; // Lista de pestañas para selector.
    modulos: ModuloDisponibleInterface[]; // Módulos disponibles para asignar.
    moduloNombre: string; // Nombre del módulo para el header.
    permisos: string[]; // Permisos del usuario en la pestaña.
    initialMode?: "idle" | "create" | "edit"; // Modo inicial del formulario.
    initialPestanaId?: number | null; // ID de pestaña inicial para editar.
    error?: string; // Mensaje de error inicial.
}

/**
 * Componente principal para la página de Gestión de Pestañas.
 * Maneja estados de formulario, validaciones y operaciones CRUD via hooks.
 * Renderiza selector, formulario condicional y mensajes de estado.
 * 
 * @param {PestanaGestionProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function PestanasGestion({
    pestanas: pestanasBack,
    modulos,
    tabs,
    moduloNombre,
    permisos,
    initialMode = "idle",
    initialPestanaId = null,
    error,
}: PestanaGestionProps) {
    // Aquí se usa el hook personalizado para manejar lógica de gestión de pestañas.
    const {
        selectedPestanaId,
        mode,
        formErrors,
        selectedPestana,
        isFormDisabled,
        pestanaOptions,
        puedeCrear,
        puedeEditar,
        puedeEliminar,
        handleSelectPestana,
        handleCreateNew,
        handleCancel,
        handleSubmit,
        handleDelete,
    } = usePestanaGestion({
        pestanasIniciales: pestanasBack,
        permisos,
        initialMode,
        initialPestanaId,
    });

    // Aquí se calcula datos iniciales del formulario basados en modo y pestaña seleccionada.
    const formInitialData = useMemo(() => {
        if (mode === "edit" && selectedPestana) {
            return {
                nombre: selectedPestana.nombre,
                ruta: selectedPestana.ruta,
                modulo_id: selectedPestana.modulo_eliminado ? null : Number(selectedPestana.modulo_id),
                permisos_extra: selectedPestana.permisos_extra.join(","),
            };
        }
        return PESTANA_INITIAL_DATA;
    }, [mode, selectedPestana]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Aquí se actualiza el mensaje de error cuando cambia la prop 'error'.
    useEffect(() => {
        setErrorMessage(error ?? null);
    }, [error]);

    // Aquí se limpia el error cuando el usuario interactúa (selecciona pestaña o crea nueva).
    useEffect(() => {
        const userInteracted =
            (selectedPestanaId && selectedPestanaId !== initialPestanaId) || mode === "create";

        if (userInteracted) {
            setErrorMessage(null);
        }
    }, [selectedPestanaId, mode, initialPestanaId]);

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
                        Gestión de Pestañas
                        {/* Aquí se incluye HelpManualButton para acceder al manual. */}
                        <HelpManualButton
                            url="/docs/Manual-Modulos-Gestion.pdf"
                            variant="muted"
                        />
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col space-y-6">
                    <div>
                        <div
                            className={`grid gap-4 items-end${puedeCrear ? " md:grid-cols-[1fr_auto]" : ""}`}
                        >
                            <div>
                                <Label>Seleccionar pestaña para editar</Label>

                                {puedeEditar ? (
                                    <SearchableSelect
                                        options={pestanaOptions}
                                        value={selectedPestanaId?.toString() || ""}
                                        onValueChange={handleSelectPestana}
                                        placeholder="Buscar pestaña..."
                                        searchPlaceholder="Escribir para buscar..."
                                        emptyText="No se encontraron pestañas"
                                    />
                                ) : (
                                    <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10 w-full">
                                        <p className="text-sm text-destructive">
                                            No tienes permiso para editar pestañas
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
                                    Nueva Pestaña
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
                                                Modo: Crear nueva pestaña
                                            </span>
                                        ) : (
                                            <span className="flex gap-2 items-center">
                                                <Pencil className="h-4 w-4" />
                                                Modo: Editando {selectedPestana?.nombre}
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
                                <PestanaForm
                                    mode={mode === "create" ? "create" : "edit"}
                                    initialData={formInitialData}
                                    disabled={isFormDisabled}
                                    modulos={modulos}
                                    onSubmit={handleSubmit}
                                    onDelete={mode === "edit" && puedeEliminar ? handleDelete : undefined}
                                    onCancel={handleCancel}
                                    externalErrors={formErrors}
                                    moduloEliminado={selectedPestana?.modulo_eliminado}
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
                                                No tienes permisos para crear ni editar pestañas
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            {puedeEditar ? "Selecciona una pestaña para editar" : ""}
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
PestanasGestion.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);
