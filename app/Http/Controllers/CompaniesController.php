<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Exception;
use Illuminate\Support\Facades\DB;

/**
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-12
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
