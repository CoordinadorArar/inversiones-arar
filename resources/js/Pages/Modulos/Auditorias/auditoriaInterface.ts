/**
 * Interface AuditoriaInterface.
 * 
 * Define la estructura de una auditoría en el frontend.
 * Incluye usuario con detalles si existe.
 */
export interface AuditoriaInterface {
  id: number;
  tabla_afectada: string;
  id_registro_afectado: string;
  accion: string | null;
  usuario: {
    id: number;
    name: string;
    lastname: string;
    email: string;
    rol: string;
    cargo: string;
  } | null;  // Null si no hay usuario.
  usuario_nombre?: string
  fecha: string;
  cambios: Array<{
    columna: string;
    antes: any;
    despues: any;
  }> | null;
}