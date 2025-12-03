<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;

/**
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-11
 */

class HomeController extends Controller
{
    /**
     * Método index - Muestra la página de inicio.
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        return inertia('Public/Home');
    }

}
