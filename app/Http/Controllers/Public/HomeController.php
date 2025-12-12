<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\ConfiguracionService;

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
        $images = ConfiguracionService::getGroup('image');

        return inertia('Public/Home', ['images' => $images]);
    }

}
