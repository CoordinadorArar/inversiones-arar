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
        Schema::create('pestanas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('modulo_id')
                ->nullable()
                ->constrained('modulos');

            $table->string('nombre', 50)->unique();            
            $table->string('ruta', 255)->unique();            

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
        Schema::dropIfExists('pestanas');
    }
};
