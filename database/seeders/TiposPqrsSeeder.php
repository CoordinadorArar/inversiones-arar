<?php

namespace Database\Seeders;

use App\Models\PQRSD\TipoPqrs;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TiposPqrsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'Petición', 'abreviatura' => 'P'],
            ['nombre' => 'Queja', 'abreviatura' => 'Q'],
            ['nombre' => 'Reclamo', 'abreviatura' => 'R'],
            ['nombre' => 'Sugerencia', 'abreviatura' => 'S'],
            ['nombre' => 'Denuncia', 'abreviatura' => 'D'],
        ];

        foreach ($tipos as $tipo) {
            TipoPqrs::firstOrCreate(['nombre' => $tipo['nombre']], $tipo);
        }
    }
}
