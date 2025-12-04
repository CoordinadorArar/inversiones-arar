/**
 * Hook useTipoIdentificacionGestion.
 * 
 * Hook específico para gestionar tipos de identificación.
 * Llama al hook genérico useTipoGestion con ruta base y configuración específicas.
 * Exporta la interfaz y rutas para uso en otros lugares si es necesario.
 * 
 * @author Yariangel Aray
 * @date 2025-12-03
 */
import { useTipoGestion } from "./useTipoGestion";
import { TipoInterface } from "../types/tipoInterface";

/**
 * Interfaz para las props del hook useTipoIdentificacionGestion.
 * Define los datos iniciales y permisos necesarios.
 * 
 * @typedef {Object} UseTipoIdentificacionGestionProps
 * @property {TipoInterface[]} tiposIniciales - Lista inicial de tipos.
 * @property {string[]} permisos - Lista de permisos del usuario.
 */
interface UseTipoIdentificacionGestionProps {
  tiposIniciales: TipoInterface[];
  permisos: string[];
}

/**
 * Hook personalizado para gestionar tipos de identificación.
 * Usa el hook genérico con rutas específicas.
 */
export function useTipoIdentificacionGestion({ tiposIniciales, permisos }: UseTipoIdentificacionGestionProps) {
  return useTipoGestion({
    tiposIniciales,
    permisos,
    rutaBase: 'tipo-identificacion',
  });
}