<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear la tabla 'configuraciones'.
 * 
 * Almacena configuraciones globales clave-valor (ej. "max_usuarios" -> "100").
 * Sin FK externas, enfocada en settings simples.
 * Incluye timestamps manuales para creación/modificación.
 * 
 * Propósito: Configuraciones dinámicas para la app, editables desde admin.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-26
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tabla 'configuraciones'.
     * 
     * Campos para configuraciones: nombre único, valor opcional, timestamps.
     * 
     * @return void
     */
    public function up(): void
    {
        Schema::create('configuraciones', function (Blueprint $table) {
            $table->id();  // Clave primaria auto-incremental.
            
            $table->string('nombre', 50)->unique();  // Nombre único de la config (ej. "sitio_activo"). Longitud limitada para evitar nombres largos.
            $table->string('valor', 255)->nullable(); // Valor de la config (ej. "true"). Nullable para configs sin valor inicial.

            $table->dateTimeTz('fecha_creacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->dateTimeTz('fecha_modificacion', 0)->default(DB::raw('SYSDATETIME()'));            
        });
    }

    /**
     * BLOQUE: down - Eliminar tabla 'configuraciones'.
     * 
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('configuraciones');
    }
};
