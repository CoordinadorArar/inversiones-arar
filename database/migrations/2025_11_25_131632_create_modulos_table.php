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
        Schema::create('modulos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50)->unique();
            $table->string('icono', 50);
            $table->string('ruta', 255)->unique();
            $table->boolean('es_padre')->default(false);
            $table->unsignedBigInteger('modulo_padre_id')->nullable();

            $table->dateTime('fecha_creacion')->useCurrent();         // Timestamp creación.
            $table->dateTime('fecha_modificacion')->useCurrent()->useCurrentOnUpdate(); // Timestamp modificación.

            $table->softDeletes(); // Soft deletes.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modulos');
    }
};
