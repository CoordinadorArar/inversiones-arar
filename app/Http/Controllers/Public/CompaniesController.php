<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\EmpresaWeb;
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
        return inertia('Public/Companies', [
            'empresas' => EmpresaWeb::select('id_siesa as id', 'razon_social', 'tipo_empresa', 'descripcion', 'sitio_web', 'logo_url')
                ->where('mostrar_en_empresas', true)   // solo las que deben mostrarse
                ->get()
        ]);
    }
}
