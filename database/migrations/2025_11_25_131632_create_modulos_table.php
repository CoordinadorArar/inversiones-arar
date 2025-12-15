<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear la tabla 'modulos'.
 * 
 * Define módulos del sistema (ej. "Usuarios", "PQRSD") con permisos básicos CRUD implícitos
 * y permisos_extra específicos (JSON, ej. ["aprobar", "asignar"]). Soporta jerarquía (padre/hijo).
 * Incluye soft deletes y timestamps manuales.
 * 
 * Propósito: Base para sistema de permisos por módulo, asignables a roles/usuarios.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-26
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tabla 'modulos'.
     * 
     * Campos para estructura modular: nombre único, icono, ruta, jerarquía, permisos_extra JSON.
     * Permisos básicos (ver, editar, actualizar, eliminar) se asumen implícitos para cada módulo.
     * 
     * @return void
     */
    public function up(): void
    {
        Schema::create('modulos', function (Blueprint $table) {
            $table->id();  // Clave primaria.
            
            $table->string('nombre', 50)->unique();  // Nombre del módulo (único, ej. "PQRSD").
            $table->string('icono', 50);             // Ícono para UI (ej. "shield").
            $table->string('ruta', 255)->unique();   // Ruta base del módulo (única, ej. "/pqrsd").
            
            $table->boolean('es_padre')->default(false);  // Si es módulo padre (para jerarquía).
            $table->unsignedBigInteger('modulo_padre_id')->nullable();  // FK a módulo padre (nullable).

            // JSON para permisos específicos del módulo (ej. ["aprobar", "asignar"]).
            // - Nullable: Módulos sin extras usan solo CRUD básico.
            // - Propósito: Flexibilidad para acciones custom sin hardcodear en código.
            $table->json('permisos_extra')->nullable();

            $table->dateTimeTz('fecha_creacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->dateTimeTz('fecha_modificacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->softDeletes();
        });
    }

    /**
     * BLOQUE: down - Eliminar tabla 'modulos'.
     * 
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('modulos');
    }
};