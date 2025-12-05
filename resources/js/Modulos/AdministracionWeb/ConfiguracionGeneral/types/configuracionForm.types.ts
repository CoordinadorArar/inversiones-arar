/**
 * Tipos y validaciones para formularios de Configuración
 * 
 * Define estructuras de datos, límites y schemas Zod
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

import { z } from "zod";

/**
 * Límites de caracteres para campos de configuración
 */
export const CONFIG_LIMITS = {
  email: 255,
  telefono: 15,
  ubicacion: 255,
  ubicacion_detalles: 255,
  ubicacion_url: 500,
  red_social_url: 500,
} as const;

/**
 * FormData para Información Corporativa
 */
export interface InformacionCorporativaFormData {
  email: string;
  telefono: string;
  ubicacion: string;
  ubicacion_detalles: string;
  ubicacion_url: string;
  logo: File | null;
  icono: File | null;
}

/**
 * FormData para Redes Sociales
 */
export interface RedesSocialesFormData {
  instagram: string;
  facebook: string;
  x: string;
  linkedin: string;
}

/**
 * Schema de validación para Información Corporativa
 */
export const informacionCorporativaSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Ingrese un correo electrónico válido")
    .max(CONFIG_LIMITS.email, `Máximo ${CONFIG_LIMITS.email} caracteres`)
    .optional()
    .or(z.literal("")),

  telefono: z
    .string()
    .trim()
    .max(CONFIG_LIMITS.telefono, `Máximo ${CONFIG_LIMITS.telefono} caracteres`)
    .regex(
      /^[0-9+\s]*$/,
      "Solo números, espacios y el símbolo +"
    )
    .optional()
    .or(z.literal("")),

  ubicacion: z
    .string()
    .trim()
    .max(CONFIG_LIMITS.ubicacion, `Máximo ${CONFIG_LIMITS.ubicacion} caracteres`)
    .optional()
    .or(z.literal("")),

  ubicacion_detalles: z
    .string()
    .trim()
    .max(
      CONFIG_LIMITS.ubicacion_detalles,
      `Máximo ${CONFIG_LIMITS.ubicacion_detalles} caracteres`
    )
    .optional()
    .or(z.literal("")),

  ubicacion_url: z
    .string()
    .trim()
    .max(CONFIG_LIMITS.ubicacion_url, `Máximo ${CONFIG_LIMITS.ubicacion_url} caracteres`)
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Debe ser una URL válida (ej: https://maps.app.goo.gl/...)"
    )
    .optional()
    .or(z.literal("")),
});

/**
 * Schema de validación para Redes Sociales
 */
export const redesSocialesSchema = z.object({
  instagram: z
    .string()
    .trim()
    .max(CONFIG_LIMITS.red_social_url, `Máximo ${CONFIG_LIMITS.red_social_url} caracteres`)
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Debe ser una URL válida (ej: https://www.instagram.com/...)"
    )
    .optional()
    .or(z.literal("")),

  facebook: z
    .string()
    .trim()
    .max(CONFIG_LIMITS.red_social_url, `Máximo ${CONFIG_LIMITS.red_social_url} caracteres`)
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Debe ser una URL válida (ej: https://www.facebook.com/...)"
    )
    .optional()
    .or(z.literal("")),

  x: z
    .string()
    .trim()
    .max(CONFIG_LIMITS.red_social_url, `Máximo ${CONFIG_LIMITS.red_social_url} caracteres`)
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Debe ser una URL válida (ej: https://x.com/...)"
    )
    .optional()
    .or(z.literal("")),

  linkedin: z
    .string()
    .trim()
    .max(CONFIG_LIMITS.red_social_url, `Máximo ${CONFIG_LIMITS.red_social_url} caracteres`)
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Debe ser una URL válida (ej: https://linkedin.com/company/...)"
    )
    .optional()
    .or(z.literal("")),
});

/**
 * Tipos inferidos de los schemas
 */
export type InformacionCorporativaSchemaType = z.infer<typeof informacionCorporativaSchema>;
export type RedesSocialesSchemaType = z.infer<typeof redesSocialesSchema>;