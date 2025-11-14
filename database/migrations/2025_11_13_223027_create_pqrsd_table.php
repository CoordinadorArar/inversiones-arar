<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pqrsds', function (Blueprint $table) {
            $table->id();

            // Información de la PQRSD
            $table->unsignedBigInteger('empresa_id');
            $table->foreignId('tipo_pqrs_id')                
                ->constrained('tipos_pqrs');

            // Datos personales del solicitante
            $table->string('nombre', 50);
            $table->string('apellido', 50);
            $table->foreignId('tipo_identificacion_id')                
                ->constrained('tipos_identificaciones');

            $table->string('numero_identificacion', 15);

            // Información de contacto
            $table->string('correo', 50);
            $table->string('telefono', 15);
            $table->unsignedBigInteger('departamento_codigo');
            $table->unsignedBigInteger('ciudad_codigo');
            $table->string('direccion', 100)->nullable();
            $table->string('relacion', 50);

            // Descripción y archivos
            $table->text('descripcion');
            $table->json('adjuntos')->nullable();
            $table->string('directorio', 255)->nullable();

            // Estado y seguimiento            
            $table->foreignId('estado_id')                
                ->constrained('estados_pqrs');

            $table->foreignId('usuario_asignado_id')
                ->nullable()
                ->constrained('users');

            $table->dateTime('fecha_creacion')->useCurrent();
            $table->dateTime('fecha_modificacion')->useCurrent()->useCurrentOnUpdate();
            $table->dateTime('fecha_finalizacion')->nullable();
            
            $table->softDeletes();

            // Índices para búsquedas
            $table->index('empresa_id');
            $table->index('tipo_pqrs_id');
            $table->index('estado_id');
            $table->index('fecha_creacion');
            $table->index('numero_identificacion');
            $table->index('usuario_asignado_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pqrsds');
    }
};
