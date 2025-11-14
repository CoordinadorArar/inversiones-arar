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
        Schema::create('auditorias', function (Blueprint $table) {
            $table->id();
            $table->string('tabla_afectada', 100);
            $table->unsignedBigInteger('id_registro_afectado');
            $table->enum('accion', ['INSERT', 'UPDATE', 'DELETE']);

            // Clave foránea a la tabla users (permite NULL si no hay usuario autenticado)
            $table->foreignId('usuario_id')
                ->nullable()
                ->constrained('users');

            $table->json('cambios')->nullable(); //{ "campo": {"antes": "x", "despues": "y"} }
            $table->timestamp('fecha_creacion')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};
