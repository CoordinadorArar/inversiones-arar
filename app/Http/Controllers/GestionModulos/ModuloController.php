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
        $modulos = Modulo::with(['moduloPadre', 'modulosHijos'])
            // ->orderBy('modulo_padre_id')
            ->orderByDesc('id')
            ->get()
            ->map(function ($modulo) {
                return [
                    'id' => $modulo->id,
                    'nombre' => $modulo->nombre,
                    'icono' => $modulo->icono,
                    'ruta' => $modulo->moduloPadre 
                        ? $modulo->moduloPadre->ruta . $modulo->ruta 
                        : $modulo->ruta,
                    'es_padre' => $modulo->es_padre,
                    'modulo_padre' => $modulo->moduloPadre ? [
                        'id' => $modulo->moduloPadre->id,
                        'nombre' => $modulo->moduloPadre->nombre,
                    ] : null,
                    'tiene_hijos' => $modulo->modulosHijos->isNotEmpty(),
                    'cantidad_hijos' => $modulo->modulosHijos->count(),                    
                ];
            });

        return Inertia::render('Modulos:GestionModulos/Modulos/pages/Listado', [
            'tabs' => $this->tabs,
            'modulos' => $modulos,
            'moduloNombre' => $this->moduloNombre,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreModuloRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Modulo $modulo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Modulo $modulo)
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
