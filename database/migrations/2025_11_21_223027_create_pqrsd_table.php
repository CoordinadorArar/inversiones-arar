<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear la tabla 'pqrsds'.
 * 
 * Propósito: Almacenar PQRs (Peticiones, Quejas, Reclamos, Sugerencias, Denuncias).
 * Incluye datos personales, contacto, descripción, adjuntos y seguimiento.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tabla 'pqrsds'.
     * 
     * Campos principales:
     * - Información PQR: empresa_id, tipo_pqrs_id (FKs).
     * - Datos personales: nombre, apellido, tipo_identificacion_id (FK), numero_identificacion.
     * - Contacto: correo, telefono, departamento_codigo, ciudad_codigo, direccion, relacion.
     * - Descripción: descripcion (text), adjuntos (JSON), directorio (path a archivos).
     * - Seguimiento: estado_id (FK), usuario_asignado_id (FK nullable), fechas (creacion/modificacion/finalizacion).
     * - Soft deletes y índices para búsquedas eficientes.
     * 
     * Propósito: Tabla central para gestionar PQRs con integridad referencial.
     * 
     * @return void
     */
    public function up(): void
    {
        Schema::create('pqrsds', function (Blueprint $table) {
            $table->id();

            // Información de la PQRSD
            $table->foreignId('empresa_web_id')
                ->constrained('empresas_web');

            $table->foreignId('tipo_pqrs_id')
                ->constrained('tipos_pqrs');

            // Define si es anonimo
            $table->boolean('anonimo')->default(false);

            // Datos personales del solicitante
            $table->string('nombre', 50)->nullable();
            $table->string('apellido', 50)->nullable();

            $table->foreignId('tipo_identificacion_id')->nullable()
                ->constrained('tipos_identificaciones');

            $table->string('numero_identificacion', 15)->nullable();

            // Información de contacto
            $table->string('correo', 50)->nullable();
            $table->string('telefono', 15)->nullable();
            $table->unsignedBigInteger('departamento_codigo')->nullable();
            $table->unsignedBigInteger('ciudad_codigo')->nullable();
            $table->string('direccion', 100)->nullable();
            $table->string('relacion', 50)->nullable();

            // Descripción y archivos
            $table->text('descripcion');
            $table->json('adjuntos')->nullable();
            $table->string('directorio', 255)->nullable();

            // Estado y seguimiento            
            $table->foreignId('estado_id')
                ->constrained('estados_pqrs');

            $table->foreignId('usuario_asignado_id')
                ->nullable()
                ->constrained('usuarios');

            $table->dateTime('fecha_creacion')->useCurrent();
            $table->dateTime('fecha_modificacion')->useCurrent()->useCurrentOnUpdate();
            $table->dateTime('fecha_finalizacion')->nullable();

            $table->softDeletes();

            // Índices para búsquedas            
            $table->index('tipo_pqrs_id');
            $table->index('estado_id');
            $table->index('fecha_creacion');
            $table->index('numero_identificacion');
            $table->index('usuario_asignado_id');
        });
    }

    /**
     * BLOQUE: down - Eliminar tabla 'pqrsds'.
     * 
     * Propósito: Revertir la migración eliminando la tabla si es necesario (rollback).
     * 
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('pqrsds');
    }
};
