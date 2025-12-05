/**
 * Componente ImageUpload
 * 
 * Componente genérico para subir imágenes con drag & drop.
 * Valida formato y tamaño configurables.
 * Muestra preview de la imagen seleccionada con opción de eliminar.
 * 
 * @author Yariangel Aray
 * @date 2025-12-04
 */

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  preview: string | null;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  maxSize?: number; // en bytes
  acceptedFormats?: string[];
}

export function ImageUpload({
  preview,
  onImageChange,
  onImageRemove,
  disabled = false,
  error,
  label = "Imagen",
  maxSize = 2 * 1024 * 1024, // 2MB por defecto
  acceptedFormats = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"],
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateAndProcessFile = (file: File): boolean => {
    if (!acceptedFormats.includes(file.type)) {
      const formats = acceptedFormats
        .map((f) => f.split("/")[1].toUpperCase())
        .join(", ");
      toast({
        title: "Formato no válido",
        description: `${file.name} debe ser ${formats}`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      toast({
        title: "Archivo muy grande",
        description: `${file.name} debe ser menor a ${sizeMB}MB`,
        variant: "destructive",
      });
      return false;
    }

    onImageChange(file);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    onImageRemove();
  };

  const formatsList = acceptedFormats
    .map((f) => f.split("/")[1].toUpperCase())
    .join(", ");
  const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-primary" />
        {label}
      </Label>

      <div className="flex flex-col gap-4">
        {preview ? (
          <div className="relative w-full max-w-xs">
            <div className="aspect-video w-full rounded-lg border-2 border-dashed border-primary/30 bg-muted/30 p-4 flex items-center justify-center overflow-hidden">
              <img
                src={preview.startsWith("data:") || preview.startsWith("blob:") ? preview : `/storage/${preview}`}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className={`w-full max-w-xs border-2 border-dashed rounded-lg p-6 pb-4 text-center transition-all ${
              disabled
                ? "bg-muted/20 cursor-not-allowed"
                : isDragging
                ? "border-primary bg-primary/10 scale-105"
                : "border-primary/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
            }`}
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                  isDragging ? "bg-primary/20" : "bg-primary/10"
                }`}
              >
                <Upload
                  className={`h-6 w-6 transition-colors ${
                    isDragging ? "text-primary" : "text-primary"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {isDragging ? "Suelta el archivo aquí" : "Subir imagen"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isDragging
                    ? "Suelta para cargar"
                    : "Arrastra una imagen o haz clic"}
                </p>
              </div>
              {!isDragging && (
                <Button
                  type="button"
                  size="sm"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Seleccionar archivo
                </Button>
              )}
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {error && <InputError message={error} />}

      <p className="text-xs text-muted-foreground">
        Formatos: {formatsList} • Máximo: {sizeMB}MB
      </p>
    </div>
  );
}