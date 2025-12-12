/**
 * Tipos y validaciones para formularios de Usuarios
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

import { z } from "zod";

/**
 * Límites de caracteres
 */
export const USUARIO_LIMITS = {
  numero_documento: 20,
  email: 255,
} as const;

/**
 * FormData para Usuario
 */
export interface UsuarioFormData {
  numero_documento: string;
  nombre_completo: string;
  email: string;
  rol_id: number | null;
}

/**
 * Valores iniciales
 */
export const USUARIO_INITIAL_DATA: UsuarioFormData = {
  numero_documento: "",
  nombre_completo: "",
  email: "",
  rol_id: null,
};

/**
 * Schema de validación con Zod
 */
export const usuarioSchemaBase = z.object({
  numero_documento: z
    .string()
    .trim()
    .min(1, "El número de documento es obligatorio")
    .max(USUARIO_LIMITS.numero_documento, `Máximo ${USUARIO_LIMITS.numero_documento} caracteres`)
    .regex(/^[0-9]+$/, "Solo números"),

  nombre_completo: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),

  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .email("Email inválido")
    .max(USUARIO_LIMITS.email, `Máximo ${USUARIO_LIMITS.email} caracteres`),

  rol_id: z.number({
    error: "El rol es obligatorio",
  }).positive("Debe seleccionar un rol válido"),
});

export type UsuarioSchemaType = z.infer<typeof usuarioSchemaBase>;