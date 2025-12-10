export interface ModuloInterface {
  id: number;
  nombre: string;
  icono: string;
  ruta: string;
  es_padre: boolean;
  modulo_padre: {
    id: number;
    nombre: string;
  } | null;
  tiene_hijos: boolean;
  cantidad_hijos: number;
  fecha_creacion: string;
}