<?php

namespace App\Http\Controllers\GestionModulos;

use App\Http\Controllers\Controller;
use App\Models\GestionModulos\Modulo;
use App\Http\Requests\GestionModulos\StoreModuloRequest;
use App\Http\Requests\GestionModulos\UpdateModuloRequest;
use Illuminate\Support\Facades\Auth;
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
                    ? ($modulo->moduloPadre->ruta . $modulo->ruta)
                    : $modulo->ruta;

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
     * Store a newly created resource in storage.
     */
    public function store(StoreModuloRequest $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateModuloRequest $request, Modulo $modulo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Modulo $modulo)
    {
        //
    }
}
