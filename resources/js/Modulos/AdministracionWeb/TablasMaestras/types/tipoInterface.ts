/**
 * Interfaz para formularios y tablas genéricas en el módulo de Tablas Maestras.
 * 
 * @author Yariangel Aray
 * @date 2025-12-03
 */

// Interfaz base para cualquier "tipo" maestro
export interface TipoInterface {
    id: number;
    nombre: string;
    abreviatura: string;
}