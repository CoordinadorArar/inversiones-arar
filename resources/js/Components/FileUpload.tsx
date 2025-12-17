/**
 * Componente FileUpload.
 * 
 * Componente para subir archivos con drag & drop, validaciones de tipo y tamaño, y preview de archivo existente.
 * Incluye zona de drop interactiva, validaciones con toast, y opciones para remover archivo.
 * Usa useRef para input oculto, useState para estado de dragging, y hooks de UI para notificaciones.
 * Se integra con React para gestión de archivos via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, X } from "lucide-react";
import InputError from "@/Components/InputError";
import { useToast } from "@/hooks/use-toast";

/**
 * Interfaz para las props del componente FileUpload.
 * Define las opciones para subida de archivos, validaciones y callbacks.
 */
interface FileUploadProps {
  value: File | null; // Archivo seleccionado actualmente.
  preview: string | null; // URL de preview del archivo existente.
  onChange: (file: File | null) => void; // Callback para cambios en archivo.
  onRemove: () => void; // Callback para remover archivo.
  disabled?: boolean; // Indica si el componente está deshabilitado.
  error?: string; // Mensaje de error para mostrar.
  required?: boolean; // Indica si el archivo es requerido.
  label?: string; // Etiqueta del campo.
  accept?: string; // Tipos de archivo aceptados (e.g., ".pdf,.doc").
  maxSize?: number; // Tamaño máximo en MB.
}

/**
 * Componente FileUpload.
 * 
 * Renderiza una zona de drop o preview de archivo, con validaciones y handlers para drag & drop.
 * Maneja estado de dragging y muestra errores via InputError.
 * 
 * @param {FileUploadProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
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
  // Aquí se usa useRef para referenciar el input oculto.
  const inputRef = useRef<HTMLInputElement>(null);

  // Aquí se usa useState para controlar el estado de dragging.
  const [isDragging, setIsDragging] = useState(false);

  // Aquí se usa useToast para mostrar notificaciones de validación.
  const { toast } = useToast();

  /**
   * Función para validar y procesar el archivo seleccionado.
   * Verifica tipo MIME y tamaño, muestra toast si falla, y llama onChange si pasa.
   * 
   * @param {File} file - Archivo a validar.
   * @returns {boolean} True si válido, false si no.
   */
  const validateAndProcessFile = (file: File): boolean => {
    // Aquí se mapean extensiones a tipos MIME permitidos.
    const acceptedTypes: Record<string, string[]> = {
      ".pdf": ["application/pdf"],
      ".doc": ["application/msword"],
      ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    };

    // Aquí se obtienen tipos permitidos según accept prop.
    const allowedTypes = accept.split(",").flatMap((ext) => acceptedTypes[ext.trim()] || []);

    // Aquí se valida el tipo de archivo.
    if (!allowedTypes.includes(file.type)) {
      const extensions = accept.split(",").map((ext) => ext.trim().toUpperCase()).join(", ");
      toast({
        title: "Formato no válido",
        description: `${file.name} debe ser ${extensions}`,
        variant: "destructive",
      });
      return false;
    }

    // Aquí se valida el tamaño del archivo.
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

  /**
   * Handler para cambios en el input de archivo.
   * Valida y procesa el archivo seleccionado.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  /**
   * Handler para drop de archivos.
   * Previene default, resetea dragging y valida el archivo dropeado.
   * 
   * @param {React.DragEvent<HTMLDivElement>} e - Evento de drop.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  /**
   * Handler para drag over.
   * Previene default y activa estado de dragging si no deshabilitado.
   * 
   * @param {React.DragEvent<HTMLDivElement>} e - Evento de drag over.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  /**
   * Handler para drag leave.
   * Resetea el estado de dragging.
   */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * Función para formatear el tamaño del archivo en bytes legibles.
   * 
   * @param {number} bytes - Tamaño en bytes.
   * @returns {string} Tamaño formateado.
   */
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  /**
   * Función para formatear las extensiones aceptadas para display.
   * 
   * @returns {string} Extensiones formateadas.
   */
  const formatAccept = () => {
    return accept
      .split(",")
      .map((ext) => ext.trim().toUpperCase().replace(".", ""))
      .join(", ");
  };

  return (
    // Aquí se renderiza el contenedor principal con espacio para label y zona de upload.
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
          className={`border-2 cursor-pointer border-dashed rounded-lg p-6 pb-2 text-center transition-colors ${isDragging
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
        // Aquí se renderiza la preview del archivo cuando hay uno.
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
            // Aquí se renderiza el botón para remover archivo.
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