/**
 * Interfaces para usuarios del sistema
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

import { TabInterface } from "@/Types/tabInterface";

export interface UsuarioInterface {
  id: number;
  nombre_completo: string;
  numero_documento: string;
  email: string;
  rol_id: number;
  rol?: {
    id: number;
    nombre: string;
  };
  bloqueado_at: string | null;
}

export interface RolInterface {
  id: number;
  nombre: string;
  abreviatura?: string;
}

export interface UsuarioListadoProps {
  tabs: TabInterface[];
  usuarios: UsuarioInterface[];
  roles: RolInterface[];
  moduloNombre: string;
  permisos: string[];
}

export interface UsuarioGestionProps {
  tabs: TabInterface[];
  usuarios: UsuarioInterface[];
  roles: RolInterface[];
  moduloNombre: string;
  permisos: string[];
}