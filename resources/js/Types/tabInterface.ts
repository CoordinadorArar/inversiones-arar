/**
 * Interface EmpresaInterface.
 * 
 * Define la estructura de una empresa en el frontend.
 * Usada para tipar props, columnas de tabla y respuestas del backend.
 * Incluye campos de DB con tipos TypeScript.
 */
export interface TabInterface {
    id: number;  // ID único.
    nombre: string; // Nombre de la pestaña
    ruta: string;  // Ruta de la pestaña    
}

