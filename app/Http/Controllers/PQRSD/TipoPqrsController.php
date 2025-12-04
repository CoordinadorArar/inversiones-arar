<?php

namespace App\Http\Controllers\PQRSD;

use App\Http\Controllers\Controller;
use App\Models\PQRSD\TipoPqrs;
use App\Http\Requests\PQRSD\StoreTipoPqrsRequest;
use App\Http\Requests\PQRSD\UpdateTipoPqrsRequest;
use App\Models\GestionModulos\Modulo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador para gestionar tipos de PQRSD en el módulo de Administración Web.
 * Maneja operaciones CRUD (crear, leer, actualizar, eliminar) para tipos de PQRSD,
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 *
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class TipoPqrsController extends Controller
{
    /**
     * ID fijo del módulo Tablas Maestras (no cambia).
     */
    protected int $moduloId = 8;

    /**
     * ID fijo de la pestaña Tipos de PQRSD (no cambia).
     */
    protected int $pestanaId = 6;

    /**
     * Rol del usuario autenticado (cargado en constructor).
     * Contiene el objeto rol para acceder a permisos y pestañas.
     */
    protected $rol;

    /**
     * Pestañas accesibles del módulo para el rol (array de pestañas).
     * Lista de pestañas que el usuario puede ver según su rol.
     */
    protected $tabs;

    /**
     * Nombre del módulo (para pasar a vistas).
     * Nombre del módulo obtenido de la base de datos, usado en las vistas de Inertia.
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
     * Muestra la lista de tipos de PQRSD en la vista de React via Inertia.
     * Recupera todos los tipos ordenados por ID descendente, junto con pestañas, permisos y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        $permisos = $this->rol->getPermisosPestana($this->pestanaId);

        return Inertia::render('Modulos:AdministracionWeb/TablasMaestras/pages/TiposPQRSD', [
            'tabs' => $this->tabs,
            'tipos' => TipoPqrs::orderByDesc('id')->get(),
            'moduloNombre' => $this->moduloNombre,
            'permisos' => $permisos,
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
    public function store(StoreTipoPqrsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TipoPqrs $tiposPqrs)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TipoPqrs $tiposPqrs)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTipoPqrsRequest $request, TipoPqrs $tiposPqrs)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TipoPqrs $tiposPqrs)
    {
        //
    }
}
