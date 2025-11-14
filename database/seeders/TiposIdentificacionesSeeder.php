<?php

namespace Database\Seeders;

use App\Models\TipoIdentificacion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TiposIdentificacionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'Cédula de Ciudadanía', 'abreviatura' => 'CC'],
            ['nombre' => 'Pasaporte', 'abreviatura' => 'PA'],
            ['nombre' => 'Cédula de Extranjería', 'abreviatura' => 'CE'],
        ];

        foreach ($tipos as $tipo) {
            TipoIdentificacion::firstOrCreate(['nombre' => $tipo['nombre']], $tipo);
        }
    }
}
