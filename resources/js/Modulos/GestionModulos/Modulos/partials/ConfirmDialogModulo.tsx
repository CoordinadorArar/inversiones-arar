/**
 * Componente ConfirmDialogModulo.
 * 
 * Diálogo de confirmación para acciones sensibles en el formulario de módulos.
 * Muestra advertencias para creación de módulos o cambios críticos en edición,
 * con lista de acciones requeridas. Usa AlertDialog de Radix UI para modal.
 * Se integra con React para formularios de módulos via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-11
 */

import { AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

/**
 * Interfaz para las props del componente ConfirmDialogModulo.
 * Define los parámetros necesarios para configurar el diálogo de confirmación.
 */
interface ConfirmDialogModuloProps {
    open: boolean; // Indica si el diálogo está abierto.
    onOpenChange: (open: boolean) => void; // Callback para cambiar el estado de apertura.
    onConfirm: () => void; // Callback para confirmar la acción.
    onCancel: () => void; // Callback para cancelar la acción.
    mode: "create" | "edit"; // Modo del formulario (crear o editar).
    hasCriticalChanges?: boolean; // Indica si hay cambios críticos en modo edición.
    changes: Record<string, boolean>; // Objeto con flags de cambios (ej: { ruta: true }).
}

/**
 * Componente ConfirmDialogModulo.
 * 
 * Renderiza un diálogo modal con advertencias para creación o cambios sensibles.
 * Incluye lista de acciones requeridas y botones de confirmación/cancelación.
 * Maneja lógica condicional basada en modo y cambios.
 * 
 * @param {ConfirmDialogModuloProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export function ConfirmDialogModulo({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
    mode,
    hasCriticalChanges = false,
    changes,
}: ConfirmDialogModuloProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        {mode === "create" ? "Confirmar creación de módulo" : "Advertencia: Datos sensibles"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 text-left">
                        {mode === "create" ? (
                            <>
                                <p className="font-medium text-foreground">
                                    Después de crear el módulo, deberás realizar las siguientes acciones:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Crear las rutas correspondientes en el archivo de rutas de Laravel</li>
                                    <li>Crear el controlador y las vistas necesarias</li>
                                    <li>Asignar el módulo a uno o más roles para que sea accesible</li>
                                    <li>Si tiene pestañas, crear y configurar cada pestaña</li>
                                </ul>
                                <p className="text-amber-600 font-medium">
                                    ¿Estás seguro de que deseas crear este módulo?
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="font-medium text-foreground">
                                    Los datos del módulo son sensibles y pueden afectar el funcionamiento del sistema.
                                </p>
                                {hasCriticalChanges && (
                                    <>
                                        <p className="font-medium text-amber-600">
                                            Has modificado datos críticos:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            {changes.ruta && <li>Ruta del módulo</li>}
                                            {changes.es_padre && <li>Confirmación para Modulo Padre</li>}
                                            {changes.modulo_padre_id && <li>Módulo padre</li>}
                                        </ul>
                                        <p className="text-sm">
                                            Si cambias la ruta o el módulo padre y su confirmación, deberás actualizar:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Las rutas en el archivo de rutas de Laravel</li>
                                            <li>Los archivos de vistas y controladores internos</li>
                                            <li>Las referencias en otros módulos o pestañas</li>
                                        </ul>
                                    </>
                                )}
                                <p className="text-amber-600 font-medium">
                                    ¿Estás seguro de que deseas guardar estos cambios?
                                </p>
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        {mode === "create" ? "Sí, crear módulo" : "Sí, guardar cambios"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}