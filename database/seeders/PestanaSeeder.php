<?php

namespace Database\Seeders;

use App\Models\GestionModulos\Modulo;
use App\Models\GestionModulos\Pestana;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PestanaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $pestanas = [

        // Administración Web → Empresas
        [
            'modulo' => 'Empresas',
            'nombre' => 'Listado',
            'ruta'   => '/listado'
        ],
        [
            'modulo' => 'Empresas',
            'nombre' => 'Gestión',
            'ruta'   => '/gestion'
        ],

        // Seguridad y Acceso → Usuarios
        [
            'modulo' => 'Usuarios',
            'nombre' => 'Listado',
            'ruta'   => '/listado'
        ],
        [
            'modulo' => 'Usuarios',
            'nombre' => 'Gestión',
            'ruta'   => '/gestion'
        ],

        // Seguridad y Acceso → Roles
        [
            'modulo' => 'Roles',
            'nombre' => 'Listado',
            'ruta'   => '/listado'
        ],
        [
            'modulo' => 'Roles',
            'nombre' => 'Gestión',
            'ruta'   => '/gestion'
        ],
        [
            'modulo' => 'Roles',
            'nombre' => 'Asignar Permisos',
            'ruta'   => '/asignar-permisos'
        ],

        // Gestión de Módulos → Módulos
        [
            'modulo' => 'Módulos',
            'nombre' => 'Listado',
            'ruta'   => '/listado'
        ],
        [
            'modulo' => 'Módulos',
            'nombre' => 'Gestión',
            'ruta'   => '/crear'
        ],

        // Gestión de Módulos → Pestañas
        [
            'modulo' => 'Pestañas',
            'nombre' => 'Listado',
            'ruta'   => '/listado'
        ],
        [
            'modulo' => 'Pestañas',
            'nombre' => 'Gestión',
            'ruta'   => '/crear'
        ],

        // Recursos Humanos → Documentos
        [
            'modulo' => 'Documentos Corporativos',
            'nombre' => 'Listado',
            'ruta'   => '/listado'
        ],
        [
            'modulo' => 'Documentos Corporativos',
            'nombre' => 'Gestión',
            'ruta'   => '/gestion'
        ],

        // Recursos Humanos → Calendario
        [
            'modulo' => 'Calendario Corporativo',
            'nombre' => 'Calendario',
            'ruta'   => '/calendario'
        ],
        [
            'modulo' => 'Calendario Corporativo',
            'nombre' => 'Gestión de Eventos',
            'ruta'   => '/gestion-evento'
        ],

    ];

    foreach ($pestanas as $item) {

        $modulo = Modulo::where('nombre', $item['modulo'])->first();

        if (!$modulo) continue;

        Pestana::firstOrCreate(
            [
                'modulo_id' => $modulo->id,
                'nombre'    => $item['nombre'],
            ],
            [
                'ruta'      => $item['ruta'],
            ]
        );
    }
}

}
