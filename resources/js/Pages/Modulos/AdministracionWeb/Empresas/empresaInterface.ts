/**
 * Interface que representa una empresa dentro del sistema.
 * Se usa para tipar correctamente la tabla, formularios y respuestas del backend.
 */
export interface EmpresaInterface {
  id: number
  id_siesa: string | null
  razon_social: string
  siglas: string | null
  tipo_empresa: string | null
  descripcion: string | null
  dominio: string | null
  sitio_web: string | null
  logo_url: string | null
  mostrar_en_header: boolean
  mostrar_en_empresas: boolean
  mostrar_en_portafolio: boolean
  permitir_pqrsd: boolean
}
