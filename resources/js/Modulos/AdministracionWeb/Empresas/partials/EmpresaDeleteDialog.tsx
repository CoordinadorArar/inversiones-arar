import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EmpresaDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void>;
    empresaNombre: string;
    processing: boolean;
}

/**
 * Dialog de confirmación para eliminar empresa
 * 
 * @author Yariangel Aray
 * @date 2025-12-02
 */
export function EmpresaDeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    empresaNombre,
    processing,
}: EmpresaDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar empresa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer desde la plataforma.
                        La empresa «{empresaNombre}» será desactivada y dejará de estar disponible en el sistema.
                        Para restaurarla posteriormente será necesario realizar el proceso manualmente desde la administración interna.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={processing}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {processing ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}