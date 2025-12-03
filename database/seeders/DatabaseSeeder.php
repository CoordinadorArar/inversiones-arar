<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Seeder principal de la base de datos.
 * 
 * Propósito: Ejecutar otros seeders para poblar la DB con datos iniciales.
 * Llamado desde artisan (php artisan db:seed) para setup inicial.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

class DatabaseSeeder extends Seeder
{
    /**
     * BLOQUE: run - Ejecutar seeders.
     * 
     * Llama a seeders específicos para poblar tablas auxiliares de PQRs.
     * Orden: Tipos PQRs, Tipos Identificaciones, Estados PQRs.
     * 
     * Propósito: Asegurar que las tablas de referencia tengan datos antes de PQRs.
     * 
     * @return void
     */
    public function run(): void
    {
        $this->call(TiposPqrsSeeder::class);
        $this->call(TiposIdentificacionesSeeder::class);
        $this->call(EstadoPqrsSeeder::class);
        $this->call(RolSeeder::class);
        $this->call(EmpresaWebSeeder::class);

        $this->call(ModuloSeeder::class);
        $this->call(PestanaSeeder::class);
                
        $this->call(ConfiguracionSeeder::class);

        $this->call(ModuloRolSeeder::class);
        $this->call(PestanaRolSeeder::class);
    }
}