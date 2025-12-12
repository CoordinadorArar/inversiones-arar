import { z } from "zod";

export const PESTANA_LIMITS = {
  nombre: 50,
  ruta: 255,
};

export interface PestanaFormData {
  nombre: string;
  ruta: string;
  modulo_id: number | null;
  permisos_extra: string;
}

export const PESTANA_INITIAL_DATA: PestanaFormData = {
  nombre: "",
  ruta: "",
  modulo_id: null,
  permisos_extra: "",
};

export const pestanaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(PESTANA_LIMITS.nombre, `Máximo ${PESTANA_LIMITS.nombre} caracteres`),
  ruta: z
    .string()
    .min(1, "La ruta es obligatoria")
    .max(PESTANA_LIMITS.ruta, `Máximo ${PESTANA_LIMITS.ruta} caracteres`)
    .regex(/^\/[a-z0-9\-/]*$/, "La ruta debe empezar con / y solo contener letras minúsculas, números y guiones"),
  modulo_id: z.number({
    error: "El módulo es obligatorio",
  }).positive("Debe seleccionar un módulo válido"),

  permisos_extra: z.string(),
});