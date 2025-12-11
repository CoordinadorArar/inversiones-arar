export interface ModuloInterface {
  id: number;
  nombre: string;
  icono: string;
  ruta: string;
  ruta_completa: string;
  es_padre: boolean;
  modulo_padre_id: number | null;
  modulo_padre_nombre: string | null;
  modulo_padre_ruta: string | null;
  padre_eliminado: boolean
  permisos_extra: string[];
  cant_hijos: number;
}

export interface ModuloPadreInterface {
  id: number;
  nombre: string;
  ruta: string;
}