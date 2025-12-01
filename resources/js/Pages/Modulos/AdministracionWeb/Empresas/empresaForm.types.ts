/**
 * Tipos y validaciones para el formulario de Empresas
 * 
 * Define la estructura de datos, límites de caracteres y schema Zod
 * con validaciones condicionales según los switches activados.
 * 
 * @author Yariangel Aray
 * @date 2025-12-01
 */

import { z } from "zod";

/**
 * Interface EmpresaFormData
 * Estructura completa de datos del formulario de empresas
 */
export interface EmpresaFormData {
  id_siesa: string;
  razon_social: string;
  siglas: string;
  tipo_empresa: string;
  descripcion: string;
  sitio_web: string;
  dominio: string;
  logo: File | null;
  logo_preview: string | null; // URL para preview
  mostrar_en_header: boolean;
  mostrar_en_empresas: boolean;
  mostrar_en_portafolio: boolean;
  permitir_pqrsd: boolean;
}

/**
 * Límites de caracteres para cada campo
 */
export const EMPRESA_LIMITS = {
  id_siesa: 20,
  razon_social: 50,
  siglas: 10,
  tipo_empresa: 50,
  descripcion: 150,
  sitio_web: 100,
  dominio: 100,
} as const;

/**
 * Valores iniciales del formulario
 */
export const EMPRESA_INITIAL_DATA: EmpresaFormData = {
  id_siesa: "",
  razon_social: "",
  siglas: "",
  tipo_empresa: "",
  descripcion: "",
  sitio_web: "",
  dominio: "",
  logo: null,
  logo_preview: null,
  mostrar_en_header: false,
  mostrar_en_empresas: false,
  mostrar_en_portafolio: false,
  permitir_pqrsd: false,
};

/**
 * Schema de validación con Zod
 * 
 * Validaciones condicionales:
 * - mostrar_en_header: Requiere id_siesa
 * - mostrar_en_empresas: Requiere id_siesa, descripcion, sitio_web, tipo_empresa
 * - razon_social: Siempre obligatorio
 */
export const createEmpresaSchema = (data: EmpresaFormData) => {
  return z.object({
    // ID Siesa - Condicional según switches
    id_siesa: data.mostrar_en_header || data.mostrar_en_empresas
      ? z.string()
          .trim()
          .min(1, "El ID de Siesa es obligatorio cuando se activa 'Mostrar en Header' o 'Mostrar en Empresas'")
          .max(EMPRESA_LIMITS.id_siesa, `Máximo ${EMPRESA_LIMITS.id_siesa} caracteres`)
      : z.string()
          .max(EMPRESA_LIMITS.id_siesa, `Máximo ${EMPRESA_LIMITS.id_siesa} caracteres`)
          .optional()
          .or(z.literal("")),

    // Razón Social - SIEMPRE obligatorio
    razon_social: z.string()
      .trim()
      .min(1, "La razón social es obligatoria")
      .max(EMPRESA_LIMITS.razon_social, `Máximo ${EMPRESA_LIMITS.razon_social} caracteres`)
      .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s&.,()-]+$/, "Solo letras, números y caracteres especiales básicos"),

    // Siglas - Opcional
    siglas: z.string()
      .trim()
      .max(EMPRESA_LIMITS.siglas, `Máximo ${EMPRESA_LIMITS.siglas} caracteres`)
      .regex(/^[A-Z]*$/, "Solo letras mayúsculas sin espacios")
      .optional()
      .or(z.literal("")),

    // Tipo Empresa - Condicional
    tipo_empresa: data.mostrar_en_empresas
      ? z.string()
          .trim()
          .min(1, "El tipo de empresa es obligatorio cuando se activa 'Mostrar en Empresas'")
          .max(EMPRESA_LIMITS.tipo_empresa, `Máximo ${EMPRESA_LIMITS.tipo_empresa} caracteres`)
      : z.string()
          .max(EMPRESA_LIMITS.tipo_empresa, `Máximo ${EMPRESA_LIMITS.tipo_empresa} caracteres`)
          .optional()
          .or(z.literal("")),

    // Descripción - Condicional
    descripcion: data.mostrar_en_empresas
      ? z.string()
          .trim()
          .min(1, "La descripción es obligatoria cuando se activa 'Mostrar en Empresas'")
          .max(EMPRESA_LIMITS.descripcion, `Máximo ${EMPRESA_LIMITS.descripcion} caracteres`)
      : z.string()
          .max(EMPRESA_LIMITS.descripcion, `Máximo ${EMPRESA_LIMITS.descripcion} caracteres`)
          .optional()
          .or(z.literal("")),

    // Sitio Web - Condicional
    sitio_web: data.mostrar_en_empresas
      ? z.string()
          .trim()
          .min(1, "El sitio web es obligatorio cuando se activa 'Mostrar en Empresas'")
          .url("Ingrese una URL válida (ej: https://ejemplo.com)")
          .max(EMPRESA_LIMITS.sitio_web, `Máximo ${EMPRESA_LIMITS.sitio_web} caracteres`)
      : z.string()
          .trim()
          .max(EMPRESA_LIMITS.sitio_web, `Máximo ${EMPRESA_LIMITS.sitio_web} caracteres`)
          .refine(
            (val) => !val || /^https?:\/\/.+/.test(val),
            "Debe ser una URL válida si se proporciona"
          )
          .optional()
          .or(z.literal("")),

    // Dominio - Opcional
    dominio: z.string()
      .trim()
      .max(EMPRESA_LIMITS.dominio, `Máximo ${EMPRESA_LIMITS.dominio} caracteres`)
      .regex(/^[a-zA-Z0-9.-]*$/, "Solo letras, números, puntos y guiones")
      .optional()
      .or(z.literal("")),

    // Switches - Booleanos
    mostrar_en_header: z.boolean(),
    mostrar_en_empresas: z.boolean(),
    mostrar_en_portafolio: z.boolean(),
    permitir_pqrsd: z.boolean(),
  });
};

/**
 * Tipo inferido del schema
 */
export type EmpresaSchemaType = z.infer<ReturnType<typeof createEmpresaSchema>>;

/**
 * Descripciones de los switches para mostrar en la UI
 */
export const SWITCH_DESCRIPTIONS = {
  mostrar_en_header: {
    label: "Mostrar en Header",
    description: "Aparecerá en el dropdown de Gestión Humana del header público",
    requiredFields: ["id_siesa"],
  },
  mostrar_en_empresas: {
    label: "Mostrar en Página Empresas",
    description: "Se mostrará en la página pública de empresas del holding",
    requiredFields: ["id_siesa", "descripcion", "sitio_web", "tipo_empresa"],
  },
  mostrar_en_portafolio: {
    label: "Mostrar en Portafolio",
    description: "Aparecerá en el apartado de clientes del portafolio",
    requiredFields: [],
  },
  permitir_pqrsd: {
    label: "Permitir PQRSD",
    description: "Habilitará denuncias/reclamos dirigidos a esta empresa",
    requiredFields: [],
  },
} as const;