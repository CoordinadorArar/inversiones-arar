/**
 * Componente Roles.
 * 
 * Vista con tabla y formulario lateral para gestión de roles.
 * - Tabla en el lado izquierdo para listar roles.
 * - Formulario en el lado derecho (se muestra según permisos) para crear/editar.
 * - Columna "Accesos" visible solo si el usuario tiene el módulo Control de Accesos asignado.
 * 
 * @author Yariangel Aray
 * @date 2025-12-17
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { DeleteDialog } from "@/Components/DeleteDialog";
import HelpManualButton from "@/Components/HelpManualButton";
import { useMemo } from "react";
import { Info } from "lucide-react";
import { TabInterface } from "@/Types/tabInterface";
import { RolInterface } from "./types/rolInterface";
import { useRolGestion } from "./hooks/useRolGestion";
import { RolForm } from "./partials/RolForm";
import { createRolColumns } from "./rolColumns";
import { Head } from "@inertiajs/react";

/**
 * Interfaz para las props del componente Roles.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
interface RolesProps {
    tabs: TabInterface[]; // Pestañas accesibles del módulo.
    roles: RolInterface[]; // Lista de roles iniciales.
    moduloNombre: string; // Nombre del módulo para el header.
    permisos: string[]; // Permisos del usuario en el módulo.
    tieneControlAccesos: boolean; // Si tiene módulo Control de Accesos.
    tieneAccesosModulos: boolean; // Si tiene pestaña Accesos Módulos.
    tieneAccesosPestanas: boolean; // Si tiene pestaña Accesos Pestañas.
}

/**
 * Componente principal para la página de Gestión de Roles.
 * Maneja estado de roles, formulario y operaciones CRUD via hooks.
 * Renderiza tabla con columnas dinámicas y formulario lateral condicional.
 * 
 * @param {RolesProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function Roles({
    roles: rolesIniciales,
    moduloNombre,
    permisos,
    tieneControlAccesos,
    tieneAccesosModulos,
    tieneAccesosPestanas
}: RolesProps) {

    // Aquí se usa el hook personalizado para manejar lógica de gestión de roles.
    const {
        roles,
        mode,
        editingRol,
        formErrors,
        processing,
        showDeleteDialog,
        rolToDelete,
        shouldShowForm,
        puedeCrear,
        puedeEditar,
        puedeEliminar,
        handleEdit,
        handleCancel,
        handleSubmit,
        handleDeleteClick,
        handleCancelDelete,
        handleConfirmDelete,
    } = useRolGestion({
        rolesIniciales,
        permisos,
    });

    // Aquí se crean columnas dinámicas basadas en permisos y accesos.
    const columns = createRolColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
        permisos: { editar: puedeEditar, eliminar: puedeEliminar },
        tieneControlAccesos,
        tieneAccesosModulos,
        tieneAccesosPestanas,
    });

    // Aquí se calcula datos iniciales del formulario basados en modo y rol editando.
    const formInitialData = useMemo(() => {
        if (mode === "edit" && editingRol) {
            return {
                nombre: editingRol.nombre,
                abreviatura: editingRol.abreviatura,
            };
        }
        return { nombre: "", abreviatura: "" };
    }, [mode, editingRol]);

    return (
        <>
            <Head title={moduloNombre} />

            <div className={`h-full grid gap-4 animate-fade ${shouldShowForm ? 'lg:grid-cols-[1fr_320px]' : ''}`}>
                <Card className="py-4 sm:py-6 flex flex-col shadow border-none gap-3 sm:gap-4 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-5">
                            Listado de Roles
                            {/* Aquí se incluye HelpManualButton para acceder al manual. */}
                            <HelpManualButton
                                url="/docs/Manual-Roles.pdf"
                                variant="muted"
                            />
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 min-h-0 flex flex-col">
                        {/* Aquí se usa DataTable para renderizar la tabla con columnas dinámicas y búsqueda. */}
                        <DataTable
                            columns={columns}
                            data={roles}
                            searchPlaceholder="Buscar roles..."
                        />
                    </CardContent>
                </Card>

                {/* Aquí se muestra el formulario lateral si tiene permisos para crear/editar. */}
                {shouldShowForm && (
                    <div>
                        <Card id="rol-form-container" className="py-4 h-min shadow border-none sticky top-16">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {mode === "create" ? "Crear Rol" : "Editar Rol"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RolForm
                                    mode={mode}
                                    initialData={formInitialData}
                                    onSubmit={handleSubmit}
                                    onCancel={handleCancel}
                                    externalErrors={formErrors}
                                    processing={processing}
                                />
                            </CardContent>
                        </Card>
                        <p className="mt-6 text-xs text-muted-foreground text-center">
                            <Info className="h-4 w-4 mr-2 float-left" />
                            La información gestionada en este módulo es <b>sensible</b> y puede afectar el <b>funcionamiento</b> del sistema.
                            Antes de modificar o eliminar un registro, verifica que no esté asociado a <b>otros procesos, validaciones</b> o
                            <b> módulos operativos</b>. Realiza los cambios con precaución ya que pueden <b>impactar</b> en flujos, reglas de negocios o datos ya registrados.
                        </p>
                    </div>
                )}
            </div>

            {/* Aquí se usa DeleteDialog para confirmar eliminación de roles. */}
            <DeleteDialog
                open={showDeleteDialog}
                onOpenChange={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                itemName={`El rol «${rolToDelete?.nombre}» será eliminado y dejará de estar disponible en el sistema. Asegurese de que no esté asociado a usuarios u otros procesos antes de confirmar.`}
                processing={processing}
            />
        </>
    );
}

/**
 * Layout del componente: Envuelve la página en DashboardLayout con header dinámico.
 * Se usa para renderizar el componente dentro del layout principal.
 * 
 * @param {any} page - Página a renderizar.
 * @returns {JSX.Element} Elemento JSX con layout aplicado.
 */
Roles.layout = (page) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);