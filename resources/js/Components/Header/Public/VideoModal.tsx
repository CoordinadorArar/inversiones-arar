import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoModalProps } from "../header.types";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Componente: VideoModal
 * Modal con video tutorial de gestión humana
 */

export const VideoModal = ({ isOpen, onClose, onContinue, videoRef }: VideoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Tutorial de Gestión Humana
          </DialogTitle>
          <DialogDescription>
            Por favor, mira este video tutorial antes de continuar
          </DialogDescription>
        </DialogHeader>

        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full"
            controls
          >
            <source src="videos/tutorial-gh.mp4" type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={onContinue}
            className="w-full sm:w-auto"
          >
            Continuar a Gestión Humana
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};