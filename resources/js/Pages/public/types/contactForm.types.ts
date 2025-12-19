/**
 * Tipos y validaciones para el formulario de Contacto
 * 
 * Define la estructura de datos, límites de caracteres y schema Zod
 * para el formulario de contacto público.
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { z } from "zod";

/**
 * Interface ContactFormData
 * Estructura completa de datos del formulario de contacto.
 * 
 * Cada propiedad corresponde a un campo del form, con tipos específicos.
 * Se usa para tipar el estado y asegurar consistencia en TypeScript.
 */
export interface ContactFormData {
    subject: string;        // Asunto del mensaje (obligatorio, string).
    name: string;           // Nombre completo del remitente (obligatorio, string).
    company: string;        // Empresa del remitente (opcional, string).
    email: string;          // Correo electrónico (obligatorio, string válido como email).
    phone: string;          // Teléfono (obligatorio, string numérico).
    message: string;        // Mensaje del contacto (obligatorio, string).
    acceptsPolicy: boolean; // Checkbox para aceptar política (obligatorio true).
}

/**
 * Límites de caracteres para cada campo del formulario.
 * 
 * Se usa en validaciones de Zod y maxLength de inputs.
 * 'as const' asegura que sea tratado como literal, no como tipo amplio.
 */
export const CONTACT_LIMITS = {
    subject: 50,
    name: 30,
    company: 100,
    email: 50,
    phone: 15,
    message: 500,
} as const;

/**
 * Valores iniciales del formulario.
 * Se usa para resetear el form tras envío exitoso.
 */
export const CONTACT_INITIAL_DATA: ContactFormData = {
    subject: "",       // Asunto vacío.
    name: "",          // Nombre vacío.
    company: "",       // Empresa vacía (opcional).
    email: "",         // Email vacío.
    phone: "",         // Teléfono vacío.
    message: "",       // Mensaje vacío.
    acceptsPolicy: false,  // Checkbox en false.
};

/**
 * Schema de validación con Zod.
 * 
 * Define reglas para cada campo: obligatorios, formatos, longitudes, regex.
 * Cada campo tiene mensajes de error personalizados en español.
 * 
 * Validaciones específicas:
 * - subject: Solo letras y espacios, max 50 chars
 * - name: Solo letras y espacios, max 30 chars
 * - company: Opcional, max 100 chars
 * - email: Formato email válido, max 50 chars
 * - phone: Solo números con + opcional, min 7 max 15
 * - message: Min 10 max 500 chars
 * - acceptsPolicy: Debe ser true para enviar
 */
export const contactSchema = z.object({
    // Campo subject: Obligatorio, solo letras/espacios, max 50 chars.
    subject: z.string()
        .trim()  // Elimina espacios al inicio/fin.
        .min(1, "Este campo es obligatorio")  // Debe tener al menos 1 char.
        .max(CONTACT_LIMITS.subject, `El asunto debe tener máximo ${CONTACT_LIMITS.subject} caracteres`)
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras"),  // Regex para letras y espacios.

    // Campo name: Similar a subject, obligatorio, solo letras.
    name: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .max(CONTACT_LIMITS.name, `El nombre debe tener máximo ${CONTACT_LIMITS.name} caracteres`)
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras"),

    // Campo company: Opcional, max 100 chars, permite vacío.
    company: z.string()
        .trim()
        .max(CONTACT_LIMITS.company, `La empresa debe tener máximo ${CONTACT_LIMITS.company} caracteres`)
        .optional()  // No obligatorio.
        .or(z.literal('')),  // Permite string vacío.

    // Campo email: Obligatorio, formato email válido, max 50.
    email: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .email("Ingrese un correo electrónico válido")  // Valida formato email.
        .max(CONTACT_LIMITS.email, `El correo debe tener máximo ${CONTACT_LIMITS.email} caracteres`),

    // Campo phone: Obligatorio, solo números, min 7 max 15, permite + al inicio.
    phone: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .regex(/^\+?[0-9]+$/, "Ingrese un número de teléfono válido")  // Solo dígitos, opcional +.
        .min(7, "El teléfono debe tener al menos 7 dígitos")  // Mínimo lógico.
        .max(CONTACT_LIMITS.phone, `El teléfono debe tener máximo ${CONTACT_LIMITS.phone} caracteres`),

    // Campo message: Obligatorio, min 10 max 500 chars.
    message: z.string()
        .trim()
        .min(1, "Este campo es obligatorio")
        .min(10, "El mensaje debe tener al menos 10 caracteres")  // Mínimo para mensaje útil.
        .max(CONTACT_LIMITS.message, `El mensaje debe tener máximo ${CONTACT_LIMITS.message} caracteres`),

    // Campo acceptsPolicy: Booleano, debe ser true para pasar.
    acceptsPolicy: z.boolean()
        .refine(val => val === true, "Debes aceptar la política de privacidad"),  // Refine para mensaje custom.
});

/**
 * Tipo inferido del schema para type safety
 */
export type ContactSchemaType = z.infer<typeof contactSchema>;