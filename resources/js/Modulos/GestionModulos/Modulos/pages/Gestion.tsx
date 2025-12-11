import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
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

export interface ModuloGestionProps {
    tabs: TabInterface[];
    modulos: ModuloInterface[];
    modulosPadre: ModuloPadreInterface[];
    moduloNombre: string;
    permisos: string[];
    initialMode?: "idle" | "create" | "edit";
    initialModuloId?: number | null;
    error?: string;
}

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
    const {
        selectedModuloId,
        mode,
        formErrors,
        selectedModulo,
        isFormDisabled,
        moduloOptions,
        puedeCrear,
        puedeEditar,
        handleSelectModulo,
        handleCreateNew,
        handleCancel,
        handleSubmit,
    } = useModuloGestion({
        modulosIniciales: modulosBack,
        permisos,
        initialMode,
        initialModuloId,
    });

    const formInitialData = useMemo(() => {
        if (mode === "edit" && selectedModulo) {
            return {
                nombre: selectedModulo.nombre,
                icono: selectedModulo.icono,
                ruta: selectedModulo.ruta,
                es_padre: selectedModulo.es_padre,
                modulo_padre_id: selectedModulo.modulo_padre_id,
                permisos_extra: selectedModulo.permisos_extra.join(","),
            };
        }
        return MODULO_INITIAL_DATA;
    }, [mode, selectedModulo]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setErrorMessage(error ?? null);
    }, [error]);

    useEffect(() => {
        const userInteracted =
            (selectedModuloId && selectedModuloId !== initialModuloId) || mode === "create";

        if (userInteracted) {
            setErrorMessage(null);
        }
    }, [selectedModuloId, mode, initialModuloId]);

    return (
        <ModuleLayout
            moduloNombre={moduloNombre}
            tabs={tabs}
            activeTab={window.location.pathname}
        >
            <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-5">
                        Gestión de Módulos
                        {/* Aquí se incluye HelpManualButton para acceder al manual de gestión de empresas. */}
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
        </ModuleLayout>
    );
}

ModulosGestion.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);