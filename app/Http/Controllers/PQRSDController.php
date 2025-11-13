<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Support\Facades\DB;

/**
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-13
 */

class PQRSDController extends Controller
{
    /**
     * Método index - Muestra la página de empresas.
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        return inertia('Public/PQRSD');
    }
}
