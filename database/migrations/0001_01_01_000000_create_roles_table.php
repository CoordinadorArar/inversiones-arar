<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear la tabla 'roles'.
 * 
 * Define roles de usuario (ej. SuperAdmin, Estandar) con nombre y abreviatura únicos.
 * Incluye timestamps manuales y soft deletes para auditoría y no eliminación física.
 * 
 * Propósito: Base para sistema de roles en la aplicación.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-21
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tabla 'roles'.
     * 
     * Campos principales:
     * - id: Clave primaria auto-incremental.
     * - nombre: Nombre del rol (único, ej. 'SuperAdmin').
     * - abreviatura: Abreviatura corta (opcional, única, ej. 'SA').
     * - fecha_creacion/modificacion: Timestamps manuales.
     * - deleted_at: Soft deletes.
     * 
     * Propósito: Almacenar roles fijos para asignar a usuarios.
     * 
     * @return void
     */
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();  // Nombre único del rol.
            $table->string('abreviatura', 10)->nullable()->unique();  // Abreviatura opcional y única.
            
            $table->dateTime('fecha_creacion')->useCurrent();  // Timestamp de creación automático.
            $table->dateTime('fecha_modificacion')->useCurrent()->useCurrentOnUpdate();  // Timestamp de modificación automático.
            $table->softDeletes();  // Soft deletes: agrega deleted_at.
        });
    }

    /**
     * BLOQUE: down - Eliminar tabla 'roles'.
     * 
     * Propósito: Revertir la migración eliminando la tabla si es necesario (rollback).
     * 
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
