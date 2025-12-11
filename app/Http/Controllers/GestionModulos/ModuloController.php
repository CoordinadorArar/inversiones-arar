<?php

namespace App\Http\Controllers\GestionModulos;

use App\Http\Controllers\Controller;
use App\Http\Requests\GestionModulos\ModuloRequest;
use App\Models\GestionModulos\Modulo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ModuloController extends Controller
{
    /**
     * ID fijo del módulo "Modulos" (no cambia).
     * Usado para acceder a datos relacionados con el módulo.
     *
     * @var int
     */
    protected int $moduloId = 11;

    /**
     * Rol del usuario autenticado (cargado en constructor).
     * Contiene el objeto rol para acceder a permisos y pestañas.
     *
     * @var mixed
     */
    protected $rol;

    /**
     * Pestañas accesibles del módulo para el rol (array de pestañas).
     * Lista de pestañas que el usuario puede ver según su rol.
     *
     * @var mixed
     */
    protected $tabs;

    /**
     * Nombre del módulo (para pasar a vistas).
     * Nombre del módulo obtenido de la base de datos, usado en las vistas de Inertia.
     *
     * @var mixed
     */
    protected $moduloNombre;

    /**
     * Obtener módulos cacheados con rutas concatenadas
     */
    private function getModulosCacheados()
    {
        return Modulo::with(['moduloPadre', 'modulosHijos'])
            ->orderByDesc('id')
            ->get()
            ->map(function ($modulo) {
                // Concatenar ruta si tiene padre
                $rutaCompleta = $modulo->modulo_padre_id
                    ? ($modulo->moduloPadre?->ruta . $modulo->ruta)
                    : $modulo->ruta;

                // Flag para saber si el padre fue eliminado
                $padreEliminado = $modulo->modulo_padre_id && !$modulo->moduloPadre;

                return [
                    'id' => $modulo->id,
                    'nombre' => $modulo->nombre,
                    'icono' => $modulo->icono,
                    'ruta' => $modulo->ruta,
                    'ruta_completa' => $rutaCompleta,
                    'es_padre' => $modulo->es_padre,
                    'modulo_padre_id' => $modulo->modulo_padre_id,
                    'modulo_padre_nombre' => $modulo->moduloPadre?->nombre,
                    'modulo_padre_ruta' => $modulo->moduloPadre?->ruta,
                    'padre_eliminado' => $padreEliminado,
                    'permisos_extra' => $modulo->permisos_extra ?? [],
                    'cant_hijos' => $modulo->modulosHijos->count(),
                ];
            });
    }

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
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Modulos:GestionModulos/Modulos/pages/Listado', [
            'tabs' => $this->tabs,
            'modulos' => $this->getModulosCacheados(),
            'moduloNombre' => $this->moduloNombre,
        ]);
    }

    /**
     * Vista: Gestión de módulos
     */
    public function gestion()
    {
        $permisos = $this->rol->getPermisosPestana(14);
        $modulos = in_array('editar', $permisos) ? $this->getModulosCacheados() : [];

        // Obtener solo módulos padre para el combo
        $modulosPadre = Modulo::where('es_padre', true)
            ->orderBy('nombre')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'nombre' => $m->nombre,
                'ruta' => $m->ruta,
            ]);

        return Inertia::render('Modulos:GestionModulos/Modulos/pages/Gestion', [
            'tabs' => $this->tabs,
            'modulos' => $modulos,
            'modulosPadre' => $modulosPadre,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'idle',
            'initialModuloId' => null,
        ]);
    }

    /**
     * Vista: Gestión - Modo crear
     */
    public function create()
    {
        $permisos = $this->rol->getPermisosPestana(14);

        if (!in_array('crear', $permisos)) {
            return $this->gestion()->with('error', 'No tienes permiso para crear módulos');
        }

        $modulos = (in_array('editar', $permisos) && in_array('crear', $permisos))
            ? $this->getModulosCacheados()
            : [];

        $modulosPadre = Modulo::where('es_padre', true)
            ->orderBy('nombre')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'nombre' => $m->nombre,
                'ruta' => $m->ruta,
            ]);

        return Inertia::render('Modulos:GestionModulos/Modulos/pages/Gestion', [
            'tabs' => $this->tabs,
            'modulos' => $modulos,
            'modulosPadre' => $modulosPadre,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'create',
            'initialModuloId' => null,
        ]);
    }

    /**
     * Vista: Gestión - Modo editar
     */
    public function edit(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(14);

        if (!in_array('editar', $permisos)) {
            return $this->gestion()->with('error', 'No tienes permiso para editar módulos');
        }

        $modulo = Modulo::find($id);
        if (!$modulo) {
            return $this->gestion()->with('error', 'El módulo no existe');
        }

        $modulos = in_array('editar', $permisos) ? $this->getModulosCacheados() : [];

        $modulosPadre = Modulo::where('es_padre', true)
            ->where('id', '!=', $id)
            ->orderBy('nombre')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'nombre' => $m->nombre,
                'ruta' => $m->ruta,
            ]);

        return Inertia::render('Modulos:GestionModulos/Modulos/pages/Gestion', [
            'tabs' => $this->tabs,
            'modulos' => $modulos,
            'modulosPadre' => $modulosPadre,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'edit',
            'initialModuloId' => $id,
        ]);
    }

    /**
     * Crear nuevo módulo
     */
    public function store(ModuloRequest $request)
    {
        $permisos = $this->rol->getPermisosPestana(14);

        if (!in_array('crear', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para crear módulos'
            ], 403);
        }

        try {
            $validated = $request->validated();

            $modulo = Modulo::create([
                'nombre' => $validated['nombre'],
                'icono' => $validated['icono'],
                'ruta' => $validated['ruta'],
                'es_padre' => $validated['es_padre'],
                'modulo_padre_id' => $validated['modulo_padre_id'] ?? null,
                'permisos_extra' => $validated['permisos_extra'] && !empty($validated['permisos_extra']) ? $validated['permisos_extra'] : null,  // Guarda null si es vacío
            ]);

            Cache::forget('modulos_list');

            // Cargar relaciones para la respuesta
            $modulo->load(['moduloPadre', 'modulosHijos']);

            $rutaCompleta = $modulo->modulo_padre_id
                ? ($modulo->moduloPadre->ruta . $modulo->ruta)
                : $modulo->ruta;

            return response()->json([
                'message' => 'Módulo creado correctamente',
                'modulo' => [
                    'id' => $modulo->id,
                    'nombre' => $modulo->nombre,
                    'icono' => $modulo->icono,
                    'ruta' => $modulo->ruta,
                    'ruta_completa' => $rutaCompleta,
                    'es_padre' => $modulo->es_padre,
                    'modulo_padre_id' => $modulo->modulo_padre_id,
                    'modulo_padre_nombre' => $modulo->moduloPadre?->nombre,
                    'modulo_padre_ruta' => $modulo->moduloPadre?->ruta,
                    'permisos_extra' => $modulo->permisos_extra ?? [],
                    'cant_hijos' => 0,
                ]
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creando módulo: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al crear el módulo'
            ], 500);
        }
    }

    /**
     * Actualizar módulo existente
     */
    public function update(ModuloRequest $request, int $id)
    {
        $permisos = $this->rol->getPermisosPestana(14);

        if (!in_array('editar', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para editar módulos'
            ], 403);
        }

        try {
            $modulo = Modulo::findOrFail($id);
            $validated = $request->validated();

            $modulo->update([
                'nombre' => $validated['nombre'],
                'icono' => $validated['icono'],
                'ruta' => $validated['ruta'],
                'es_padre' => $validated['es_padre'],
                'modulo_padre_id' => $validated['modulo_padre_id'] ?? null,
                'permisos_extra' => $validated['permisos_extra'] && !empty($validated['permisos_extra']) ? $validated['permisos_extra'] : null,  // Guarda null si es vacío
            ]);


            Cache::forget('modulos_list');

            $modulo->load(['moduloPadre', 'modulosHijos']);

            $rutaCompleta = $modulo->modulo_padre_id
                ? ($modulo->moduloPadre->ruta . $modulo->ruta)
                : $modulo->ruta;

            return response()->json([
                'message' => 'Módulo actualizado correctamente',
                'modulo' => [
                    'id' => $modulo->id,
                    'nombre' => $modulo->nombre,
                    'icono' => $modulo->icono,
                    'ruta' => $modulo->ruta,
                    'ruta_completa' => $rutaCompleta,
                    'es_padre' => $modulo->es_padre,
                    'modulo_padre_id' => $modulo->modulo_padre_id,
                    'modulo_padre_nombre' => $modulo->moduloPadre?->nombre,
                    'modulo_padre_ruta' => $modulo->moduloPadre?->ruta,
                    'permisos_extra' => $modulo->permisos_extra ?? [],
                    'cant_hijos' => $modulo->modulosHijos->count(),
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error actualizando módulo: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al actualizar el módulo'
            ], 500);
        }
    }

    /**
     * Eliminar módulo
     */
    public function destroy(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(14);

        if (!in_array('eliminar', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para eliminar módulos'
            ], 403);
        }

        try {
            $modulo = Modulo::findOrFail($id);

            // // Verificar que no tenga módulos hijos
            // if ($modulo->modulosHijos()->count() > 0) {
            //     return response()->json([
            //         'error' => 'No se puede eliminar un módulo que tiene módulos hijos'
            //     ], 422);
            // }

            // // Verificar que no tenga pestañas
            // if ($modulo->pestanas()->count() > 0) {
            //     return response()->json([
            //         'error' => 'No se puede eliminar un módulo que tiene pestañas asociadas'
            //     ], 422);
            // }

            $modulo->delete();
            Cache::forget('modulos_list');

            return response()->json([
                'message' => 'Módulo eliminado correctamente'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error eliminando módulo: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al eliminar el módulo'
            ], 500);
        }
    }
}
