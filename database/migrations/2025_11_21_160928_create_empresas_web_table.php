<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migración para crear la tabla 'empresas_web'.
 * 
 * Almacena información de empresas para mostrar en el sitio web (header, portafolio, PQRsD).
 * Incluye campos únicos filtrados (solo aplican si no son NULL) para id_siesa, siglas, dominio.
 * Usa soft deletes y timestamps manuales.
 * 
 * Propósito: Centralizar datos de empresas visibles en la web, con integración a Siesa.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-21
 */

return new class extends Migration
{
    /**
     * BLOQUE: up - Crear tabla 'empresas_web'.
     * 
     * Campos principales:
     * - id: Clave primaria.
     * - id_siesa: ID único de Siesa (nullable, para integración externa).
     * - razon_social: Nombre legal (único, max 50).
     * - siglas: Abreviatura (nullable, max 10).
     * - tipo_empresa/descripcion: Categoría y descripción (nullable).
     * - sitio_web/dominio: URLs y dominio para correos (nullable).
     * - logo_url: Ruta al logo (nullable, en storage).
     * - mostrar_*: Bools para visibilidad en secciones (header, empresas, portafolio, PQRSD).
     * - fecha_creacion/modificacion: Timestamps manuales.
     * - deleted_at: Soft deletes.
     * 
     * Índices únicos filtrados: Solo aplican si el campo no es NULL (evita conflictos con múltiples NULLs).
     * 
     * @return void
     */
    public function up(): void
    {
        Schema::create('empresas_web', function (Blueprint $table) {
            $table->id();

            // Identificador interno de Siesa (único, nullable para empresas sin ID).
            $table->unsignedBigInteger('id_siesa')->nullable();

            // Información básica.
            $table->string('razon_social', 50)->unique();  // Nombre legal único.
            $table->string('siglas', 10)->nullable();      // Abreviatura opcional.
            $table->string('tipo_empresa', 50)->nullable(); // Tipo (ej. "Holding Empresarial", "Servicios financieros").
            $table->string('descripcion', 150)->nullable(); // Descripción breve.

            // Sitio web.
            $table->string('sitio_web', 100)->nullable();

            // Dominio para correos corporativos (ej. inversionesarar.com).
            $table->string('dominio', 100)->nullable();

            // Ruta/URL del logotipo (puede ser null, en storage/app/public/logos_empresas -> storage/logos_empresas).
            $table->string('logo_url', 255)->nullable();

            // Visibilidad en distintas secciones del sitio.
            $table->boolean('mostrar_en_header')->default(false);     // Mostrar en header.
            $table->boolean('mostrar_en_empresas')->default(false);   // Mostrar en página empresas.
            $table->boolean('mostrar_en_portafolio')->default(false); // Mostrar en portafolio.
            $table->boolean('permitir_pqrsd')->default(false);        // Permitir PQRSD para esta empresa.

            $table->dateTimeTz('fecha_creacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->dateTimeTz('fecha_modificacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->dateTimeTz('deleted_at', 0)->nullable();
        });

        // Índice único para id_siesa solo si no es null (permite múltiples nulls).
        DB::statement("
                CREATE UNIQUE INDEX empresas_web_id_siesa_unique
                ON empresas_web(id_siesa)
                WHERE id_siesa IS NOT NULL;
            ");

        // Índice único para siglas solo si no es null.
        DB::statement("
                CREATE UNIQUE INDEX empresas_web_siglas_unique
                ON empresas_web(siglas)
                WHERE siglas IS NOT NULL;
            ");

        // Índice único para dominio solo si no es null.
        DB::statement("
                CREATE UNIQUE INDEX empresas_web_dominio_unique
                ON empresas_web(dominio)
                WHERE dominio IS NOT NULL;
         ");
    }

    /**
     * BLOQUE: down - Eliminar tabla e índices.
     * 
     * Elimina índices únicos filtrados primero, luego la tabla.
     * 
     * @return void
     */
    public function down(): void
    {
        // Elimina índices antes de la tabla.
        DB::statement('DROP INDEX empresas_web_id_siesa_unique ON empresas_web');
        DB::statement('DROP INDEX empresas_web_siglas_unique ON empresas_web');
        DB::statement('DROP INDEX empresas_web_dominio_unique ON empresas_web');
        
        Schema::dropIfExists('empresas_web');
    }
};