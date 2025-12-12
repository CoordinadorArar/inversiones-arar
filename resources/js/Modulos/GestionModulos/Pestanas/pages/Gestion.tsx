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

export interface PestanaGestionProps {
    tabs: TabInterface[];
    pestanas: PestanaInterface[];
    modulos: ModuloDisponibleInterface[];
    moduloNombre: string;
    permisos: string[];
    initialMode?: "idle" | "create" | "edit";
    initialPestanaId?: number | null;
    error?: string;
}

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

    useEffect(() => {
        setErrorMessage(error ?? null);
    }, [error]);

    useEffect(() => {
        const userInteracted =
            (selectedPestanaId && selectedPestanaId !== initialPestanaId) || mode === "create";

        if (userInteracted) {
            setErrorMessage(null);
        }
    }, [selectedPestanaId, mode, initialPestanaId]);

    return (
        <TabsLayout
            moduloNombre={moduloNombre}
            tabs={tabs}
            activeTab={window.location.pathname}
        >
            <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-5">
                        Gestión de Pestañas
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

PestanasGestion.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);