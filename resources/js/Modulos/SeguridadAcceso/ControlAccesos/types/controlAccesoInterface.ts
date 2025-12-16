export interface RolSimpleInterface {
  id: number;
  nombre: string;
}

export interface ModuloAsignacionInterface {
  id: number;
  nombre: string;
  icono: string;
  es_padre: boolean;
  permisos_extra: string[];
  tiene_pestanas: boolean;
  cant_pestanas: number;
  asignado: boolean;
  permisos_asignados: string[];
  hijos?: ModuloAsignacionInterface[];
}