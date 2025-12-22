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
 * Maneja vistas de listado y gestión, operaciones CRUD (crear, leer, actualizar, eliminar),
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 * Calcula rutas completas y jerarquías considerando módulos padre.
 * Maneja dos pestañas: Listado y Gestión.
 *
 * @author Yariangel Aray
 * @date 2025-12-12
 */
class PestanaController extends Controller
{
    /**
     * ID fijo del módulo "Pestañas".
     * Se usa para obtener pestañas y nombre del módulo.
     *
     * @var int
     */
    protected int $moduloId = 12;

    /**
     * Rol del usuario autenticado.
     * Contiene la lógica de permisos por pestaña.
     *
     * @var mixed
     */
    protected $rol;

    /**
     * Pestañas accesibles del módulo según el rol.
     *
     * @var mixed
     */
    protected $tabs;

    /**
     * Nombre del módulo cargado desde base de datos.
     *
     * @var mixed
     */
    protected $moduloNombre;

    /**
     * Constructor: Inicializa propiedades con datos del usuario autenticado.
     * Carga rol, pestañas accesibles y nombre del módulo para usar en métodos.
     * Se ejecuta automáticamente al instanciar el controlador.
     */
    public function __construct()
    {
        // Obtiene el rol del usuario logueado.
        $this->rol = Auth::user()->rol;

        // Obtiene pestañas accesibles del módulo para el rol (método en modelo Rol).
        $this->tabs = $this->rol->getPestanasModulo($this->moduloId);

        // Obtiene nombre del módulo por ID.
        $this->moduloNombre = Modulo::find($this->moduloId)->nombre;
    }

    /**
     * Muestra la vista de listado de pestañas en React via Inertia.
     * Renderiza el componente 'Listado' con pestañas ordenadas, pestañas y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:GestionModulos/Pestanas/pages/Listado', [
            'tabs' => $this->tabs,
            'pestanas' => $this->getPestanasCacheadas(),
            'moduloNombre' => $this->moduloNombre,
        ]);
    }

    /**
     * Muestra la vista de gestión de pestañas en React via Inertia.
     * Renderiza el componente 'Gestion' con pestañas (si tiene permiso de editar), módulos disponibles para asignar, permisos de la pestaña 15 y datos del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function gestion()
    {
        // Obtiene permisos específicos de la pestaña 15 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(15);

        // Si puede editar, enviar pestañas; si no, array vacío.
        $pestanas = in_array('editar', $permisos) 
            ? $this->getPestanasCacheadas() 
            : [];

        // Renderiza vista Inertia con datos.
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
     * Vista: Gestión - Modo crear.
     * Renderiza la misma vista pero con el formulario en modo crear.
     * URL: /gestion/crear.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Obtiene permisos específicos de la pestaña 15 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(15);

        if (!in_array('crear', $permisos)) {
            // Retorna la vista de gestión con un error adicional (sin re-renderizar, solo agrega prop 'error').
            return $this->gestion()->with('error', 'No tienes permiso para crear pestañas');
        }

        // Si puede editar, enviar pestañas; si no, array vacío.
        $pestanas = in_array('editar', $permisos)
            ? $this->getPestanasCacheadas()
            : [];

        // Renderiza vista Inertia con datos.
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
     * Vista: Gestión - Modo editar.
     * Renderiza la misma vista pero con el formulario en modo editar.
     * URL: /gestion/{id}.
     *
     * @param int $id ID de la pestaña a editar.
     * @return \Inertia\Response
     */
    public function edit(int $id)
    {
        // Obtiene permisos específicos de la pestaña 15 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(15);

        if (!in_array('editar', $permisos)) {
            // Retorna la vista de gestión con un error adicional (sin re-renderizar, solo agrega prop 'error').
            return $this->gestion()->with('error', 'No tienes permiso para editar pestañas');
        }

        // Verificar que la pestaña existe.
        $pestana = Pestana::find($id);

        if (!$pestana) {
            // Retorna la vista de gestión con un error adicional (sin re-renderizar, solo agrega prop 'error').
            return $this->gestion()->with('error', 'La pestaña no existe');
        }

        // Obtener todas las pestañas para el select.
        $pestanas = $this->getPestanasCacheadas();

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
     * Crea una nueva pestaña en la base de datos.
     * Valida permisos, procesa permisos extra y retorna respuesta JSON con ruta completa y jerarquía calculadas.
     *
     * @param PestanaRequest $request Solicitud con datos validados para crear la pestaña.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function store(PestanaRequest $request)
    {
        // Obtiene permisos específicos de la pestaña 15 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(15);

        // Validar permiso.
        if (!in_array('crear', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para crear pestañas'
            ], 403);
        }

        try {
            $validated = $request->validated();

            // Crear pestaña. Guarda null en permisos_extra si está vacío.
            $pestana = Pestana::create([
                'nombre' => $validated['nombre'],
                'ruta' => $validated['ruta'],
                'modulo_id' => $validated['modulo_id'],
                'permisos_extra' => $validated['permisos_extra'] && !empty($validated['permisos_extra']) ? $validated['permisos_extra'] : null,
            ]);

            // Invalidar cache después de crear.
            Cache::forget('pestanas_list');

            // Cargar relaciones para calcular ruta completa y jerarquía.
            $pestana->load(['modulo.moduloPadre']);

            $modulo = $pestana->modulo;
            $moduloPadre = $modulo->moduloPadre;

            // Flag para detectar si el padre fue eliminado (modulo_padre_id existe pero moduloPadre es null).
            $padreEliminado = $modulo->modulo_padre_id && !$moduloPadre;

            // Construir ruta completa concatenando módulo padre (si existe) + módulo + pestaña.
            $rutaCompleta = '';
            if (!$padreEliminado && $moduloPadre) {
                $rutaCompleta .= $moduloPadre->ruta;
            }
            $rutaCompleta .= $modulo->ruta . $pestana->ruta;

            // Construir jerarquía (breadcrumb) mostrando módulo padre (si existe) > módulo.
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
            \Log::error('Error al crear pestaña: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al crear la pestaña. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Actualiza una pestaña existente en la base de datos.
     * Valida permisos, procesa permisos extra y retorna respuesta JSON con ruta completa y jerarquía calculadas.
     *
     * @param PestanaRequest $request Solicitud con datos validados para actualizar.
     * @param int $id ID de la pestaña a actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function update(PestanaRequest $request, int $id)
    {
        // Obtiene permisos específicos de la pestaña 15 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(15);

        // Validar permiso.
        if (!in_array('editar', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para editar pestañas'
            ], 403);
        }

        try {
            $pestana = Pestana::findOrFail($id);
            $validated = $request->validated();

            // Actualizar pestaña. Guarda null en permisos_extra si está vacío.
            $pestana->update([
                'nombre' => $validated['nombre'],
                'ruta' => $validated['ruta'],
                'modulo_id' => $validated['modulo_id'],
                'permisos_extra' => $validated['permisos_extra'] && !empty($validated['permisos_extra']) ? $validated['permisos_extra'] : null,
            ]);

            // Invalidar cache después de actualizar.
            Cache::forget('pestanas_list');

            // Cargar relaciones para calcular ruta completa y jerarquía.
            $pestana->load(['modulo.moduloPadre']);

            $modulo = $pestana->modulo;
            $moduloPadre = $modulo->moduloPadre;

            // Flag para detectar si el padre fue eliminado (modulo_padre_id existe pero moduloPadre es null).
            $padreEliminado = $modulo->modulo_padre_id && !$moduloPadre;

            // Construir ruta completa concatenando módulo padre (si existe) + módulo + pestaña.
            $rutaCompleta = '';
            if (!$padreEliminado && $moduloPadre) {
                $rutaCompleta .= $moduloPadre->ruta;
            }
            $rutaCompleta .= $modulo->ruta . $pestana->ruta;

            // Construir jerarquía (breadcrumb) mostrando módulo padre (si existe) > módulo.
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
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar pestaña: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al actualizar la pestaña. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Elimina una pestaña de la base de datos (soft delete).
     * Valida permisos y retorna respuesta JSON.
     *
     * @param int $id ID de la pestaña a eliminar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function destroy(int $id)
    {
        // Obtiene permisos específicos de la pestaña 15 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(15);

        // Validar permiso.
        if (!in_array('eliminar', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para eliminar pestañas'
            ], 403);
        }

        try {
            $pestana = Pestana::findOrFail($id);

            // Soft delete.
            $pestana->delete();

            // Invalidar cache después de eliminar.
            Cache::forget('pestanas_list');

            return response()->json([
                'message' => 'Pestaña eliminada correctamente'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al eliminar pestaña: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al eliminar la pestaña. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Método auxiliar para obtener pestañas cacheadas con rutas completas y jerarquía.
     * Cachea por 5 minutos para evitar consultas repetidas.
     * Calcula ruta completa concatenando módulo padre + módulo + pestaña, y construye jerarquía (breadcrumb).
     * Detecta si el módulo o su padre fueron eliminados.
     *
     * @return \Illuminate\Support\Collection
     */
    private function getPestanasCacheadas()
    {
        return Cache::remember('pestanas_list', 300, function () { // 300 segundos = 5 minutos
            return Pestana::with(['modulo.moduloPadre'])
                ->orderByDesc('id')
                ->get()
                ->map(function ($pestana) {
                    $modulo = $pestana->modulo;
                    $moduloEliminado = !$modulo;

                    // Si el módulo fue eliminado, retornar estructura básica indicando el error.
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

                    // Flag para detectar si el padre fue eliminado (modulo_padre_id existe pero moduloPadre es null).
                    $padreEliminado = $modulo->modulo_padre_id && !$moduloPadre;

                    // Construir ruta completa concatenando módulo padre (si existe) + módulo + pestaña.
                    $rutaCompleta = '';
                    if (!$padreEliminado && $moduloPadre) {
                        $rutaCompleta .= $moduloPadre->ruta;
                    }
                    $rutaCompleta .= $modulo->ruta . $pestana->ruta;

                    // Construir jerarquía (breadcrumb) mostrando módulo padre (si existe) > módulo.
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
                        'permisos_extra' => $pestana->permisos_extra ? json_decode($pestana->permisos_extra, true) : [],
                    ];
                });
        });
    }

    /**
     * Método auxiliar para obtener módulos disponibles para asignar a pestañas.
     * Retorna solo módulos hijos y directos (es_padre = false), excluyendo módulos padre.
     * Calcula ruta completa considerando módulo padre si existe.
     *
     * @return \Illuminate\Support\Collection
     */
    private function getModulosDisponibles()
    {
        return Modulo::with('moduloPadre')
            ->where('es_padre', false)
            ->orderBy('nombre')
            ->get()
            ->map(function ($modulo) {
                $moduloPadre = $modulo->moduloPadre;

                // Flag para detectar si el padre fue eliminado (modulo_padre_id existe pero moduloPadre es null).
                $padreEliminado = $modulo->modulo_padre_id && !$moduloPadre;

                // Construir ruta completa concatenando módulo padre (si existe) + módulo.
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
}