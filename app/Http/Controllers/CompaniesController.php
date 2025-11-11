<?php

namespace App\Http\Controllers;

/**
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-11
 */

class CompaniesController extends Controller
{
    /**
     * Método index - Muestra la página de empresas.
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        return inertia('Public/Companies');
    }

}
