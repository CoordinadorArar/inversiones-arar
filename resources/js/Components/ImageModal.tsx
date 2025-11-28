"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Props {
  open: boolean
  onClose: () => void
  src: string
}

/**
 * Modal simple para mostrar una imagen.
 */
export default function ImageModal({ open, onClose, src }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm flex items-center justify-center">
        <img src={src} alt="Logo" className="rounded-md max-h-80" />
      </DialogContent>
    </Dialog>
  )
}
