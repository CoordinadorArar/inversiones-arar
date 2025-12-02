/**
 * Componente EmpresaLogoUpload
 * 
 * Maneja la subida y preview del logo de la empresa.
 * Valida formato (PNG, JPG, SVG) y tamaño (máx 2MB).
 * Muestra preview de la imagen seleccionada con opción de eliminar.
 * Soporta drag & drop para arrastrar imágenes.
 * 
 * Props:
 * - logoPreview: URL de preview de la imagen
 * - onLogoChange: Callback cuando se selecciona un archivo
 * - onLogoRemove: Callback para eliminar la imagen
 * - disabled: Deshabilitar upload
 * 
 * @author Yariangel Aray
 * @date 2025-12-01
 */

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { useToast } from "@/hooks/use-toast";

interface EmpresaLogoUploadProps {
  logoPreview: string | null;
  onLogoChange: (file: File) => void;
  onLogoRemove: () => void;
  disabled?: boolean;
  error?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

export function EmpresaLogoUpload({
  logoPreview,
  onLogoChange,
  onLogoRemove,
  disabled = false,
  error,
}: EmpresaLogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  /**
   * Valida y procesa un archivo
   * Retorna true si es válido, false si no
   */
  const validateAndProcessFile = (file: File): boolean => {
    // Validar formato
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      toast({
        title: "Formato no válido",
        description: `${file.name} debe ser PNG, JPG o SVG`,
        variant: "destructive",
      });
      return false;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Archivo muy grande",
        description: `${file.name} debe ser menor a 2MB`,
        variant: "destructive",
      });
      return false;
    }

    // Si pasa validaciones, llamar al callback
    onLogoChange(file);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    validateAndProcessFile(file);
  };

  /**
   * Maneja el evento de soltar archivo en la zona de drop.
   * Previene default, valida y procesa el archivo.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    // Si hay archivos en el drop
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  /**
   * Maneja evento drag over en zona de drop.
   * Previene default y activa estado de dragging para estilos.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  /**
   * Maneja evento drag leave en zona de drop.
   * Previene default y desactiva estado de dragging.
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onLogoRemove();
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-primary" />
        Logo de la Empresa (Opcional)
      </Label>

      <div className="flex flex-col gap-4">
        {/* Preview del logo */}
        {logoPreview ? (
          <div className="relative w-full max-w-xs">
            <div className="aspect-video w-full rounded-lg border-2 border-dashed border-primary/30 bg-muted/30 p-4 flex items-center justify-center overflow-hidden">
              <img
                src={"/storage/" + logoPreview}
                alt="Preview del logo"
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
          /* Área de upload con drag & drop */
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
              <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? "bg-primary/20" : "bg-primary/10"
              }`}>
                <Upload className={`h-6 w-6 transition-colors ${
                  isDragging ? "text-primary" : "text-primary"
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {isDragging ? "Suelta el archivo aquí" : "Subir logo"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isDragging 
                    ? "Suelta para cargar" 
                    : "Arrastra una imagen o haz clic para seleccionar"
                  }
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

        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FORMATS.join(",")}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {error && <InputError message={error} />}

      <p className="text-xs text-muted-foreground">
        Formatos aceptados: PNG, JPG, SVG • Tamaño máximo: 2MB
      </p>
    </div>
  );
}