/**
 * Tipos y validaciones para el formulario de documentos corporativos.
 * 
 * Define límites de caracteres, interfaz de datos del formulario, datos iniciales, esquema de validación con Zod
 * y descripciones para switches de visibilidad. Incluye validaciones condicionales basadas en switches y modo.
 * Usa Zod para validaciones robustas y constantes para configuraciones reutilizables.
 * Se integra con React para gestión de formularios de documentos via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */

import { z } from "zod";

/**
 * Límites de caracteres para campos del formulario de documentos.
 * Usados en validaciones y UI (ej: maxLength en inputs).
 */
export const DOCUMENTO_LIMITS = {
  nombre: 50,
  icono: 50,
};

/**
 * Interfaz para los datos del formulario de documentos.
 * Define la estructura de los campos requeridos para crear/editar documentos.
 */
export interface DocumentoFormData {
  nombre: string; // Nombre del documento.
  icono: string; // Ícono del documento (opcional, pero requerido si se muestra en footer).
  archivo: File | null; // Archivo subido (requerido en creación).
  archivo_preview: string | null; // URL de preview del archivo existente.
  mostrar_en_dashboard: boolean; // Si mostrar en dashboard.
  mostrar_en_footer: boolean; // Si mostrar en footer.
}

/**
 * Datos iniciales por defecto para el formulario de documentos.
 * Usados para inicializar el estado en modo create o reset.
 */
export const DOCUMENTO_INITIAL_DATA: DocumentoFormData = {
  nombre: "",
  icono: "",
  archivo: null,
  archivo_preview: null,
  mostrar_en_dashboard: false,
  mostrar_en_footer: false,
};

/**
 * Función para crear el esquema de validación con Zod para el formulario de documentos.
 * Incluye validaciones básicas (min, max), condicionales basadas en switches y modo,
 * y validaciones de archivo (tipo, tamaño). Mejora la UX al validar datos antes de submit.
 * 
 * @param {DocumentoFormData} data - Datos del formulario para validaciones condicionales.
 * @param {"create" | "edit"} mode - Modo del formulario (crear o editar).
 * @returns {z.ZodObject} Esquema de validación de Zod.
 */
export const createDocumentoSchema = (data: DocumentoFormData, mode: "create" | "edit") => {
  // Aquí se define el esquema base con validaciones comunes para todos los campos.
  const baseSchema = {
    nombre: z
      .string()
      .min(1, "El nombre es obligatorio")
      .max(DOCUMENTO_LIMITS.nombre, `Máximo ${DOCUMENTO_LIMITS.nombre} caracteres`),
    mostrar_en_dashboard: z.boolean(),
    mostrar_en_footer: z.boolean(),
  };

  // Aquí se valida el ícono condicionalmente si mostrar_en_footer está activo.
  if (data.mostrar_en_footer) {
    baseSchema['icono'] = z
      .string()
      .min(1, "El ícono es obligatorio cuando se muestra en el footer")
      .max(DOCUMENTO_LIMITS.icono, `Máximo ${DOCUMENTO_LIMITS.icono} caracteres`);
  } else {
    baseSchema['icono'] = z.string();
  }

  // Aquí se valida el archivo obligatoriamente en modo create, con refinamientos de tamaño y tipo.
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

/**
 * Descripciones para los switches de visibilidad en el formulario de documentos.
 * Usadas en el componente DocumentoSwitches para mostrar labels, descripciones y campos requeridos.
 */
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