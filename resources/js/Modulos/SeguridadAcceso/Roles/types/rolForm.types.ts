/**
 * Archivo de tipos y validaciones para roles usando Zod.
 * Define límites, esquema de validación y tipo inferido para formularios de roles.
 * 
 * @author Yariangel Aray
 * @date 2025-12-17
 */

import { z } from "zod";

/**
 * Límites de caracteres para campos del formulario de roles.
 * Usados en validaciones y UI (ej: contadores de caracteres).
 */
export const ROL_LIMITS = {
    nombre: 50, // Máximo 50 caracteres para nombre.
    abreviatura: 10, // Máximo 10 caracteres para abreviatura.
};

/**
 * Esquema de validación para roles usando Zod.
 * Valida nombre y abreviatura con regex, min/max y transformación a mayúsculas.
 */
export const rolSchema = z.object({
    nombre: z.string()
        .trim() // Aquí se remueven espacios al inicio y fin.
        .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo letras, números y espacios") // Aquí se valida caracteres permitidos.
        .min(1, "El nombre es obligatorio") // Aquí se requiere al menos 1 caracter.
        .max(ROL_LIMITS.nombre, `Máximo ${ROL_LIMITS.nombre} caracteres`), // Aquí se limita longitud máxima.

    abreviatura: z.string()
        .trim() // Aquí se remueven espacios al inicio y fin.
        .regex(/^[a-zA-Z]+$/, "Solo letras sin espacios") // Aquí se valida solo letras.
        .min(1, "La abreviatura es obligatoria") // Aquí se requiere al menos 1 caracter.
        .max(ROL_LIMITS.abreviatura, `Máximo ${ROL_LIMITS.abreviatura} caracteres`) // Aquí se limita longitud máxima.
        .transform(val => val.toUpperCase()), // Aquí se transforma a mayúsculas.
});

/**
 * Tipo inferido del esquema de roles.
 * Usado para type safety en formularios y hooks.
 */
export type RolFormData = z.infer<typeof rolSchema>;
