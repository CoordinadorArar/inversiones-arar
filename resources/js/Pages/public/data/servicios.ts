/**
 * Data: Lista de servicios ofrecidos por la empresa.
 * 
 * Propósito: Centralizar los datos de servicios para facilitar mantenimiento.
 * Usado en la página de Portafolio en la sección de servicios.
 * 
 * Estructura:
 * - nombre: Nombre del servicio
 * - icono: Componente de icono de lucide-react
 * - descripcion: Descripción detallada del servicio
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import {
  Shield,
  Server,
  Calculator,
  Users,
  Heart,
  Scale,
  LucideIcon
} from "lucide-react";

export interface Servicio {
  nombre: string;
  icono: LucideIcon;
  descripcion: string;
}

export const servicios: Servicio[] = [
  {
    nombre: "Control Interno",
    icono: Shield,
    descripcion: "Gestión integral de riesgos y controles para garantizar la eficiencia operativa y el cumplimiento normativo."
  },
  {
    nombre: "Infraestructura y Tecnología",
    icono: Server,
    descripcion: "Soluciones tecnológicas innovadoras y gestión de infraestructura para optimizar procesos empresariales."
  },
  {
    nombre: "Contabilidad",
    icono: Calculator,
    descripcion: "Servicios contables especializados con enfoque en precisión, transparencia y cumplimiento fiscal."
  },
  {
    nombre: "Gestión Humana",
    icono: Users,
    descripcion: "Administración estratégica del talento humano, desarrollo organizacional y bienestar laboral."
  },
  {
    nombre: "SGSST",
    icono: Heart,
    descripcion: "Sistema de Gestión de Seguridad y Salud en el Trabajo para ambientes laborales seguros y saludables."
  },
  {
    nombre: "Jurídico",
    icono: Scale,
    descripcion: "Asesoría legal integral, gestión de contratos y representación jurídica corporativa."
  }
];