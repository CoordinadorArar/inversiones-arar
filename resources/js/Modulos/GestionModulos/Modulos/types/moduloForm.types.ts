/**
 * Tipos y validaciones para el formulario de módulos.
 * 
 * Define límites, interfaz de datos, datos iniciales y schema de validación con Zod.
 * Incluye regex para campos específicos para mayor precisión en validaciones.
 * Se integra con React para formularios de módulos via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-12-11
 */

import { z } from "zod";

/**
 * Límites de caracteres para campos del formulario de módulos.
 * Usados en validaciones y UI (ej: maxLength en inputs).
 */
export const MODULO_LIMITS = {
  nombre: 50,
  icono: 50,
  ruta: 255,
};

/**
 * Interfaz para los datos del formulario de módulos.
 * Define la estructura de los campos requeridos.
 */
export interface ModuloFormData {
  nombre: string; // Nombre del módulo.
  icono: string; // Ícono del módulo (en kebab-case).
  ruta: string; // Ruta del módulo.
  es_padre: boolean; // Indica si es módulo padre.
  modulo_padre_id: number | null; // ID del módulo padre (opcional).
  permisos_extra: string; // Permisos extra separados por comas.
}

/**
 * Datos iniciales por defecto para el formulario de módulos.
 * Usados para inicializar el estado en modo create o reset.
 */
export const MODULO_INITIAL_DATA: ModuloFormData = {
  nombre: "",
  icono: "",
  ruta: "",
  es_padre: false,
  modulo_padre_id: null,
  permisos_extra: "",
};

/**
 * Schema de validación con Zod para el formulario de módulos.
 * Incluye validaciones básicas (min, max) y regex para patrones específicos.
 * Mejora la UX al validar datos antes de submit.
 */
export const moduloSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(MODULO_LIMITS.nombre, `Máximo ${MODULO_LIMITS.nombre} caracteres`)
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "El nombre solo puede contener letras y espacios"),
  icono: z
    .string()
    .min(1, "El ícono es obligatorio")
    .max(MODULO_LIMITS.icono, `Máximo ${MODULO_LIMITS.icono} caracteres`)
    .regex(/^[a-zA-Z0-9\-]+$/, "El ícono solo puede contener letras, números y guiones"),
  ruta: z
    .string()
    .min(1, "La ruta es obligatoria")
    .max(MODULO_LIMITS.ruta, `Máximo ${MODULO_LIMITS.ruta} caracteres`)
    .regex(/^\/[a-z0-9\-/]*$/, "La ruta debe empezar con / y solo contener letras minúsculas, números y guiones"),
  es_padre: z.boolean(),
  modulo_padre_id: z.number().nullable(),
  permisos_extra: z
    .string()
    .regex(/^[a-z_,]*$/, "Los permisos extra solo pueden contener letras minúsculas, guiones bajos y comas"),
});
