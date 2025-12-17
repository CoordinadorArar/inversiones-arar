/**
 * Componente DocumentosListado.
 * 
 * Página de listado de documentos corporativos con tabla de datos interactiva.
 * Muestra documentos con búsqueda, filtrado y columnas configurables.
 * Usa DataTable para renderizado eficiente y gestión de visibilidad de columnas.
 * Se integra con React via Inertia para gestión de documentos del sistema.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { TabInterface } from "@/Types/tabInterface";
import HelpManualButton from "@/Components/HelpManualButton";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { DocumentoCorporativoInterface } from "../types/documentoInterface";
import { DocumentoColumns, DocumentoInactiveColumns } from "../documentoColumns";

/**
 * Interfaz para las props del componente DocumentosListado.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
export interface DocumentoListadoProps {
    tabs: TabInterface[]; // Pestañas accesibles del módulo.
    documentos: DocumentoCorporativoInterface[]; // Lista de documentos corporativos.
    moduloNombre: string; // Nombre del módulo para el header.
}

/**
 * Componente principal para la página de Listado de Documentos Corporativos.
 * Renderiza tabla de datos con búsqueda y columnas configurables.
 * 
 * @param {DocumentoListadoProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function DocumentosListado({
    documentos,
    tabs,
    moduloNombre,
}: DocumentoListadoProps) {
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
                        Listado de Documentos Corporativos
                        {/* Aquí se incluye HelpManualButton para acceder al manual. */}
                        <HelpManualButton
                            url="/docs/Manual-Documentos-Listado.pdf"
                            variant="muted"
                        />
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1">
                    {/* Aquí se renderiza DataTable con columnas configuradas y visibilidad inicial. */}
                    <DataTable
                        columns={DocumentoColumns}
                        data={documentos}
                        searchPlaceholder="Buscar documentos..."
                        initialColumnVisibility={DocumentoInactiveColumns}
                    />
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
DocumentosListado.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);