/**
 * Hook useEstadoPQRSGestion.
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
 * Interfaz para las props del hook useEstadoPQRSGestion.
 * Define los datos iniciales y permisos necesarios.
 * 
 * @typedef {Object} UseEstadoPQRSGestionProps
 * @property {TipoInterface[]} estadosIniciales - Lista inicial de tipos.
 * @property {string[]} permisos - Lista de permisos del usuario.
 */
interface UseEstadoPQRSGestionProps {
  estadosIniciales: TipoInterface[];
  permisos: string[];
}

/**
 * Hook personalizado para gestionar tipos de identificación.
 * Usa el hook genérico con rutas específicas.
 */
export function useEstadoPQRSGestion({ estadosIniciales:tiposIniciales, permisos }: UseEstadoPQRSGestionProps) {
  return useTipoGestion({
    tiposIniciales,
    permisos,
    rutaBase: 'estado-pqrsd',
  });
}