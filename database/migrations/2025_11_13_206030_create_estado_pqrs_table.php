<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear la tabla 'estados_pqrs'.
 * 
 * Propósito: Definir estados de PQRs (ej. Pendiente, En Proceso, Resuelto).
 * Usada para tracking del estado de cada PQR en el sistema.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tabla 'estados_pqrs'.
     * 
     * Campos principales:
     * - id: Clave primaria auto-incremental.
     * - nombre: Nombre del estado (ej. 'Pendiente').
     * - abreviatura: Abreviatura corta (opcional, ej. 'P').
     * - fecha_creacion/modificacion: Timestamps automáticos.
     * - deleted_at: Soft deletes para no eliminar físicamente.
     * 
     * Propósito: Almacenar opciones fijas para estados de PQRs.
     * 
     * @return void
     */
    public function up(): void
    {
        Schema::create('estados_pqrs', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50)->unique();
            $table->string('abreviatura', 10)->unique();

            $table->dateTimeTz('fecha_creacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->dateTimeTz('fecha_modificacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->softDeletes();
        });
    }

    /**
     * BLOQUE: down - Eliminar tabla 'estados_pqrs'.
     * 
     * Propósito: Revertir la migración eliminando la tabla si es necesario (rollback).
     * 
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('estados_pqrs');
    }
};