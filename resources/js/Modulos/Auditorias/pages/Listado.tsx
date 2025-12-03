/**
 * Componente AuditoriasListado.
 * 
 * Propósito: Vista de listado de auditorías dentro del módulo "Auditorías".
 * Usa DataTable para mostrar auditorías con filtros/búsqueda.
 * Incluye modal para ver detalles de cambios.
 * 
 * Props:
 * - auditorias: Array de auditorías (tipadas con AuditoriaInterface).
 * - moduloNombre: Nombre del módulo para header.
 * 
 * Layout: Envuelto en DashboardLayout con header dinámico.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-12-02
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { AuditoriaInterface } from "../auditoriaInterface";
import { DataTable } from "@/Components/ui/data-table";
import { AuditoriaColumns } from "../auditoriaColumns";
import { Head } from "@inertiajs/react";

// Interface para props del componente.
interface AuditoriasListadoProps {
    auditorias: AuditoriaInterface[];
    moduloNombre: string;
}

// Componente funcional AuditoriasListado.
export default function AuditoriasListado({ auditorias, moduloNombre }: AuditoriasListadoProps) {
    // Render: ModuleLayout con tabs, Card con DataTable.
    return (
        <>
            <Head title={moduloNombre} />
            <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
                {/* Header del card con título. */}
                <CardHeader>
                    <CardTitle>Registro de Auditorias</CardTitle>
                </CardHeader>

                {/* Contenido: DataTable con columnas y datos. */}
                <CardContent className="flex-1 min-h-0">
                    <DataTable
                        columns={AuditoriaColumns}  // Columnas definidas en auditoriaColumns.
                        data={auditorias}  // Datos de auditorias.
                        searchPlaceholder="Buscar auditoria..."  // Placeholder para búsqueda.
                    />
                </CardContent>
            </Card>
        </>
    );
}

// Layout para Inertia: Envuelve en DashboardLayout con header del módulo.
AuditoriasListado.layout = (page) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);