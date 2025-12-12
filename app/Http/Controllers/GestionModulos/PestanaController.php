<?php

namespace App\Http\Controllers\GestionModulos;

use App\Http\Controllers\Controller;
use App\Http\Requests\GestionModulos\PestanaRequest;
use App\Models\GestionModulos\Modulo;
use App\Models\GestionModulos\Pestana;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

/**
 * Controlador para gestionar pestañas del sistema.
 * 
 * @author Yariangel Aray
 * @date 2025-12-12
 */
class PestanaController extends Controller
{
    protected int $moduloId = 12;
    protected $rol;
    protected $tabs;
    protected $moduloNombre;

    /**
     * Obtener pestañas cacheadas con rutas completas y jerarquía
     */
    private function getPestanasCacheadas()
    {
        return Cache::remember('pestanas_list', 300, function () {
            return Pestana::with(['modulo.moduloPadre'])
                ->orderByDesc('id')
                ->get()
                ->map(function ($pestana) {
                    $modulo = $pestana->modulo;
                    $moduloEliminado = !$modulo;

                    if ($moduloEliminado) {
                        return [
                            'id' => $pestana->id,
                            'nombre' => $pestana->nombre,
                            'ruta' => $pestana->ruta,
                            'ruta_completa' => $pestana->ruta,
                            'jerarquia' => 'Módulo eliminado',
                            'modulo_id' => $pestana->modulo_id,
                            'modulo_nombre' => null,
                            'modulo_eliminado' => true,
                            'padre_eliminado' => false,
                            'permisos_extra' => $pestana->permisos_extra ?? [],
                        ];
                    }

                    $moduloPadre = $modulo->moduloPadre;
                    $padreEliminado = $modulo->modulo_padre_id && !$moduloPadre;

                    // Construir ruta completa
                    $rutaCompleta = '';
                    if (!$padreEliminado && $moduloPadre) {
                        $rutaCompleta .= $moduloPadre->ruta;
                    }
                    $rutaCompleta .= $modulo->ruta . $pestana->ruta;

                    // Construir jerarquía (breadcrumb)
                    $jerarquia = '';
                    if (!$padreEliminado && $moduloPadre) {
                        $jerarquia .= $moduloPadre->nombre . '>';
                    }
                    $jerarquia .= $modulo->nombre;

                    return [
                        'id' => $pestana->id,
                        'nombre' => $pestana->nombre,
                        'ruta' => $pestana->ruta,
                        'ruta_completa' => $rutaCompleta,
                        'jerarquia' => $jerarquia,
                        'modulo_id' => $pestana->modulo_id,
                        'modulo_nombre' => $modulo->nombre,
                        'modulo_ruta' => $modulo->ruta,
                        'modulo_ruta_completa' => $padreEliminado ? $modulo->ruta : ($moduloPadre ? $moduloPadre->ruta . $modulo->ruta : $modulo->ruta),
                        'modulo_eliminado' => false,
                        'padre_eliminado' => $padreEliminado,
                        'permisos_extra' => $pestana->permisos_extra ?? [],
                    ];
                });
        });
    }

    /**
     * Obtener módulos disponibles (solo hijos y directos, NO padres)
     */
    private function getModulosDisponibles()
    {
        return Modulo::with('moduloPadre')
            ->where('es_padre', false)
            ->orderBy('nombre')
            ->get()
            ->map(function ($modulo) {
                $moduloPadre = $modulo->moduloPadre;
                $padreEliminado = $modulo->modulo_padre_id && !$moduloPadre;

                $rutaCompleta = '';
                if (!$padreEliminado && $moduloPadre) {
                    $rutaCompleta .= $moduloPadre->ruta;
                }
                $rutaCompleta .= $modulo->ruta;

                return [
                    'id' => $modulo->id,
                    'nombre' => $modulo->nombre,
                    'ruta' => $modulo->ruta,
                    'ruta_completa' => $rutaCompleta,
                    'padre_eliminado' => $padreEliminado,
                ];
            });
    }

    public function __construct()
    {
        $this->rol = Auth::user()->rol;
        $this->tabs = $this->rol->getPestanasModulo($this->moduloId);
        $this->moduloNombre = Modulo::find($this->moduloId)->nombre;
    }

    /**
     * Vista: Listado de pestañas
     */
    public function index()
    {

        return Inertia::render('Modulos:GestionModulos/Pestanas/pages/Listado', [
            'tabs' => $this->tabs,
            'pestanas' => $this->getPestanasCacheadas(),
            'moduloNombre' => $this->moduloNombre,
        ]);
    }

    /**
     * Vista: Gestión de pestañas
     */
    public function gestion()
    {
        $permisos = $this->rol->getPermisosPestana(16); // Assuming pestaña ID 16 for gestión
        $pestanas = in_array('editar', $permisos) ? $this->getPestanasCacheadas() : [];

        return Inertia::render('Modulos:GestionModulos/Pestanas/pages/Gestion', [
            'tabs' => $this->tabs,
            'pestanas' => $pestanas,
            'modulos' => $this->getModulosDisponibles(),
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'idle',
            'initialPestanaId' => null,
        ]);
    }

    /**
     * Vista: Gestión - Modo crear
     */
    public function create()
    {
        $permisos = $this->rol->getPermisosPestana(16);

        if (!in_array('crear', $permisos)) {
            return $this->gestion()->with('error', 'No tienes permiso para crear pestañas');
        }

        $pestanas = (in_array('editar', $permisos) && in_array('crear', $permisos))
            ? $this->getPestanasCacheadas()
            : [];

        return Inertia::render('Modulos:GestionModulos/Pestanas/pages/Gestion', [
            'tabs' => $this->tabs,
            'pestanas' => $pestanas,
            'modulos' => $this->getModulosDisponibles(),
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'create',
            'initialPestanaId' => null,
        ]);
    }

    /**
     * Vista: Gestión - Modo editar
     */
    public function edit(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(16);

        if (!in_array('editar', $permisos)) {
            return $this->gestion()->with('error', 'No tienes permiso para editar pestañas');
        }

        $pestana = Pestana::find($id);
        if (!$pestana) {
            return $this->gestion()->with('error', 'La pestaña no existe');
        }

        $pestanas = in_array('editar', $permisos) ? $this->getPestanasCacheadas() : [];

        return Inertia::render('Modulos:GestionModulos/Pestanas/pages/Gestion', [
            'tabs' => $this->tabs,
            'pestanas' => $pestanas,
            'modulos' => $this->getModulosDisponibles(),
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'edit',
            'initialPestanaId' => $id,
        ]);
    }

    /**
     * Crear nueva pestaña
     */
    public function store(PestanaRequest $request)
    {
        $permisos = $this->rol->getPermisosPestana(16);

        if (!in_array('crear', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para crear pestañas'
            ], 403);
        }

        try {
            $validated = $request->validated();

            $pestana = Pestana::create([
                'nombre' => $validated['nombre'],
                'ruta' => $validated['ruta'],
                'modulo_id' => $validated['modulo_id'],
                'permisos_extra' => $validated['permisos_extra'] && !empty($validated['permisos_extra']) ? $validated['permisos_extra'] : null,  // Guarda null si es vacío
            ]);

            Cache::forget('pestanas_list');

            // Cargar relaciones para respuesta
            $pestana->load(['modulo.moduloPadre']);

            $modulo = $pestana->modulo;
            $moduloPadre = $modulo->moduloPadre;
            $padreEliminado = $modulo->modulo_padre_id && !$moduloPadre;

            $rutaCompleta = '';
            if (!$padreEliminado && $moduloPadre) {
                $rutaCompleta .= $moduloPadre->ruta;
            }
            $rutaCompleta .= $modulo->ruta . $pestana->ruta;

            $jerarquia = '';
            if (!$padreEliminado && $moduloPadre) {
                $jerarquia .= $moduloPadre->nombre . ' > ';
            }
            $jerarquia .= $modulo->nombre;

            return response()->json([
                'message' => 'Pestaña creada correctamente',
                'pestana' => [
                    'id' => $pestana->id,
                    'nombre' => $pestana->nombre,
                    'ruta' => $pestana->ruta,
                    'ruta_completa' => $rutaCompleta,
                    'jerarquia' => $jerarquia,
                    'modulo_id' => $pestana->modulo_id,
                    'modulo_nombre' => $modulo->nombre,
                    'modulo_ruta' => $modulo->ruta,
                    'modulo_ruta_completa' => $padreEliminado ? $modulo->ruta : ($moduloPadre ? $moduloPadre->ruta . $modulo->ruta : $modulo->ruta),
                    'modulo_eliminado' => false,
                    'padre_eliminado' => $padreEliminado,
                    'permisos_extra' => $pestana->permisos_extra ?? [],
                ]
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creando pestaña: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al crear la pestaña'
            ], 500);
        }
    }

    /**
     * Actualizar pestaña existente
     */
    public function update(PestanaRequest $request, int $id)
    {
        $permisos = $this->rol->getPermisosPestana(16);

        if (!in_array('editar', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para editar pestañas'
            ], 403);
        }

        try {
            $pestana = Pestana::findOrFail($id);
            $validated = $request->validated();

            $pestana->update([
                'nombre' => $validated['nombre'],
                'ruta' => $validated['ruta'],
                'modulo_id' => $validated['modulo_id'],
                'permisos_extra' => $validated['permisos_extra'] && !empty($validated['permisos_extra']) ? $validated['permisos_extra'] : null,  // Guarda null si es vacío
            ]);

            Cache::forget('pestanas_list');

            $pestana->load(['modulo.moduloPadre']);

            $modulo = $pestana->modulo;
            $moduloPadre = $modulo->moduloPadre;
            $padreEliminado = $modulo->modulo_padre_id && !$moduloPadre;

            $rutaCompleta = '';
            if (!$padreEliminado && $moduloPadre) {
                $rutaCompleta .= $moduloPadre->ruta;
            }
            $rutaCompleta .= $modulo->ruta . $pestana->ruta;

            $jerarquia = '';
            if (!$padreEliminado && $moduloPadre) {
                $jerarquia .= $moduloPadre->nombre . ' > ';
            }
            $jerarquia .= $modulo->nombre;

            return response()->json([
                'message' => 'Pestaña actualizada correctamente',
                'pestana' => [
                    'id' => $pestana->id,
                    'nombre' => $pestana->nombre,
                    'ruta' => $pestana->ruta,
                    'ruta_completa' => $rutaCompleta,
                    'jerarquia' => $jerarquia,
                    'modulo_id' => $pestana->modulo_id,
                    'modulo_nombre' => $modulo->nombre,
                    'modulo_ruta' => $modulo->ruta,
                    'modulo_ruta_completa' => $padreEliminado ? $modulo->ruta : ($moduloPadre ? $moduloPadre->ruta . $modulo->ruta : $modulo->ruta),
                    'modulo_eliminado' => false,
                    'padre_eliminado' => $padreEliminado,
                    'permisos_extra' => $pestana->permisos_extra ?? [],
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error actualizando pestaña: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al actualizar la pestaña'
            ], 500);
        }
    }

    /**
     * Eliminar pestaña
     */
    public function destroy(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(16);

        if (!in_array('eliminar', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para eliminar pestañas'
            ], 403);
        }

        try {
            $pestana = Pestana::findOrFail($id);
            $pestana->delete();
            Cache::forget('pestanas_list');

            return response()->json([
                'message' => 'Pestaña eliminada correctamente'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error eliminando pestaña: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al eliminar la pestaña'
            ], 500);
        }
    }
}