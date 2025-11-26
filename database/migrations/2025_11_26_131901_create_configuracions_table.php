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
        Schema::create('configuraciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50)->unique();
            $table->string('valor', 255)->nullable();

            $table->dateTime('fecha_creacion')->useCurrent();         // Timestamp creación.
            $table->dateTime('fecha_modificacion')->useCurrent()->useCurrentOnUpdate(); // Timestamp modificación.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configuraciones');
    }
};
