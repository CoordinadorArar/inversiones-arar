<?php

namespace Database\Seeders;

use App\Models\GestionModulos\Modulo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Seeder para la tabla 'modulos'.
 * 
 * Propósito: Poblar módulos iniciales con jerarquía (padres e hijos).
 * Padres: Categorías principales (ej. "Administración Web"). Hijos: Submódulos (ej. "Empresas").
 * Asigna `modulo_padre_id` dinámicamente buscando por nombre del padre.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-26
 */

class ModuloSeeder extends Seeder
{
    /**
     * BLOQUE: run - Insertar módulos iniciales.
     * 
     * Array $modulos: Padres (sin 'padre') e hijos (con 'padre' para asignar FK).
     * Busca padre por nombre, asigna ID, usa firstOrCreate para idempotencia.
     * 
     * @return void
     */
    public function run(): void
    {
        $modulos = [
            // Padres: Módulos principales sin padre.
            [
                'nombre' => 'Administración Web',
                'icono' => 'user-cog',  // Ícono para UI.
                'ruta' => '/administracion-web',
                'es_padre' => true,  // Marca como padre.
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
                'nombre' => 'Auditorías', // No es padre, es módulo nivel 1 (módulo con enlace directo)
                'icono' => 'scroll-text',
                'ruta' => '/auditorias',
            ],

            // Hijos: Submódulos con referencia a padre por nombre.
            [
                'nombre' => 'Empresas',
                'icono' => 'building-2',
                'ruta' => '/empresas',
                'padre' => 'Administración Web',  // Nombre del padre para asignar FK.
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
                'nombre' => 'Control de Accesos',
                'icono' => 'shield-check',
                'ruta' => '/control-accesos',
                'padre' => 'Seguridad y Acceso',
            ],
        ];

        // Loop: Procesar cada módulo.
        foreach ($modulos as $item) {
            $data = $item;  // Copia datos.

            // Si tiene 'padre', buscar módulo padre por nombre y asignar ID.
            if (isset($item['padre'])) {
                $padre = Modulo::where('nombre', $item['padre'])->first();
                if (!$padre) continue;  // Saltar si padre no existe.

                $data['modulo_padre_id'] = $padre->id;  // Asignar FK.
                unset($data['padre']);  // Remover 'padre' del array.
            }

            // Insertar o actualizar si existe (por nombre único).
            Modulo::firstOrCreate(
                ['nombre' => $item['nombre']],
                $data
            );
        }
    }
}