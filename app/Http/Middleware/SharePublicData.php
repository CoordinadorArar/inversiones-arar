<?php

namespace App\Http\Middleware;

/**
 * Middleware SharePublicData.
 * 
 * Propósito: Compartir datos globales a vistas públicas de Inertia (React).
 * - Comparte 'empresasHeader' (empresas visibles en header) para evitar consultas repetidas en controladores.
 * - Optimiza rendimiento: Una sola query por request, accesible en todos los componentes públicos.
 * - Se aplica solo a rutas públicas (middleware 'public') para no sobrecargar rutas auth.
 * - Usa Inertia::share() para enviar datos a React via usePage().props.
 * 
 * Por qué se usa:
 * - DRY (Don't Repeat Yourself): En lugar de consultar empresas en cada controlador (Home, Portfolio, etc.),
 *   se hace una vez aquí y se comparte globalmente.
 * - Rendimiento: Reduce DB queries y mejora UX en navegación SPA.
 * - Flexibilidad: Fácil agregar más datos compartidos (ej. configuraciones globales).
 * - Seguridad: Solo para públicas; rutas auth no lo usan para evitar leaks.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-25
 */
use App\Models\EmpresaWeb;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;


class SharePublicData
{
    /**
     * BLOQUE: handle - Compartir datos globales.
     * 
     * Ejecuta query optimizada para empresas visibles en header, comparte via Inertia.
     * 
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        /**
         * 🔹 Datos compartidos globalmente a las vistas de Inertia.
         * 
         * En este caso compartimos la lista de empresas solo para las páginas públicas.
         * 
         * - Se usa 'Inertia::share()' para enviar datos accesibles desde React mediante `usePage().props`.
         * - La consulta obtiene únicamente los campos necesarios (id_siesa as id, razon_social as name), reduciendo carga innecesaria.
         * - Se filtran las empresas por 'mostrar_en_header' true, ordenadas alfabéticamente.
         * - Propósito: Alimentar dropdown/header en componentes públicos sin queries repetidas.
         */
        Inertia::share([
            'empresasHeader' => EmpresaWeb::select('id_siesa as id', 'razon_social as name')
                ->where('mostrar_en_header', true)   // Solo las que deben mostrarse en header.
                ->orderBy('razon_social')            // Orden alfabético.
                ->get(),
        ]);
        
        // Continuar con el request.
        return $next($request);
    }
}