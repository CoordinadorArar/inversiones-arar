<?php

namespace Database\Seeders;

use App\Models\PQRSD\TipoPqrs;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Seeder para la tabla 'tipos_pqrs'.
 * 
 * Propósito: Poblar tipos de PQRs iniciales (Petición, Queja, etc.).
 * Usado para categorizar PQRs en el formulario y sistema.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-18
 */

class TiposPqrsSeeder extends Seeder
{
    /**
     * BLOQUE: run - Insertar tipos PQRs.
     * 
     * Datos: Array con tipos estándar de PQRs y abreviaturas.
     * Usa firstOrCreate para evitar duplicados (si ya existe por nombre, no inserta).
     * 
     * Propósito: Proporcionar opciones para el campo tipo_pqrs_id en PQRs.
     * 
     * @return void
     */
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'Petición', 'abreviatura' => 'P'],
            ['nombre' => 'Queja', 'abreviatura' => 'Q'],
            ['nombre' => 'Reclamo', 'abreviatura' => 'R'],
            ['nombre' => 'Sugerencia', 'abreviatura' => 'S'],
            ['nombre' => 'Denuncia', 'abreviatura' => 'D'],
        ];

        foreach ($tipos as $tipo) {
            TipoPqrs::firstOrCreate(['nombre' => $tipo['nombre']], $tipo);
        }
    }
}