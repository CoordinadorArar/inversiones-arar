<?php

namespace App\Http\Controllers;

use App\Models\EmpresaWeb;
use App\Http\Requests\EmpresasWeb\StoreEmpresaWebRequest;
use App\Http\Requests\EmpresasWeb\UpdateEmpresaWebRequest;
use App\Models\GestionModulos\Modulo;
use App\Models\GestionModulos\Pestana;
use App\Models\Rol;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmpresaWebController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rol = Auth::user()->rol;

        // IDs del módulo y pestaña
        $moduloId = 6;
        $pestanaId = 1;

        // Obtener pestañas del módulo para el layout
        $tabs = $rol->getPestanasModulo($moduloId);

        // Obtener permisos específicos de esta pestaña
        $permisos = $rol->getPermisosPestana($pestanaId);

        // Obtener datos
        $empresas = EmpresaWeb::all();

        return Inertia::render('Modulos/AdministracionWeb/Empresas/Listado', [
            'tabs' => $tabs,
            'empresas' => $empresas,
            'permisos' => $permisos, // Pasar permisos al frontend
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
