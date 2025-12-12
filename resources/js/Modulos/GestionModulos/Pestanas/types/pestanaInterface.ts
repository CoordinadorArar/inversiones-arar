export interface PestanaInterface {
  id: number;
  nombre: string;
  ruta: string;
  ruta_completa: string;
  jerarquia: string;
  modulo_id: number;
  modulo_nombre: string | null;
  modulo_ruta?: string;
  modulo_ruta_completa?: string;
  modulo_eliminado: boolean;
  permisos_extra: string[];
}

export interface ModuloDisponibleInterface {
  id: number;
  nombre: string;
  ruta: string;
  ruta_completa: string;
  padre_eliminado: boolean;
}