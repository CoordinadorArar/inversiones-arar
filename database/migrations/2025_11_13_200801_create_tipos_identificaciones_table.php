<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear la tabla 'tipos_identificaciones'.
 * 
 * Propósito: Definir tipos de identificación (ej. CC, CE, NIT).
 * Usada para validar y categorizar documentos de identidad en PQRs.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-18
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tabla 'tipos_identificaciones'.
     * 
     * Campos principales:
     * - id: Clave primaria auto-incremental.
     * - nombre: Nombre del tipo (ej. 'Cédula de Ciudadanía').
     * - abreviatura: Abreviatura corta (opcional, ej. 'CC').
     * - fecha_creacion/modificacion: Timestamps automáticos.
     * - deleted_at: Soft deletes para no eliminar físicamente.
     * 
     * Propósito: Almacenar opciones fijas para tipos de ID.
     * 
     * @return void
     */
    public function up(): void
    {
        Schema::create('tipos_identificaciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('abreviatura', 10)->unique();
            
            $table->dateTime('fecha_creacion')->useCurrent();
            $table->dateTime('fecha_modificacion')->useCurrent()->useCurrentOnUpdate();
            $table->softDeletes();
        });
    }

    /**
     * BLOQUE: down - Eliminar tabla 'tipos_identificaciones'.
     * 
     * Propósito: Revertir la migración eliminando la tabla si es necesario (rollback).
     * 
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('tipos_identificaciones');
    }
};