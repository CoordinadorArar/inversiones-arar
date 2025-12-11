import { z } from "zod";

export const MODULO_LIMITS = {
  nombre: 50,
  icono: 50,
  ruta: 255,
};

export interface ModuloFormData {
  nombre: string;
  icono: string;
  ruta: string;
  es_padre: boolean;
  modulo_padre_id: number | null;
  permisos_extra: string;
}

export const MODULO_INITIAL_DATA: ModuloFormData = {
  nombre: "",
  icono: "",
  ruta: "",
  es_padre: false,
  modulo_padre_id: null,
  permisos_extra: "",
};

export const moduloSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(MODULO_LIMITS.nombre, `Máximo ${MODULO_LIMITS.nombre} caracteres`),
  icono: z
    .string()
    .min(1, "El ícono es obligatorio")
    .max(MODULO_LIMITS.icono, `Máximo ${MODULO_LIMITS.icono} caracteres`),
  ruta: z
    .string()
    .min(1, "La ruta es obligatoria")
    .max(MODULO_LIMITS.ruta, `Máximo ${MODULO_LIMITS.ruta} caracteres`)
    .regex(/^\/[a-z0-9\-/]*$/, "La ruta debe empezar con / y solo contener letras minúsculas, números y guiones"),
  es_padre: z.boolean(),
  modulo_padre_id: z.number().nullable(),
  permisos_extra: z.string(),
});