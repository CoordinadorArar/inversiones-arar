/**
 * Interface EmpresaInterface.
 * 
 * Define la estructura de una empresa en el frontend.
 * Usada para tipar props, columnas de tabla y respuestas del backend.
 * Incluye campos de DB con tipos TypeScript.
 */
export interface EmpresaInterface {
  id: number;  // ID único.
  id_siesa: string | null;  // ID de Siesa (nullable).
  razon_social: string;  // Nombre legal.
  siglas: string | null;  // Abreviatura (nullable).
  tipo_empresa: string | null;  // Categoría (nullable).
  descripcion: string | null;  // Descripción (nullable).
  dominio: string | null;  // Dominio para correos (nullable).
  sitio_web: string | null;  // URL del sitio (nullable).
  logo_url: string | null;  // Ruta al logo (nullable).
  mostrar_en_header: boolean;  // Flag para header.
  mostrar_en_empresas: boolean;  // Flag para página empresas.
  mostrar_en_portafolio: boolean;  // Flag para portafolio.
  permitir_pqrsd: boolean;  // Flag para PQRsD.
}

