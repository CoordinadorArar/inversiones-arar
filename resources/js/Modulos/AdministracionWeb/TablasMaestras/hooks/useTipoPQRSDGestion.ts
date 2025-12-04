/**
 * Hook useTipoPQRSDGestion.
 * 
 * Hook específico para gestionar tipos de identificación.
 * Llama al hook genérico useTipoGestion con ruta base y configuración específicas.
 * Exporta la interfaz y rutas para uso en otros lugares si es necesario.
 * 
 * @author Yariangel Aray
 * @date 2025-12-04
 */
import { useTipoGestion } from "./useTipoGestion";
import { TipoInterface } from "../types/tipoInterface";

/**
 * Interfaz para las props del hook useTipoPQRSDGestion.
 * Define los datos iniciales y permisos necesarios.
 * 
 * @typedef {Object} UseTipoPQRSDGestionProps
 * @property {TipoInterface[]} tiposIniciales - Lista inicial de tipos.
 * @property {string[]} permisos - Lista de permisos del usuario.
 */
interface UseTipoPQRSDGestionProps {
  tiposIniciales: TipoInterface[];
  permisos: string[];
}

/**
 * Hook personalizado para gestionar tipos de identificación.
 * Usa el hook genérico con rutas específicas.
 */
export function useTipoPQRSDGestion({ tiposIniciales, permisos }: UseTipoPQRSDGestionProps) {
  return useTipoGestion({
    tiposIniciales,
    permisos,
    rutaBase: 'tipo-pqrsd',
  });
}