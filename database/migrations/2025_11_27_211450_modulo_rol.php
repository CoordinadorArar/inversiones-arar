<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para tabla pivote 'modulo_rol'.
 * 
 * Propósito: Relacionar roles con módulos (muchos a muchos) + permisos granulares.
 * Determina qué módulos puede ver cada rol y qué acciones puede realizar.
 * 
 * Estructura de permisos JSON:
 * {
 *   "crear": true,
 *   "editar": true,
 *   "eliminar": false,
 * }
 * 
 * @author Yariangel Aray
 * @date 2025-11-27
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('modulo_rol', function (Blueprint $table) {
            $table->id();

            // FK a roles
            $table->foreignId('rol_id')
                ->constrained('roles')
                ->onDelete('cascade');

            // FK a modulos
            $table->foreignId('modulo_id')
                ->constrained('modulos')
                ->onDelete('cascade');

            // Permisos en formato JSON
            $table->json('permisos')->nullable();

            // Evitar duplicados: un rol no puede tener el mismo módulo dos veces
            $table->unique(['rol_id', 'modulo_id']);

            $table->timestamps();
        });

        // Ajustes para SQL Server: Cambia timestamps a datetime2 (más preciso que datetime).
        DB::statement('ALTER TABLE modulo_rol ALTER COLUMN created_at datetime2');
        DB::statement('ALTER TABLE modulo_rol ALTER COLUMN updated_at datetime2');

    }

    public function down(): void
    {
        Schema::dropIfExists('modulo_rol');
    }
};