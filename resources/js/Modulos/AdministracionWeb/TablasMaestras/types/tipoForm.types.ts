import { z } from "zod";

export const TIPO_LIMITS = {
    nombre: 50,
    abreviatura: 10,
};

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

export type TipoFormData = z.infer<typeof tipoSchema>;