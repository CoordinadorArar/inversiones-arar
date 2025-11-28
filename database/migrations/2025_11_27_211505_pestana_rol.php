<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para tabla pivote 'pestana_rol'.
 * 
 * Propósito: Relacionar roles con pestañas (muchos a muchos) + permisos granulares.
 * Determina qué pestañas específicas puede acceder cada rol y qué puede hacer.
 * 
 * Estructura de permisos JSON:
 * {
 *   "crear": true,
 *   "editar": false,
 *   "eliminar": false,
 * }
 * 
 * IMPORTANTE: 
 * - Si un rol tiene acceso a una pestaña, automáticamente debe tener 
 *   acceso al módulo padre (validar en lógica de asignación).
 * - Los permisos de pestaña pueden ser más restrictivos que los del módulo.
 * 
 * @author Yariangel Aray
 * @date 2025-11-27
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pestana_rol', function (Blueprint $table) {
            $table->id();

            // FK a roles
            $table->foreignId('rol_id')
                ->constrained('roles')
                ->onDelete('cascade');

            // FK a pestanas
            $table->foreignId('pestana_id')
                ->constrained('pestanas')
                ->onDelete('cascade');

            // Permisos en formato JSON
            $table->json('permisos')->nullable();

            // Evitar duplicados: un rol no puede tener la misma pestaña dos veces
            $table->unique(['rol_id', 'pestana_id']);

            $table->timestamps();
        });

        DB::statement('ALTER TABLE pestana_rol ALTER COLUMN created_at datetime2');
        DB::statement('ALTER TABLE pestana_rol ALTER COLUMN updated_at datetime2');
    }

    public function down(): void
    {
        Schema::dropIfExists('pestana_rol');
    }
};
