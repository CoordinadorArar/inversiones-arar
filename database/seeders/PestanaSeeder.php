<?php

namespace Database\Seeders;

use App\Models\GestionModulos\Modulo;
use App\Models\GestionModulos\Pestana;
use Illuminate\Database\Seeder;

/**
 * Seeder para la tabla 'pestanas'.
 * 
 * Propósito: Poblar pestañas iniciales asociadas a módulos por nombre.
 * Cada pestaña pertenece a un módulo hijo (ej. "Listado" en "Empresas").
 * Usa firstOrCreate con clave compuesta para evitar duplicados.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
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
                'nombre' => 'Listado Empresas',   // Nombre de la pestaña.
                'ruta'   => '/listado'   // Ruta relativa.
            ],
            [
                'modulo' => 'Empresas',
                'nombre' => 'Gestión Empresas',
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
                'nombre' => 'Tipos de PQRS',
                'ruta'   => '/tipos-pqrsd'
            ],
            [
                'modulo' => 'Tablas Maestras',
                'nombre' => 'Estados de PQRS',
                'ruta'   => '/estados-pqrsd'
            ],

            // Seguridad y Acceso → Usuarios: Pestañas para gestión de usuarios.
            [
                'modulo' => 'Usuarios',
                'nombre' => 'Listado Usuarios',
                'ruta'   => '/listado'
            ],
            [
                'modulo' => 'Usuarios',
                'nombre' => 'Gestión Usuarios',
                'ruta'   => '/gestion',
                'permisos_extra' => [
                    "bloquear",
                    "restaurar_password"
                ]
            ],

            // Seguridad y Acceso → Roles: Pestañas para roles y permisos.
            [
                'modulo' => 'Roles',
                'nombre' => 'Listado Roles',
                'ruta'   => '/listado'
            ],
            [
                'modulo' => 'Roles',
                'nombre' => 'Gestión Roles',
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
                'nombre' => 'Listado Módulos',
                'ruta'   => '/listado'
            ],
            [
                'modulo' => 'Módulos',
                'nombre' => 'Gestión Módulos',
                'ruta'   => '/gestion'
            ],

            // Gestión de Módulos → Pestañas: Pestañas para pestañas.
            [
                'modulo' => 'Pestañas',
                'nombre' => 'Listado Pestañas',
                'ruta'   => '/listado'
            ],
            [
                'modulo' => 'Pestañas',
                'nombre' => 'Gestión Pestañas',
                'ruta'   => '/gestion'
            ],

            // Recursos Humanos → Documentos: Pestañas para documentos.
            [
                'modulo' => 'Documentos Corporativos',
                'nombre' => 'Listado Documentos',
                'ruta'   => '/listado'
            ],
            [
                'modulo' => 'Documentos Corporativos',
                'nombre' => 'Gestión Documentos',
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

            // Preparar atributos para crear/actualizar: incluir ruta y permisos_extra si existe.
            $attributes = [
                'ruta' => $item['ruta'],  // Ruta siempre presente.
            ];

            if (isset($item['permisos_extra'])) {
                $attributes['permisos_extra'] = json_encode($item['permisos_extra']);  // Serializar como JSON.
            }

            // Insertar o actualizar pestaña (clave: modulo_id + nombre).
            Pestana::firstOrCreate(
                [
                    'modulo_id' => $modulo->id,  // FK al módulo.
                    'nombre'    => $item['nombre'],  // Nombre único por módulo.
                ],
                $attributes  // Atributos para crear si no existe.
            );
        }
    }
}
