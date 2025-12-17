/**
 * Interfaces para usuarios del sistema
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

export interface UsuarioInterface {
  id: number;
  nombres: string;
  apellidos: string;
  numero_documento: string;
  email: string;
  rol_id: number;
  rol?: {
    id: number;
    nombre: string;
  };
  bloqueado_at: string | null;
}