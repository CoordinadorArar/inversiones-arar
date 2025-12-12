<?php

namespace App\Http\Controllers\GestionModulos;

use App\Http\Controllers\Controller;
use App\Http\Requests\GestionModulos\ModuloRequest;
use App\Models\GestionModulos\Modulo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

/**
 * Controlador para gestionar módulos del sistema.
 * Maneja vistas de listado y gestión, operaciones CRUD (crear, leer, actualizar, eliminar),
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 * Maneja dos pestañas: Listado y Gestión.
 *
 * @author Yariangel Aray
 * @date 2025-12-09
 */
class ModuloController extends Controller
{
    /**
     * ID fijo del módulo "Modulos".
     * Se usa para obtener pestañas y nombre del módulo.
     *
     * @var int
     */
    protected int $moduloId = 11;

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
     * Muestra la vista de listado de módulos en React via Inertia.
     * Renderiza el componente 'Listado' con módulos ordenados, pestañas y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:GestionModulos/Modulos/pages/Listado', [
            'tabs' => $this->tabs,
            'modulos' => $this->getModulosCacheados(),
            'moduloNombre' => $this->moduloNombre,
        ]);
    }

    /**
     * Muestra la vista de gestión de módulos en React via Inertia.
     * Renderiza el componente 'Gestion' con módulos (si tiene permiso de editar), módulos padre para selector, permisos de la pestaña 14 y datos del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function gestion()
    {
        // Obtiene permisos específicos de la pestaña 14 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(14);

        // Si puede editar, enviar módulos; si no, array vacío.
        $modulos = in_array('editar', $permisos)
            ? $this->getModulosCacheados()
            : [];

        // Obtener solo módulos padre para el combo de selección.
        $modulosPadre = Modulo::where('es_padre', true)
            ->orderBy('nombre')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'nombre' => $m->nombre,
                'ruta' => $m->ruta,
            ]);

        // Renderiza vista Inertia con datos.
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
     * Vista: Gestión - Modo crear.
     * Renderiza la misma vista pero con el formulario en modo crear.
     * URL: /gestion/crear.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Obtiene permisos específicos de la pestaña 14 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(14);

        if (!in_array('crear', $permisos)) {
            // Retorna la vista de gestión con un error adicional (sin re-renderizar, solo agrega prop 'error').
            return $this->gestion()->with('error', 'No tienes permiso para crear módulos');
        }

        // Si puede editar, enviar módulos; si no, array vacío.
        $modulos = in_array('editar', $permisos)
            ? $this->getModulosCacheados()
            : [];

        // Obtener solo módulos padre para el combo de selección.
        $modulosPadre = Modulo::where('es_padre', true)
            ->orderBy('nombre')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'nombre' => $m->nombre,
                'ruta' => $m->ruta,
            ]);

        // Renderiza vista Inertia con datos.
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
     * Vista: Gestión - Modo editar.
     * Renderiza la misma vista pero con el formulario en modo editar.
     * URL: /gestion/{id}.
     *
     * @param int $id ID del módulo a editar.
     * @return \Inertia\Response
     */
    public function edit(int $id)
    {
        // Obtiene permisos específicos de la pestaña 14 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(14);

        if (!in_array('editar', $permisos)) {
            // Retorna la vista de gestión con un error adicional (sin re-renderizar, solo agrega prop 'error').
            return $this->gestion()->with('error', 'No tienes permiso para editar módulos');
        }

        // Verificar que el módulo existe.
        $modulo = Modulo::find($id);

        if (!$modulo) {
            // Retorna la vista de gestión con un error adicional (sin re-renderizar, solo agrega prop 'error').
            return $this->gestion()->with('error', 'El módulo no existe');
        }

        // Obtener todos los módulos para el select.
        $modulos = $this->getModulosCacheados();

        // Obtener módulos padre excluyendo el módulo actual (para evitar asignarse a sí mismo como padre).
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
     * Crea un nuevo módulo en la base de datos.
     * Valida permisos, procesa permisos extra y retorna respuesta JSON con ruta completa calculada.
     *
     * @param ModuloRequest $request Solicitud con datos validados para crear el módulo.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function store(ModuloRequest $request)
    {
        // Obtiene permisos específicos de la pestaña 14 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(14);

        // Validar permiso.
        if (!in_array('crear', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para crear módulos'
            ], 403);
        }

        try {
            $validated = $request->validated();

            // Crear módulo. Guarda null en permisos_extra si está vacío.
            $modulo = Modulo::create([
                'nombre' => $validated['nombre'],
                'icono' => $validated['icono'],
                'ruta' => $validated['ruta'],
                'es_padre' => $validated['es_padre'],
                'modulo_padre_id' => $validated['modulo_padre_id'] ?? null,
                'permisos_extra' => $validated['permisos_extra'] && !empty($validated['permisos_extra']) ? $validated['permisos_extra'] : null,
            ]);

            // Invalidar cache después de crear.
            Cache::forget('modulos_list');

            // Cargar relaciones para calcular ruta completa.
            $modulo->load(['moduloPadre', 'modulosHijos']);

            // Concatenar ruta completa si tiene módulo padre.
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
            \Log::error('Error al crear módulo: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al crear el módulo. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Actualiza un módulo existente en la base de datos.
     * Valida permisos, procesa permisos extra y retorna respuesta JSON con ruta completa calculada.
     *
     * @param ModuloRequest $request Solicitud con datos validados para actualizar.
     * @param int $id ID del módulo a actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function update(ModuloRequest $request, int $id)
    {
        // Obtiene permisos específicos de la pestaña 14 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(14);

        // Validar permiso.
        if (!in_array('editar', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para editar módulos'
            ], 403);
        }

        try {
            $modulo = Modulo::findOrFail($id);
            $validated = $request->validated();

            // Actualizar módulo. Guarda null en permisos_extra si está vacío.
            $modulo->update([
                'nombre' => $validated['nombre'],
                'icono' => $validated['icono'],
                'ruta' => $validated['ruta'],
                'es_padre' => $validated['es_padre'],
                'modulo_padre_id' => $validated['modulo_padre_id'] ?? null,
                'permisos_extra' => $validated['permisos_extra'] && !empty($validated['permisos_extra']) ? $validated['permisos_extra'] : null,
            ]);

            // Invalidar cache después de actualizar.
            Cache::forget('modulos_list');
            Cache::forget('pestanas_list');

            // Cargar relaciones para calcular ruta completa.
            $modulo->load(['moduloPadre', 'modulosHijos']);

            // Concatenar ruta completa si tiene módulo padre.
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
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar módulo: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al actualizar el módulo. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Elimina un módulo de la base de datos (soft delete).
     * Valida permisos y retorna respuesta JSON.
     *
     * @param int $id ID del módulo a eliminar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function destroy(int $id)
    {
        // Obtiene permisos específicos de la pestaña 14 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(14);

        // Validar permiso.
        if (!in_array('eliminar', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para eliminar módulos'
            ], 403);
        }

        try {
            $modulo = Modulo::findOrFail($id);

            // Soft delete.
            $modulo->delete();

            // Invalidar cache después de eliminar.
            Cache::forget('modulos_list');
            Cache::forget('pestanas_list');

            return response()->json([
                'message' => 'Módulo eliminado correctamente'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al eliminar módulo: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al eliminar el módulo. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Método auxiliar para obtener módulos con rutas concatenadas y conteo de hijos.
     * Calcula ruta completa concatenando con módulo padre si existe, y detecta si el padre fue eliminado.
     *
     * @return \Illuminate\Support\Collection
     */
    private function getModulosCacheados()
    {
        return Modulo::with(['moduloPadre', 'modulosHijos'])
            ->orderByDesc('id')
            ->get()
            ->map(function ($modulo) {
                // Concatenar ruta completa si tiene módulo padre.
                $rutaCompleta = $modulo->modulo_padre_id
                    ? ($modulo->moduloPadre?->ruta . $modulo->ruta)
                    : $modulo->ruta;

                // Flag para detectar si el padre fue eliminado (modulo_padre_id existe pero moduloPadre es null).
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
}
