<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear tablas base de usuarios y autenticación.
 * 
 * Crea 'usuarios' (usuarios personalizados), 'password_reset_tokens' (tokens de reset) y 'sessions' (sesiones de usuario).
 * Usa ajustes para SQL Server (datetime2) en lugar de timestamp estándar. Incluye campos únicos y índices.
 * 
 * Propósito: Reemplaza tablas estándar de Laravel (users, password_resets) con versiones personalizadas para el sistema.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tablas.
     * 
     * Crea tres tablas: usuarios (con numero_documento único), password_reset_tokens (para reset de pass),
     * y sessions (para manejo de sesiones). Ajusta tipos de fecha para SQL Server.
     * 
     * @return void
     */
    public function up(): void
    {
        // Crear tabla 'usuarios' (equivalente a 'users' estándar, pero personalizada).
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();  // Clave primaria auto-incremental.
            $table->string('numero_documento', 15)->unique();  // Número de documento (único, max 15 chars).
            $table->string('email');  // Email único.            

            $table->foreignId('rol_id') //Rol del usuario 
                ->default(2) //Rol estandar por defecto
                ->constrained('roles');

            $table->string('password')->nullable();  // Contraseña hasheada.
            $table->rememberToken();  // Token para "recordarme" (agrega columna remember_token).
            $table->unsignedTinyInteger('intentos_fallidos')->default(0);  // Contador de login fallidos (para bloqueo).
            $table->timestamps();  // created_at y updated_at.
            $table->timestamp('bloqueado_at')->nullable();  // Timestamp para bloqueo de cuenta.
        });

        // Ajustes para SQL Server: Cambia timestamps a datetime2 (más preciso que datetime).
        DB::statement('ALTER TABLE usuarios ALTER COLUMN created_at datetime2');
        DB::statement('ALTER TABLE usuarios ALTER COLUMN updated_at datetime2');
        DB::statement('ALTER TABLE usuarios ALTER COLUMN bloqueado_at datetime2');

        // Crear tabla 'password_reset_tokens' (para tokens de reset de contraseña).
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();  // Email como clave primaria (único por usuario).
            $table->string('token');  // Token de reset generado.
            $table->timestamp('created_at')->nullable();  // Timestamp de creación.
        });

        // Ajuste para SQL Server en password_reset_tokens.
        DB::statement('ALTER TABLE password_reset_tokens ALTER COLUMN created_at datetime2');

        // Crear tabla 'sessions' (para almacenamiento de sesiones de usuario).
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();  // ID de sesión como clave primaria.
            $table->foreignId('user_id')->nullable()->index();  // FK a usuarios (nullable para sesiones anónimas), con índice.
            $table->string('ip_address', 45)->nullable();  // IP del usuario (max 45 para IPv6).
            $table->text('user_agent')->nullable();  // User agent del navegador.
            $table->longText('payload');  // Datos serializados de la sesión.
            $table->integer('last_activity')->index();  // Timestamp de última actividad, indexado.
        });
    }

    /**
     * BLOQUE: down - Eliminar tablas.
     * 
     * Elimina las tablas creadas en up, en orden inverso para evitar errores de FK.
     * 
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');  // Elimina tabla usuarios.
        Schema::dropIfExists('password_reset_tokens');  // Elimina tabla tokens.
        Schema::dropIfExists('sessions');  // Elimina tabla sesiones.
    }
};
