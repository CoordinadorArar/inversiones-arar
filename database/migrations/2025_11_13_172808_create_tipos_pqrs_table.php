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
        Schema::create('tipos_pqrs', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('abreviatura', 10)->nullable();
            
            $table->dateTime('fecha_creacion')->useCurrent();
            $table->dateTime('fecha_modificacion')->useCurrent()->useCurrentOnUpdate();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipos_pqrs');
    }
};
