<?php

namespace Database\Seeders;

use App\Models\GestionModulos\Modulo;
use App\Models\GestionModulos\Pestana;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Seeder para la tabla 'pestanas'.
 * 
 * Propósito: Poblar pestañas iniciales asociadas a módulos por nombre.
 * Cada pestaña pertenece a un módulo hijo (ej. "Listado" en "Empresas").
 * Usa firstOrCreate con clave compuesta para evitar duplicados.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-26
 */

class PestanaSeeder extends Seeder
{
    /**
     * BLOQUE: run - Insertar pestañas iniciales.
     * 
     * Array $pestanas: Pestañas agrupadas por módulo (comentarios indican jerarquía).
     * Busca módulo por nombre, asigna modulo_id, usa firstOrCreate.
     * 
     * @return void
     */
    public function run(): void
    {
        $pestanas = [
            // Administración Web → Empresas: Pestañas para gestión de empresas.
            [
                'modulo' => 'Empresas',  // Nombre del módulo padre.
                'nombre' => 'Listado',   // Nombre de la pestaña.
                'ruta'   => '/listado'   // Ruta relativa.
            ],
            [
                'modulo' => 'Empresas',
                'nombre' => 'Gestión',
                'ruta'   => '/gestion'
            ],

            // Administración Web → Configuración General: Pestañas para config.
            [
                'modulo' => 'Configuración General',
                'nombre' => 'Información Corporativa',
                'ruta'   => '/informacion-corporativa'
            ],
            [
                'modulo' => 'Configuración General',
                'nombre' => 'Redes Sociales',
                'ruta'   => '/redes-sociales'
            ],

            // Administración Web → Tablas Maestras
            [
                'modulo' => 'Tablas Maestras',
                'nombre' => 'Tipos de Identificaciones',
                'ruta'   => '/tipos-identificaciones'
            ],
            [
                'modulo' => 'Tablas Maestras',
                'nombre' => 'Tipos de PQRSD',
                'ruta'   => '/tipos-pqrsd'
            ],
            [
                'modulo' => 'Tablas Maestras',
                'nombre' => 'Estados de PQRSD',
                'ruta'   => '/estados-pqrsd'
            ],

            // Seguridad y Acceso → Usuarios: Pestañas para gestión de usuarios.
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

            // Seguridad y Acceso → Roles: Pestañas para roles y permisos.
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

            // Gestión de Módulos → Módulos: Pestañas para módulos.
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

            // Gestión de Módulos → Pestañas: Pestañas para pestañas.
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

            // Recursos Humanos → Documentos: Pestañas para documentos.
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

            // Recursos Humanos → Calendario: Pestañas para calendario.
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

        // Loop: Procesar cada pestaña.
        foreach ($pestanas as $item) {
            // Buscar módulo por nombre.
            $modulo = Modulo::where('nombre', $item['modulo'])->first();

            if (!$modulo) continue;  // Saltar si módulo no existe.

            // Insertar o actualizar pestaña (clave: modulo_id + nombre).
            Pestana::firstOrCreate(
                [
                    'modulo_id' => $modulo->id,  // FK al módulo.
                    'nombre'    => $item['nombre'],  // Nombre único por módulo.
                ],
                [
                    'ruta'      => $item['ruta'],  // Ruta.
                ]
            );
        }
    }
}
