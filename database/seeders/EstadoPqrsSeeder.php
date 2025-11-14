<?php

namespace Database\Seeders;

use App\Models\PQRSD\EstadoPqrs;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EstadoPqrsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'Pendiente', 'abreviatura' => 'P'],
            ['nombre' => 'En Proceso', 'abreviatura' => 'EP'],
            ['nombre' => 'Resuelto', 'abreviatura' => 'R'],
            ['nombre' => 'Cancelado', 'abreviatura' => 'C'],            
        ];

        foreach ($tipos as $tipo) {
            EstadoPqrs::firstOrCreate(['nombre' => $tipo['nombre']], $tipo);
        }
    }
}
