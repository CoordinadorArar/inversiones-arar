/**
 * Componente ControlAccesoModulos.
 * 
 * Página para asignar módulos a roles: selector de rol, lista jerárquica de módulos,
 * panel de permisos con checkboxes para asignar/desasignar.
 * Usa hooks personalizados para gestión de estado y operaciones CRUD.
 * Se integra con React via Inertia para control de acceso.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { TabInterface } from "@/Types/tabInterface";
import { RolSimpleInterface, ModuloAsignacionInterface } from "../types/controlAccesoInterface";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/Components/SearchableSelect";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { ModulosList } from "../partials/ModulosList";
import { PermisosPanel } from "../partials/PermisosPanel";
import { useControlAccesoGestion } from "../hooks/useControlAccesoGestion";

/**
 * Interfaz para las props del componente ControlAccesoModulos.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
export interface ControlAccesoModulosProps {
    tabs: TabInterface[]; // Pestañas accesibles del módulo.
    roles: RolSimpleInterface[]; // Lista de roles disponibles.
    modulos: ModuloAsignacionInterface[]; // Módulos con asignaciones iniciales.
    permisosBase: string[]; // Permisos base del sistema.
    selectedRolId: number | null; // ID del rol seleccionado inicialmente.
    permisos: string[]; // Permisos del usuario en la pestaña.
    moduloNombre: string; // Nombre del módulo para el header.
}

/**
 * Componente principal para la página de Asignación de Módulos a Roles.
 * Maneja estado de rol y módulo seleccionado, carga dinámica de datos.
 * Renderiza selector de rol, lista de módulos y panel de permisos.
 * 
 * @param {ControlAccesoModulosProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
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

    // Aquí se usa el hook personalizado para manejar lógica de gestión de control de acceso.
    const { selectedRolId, items: modulos, loadingItems, handleRolChange, loadItemsForRol } = useControlAccesoGestion({
        roles,
        itemsIniciales: modulosIniciales,
        initialRolId,
        tipo: 'modulos',
    });

    // Aquí se calculan opciones para el selector de roles.
    const rolOptions = roles.map((rol) => ({
        value: rol.id.toString(),
        label: rol.nombre,
    }));

    // Aquí se encuentra el módulo seleccionado en la lista jerárquica.
    const selectedModulo = modulos
        .flatMap((m) => [m, ...(m.hijos || [])])
        .find((m) => m.id == selectedModuloId);

    const handleModuloSelect = (moduloId: number) => {
        setSelectedModuloId(moduloId);
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
                            disabled={loadingItems} // Deshabilita mientras carga
                        />
                    </CardContent>
                </Card>

                {/* Contenido principal: Lista de módulos + Panel de permisos */}
                {selectedRolId && (
                    <div className={"flex-1 grid md:grid-cols-[1fr_250px] xl:grid-cols-[1fr_400px] gap-4 min-h-0 relative " + (loadingItems ? "opacity-60 pointer-events-none" : "")}>
                        {/* Lista de módulos */}
                        <ModulosList
                            modulos={modulos}
                            selectedModuloId={selectedModuloId}
                            onModuloSelect={handleModuloSelect}
                        />

                        {/* Panel de permisos */}
                        <PermisosPanel
                            item={selectedModulo}
                            rolId={selectedRolId}
                            permisosBase={permisosBase}
                            permisos={permisos}
                            tipo="modulo"
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
ControlAccesoModulos.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);
