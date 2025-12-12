/**
 * Componente ModulosGestion.
 * 
 * Página principal para gestión de módulos: permite seleccionar, crear, editar y eliminar módulos.
 * Incluye un selector de módulos, formulario dinámico, manejo de permisos y navegación.
 * Usa layouts, hooks personalizados y componentes UI para una experiencia integrada.
 * Se integra con React para gestión de módulos via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-11
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { TabInterface } from "@/Types/tabInterface";
import { ModuloInterface, ModuloPadreInterface } from "../types/moduloInterface";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, AlertCircle, FilePlus, Pencil } from "lucide-react";
import { SearchableSelect } from "@/Components/SearchableSelect";
import { useModuloGestion } from "../hooks/useModuloGestion";
import { useMemo, useState, useEffect } from "react";
import { MODULO_INITIAL_DATA } from "../types/moduloForm.types";
import HelpManualButton from "@/Components/HelpManualButton";
import { ModuloForm } from "../partials/ModuloForm";

/**
 * Interfaz para las props del componente ModulosGestion.
 * Define los parámetros necesarios para configurar la página de gestión de módulos.
 */
export interface ModuloGestionProps {
    tabs: TabInterface[]; // Lista de pestañas disponibles en el módulo.
    modulos: ModuloInterface[]; // Lista de módulos existentes.
    modulosPadre: ModuloPadreInterface[]; // Lista de módulos padre disponibles.
    moduloNombre: string; // Nombre del módulo actual.
    permisos: string[]; // Lista de permisos del usuario (ej: ["crear", "editar"]).
    initialMode?: "idle" | "create" | "edit"; // Modo inicial de la página.
    initialModuloId?: number | null; // ID del módulo inicial seleccionado (opcional).
    error?: string; // Mensaje de error inicial (opcional).
}

/**
 * Componente ModulosGestion.
 * 
 * Renderiza la interfaz de gestión de módulos con selector, formulario y manejo de estados.
 * Gestiona navegación, permisos y errores. Usa hooks para lógica de negocio.
 * 
 * @param {ModuloGestionProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function ModulosGestion({
    modulos: modulosBack,
    modulosPadre,
    tabs,
    moduloNombre,
    permisos,
    initialMode = "idle",
    initialModuloId = null,
    error,
}: ModuloGestionProps) {
    // Aquí se usa el hook personalizado para manejar lógica de gestión de módulos.
    const {
        selectedModuloId,
        mode,
        formErrors,
        selectedModulo,
        isFormDisabled,
        moduloOptions,
        puedeCrear,
        puedeEditar,
        puedeEliminar,
        handleSelectModulo,
        handleCreateNew,
        handleCancel,
        handleSubmit,
        handleDelete,
    } = useModuloGestion({
        modulosIniciales: modulosBack,
        permisos,
        initialMode,
        initialModuloId,
    });

    // Aquí se calcula datos iniciales para el formulario basado en el modo y módulo seleccionado.
    const formInitialData = useMemo(() => {
        if (mode === "edit" && selectedModulo) {
            return {
                nombre: selectedModulo.nombre,
                icono: selectedModulo.icono,
                ruta: selectedModulo.ruta,
                es_padre: selectedModulo.es_padre,
                modulo_padre_id: Number(selectedModulo.modulo_padre_id) || null,  // Maneja null si padre eliminado
                permisos_extra: selectedModulo.permisos_extra.join(","),
                // padre_eliminado: selectedModulo.padre_eliminado,
            };
        }
        return MODULO_INITIAL_DATA;
    }, [mode, selectedModulo]);

    // Aquí se usa useState para manejar mensajes de error locales.
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Aquí se usa useEffect para actualizar el mensaje de error cuando cambia el prop error.
    useEffect(() => {
        setErrorMessage(error ?? null);
    }, [error]);

    // Aquí se usa useEffect para limpiar errores cuando el usuario interactúa (cambia selección o modo).
    useEffect(() => {
        const userInteracted =
            (selectedModuloId && selectedModuloId !== initialModuloId) || mode === "create";

        if (userInteracted) {
            setErrorMessage(null);
        }
    }, [selectedModuloId, mode, initialModuloId]);

    return (
        <TabsLayout
            moduloNombre={moduloNombre}
            tabs={tabs}
            activeTab={window.location.pathname}
        >
            <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-5">
                        Gestión de Módulos
                        {/* Aquí se incluye HelpManualButton para acceder al manual de gestión de módulos. */}
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
                                <Label>Seleccionar módulo para editar</Label>

                                {puedeEditar ? (
                                    <SearchableSelect
                                        options={moduloOptions}
                                        value={selectedModuloId?.toString() || ""}
                                        onValueChange={handleSelectModulo}
                                        placeholder="Buscar módulo..."
                                        searchPlaceholder="Escribir para buscar..."
                                        emptyText="No se encontraron módulos"
                                    />
                                ) : (
                                    <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10 w-full">
                                        <p className="text-sm text-destructive">
                                            No tienes permiso para editar módulos
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
                                    Nuevo Módulo
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

                        {/* Aquí se muestra el indicador de modo (crear o editar) si no está en idle. */}
                        {mode !== "idle" && (
                            <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-primary">
                                        {mode === "create" ? (
                                            <span className="flex gap-2 items-center">
                                                <FilePlus className="h-4 w-4" />
                                                Modo: Crear nuevo módulo
                                            </span>
                                        ) : (
                                            <span className="flex gap-2 items-center">
                                                <Pencil className="h-4 w-4" />
                                                Modo: Editando {selectedModulo?.nombre}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 relative">
                        {/* Aquí se aplica opacidad y deshabilita eventos si el formulario está deshabilitado. */}
                        <div
                            className={`transition-opacity duration-300 ${isFormDisabled ? "opacity-50 pointer-events-none" : ""
                                }`}
                        >
                            {(puedeCrear || puedeEditar) && (
                                <ModuloForm
                                    mode={mode === "create" ? "create" : "edit"}
                                    initialData={formInitialData}
                                    disabled={isFormDisabled}
                                    modulosPadre={modulosPadre}
                                    onSubmit={handleSubmit}
                                    onDelete={mode === "edit" && puedeEliminar ? handleDelete : undefined}
                                    onCancel={handleCancel}
                                    externalErrors={formErrors}
                                    padreEliminado={selectedModulo?.padre_eliminado}
                                />
                            )}
                        </div>

                        {/* Aquí se muestra un overlay con mensaje si el formulario está deshabilitado. */}
                        {isFormDisabled && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                                <div className="bg-background/90 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center sm:max-w-sm">
                                    {!puedeCrear && !puedeEditar ? (
                                        <div className="space-y-2">
                                            <p className="text-destructive font-medium">Sin permisos</p>
                                            <p className="text-sm text-muted-foreground">
                                                No tienes permisos para crear ni editar módulos
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            {puedeEditar ? "Selecciona un módulo para editar" : ""}
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

// Aquí se define el layout para la página usando DashboardLayout.
ModulosGestion.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);