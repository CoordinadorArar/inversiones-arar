/**
 * Archivo DetailsModal.tsx.
 * 
 * Propósito: Modal para mostrar detalles completos de cambios en una auditoría.
 * Usa Dialog de Shadcn para ventana modal, con tabla que compara valores anteriores/nuevos.
 * Incluye estados vacíos y scroll para contenido largo.
 * 
 * Características:
 * - Header con ícono y descripción.
 * - Tabla de cambios con badges para columnas, códigos coloreados para valores.
 * - Estados vacíos con ícono y mensaje.
 * - Scroll vertical para contenido largo.
 * - Responsive: Max width/height, flex layout.
 * 
 * Props: open (estado), onClose (callback), auditoria (datos).
 * 
 * @author Yariangel Aray - Modal para detalles de auditoría.
 * @version 1.0
 * @date 2025-12-02
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";  
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";  
import { Badge } from "@/Components/ui/badge";  
import { AuditoriaInterface } from "../auditoriaInterface"; 
import { FileText } from "lucide-react"; 

// Interface para props del componente.
interface Props {
    open: boolean;  // Estado de apertura del modal.
    onClose: () => void;  // Callback para cerrar modal.
    auditoria: AuditoriaInterface;  // Datos de la auditoría a mostrar.
}

// Componente funcional DetailsModal.
export default function DetailsModal({ open, onClose, auditoria }: Props) {
    // Render: Dialog con contenido dinámico basado en auditoria.
    return (
        <Dialog open={open} onOpenChange={onClose}>
            {/* Content: Max width/height, flex col para header/contenido. */}
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header: Título con ícono, descripción. */}
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-5 w-5 text-primary" />  {/* Ícono FileText. */}
                        Detalles de Cambios
                    </DialogTitle>
                    <DialogDescription>
                        Información completa de los cambios del registro de auditoría #{auditoria?.id}  {/* ID dinámico. */}
                    </DialogDescription>
                </DialogHeader>

                {/* Contenido scrollable: Espacio para tabla o estado vacío. */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                    {auditoria && (
                        <div>
                            {/* Tabla de cambios: Si hay cambios, renderiza tabla; sino, estado vacío. */}
                            {auditoria.cambios && auditoria.cambios.length > 0 ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        {/* Header de tabla con bg primary sutil. */}
                                        <TableHeader className="bg-primary/5">
                                            <TableRow className="hover:bg-primary/0">
                                                <TableHead className="font-semibold text-secondary-foreground">Columna</TableHead>
                                                <TableHead className="font-semibold text-secondary-foreground">Valor Anterior</TableHead>
                                                <TableHead className="font-semibold text-secondary-foreground">Valor Nuevo</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        {/* Body: Mapea cambios a filas. */}
                                        <TableBody>
                                            {auditoria.cambios.map((cambio, index) => (
                                                <TableRow key={index} className="hover:bg-muted/50">
                                                    {/* Celda Columna: Badge outline con nombre. */}
                                                    <TableCell className="font-medium">
                                                        <Badge variant="outline" className="font-mono text-xs bg-slate-50">
                                                            {cambio.columna}  {/* Nombre de columna. */}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Celda Valor Anterior: Código rojo para "antes". */}
                                                    <TableCell>
                                                        <div className="max-w-xs">
                                                            <code className="text-xs bg-red-500/10 text-red-700 px-2 py-1 rounded">
                                                                {cambio.antes === null
                                                                    ? <span className="text-muted-foreground italic">null</span>  // Null en italic.
                                                                    : JSON.stringify(cambio.antes)  // JSON stringificado.
                                                                }
                                                            </code>
                                                        </div>
                                                    </TableCell>

                                                    {/* Celda Valor Nuevo: Código verde para "después". */}
                                                    <TableCell>
                                                        <div className="max-w-xs">
                                                            <code className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded">
                                                                {cambio.despues === null
                                                                    ? <span className="text-muted-foreground italic">null</span>  // Null en italic.
                                                                    : JSON.stringify(cambio.despues)  // JSON stringificado.
                                                                }
                                                            </code>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                // Estado vacío: Ícono y mensaje centrados.
                                <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
                                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />  {/* Ícono FileText opaco. */}
                                    <p className="text-sm">No hay cambios registrados</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
