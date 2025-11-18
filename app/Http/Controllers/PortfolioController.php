<?php

namespace App\Http\Controllers;

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
        return inertia('Public/Portfolio');
    }
}
