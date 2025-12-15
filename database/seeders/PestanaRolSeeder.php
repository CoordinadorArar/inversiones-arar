<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PestanaRolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accesos = [
            ['pestana_id' => 1, 'rol_id' => 1],
            [
                'pestana_id' => 2,
                'rol_id' => 1,
                'permisos' => json_encode([
                    "crear",
                    "editar",
                    "eliminar",
                ]),
            ],
            [
                'pestana_id' => 3,
                'rol_id' => 1,
                'permisos' => json_encode([
                    "editar",
                ]),
            ],
            [
                'pestana_id' => 4,
                'rol_id' => 1,
                'permisos' => json_encode([
                    "editar",
                ]),
            ],
            [
                'pestana_id' => 5,
                'rol_id' => 1,
                'permisos' => json_encode([
                    "crear",
                    "editar",
                    "eliminar",
                ]),
            ],
            [
                'pestana_id' => 6,
                'rol_id' => 1,
                'permisos' => json_encode([
                    "crear",
                    "editar",
                    "eliminar",
                ]),
            ],
            [
                'pestana_id' => 7,
                'rol_id' => 1,
                'permisos' => json_encode([
                    "crear",
                    "editar",
                    "eliminar",
                ]),
            ],
            ['pestana_id' => 8, 'rol_id' => 1],
            [
                'pestana_id' => 9,
                'rol_id' => 1,
                'permisos' => json_encode([
                    "crear",
                    "editar",
                    "bloquear",
                    "restaurar_password"
                ]),
            ],
            ['pestana_id' => 10, 'rol_id' => 1],
            ['pestana_id' => 11, 'rol_id' => 1],
            ['pestana_id' => 12, 'rol_id' => 1],
            ['pestana_id' => 13, 'rol_id' => 1],
            [
                'pestana_id' => 14,
                'rol_id' => 1,
                'permisos' => json_encode([
                    "crear",
                    "editar",
                    "eliminar",
                ]),
            ],
            ['pestana_id' => 15, 'rol_id' => 1],
            [
                'pestana_id' => 16,
                'rol_id' => 1,
                'permisos' => json_encode([
                    "crear",
                    "editar",
                    "eliminar",
                ]),
            ],
            ['pestana_id' => 17, 'rol_id' => 1],
            [
                'pestana_id' => 18,
                'rol_id' => 1,
                'permisos' => json_encode([
                    "crear",
                    "editar",
                    "eliminar",
                ]),
            ],
            ['pestana_id' => 19, 'rol_id' => 1],
            ['pestana_id' => 20, 'rol_id' => 1],
        ];

        foreach ($accesos as $acceso) {
            DB::table('pestana_rol')->updateOrInsert(
                [
                    'rol_id' => $acceso['rol_id'],
                    'pestana_id' => $acceso['pestana_id'],
                ],
                [
                    'permisos' =>  $acceso['permisos'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
