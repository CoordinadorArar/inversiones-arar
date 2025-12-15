export interface DocumentoCorporativoInterface {
  id: number;
  nombre: string;
  icono: string | null;
  ruta: string;
  ruta_url: string;
  mostrar_en_dashboard: boolean;
  mostrar_en_footer: boolean;
}