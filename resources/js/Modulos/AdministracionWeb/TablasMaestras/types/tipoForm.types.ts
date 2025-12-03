/**
 * Archivo de validaciones para tipos usando Zod.
 * Define límites de caracteres, esquema de validación y tipo inferido para formularios.
 * Se usa en el frontend para validar datos antes de enviar al backend.
 * 
 * @author Yariangel Aray
 * @date 2025-12-03
 */
import { z } from "zod";

/**
 * Constantes con límites de caracteres para campos de tipos.
 * Usadas en el esquema de validación para asegurar consistencia.
 */
export const TIPO_LIMITS = {
    nombre: 50,
    abreviatura: 10,
};

/**
 * Esquema de validación para datos de tipo usando Zod.
 * Valida nombre y abreviatura con reglas específicas (regex, longitud, transformación).
 * Se aplica en formularios para prevenir errores antes del envío.
 */
export const tipoSchema = z.object({
    nombre: z.string()
        .trim()
        .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo letras, números y espacios")
        .min(1, "El nombre es obligatorio")
        .max(TIPO_LIMITS.nombre, `Máximo ${TIPO_LIMITS.nombre} caracteres`),
    
    abreviatura: z.string()
        .trim()
        .regex(/^[a-zA-Z]+$/, "Solo letras sin espacios")
        .min(1, "La abreviatura es obligatoria")
        .max(TIPO_LIMITS.abreviatura, `Máximo ${TIPO_LIMITS.abreviatura} caracteres`)
        .transform(val => val.toUpperCase()),
});

/**
 * Tipo inferido del esquema tipoSchema.
 * Representa la estructura de datos válidos para el formulario de tipos.
 * Se usa para tipado en TypeScript.
 */
export type TipoFormData = z.infer<typeof tipoSchema>;
