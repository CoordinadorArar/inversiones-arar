<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModuloRolSeeder extends Seeder
{
    public function run(): void
    {
        $accesos = [
            ['modulo_id' => 1, 'rol_id' => 1],
            ['modulo_id' => 2, 'rol_id' => 1],
            ['modulo_id' => 3, 'rol_id' => 1],
            ['modulo_id' => 4, 'rol_id' => 1],
            ['modulo_id' => 5, 'rol_id' => 1],
            ['modulo_id' => 6, 'rol_id' => 1],
            ['modulo_id' => 7, 'rol_id' => 1],
            ['modulo_id' => 8, 'rol_id' => 1],
            ['modulo_id' => 9, 'rol_id' => 1],
            ['modulo_id' => 10, 'rol_id' => 1],
            ['modulo_id' => 11, 'rol_id' => 1],
            ['modulo_id' => 12, 'rol_id' => 1],
            ['modulo_id' => 13, 'rol_id' => 1],
            ['modulo_id' => 14, 'rol_id' => 1],            
        ];

        foreach ($accesos as $acceso) {
            DB::table('modulo_rol')->updateOrInsert(
                [
                    'rol_id' => $acceso['rol_id'],
                    'modulo_id' => $acceso['modulo_id'],
                ],
                [
                    'permisos' =>  null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
