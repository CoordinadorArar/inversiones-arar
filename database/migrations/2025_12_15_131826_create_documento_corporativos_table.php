<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documentos_corporativos', function (Blueprint $table) {
            $table->id();

            $table->string('nombre', 50)->unique();  // Nombre único del documento.
            $table->string('icono', 50)->nullable();
            $table->string('ruta', 255);

            $table->boolean('mostrar_en_dashboard')->default(false);   // Mostrar en página dashboard para los usuarios.
            $table->boolean('mostrar_en_footer')->default(false); // Mostrar en footer de página pública.

            $table->dateTimeTz('fecha_creacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->dateTimeTz('fecha_modificacion', 0)->default(DB::raw('SYSDATETIME()'));
            $table->dateTimeTz('deleted_at', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentos_corporativos');
    }
};
