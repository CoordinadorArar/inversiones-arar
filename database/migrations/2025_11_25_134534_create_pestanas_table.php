<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear la tabla 'pestanas'.
 * 
 * Define pestañas/subpáginas dentro de módulos (ej. "Crear PQR" dentro de "PQRsD").
 * Con permisos_extra opcionales (JSON).
 * Incluye soft deletes y timestamps manuales.
 * 
 * Propósito: Granularidad en permisos: pestañas específicas dentro de módulos.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-25
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tabla 'pestanas'.
     * 
     * Campos para pestañas: FK a módulo, nombre/ruta únicos por módulo, permisos_extra JSON.
     * 
     * @return void
     */
    public function up(): void
    {
        Schema::create('pestanas', function (Blueprint $table) {
            $table->id();  // Clave primaria.
            
            // FK a modulos
            $table->foreignId('modulo_id')
                ->constrained('modulos');  // Restricción FK.

            $table->string('nombre', 50);        // Nombre de la pestaña (ej. "Crear").
            $table->string('ruta', 255);         // Ruta específica (ej. "/pqrsd/crear").

            // Índices únicos: nombre y ruta únicos dentro de un módulo (evita duplicados por módulo).
            $table->unique(['modulo_id', 'nombre']);
            $table->unique(['modulo_id', 'ruta']);

            // JSON para permisos específicos de la pestaña (ej. ["exportar"]).
            // - Nullable: Pestañas sin extras usan permisos del módulo padre.
            // - Propósito: Granularidad extra (ej. solo "aprobar" en pestaña específica).
            $table->json('permisos_extra')->nullable();

            $table->dateTimeTz('fecha_creacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->dateTimeTz('fecha_modificacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->softDeletes();
        });
    }

    /**
     * BLOQUE: down - Eliminar tabla 'pestanas'.
     * 
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('pestanas');
    }
};