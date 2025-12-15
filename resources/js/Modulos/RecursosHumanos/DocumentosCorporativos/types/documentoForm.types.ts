import { z } from "zod";

export const DOCUMENTO_LIMITS = {
  nombre: 50,
  icono: 50,
};

export interface DocumentoFormData {
  nombre: string;
  icono: string;
  archivo: File | null;
  archivo_preview: string | null;
  mostrar_en_dashboard: boolean;
  mostrar_en_footer: boolean;
}

export const DOCUMENTO_INITIAL_DATA: DocumentoFormData = {
  nombre: "",
  icono: "",
  archivo: null,
  archivo_preview: null,
  mostrar_en_dashboard: false,
  mostrar_en_footer: false,
};

export const createDocumentoSchema = (data: DocumentoFormData, mode: "create" | "edit") => {
  const baseSchema = {
    nombre: z
      .string()
      .min(1, "El nombre es obligatorio")
      .max(DOCUMENTO_LIMITS.nombre, `Máximo ${DOCUMENTO_LIMITS.nombre} caracteres`),
    mostrar_en_dashboard: z.boolean(),
    mostrar_en_footer: z.boolean(),
  };

  // Ícono obligatorio si algún switch está activo
  if (data.mostrar_en_footer) {
    baseSchema['icono'] = z
      .string()
      .min(1, "El ícono es obligatorio cuando se muestra en el footer")
      .max(DOCUMENTO_LIMITS.icono, `Máximo ${DOCUMENTO_LIMITS.icono} caracteres`);
  } else {
    baseSchema['icono'] = z.string();
  }

  // Archivo obligatorio en creación
  if (mode === "create") {
    baseSchema['archivo'] = z
      .instanceof(File, { message: "El archivo es obligatorio" })
      .refine((file) => file.size <= 10 * 1024 * 1024, "El archivo no debe superar 10MB")
      .refine(
        (file) => ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type),
        "El archivo debe ser PDF, DOC o DOCX"
      );
  }

  return z.object(baseSchema);
};

export const SWITCH_DESCRIPTIONS = {
  mostrar_en_dashboard: {
    label: "Mostrar en Dashboard",
    description: "El documento aparecerá en el dashboard de los empleados para acceso rápido",
    requiredFields: [],
  },
  mostrar_en_footer: {
    label: "Mostrar en Footer",
    description: "El documento aparecerá en la sección Legal del footer de la página pública",
    requiredFields: ["icono"],
  },
} as const;