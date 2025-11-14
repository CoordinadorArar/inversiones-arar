<?php

namespace App\Http\Controllers;

use App\Models\TipoIdentificacion;
use App\Http\Requests\StoreTiposIdentificacionesRequest;
use App\Http\Requests\UpdateTiposIdentificacionesRequest;

class TiposIdentificacionesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreTiposIdentificacionesRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TipoIdentificacion $tiposIdentificaciones)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TipoIdentificacion $tiposIdentificaciones)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTiposIdentificacionesRequest $request, TipoIdentificacion $tiposIdentificaciones)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TipoIdentificacion $tiposIdentificaciones)
    {
        //
    }
}
