/**
 * Interfaces para las configuraciones del sistema
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

export interface ConfiguracionContacto {
  email?: string;
  telefono?: string;
  ubicacion?: string;
  "ubicacion.detalles"?: string;
  "ubicacion.url"?: string;
}

export interface ConfiguracionImages {
  logo?: string;
  icono?: string;
}

export interface ConfiguracionRRSS {
  instagram?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
}