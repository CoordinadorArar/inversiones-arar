<?php

namespace Database\Seeders;

use App\Models\GestionModulos\Modulo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModuloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modulos = [
            // Padres
            [
                'nombre' => 'Administración Web',
                'icono' => 'user-cog',
                'ruta' => '/administracion-web',
                'es_padre' => true,
            ],

            [
                'nombre' => 'Seguridad y Acceso',
                'icono' => 'user-lock',
                'ruta' => '/seguridad-acceso',
                'es_padre' => true,
            ],

            [
                'nombre' => 'Gestión de Módulos',
                'icono' => 'panels-top-left',
                'ruta' => '/gestion-modulos',
                'es_padre' => true,
            ],

            [
                'nombre' => 'Recursos Humanos',
                'icono' => 'file-user',
                'ruta' => '/recursos-humanos',
                'es_padre' => true,
            ],

            [
                'nombre' => 'Sistema',
                'icono' => 'monitor-cog',
                'ruta' => '/sistema',
                'es_padre' => true,
            ],

            // Hijos
            [
                'nombre' => 'Empresas',
                'icono' => 'building-2',
                'ruta' => '/empresas',
                'padre' => 'Administración Web',
            ],
            [
                'nombre' => 'Configuración General',
                'icono' => 'settings',
                'ruta' => '/configuracion-general',
                'padre' => 'Administración Web',
            ],
            [
                'nombre' => 'Tablas Maestras',
                'icono' => 'layout-list',
                'ruta' => '/tablas-maestras',
                'padre' => 'Administración Web',
            ],

            [
                'nombre' => 'Usuarios',
                'icono' => 'users',
                'ruta' => '/usuarios',
                'padre' => 'Seguridad y Acceso',
            ],

            [
                'nombre' => 'Roles',
                'icono' => 'shield-user',
                'ruta' => '/roles',
                'padre' => 'Seguridad y Acceso',
            ],

            [
                'nombre' => 'Módulos',
                'icono' => 'layout-dashboard',
                'ruta' => '/modulos',
                'padre' => 'Gestión de Módulos',
            ],

            [
                'nombre' => 'Pestañas',
                'icono' => 'panel-top-dashed',
                'ruta' => '/pestanas',
                'padre' => 'Gestión de Módulos',
            ],

            [
                'nombre' => 'Documentos Corporativos',
                'icono' => 'file-text',
                'ruta' => '/documentos',
                'padre' => 'Recursos Humanos',
            ],

            [
                'nombre' => 'Calendario Corporativo',
                'icono' => 'calendar-cog',
                'ruta' => '/calendario',
                'padre' => 'Recursos Humanos',
            ],

            [
                'nombre' => 'Auditoría',
                'icono' => 'scroll-text',
                'ruta' => '/auditoria',
                'padre' => 'Sistema',
            ],
        ];

        foreach ($modulos as $item) {

            $data = $item;

            // Si tiene padre, lo buscamos por nombre
            if (isset($item['padre'])) {
                $padre = Modulo::where('nombre', $item['padre'])->first();
                if (!$padre) continue;

                $data['modulo_padre_id'] = $padre->id;
                unset($data['padre']);
            }

            Modulo::firstOrCreate(
                ['nombre' => $item['nombre']],
                $data
            );
        }
    }
}
