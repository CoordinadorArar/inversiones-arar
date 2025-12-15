import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { DataTable } from "@/Components/ui/data-table";
import { TabInterface } from "@/Types/tabInterface";
import HelpManualButton from "@/Components/HelpManualButton";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { DocumentoCorporativoInterface } from "../types/documentoInterface";

export interface DocumentoListadoProps {
    tabs: TabInterface[];
    documentos: DocumentoCorporativoInterface[];
    moduloNombre: string;
}

export default function DocumentosListado({
    documentos,
    tabs,
    moduloNombre,
}: DocumentoListadoProps) {
    return (
        <TabsLayout
            moduloNombre={moduloNombre}
            tabs={tabs}
            activeTab={window.location.pathname}
        >
            <Card className="py-6 h-full flex flex-col shadow border-none gap-4">
                <CardHeader>
                    <CardTitle>
                        Listado de Documentos Corporativos
                        {/* Aquí se incluye HelpManualButton para acceder al manual. */}
                        <HelpManualButton
                            url="/docs/Manual-Documentos-Listado.pdf"
                            variant="muted"
                        />
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1">
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

DocumentosListado.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);