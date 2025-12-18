/**
 * Componente ControlAccesoPestanas.
 * 
 * Página para asignar pestañas a roles: selector de rol, lista jerárquica de pestañas,
 * panel de permisos con checkboxes para asignar/desasignar.
 * Usa hooks personalizados para gestión de estado y operaciones CRUD.
 * Se integra con React via Inertia para control de acceso.
 * 
 * @author Yariangel Aray
 * @date 2025-12-16
 */

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

/**
 * Interfaz para las props del componente ControlAccesoPestanas.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
export interface ControlAccesoPestanasProps {
    tabs: TabInterface[]; // Pestañas accesibles del módulo.
    roles: RolSimpleInterface[]; // Lista de roles disponibles.
    pestanas: PestanaAsignacionInterface[]; // Pestañas con asignaciones iniciales.
    permisosBase: string[]; // Permisos base del sistema.
    selectedRolId: number | null; // ID del rol seleccionado inicialmente.
    permisos: string[]; // Permisos del usuario en la pestaña.
    moduloNombre: string; // Nombre del módulo para el header.
}

/**
 * Componente principal para la página de Asignación de Pestañas a Roles.
 * Maneja estado de rol y pestaña seleccionado, carga dinámica de datos.
 * Renderiza selector de rol, lista de pestañas y panel de permisos.
 * 
 * @param {ControlAccesoPestanasProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
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

    // Aquí se usa el hook personalizado para manejar lógica de gestión de control de acceso.
    const { selectedRolId, items: pestanas, loadingItems, handleRolChange, loadItemsForRol } = useControlAccesoGestion({
        roles,
        itemsIniciales: pestanasIniciales,
        initialRolId,
        tipo: 'pestanas',
    });

    // Aquí se calculan opciones para el selector de roles.
    const rolOptions = roles.map((rol) => ({
        value: rol.id.toString(),
        label: rol.nombre,
    }));

    // Aquí se encuentra la pestaña seleccionada en la estructura jerárquica.
    const selectedPestana = pestanas
        .flatMap((padre) => padre.hijos.flatMap((hijo) => hijo.pestanas || []))
        .find((p) => p.id === selectedPestanaId);

    const handlePestanaSelect = (pestanaId: number) => {
        setSelectedPestanaId(pestanaId);
        setTimeout(() => {
            const formElement = document.getElementById('permiso-panel-form');
            if (formElement) {
                formElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100); // Pequeño delay para asegurar que el DOM se actualizó
    };

    return (
        // Aquí se usa TabsLayout para envolver la página con navegación de pestañas y header del módulo.
        <TabsLayout
            moduloNombre={moduloNombre}
            tabs={tabs}
            activeTab={window.location.pathname}
        >
            <div className="h-full flex flex-col gap-4">
                {/* Header con selector de rol */}
                <Card className="py-4 sm:py-6 shadow border-none gap-3 sm:gap-4">
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
                    <div className={"flex-1 grid md:grid-cols-[1fr_250px] xl:grid-cols-[1fr_400px] gap-4 min-h-0 relative " + (loadingItems ? "opacity-60 pointer-events-none" : "")}>
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

/**
 * Layout del componente: Envuelve la página en DashboardLayout con header dinámico.
 * Se usa para renderizar el componente dentro del layout principal.
 * 
 * @param {any} page - Página a renderizar.
 * @returns {JSX.Element} Elemento JSX con layout aplicado.
 */
ControlAccesoPestanas.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);
