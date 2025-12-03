<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear la tabla 'tipos_pqrs'.
 * 
 * Propósito: Definir tipos de PQRSD (Petición, Queja, Reclamo, Sugerencia, Denuncia).
 * Usada para categorizar las PQRs en el sistema.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tabla 'tipos_pqrs'.
     * 
     * Campos principales:
     * - id: Clave primaria auto-incremental.
     * - nombre: Nombre del tipo (ej. 'Queja').
     * - abreviatura: Abreviatura corta (opcional, ej. 'Q').
     * - fecha_creacion/modificacion: Timestamps automáticos.
     * - deleted_at: Soft deletes para no eliminar físicamente.
     * 
     * Propósito: Almacenar opciones fijas para tipos de PQRs.
     * 
     * @return void
     */
    public function up(): void
    {
        Schema::create('tipos_pqrs', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50)->unique();
            $table->string('abreviatura', 10)->unique();
            
            $table->dateTime('fecha_creacion')->useCurrent();
            $table->dateTime('fecha_modificacion')->useCurrent()->useCurrentOnUpdate();
            $table->softDeletes();
        });
    }

    /**
     * BLOQUE: down - Eliminar tabla 'tipos_pqrs'.
     * 
     * Propósito: Revertir la migración eliminando la tabla si es necesario (rollback).
     * 
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('tipos_pqrs');
    }
};