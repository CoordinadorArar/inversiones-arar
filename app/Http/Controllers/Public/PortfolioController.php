<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\EmpresaWeb;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    /**
     * Método index - Muestra la página de portafolio.
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        return inertia('Public/Portfolio', [
            'clientes' => EmpresaWeb::select('razon_social', 'tipo_empresa', 'logo_url')
                ->where('mostrar_en_portafolio', true)   // solo las que deben mostrarse
                ->get()
        ]);
    }
}
