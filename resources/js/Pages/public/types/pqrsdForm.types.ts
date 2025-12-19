/**
 * Tipos y validaciones para el formulario de PQRSD
 * 
 * Define la estructura de datos, límites de caracteres y schemas Zod
 * para el formulario multi-paso de PQRS y Denuncias.
 * 
 * Características:
 * - Soporte para formulario multi-paso (4 pasos)
 * - Validaciones condicionales según tipo (anónimo/normal)
 * - Schemas separados por paso para validación incremental
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { z } from "zod";

/**
 * Interface PQRSDFormData
 * Estructura completa de datos del formulario de PQRSD.
 */
export interface PQRSDFormData {
    empresa: string;      // ID de la empresa seleccionada
    tipoPqrs: string;     // ID del tipo de PQR seleccionado
    esAnonimo: boolean;   // Indica si es una denuncia anónima
    nombre: string;       // Nombre del usuario
    apellido: string;     // Apellido del usuario
    tipoId: string;       // ID del tipo de identificación
    numId: string;        // Número de documento
    correo: string;       // Email de contacto
    telefono: string;     // Teléfono de contacto
    dpto: string;         // ID del departamento seleccionado
    ciudad: string;       // ID de la ciudad seleccionada
    direccion: string;    // Dirección opcional
    relacion: string;     // Relación con la empresa
    mensaje: string;      // Descripción de la PQRSD
}

/**
 * Límites de caracteres para cada campo del formulario.
 */
export const PQRSD_LIMITS = {
    nombre: 50,
    apellido: 50,
    correo: 50,
    numId: 15,
    telefono: 15,
    direccion: 100,
    mensaje: 2000,
} as const;

/**
 * Valores iniciales del formulario.
 */
export const PQRSD_INITIAL_DATA: PQRSDFormData = {
    empresa: "",
    tipoPqrs: "",
    esAnonimo: false,
    nombre: "",
    apellido: "",
    tipoId: "",
    numId: "",
    correo: "",
    telefono: "",
    dpto: "",
    ciudad: "",
    direccion: "",
    relacion: "",
    mensaje: "",
};

/**
 * Schema de validación - Paso 1: Información PQRSD
 * Valida empresa y tipo de PQRSD
 */
export const step1Schema = z.object({
    empresa: z.string().min(1, "Debe seleccionar una empresa"),
    tipoPqrs: z.string().min(1, "Debe seleccionar el tipo de PQRSD"),
});

/**
 * Schema de validación - Paso 2: Datos Personales
 * Valida nombre, apellido, tipo y número de identificación
 */
export const step2Schema = z.object({
    nombre: z.string()
        .trim()
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras")
        .min(1, "El nombre es obligatorio")
        .max(PQRSD_LIMITS.nombre, `Máximo ${PQRSD_LIMITS.nombre} caracteres`),
    apellido: z.string()
        .trim()
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras")
        .min(1, "El apellido es obligatorio")
        .max(PQRSD_LIMITS.apellido, `Máximo ${PQRSD_LIMITS.apellido} caracteres`),
    tipoId: z.string().min(1, "Debe seleccionar el tipo de identificación"),
    numId: z.string()
        .trim()
        .regex(/^[0-9]+$/, "Solo se permiten números")
        .min(1, "El número de documento es obligatorio")
        .max(PQRSD_LIMITS.numId, `Máximo ${PQRSD_LIMITS.numId} caracteres`),
});

/**
 * Schema de validación - Paso 3: Contacto y Ubicación
 * Valida correo, teléfono, departamento, ciudad y relación con empresa
 */
export const step3Schema = z.object({
    correo: z.string()
        .trim()
        .email("Ingrese un correo válido")
        .max(PQRSD_LIMITS.correo, `Máximo ${PQRSD_LIMITS.correo} caracteres`),
    telefono: z.string()
        .trim()
        .min(1, "El teléfono es obligatorio")
        .max(PQRSD_LIMITS.telefono, `Máximo ${PQRSD_LIMITS.telefono} caracteres`)
        .regex(/^\+?[0-9]+$/, "Ingrese un teléfono válido"),
    dpto: z.string().min(1, "Debe seleccionar un departamento"),
    ciudad: z.string().min(1, "Debe seleccionar una ciudad"),
    direccion: z.string()
        .max(PQRSD_LIMITS.direccion, `Máximo ${PQRSD_LIMITS.direccion} caracteres`)
        .optional(),
    relacion: z.string().min(1, "Debe especificar su relación con la empresa"),
});

/**
 * Schema de validación - Paso 4: Descripción
 * Valida el mensaje de la PQRSD
 */
export const step4Schema = z.object({
    mensaje: z.string()
        .trim()
        .min(20, "El mensaje debe tener al menos 20 caracteres")
        .max(PQRSD_LIMITS.mensaje, `Máximo ${PQRSD_LIMITS.mensaje} caracteres`),
});

/**
 * Configuración de pasos del formulario
 * Define los 4 pasos con su información visual
 */
export const FORM_STEPS_CONFIG = {
    normal: [
        { number: 1, title: "Información PQRSD", description: "Seleccione tipo y empresa" },
        { number: 2, title: "Datos Personales", description: "Complete su información personal" },
        { number: 3, title: "Contacto y Ubicación", description: "Datos de contacto y dirección" },
        { number: 4, title: "Descripción", description: "Describa su PQRS" },
    ],
    anonimo: [
        { number: 1, title: "Información PQRSD", description: "Seleccione tipo y empresa" },
        { number: 2, title: "Descripción", description: "Describa su denuncia" },
    ],
} as const;