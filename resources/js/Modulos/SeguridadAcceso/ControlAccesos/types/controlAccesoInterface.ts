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

export interface PestanaItemInterface {
  id: number;
  nombre: string;
  icono: string;
  permisos_extra: string[];
  asignado: boolean;
  permisos_asignados: string[];
}

export interface PestanaAsignacionInterface {
  id: number;
  nombre: string;
  icono: string;
  es_padre: boolean;
  hijos: PestanaModuloInterface[];
}

export interface PestanaModuloInterface {
  modulo_id: number;
  modulo_nombre: string;
  modulo_icono: string;
  pestanas: PestanaItemInterface[];
}