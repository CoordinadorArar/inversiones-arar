<?php

namespace Database\Seeders;

use App\Models\PQRSD\EstadoPqrs;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Seeder para la tabla 'estados_pqrs'.
 * 
 * Propósito: Poblar estados iniciales para PQRs (ej. Pendiente, Resuelto).
 * Usado para workflow de seguimiento en el sistema de PQRs.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

class EstadoPqrsSeeder extends Seeder
{
    /**
     * BLOQUE: run - Insertar estados PQRs.
     * 
     * Datos: Array con estados comunes (Pendiente, En Proceso, etc.) y abreviaturas.
     * Usa firstOrCreate para evitar duplicados (si ya existe por nombre, no inserta).
     * 
     * Propósito: Proporcionar opciones fijas para el estado de cada PQR.
     * 
     * @return void
     */
    public function run(): void
    {
        $estados = [
            ['nombre' => 'Pendiente', 'abreviatura' => 'P'],
            ['nombre' => 'En Proceso', 'abreviatura' => 'EP'],
            ['nombre' => 'Resuelto', 'abreviatura' => 'R'],
            ['nombre' => 'Cancelado', 'abreviatura' => 'C'],            
        ];

        foreach ($estados as $estado) {
            EstadoPqrs::firstOrCreate(['nombre' => $estado['nombre']], $estado);
        }
    }
}