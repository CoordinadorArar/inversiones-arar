<?php

namespace App\Http\Controllers;

/**
 * Controlador EmpresaWebController.
 * 
 * Propósito: Maneja vistas y lógica para el módulo "Empresas" dentro de "Administración Web".
 * Usa permisos basados en roles y pestañas para controlar acceso. Renderiza componentes React via Inertia.
 * 
 * Propiedades:
 * - $moduloId: ID fijo del módulo (6, para Empresas).
 * - $rol: Rol del usuario autenticado.
 * - $tabs: Pestañas accesibles del módulo para el rol.
 * - $moduloNombre: Nombre del módulo (para UI).
 * 
 * Métodos:
 * - index: Vista de listado de empresas.
 * - gestion: Vista de gestión (crear/editar) de empresas.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-27
 */

use App\Models\EmpresaWeb;
use App\Http\Requests\EmpresasWeb\StoreEmpresaWebRequest;
use App\Http\Requests\EmpresasWeb\UpdateEmpresaWebRequest;
use App\Models\GestionModulos\Modulo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmpresaWebController extends Controller
{

    // ID fijo del módulo Empresas (no cambia).
    protected int $moduloId = 6;

    // Rol del usuario autenticado (cargado en constructor).
    protected $rol;

    // Pestañas accesibles del módulo para el rol (array de pestañas).
    protected $tabs;

    // Nombre del módulo (para pasar a vistas).
    protected $moduloNombre;

    /**
     * Constructor: Inicializa propiedades con datos del usuario autenticado.
     * 
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
     * BLOQUE: index - Vista de listado de empresas.
     * 
     * Renderiza componente 'Listado' con empresas, pestañas, permisos y nombre del módulo.
     * Permisos específicos de la pestaña 1 (Listado).
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        // Obtiene permisos específicos de la pestaña 1 (Listado) para el rol.
        $permisos = $this->rol->getPermisosPestana(1);
        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos/AdministracionWeb/Empresas/Listado', [
            'tabs' => $this->tabs,              // Pestañas accesibles.
            'empresas' => EmpresaWeb::all(),    // Todas las empresas.
            'permisos' => $permisos,            // Permisos de la pestaña.
            'moduloNombre' => $this->moduloNombre,  // Nombre del módulo.
        ]);
    }


    /**
     * BLOQUE: gestion - Vista de gestión de empresas.
     * 
     * Renderiza componente 'Gestion' para crear/editar empresas.
     * Similar a index, pero con permisos de la pestaña 2 (Gestión).
     * 
     * @return \Inertia\Response
     */
    public function gestion()
    {
        // Obtiene permisos específicos de la pestaña 2 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(2);
        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos/AdministracionWeb/Empresas/Gestion', [
            'tabs' => $this->tabs,              // Pestañas accesibles.
            'empresas' => EmpresaWeb::all(),    // Todas las empresas.
            'permisos' => $permisos,            // Permisos de la pestaña.
            'moduloNombre' => $this->moduloNombre,  // Nombre del módulo.
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
    public function store(StoreEmpresaWebRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(EmpresaWeb $empresa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EmpresaWeb $empresa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmpresaWebRequest $request, EmpresaWeb $empresa)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmpresaWeb $empresa)
    {
        //
    }
}
