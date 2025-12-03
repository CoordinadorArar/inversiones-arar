<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Seeder para la tabla 'roles'.
 * 
 * Propósito: Poblar roles iniciales (SuperAdmin, Estandar) para el sistema.
 * Usado para setup inicial de roles en la aplicación.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-21
 */

class RolSeeder extends Seeder
{
    /**
     * BLOQUE: run - Insertar roles iniciales.
     * 
     * Datos: Array con roles básicos y abreviaturas.
     * Usa firstOrCreate para evitar duplicados (si ya existe por nombre, no inserta).
     * 
     * Propósito: Proporcionar roles fijos para asignar permisos a usuarios.
     * 
     * @return void
     */
    public function run(): void
    {
        $roles = [
            ['nombre' => 'SuperAdmin', 'abreviatura' => 'SA'],  // Rol de super administrador.
            ['nombre' => 'Estandar', 'abreviatura' => 'E'],     // Rol estándar para usuarios normales.
        ];

        foreach ($roles as $rol) {
            Rol::firstOrCreate(['nombre' => $rol['nombre']], $rol);  // Inserta si no existe.
        }
    }
}