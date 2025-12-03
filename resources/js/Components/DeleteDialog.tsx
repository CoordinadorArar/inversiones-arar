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

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
    title?: string;
    description?: string;
    description_second?: string;
    itemName?: string;
    processing?: boolean;
}

/**
 * Dialog de confirmación para eliminar
 * 
 * @author Yariangel Aray
 * @date 2025-12-02
 */
export function DeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "¿Está seguro de continuar con la eliminación?",
    description = "Esta acción no se puede deshacer desde la plataforma.",
    description_second = "Para restaurar posteriormente será necesario realizar el proceso manual desde la administración interna.",
    itemName,
    processing = false,
}: DeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}{" "}
                        {itemName ? itemName : ""}
                        <br/>{description_second}
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
                        {processing ? "Procesando..." : "Confirmar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}