<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear la tabla 'auditorias'.
 * 
 * Propósito: Registrar cambios en otras tablas para auditoría (tracking de inserts, updates, deletes).
 * Usada para compliance y seguimiento de modificaciones en el sistema.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tabla 'auditorias'.
     * 
     * Campos principales:
     * - id: Clave primaria auto-incremental.
     * - tabla_afectada: Nombre de la tabla modificada (ej. 'users').
     * - id_registro_afectado: ID del registro cambiado.
     * - accion: Tipo de cambio ('INSERT', 'UPDATE', 'DELETE').
     * - usuario_id: FK a users (nullable, para cambios sin login).
     * - cambios: JSON con diffs (ej. {"campo": {"antes": "x", "despues": "y"}}).
     * - fecha_creacion: Timestamp automático al crear.
     * 
     * Propósito: Almacenar logs de auditoría para rastrear quién cambió qué y cuándo.
     * 
     * @return void
     */
    public function up(): void
    {
        Schema::create('auditorias', function (Blueprint $table) {
            $table->id();
            $table->string('tabla_afectada', 100);
            $table->unsignedBigInteger('id_registro_afectado');
            $table->enum('accion', ['INSERT', 'UPDATE', 'DELETE']);

            // Clave foránea a la tabla users (permite NULL si no hay usuario autenticado)
            $table->foreignId('usuario_id')
                ->nullable()
                ->constrained('usuarios');

            $table->json('cambios')->nullable(); //{ "campo": {"antes": "x", "despues": "y"} }
            $table->timestamp('fecha_creacion')->useCurrent();
        });
    }

    /**
     * BLOQUE: down - Eliminar tabla 'auditorias'.
     * 
     * Propósito: Revertir la migración eliminando la tabla si es necesario (rollback).
     * 
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};