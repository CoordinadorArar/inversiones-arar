import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { TabInterface } from "@/Types/tabInterface";
import { RolSimpleInterface, PestanaAsignacionInterface } from "../types/controlAccesoInterface";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/Components/SearchableSelect";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { PestanasList } from "../partials/PestanasList";
import { PermisosPanel } from "../partials/PermisosPanel";
import { useControlAccesoGestion } from "../hooks/useControlAccesoGestion";

export interface ControlAccesoPestanasProps {
    tabs: TabInterface[];
    roles: RolSimpleInterface[];
    pestanas: PestanaAsignacionInterface[];
    permisosBase: string[];
    selectedRolId: number | null;
    permisos: string[];
    moduloNombre: string;
}

export default function ControlAccesoPestanas({
    tabs,
    roles,
    pestanas: pestanasIniciales,
    permisosBase,
    selectedRolId: initialRolId,
    permisos,
    moduloNombre,
}: ControlAccesoPestanasProps) {
    const [selectedPestanaId, setSelectedPestanaId] = useState<number | null>(null);

    const { selectedRolId, items: pestanas, loadingItems, handleRolChange, loadItemsForRol } = useControlAccesoGestion({
        roles,
        itemsIniciales: pestanasIniciales,
        initialRolId,
        tipo: 'pestanas',
    });

    const rolOptions = roles.map((rol) => ({
        value: rol.id.toString(),
        label: rol.nombre,
    }));
    
    // Encontrar pestaña seleccionada (aplana padres → hijos → pestañas)
    const selectedPestana = pestanas
        .flatMap((padre) => padre.hijos.flatMap((hijo) => hijo.pestanas || []))
        .find((p) => p.id === selectedPestanaId);


    const handlePestanaSelect = (pestanaId: number) => {
        setSelectedPestanaId(pestanaId);
        console.log('pestanaId', pestanaId);
    };

    console.log('selectedPestana', selectedPestana, selectedPestanaId);

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
                        <CardTitle>Asignación de Pestañas a Roles</CardTitle>
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
                            disabled={loadingItems}
                        />
                    </CardContent>
                </Card>

                {/* Contenido principal: Lista de pestañas + Panel de permisos */}
                {selectedRolId && (
                    <div className={"flex-1 grid md:grid-cols-[1fr_400px] gap-4 min-h-0 relative " + (loadingItems ? "opacity-60 pointer-events-none" : "")}>
                        {/* Lista de pestañas */}
                        <PestanasList
                            pestanas={pestanas}
                            selectedPestanaId={selectedPestanaId}
                            onPestanaSelect={handlePestanaSelect}
                        />

                        {/* Panel de permisos */}
                        <PermisosPanel
                            item={selectedPestana}
                            rolId={selectedRolId}
                            permisosBase={permisosBase}
                            permisos={permisos}
                            tipo="pestana"
                            onSuccess={() => {
                                loadItemsForRol(selectedRolId);
                            }}
                        />
                    </div>
                )}
            </div>
        </TabsLayout>
    );
}

ControlAccesoPestanas.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);