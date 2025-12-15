import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, X } from "lucide-react";
import InputError from "@/Components/InputError";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  value: File | null;
  preview: string | null;
  onChange: (file: File | null) => void;
  onRemove: () => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  label?: string;
  accept?: string;
  maxSize?: number; // en MB
}

export function FileUpload({
  value,
  preview,
  onChange,
  onRemove,
  disabled = false,
  error,
  required = false,
  label = "Archivo",
  accept = ".pdf,.doc,.docx",
  maxSize = 10,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateAndProcessFile = (file: File): boolean => {
    // Mapear extensiones a tipos MIME permitidos
    const acceptedTypes: Record<string, string[]> = {
      ".pdf": ["application/pdf"],
      ".doc": ["application/msword"],
      ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    };

    // Obtener tipos permitidos según accept prop
    const allowedTypes = accept.split(",").flatMap((ext) => acceptedTypes[ext.trim()] || []);

    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      const extensions = accept.split(",").map((ext) => ext.trim().toUpperCase()).join(", ");
      toast({
        title: "Formato no válido",
        description: `${file.name} debe ser ${extensions}`,
        variant: "destructive",
      });
      return false;
    }

    // Validar tamaño
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      toast({
        title: "Archivo muy grande",
        description: `${file.name} debe ser menor a ${maxSize}MB`,
        variant: "destructive",
      });
      return false;
    }

    onChange(file);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
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

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatAccept = () => {
    return accept
      .split(",")
      .map((ext) => ext.trim().toUpperCase().replace(".", ""))
      .join(", ");
  };

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>

      {!value && !preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 cursor-pointer border-dashed rounded-lg p-6 pb-2 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-primary/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 inline-flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1 mt-2">
            {isDragging ? "Suelta el archivo aquí" : "Subir archivo"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isDragging
              ? "Suelta para cargar"
              : `${formatAccept()} (máx ${maxSize}MB)`}
          </p>
          <Label
            htmlFor="file-upload"
            className="mt-4 cursor-pointer inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            Seleccionar archivo
          </Label>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border-2 border-primary/50">
          <FileText className="w-10 h-10 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {value?.name || preview?.split("/").pop() || "Archivo actual"}
            </p>
            {value && (
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.size)}
              </p>
            )}
            {preview && !value && (
              <a
                href={preview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >

                Ver archivo actual
              </a>
            )}
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        id="file-upload"
      />

      {error && <InputError message={error} />}
    </div>
  );
}