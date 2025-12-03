<?php

namespace Database\Seeders;

use App\Models\TipoIdentificacion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Seeder para la tabla 'tipos_identificaciones'.
 * 
 * Propósito: Poblar tipos de identificación iniciales (ej. CC, Pasaporte).
 * Usado para validar documentos en formularios de PQRs.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

class TiposIdentificacionesSeeder extends Seeder
{
    /**
     * BLOQUE: run - Insertar tipos de identificación.
     * 
     * Datos: Array con tipos comunes en Colombia (CC, PA, CE) y abreviaturas.
     * Usa firstOrCreate para evitar duplicados (si ya existe por nombre, no inserta).
     * 
     * Propósito: Proporcionar opciones para el campo tipo_identificacion_id en PQRs.
     * 
     * @return void
     */
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'Cédula de Ciudadanía', 'abreviatura' => 'CC'],
            ['nombre' => 'Pasaporte', 'abreviatura' => 'PA'],
            ['nombre' => 'Cédula de Extranjería', 'abreviatura' => 'CE'],
        ];

        foreach ($tipos as $tipo) {
            TipoIdentificacion::firstOrCreate(['nombre' => $tipo['nombre']], $tipo);
        }
    }
}