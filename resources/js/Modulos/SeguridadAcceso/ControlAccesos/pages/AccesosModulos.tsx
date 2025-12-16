import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { TabInterface } from "@/Types/tabInterface";
import { RolSimpleInterface, ModuloAsignacionInterface } from "../types/controlAccesoInterface";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/Components/SearchableSelect";
import { router } from "@inertiajs/react";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { ModulosList } from "../partials/ModulosList";
import { PermisosPanel } from "../partials/PermisosPanel";
import { useControlAccesoGestion } from "../hooks/useControlAccesoGestion";
import { Loader2 } from "lucide-react";

export interface ControlAccesoModulosProps {
    tabs: TabInterface[];
    roles: RolSimpleInterface[];
    modulos: ModuloAsignacionInterface[];
    permisosBase: string[];
    selectedRolId: number | null;
    permisos: string[];
    moduloNombre: string;
}

export default function ControlAccesoModulos({
    tabs,
    roles,
    modulos: modulosIniciales,
    permisosBase,
    selectedRolId: initialRolId,
    permisos,
    moduloNombre,
}: ControlAccesoModulosProps) {
    const [selectedModuloId, setSelectedModuloId] = useState<number | null>(null);

    const { selectedRolId, selectedRol, modulos, loadingModulos, handleRolChange, loadModulosForRol } = useControlAccesoGestion({
        roles,
        modulosIniciales,
        initialRolId,
    });

    const rolOptions = roles.map((rol) => ({
        value: rol.id.toString(),
        label: rol.nombre,
    }));

    // Encontrar módulo seleccionado
    const selectedModulo = modulos
        .flatMap((m) => [m, ...(m.hijos || [])])
        .find((m) => m.id === selectedModuloId);
    const handleModuloSelect = (moduloId: number) => {
        setSelectedModuloId(moduloId);
    };

    return (
        <TabsLayout
            moduloNombre={moduloNombre}
            tabs={tabs}
            activeTab={window.location.pathname}
        >
            <div className="h-full flex flex-col gap-4">
                {/* Header con selector de rol */}
                <Card className="py-6 shadow border-none gap-4">
                    <CardHeader>
                        <CardTitle>Asignación de Módulos a Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label>Seleccionar rol para configurar permisos</Label>
                        <SearchableSelect
                            options={rolOptions}
                            value={selectedRolId?.toString() || ""}
                            onValueChange={(value) => handleRolChange(Number(value))}
                            placeholder="Buscar rol..."
                            searchPlaceholder="Escribir para buscar..."
                            emptyText="No se encontraron roles"
                            disabled={loadingModulos} // Deshabilita mientras carga
                        />
                    </CardContent>
                </Card>

                {/* Contenido principal: Lista de módulos + Panel de permisos */}
                {selectedRolId && (
                    <div className={"flex-1 grid md:grid-cols-[1fr_400px] gap-4 min-h-0 relative " + (loadingModulos ? "opacity-60 pointer-events-none" : "")}>
                        {/* Lista de módulos */}
                        <ModulosList
                            modulos={modulos}
                            selectedModuloId={selectedModuloId}
                            onModuloSelect={handleModuloSelect}
                        />

                        {/* Panel de permisos */}
                        <PermisosPanel
                            modulo={selectedModulo}
                            rolId={selectedRolId}
                            permisosBase={permisosBase}
                            permisos={permisos}
                            onSuccess={() => {
                                // Refrescar la página para obtener datos actualizados
                                loadModulosForRol(selectedRolId);
                            }}
                        />
                    </div>
                )}
            </div>
        </TabsLayout>
    );
}

ControlAccesoModulos.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);