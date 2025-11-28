<?php

namespace App\Http\Controllers;

use App\Models\GestionModulos\Modulo;
use App\Models\GestionModulos\Pestana;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

/**
 * Controlador para manejar redirecciones automáticas en módulos.
 * 
 * Propósito:
 * - Resolver redirecciones para módulos padre (que tienen hijos).
 * - Resolver redirecciones para módulos con pestañas.
 * - Redirigir al primer recurso accesible según permisos del rol del usuario.
 * 
 * @author Yariangel Aray
 * @version 1.0
 * @date 2025-11-27
 */
class ModuloRedirectController extends Controller
{
    /**
     * Redirige automáticamente al primer recurso accesible de un módulo.
     * 
     * Casos de uso:
     * 1. Módulo Padre (es_padre = true):
     *    - Busca el primer módulo hijo con acceso según rol.
     *    - Redirige a la primera pestaña del módulo hijo.
     * 
     * 2. Módulo con Pestañas (es_padre = false):
     *    - Busca la primera pestaña con acceso según rol.
     *    - Redirige a esa pestaña.
     * 
     * Validaciones:
     * - Si no encuentra módulo: 404
     * - Si no tiene acceso a ningún recurso: 403 con mensaje amigable
     * 
     * IMPORTANTE: Esta función NO debe usarse en módulos sin pestañas que tienen
     * controlador directo. Solo para módulos padre o módulos con pestañas.
     * 
     * @param string $rutaModulo Ruta del módulo (ej. '/administracion-web' o '/empresas')
     * @return RedirectResponse
     * 
     * @example
     * // En routes/Modulos/administracionWeb.php para módulo padre:
     * Route::get('/administracion-web', function () {
     *     return app(ModuloRedirectController::class)->redirectToFirstAccessible('/administracion-web');
     * });
     * 
     * @example
     * // En routes/Modulos/administracionWeb.php para módulo con pestañas:
     * Route::get('/administracion-web/empresas', function () {
     *     return app(ModuloRedirectController::class)->redirectToFirstAccessible('/empresas');
     * });
     */
    public function redirectToFirstAccessible(string $rutaModulo): RedirectResponse
    {
        // Obtener usuario autenticado
        $usuario = Auth::user();
        
        // Buscar módulo por ruta
        $modulo = Modulo::where('ruta', $rutaModulo)->first();

        // Validación: Si no existe el módulo
        if (!$modulo) {
            abort(404, 'Módulo no encontrado');
        }

        // CASO 1: Módulo Padre - Redirigir al primer hijo accesible
        if ($modulo->es_padre) {
            return $this->redirectToFirstChildModule($modulo, $usuario);
        }

        // CASO 2: Módulo con Pestañas - Redirigir a primera pestaña accesible
        return $this->redirectToFirstTab($modulo, $usuario);
    }

    /**
     * Redirige al primer módulo hijo accesible de un módulo padre.
     * 
     * Lógica:
     * 1. Obtiene todos los módulos hijos del padre.
     * 2. Filtra solo los que el usuario tiene acceso (según modulo_rol).
     * 3. Para cada hijo accesible, busca la primera pestaña accesible.
     * 4. Redirige a la primera pestaña del primer hijo con acceso.
     * 
     * @param Modulo $moduloPadre Instancia del módulo padre
     * @param \App\Models\Usuario $usuario Usuario autenticado
     * @return RedirectResponse
     */
    private function redirectToFirstChildModule(Modulo $moduloPadre, $usuario): RedirectResponse
    {
        // Obtener rol del usuario
        $rolId = $usuario->rol_id;

        // Buscar módulos hijos con acceso según rol
        // whereHas('roles') filtra solo los módulos que tienen relación con el rol del usuario
        $modulosHijos = $moduloPadre->modulosHijos()
            ->whereHas('roles', function ($query) use ($rolId) {
                $query->where('rol_id', $rolId);
            })
            ->orderBy('id')
            ->get();

        // Validación: Si no tiene acceso a ningún módulo hijo
        if ($modulosHijos->isEmpty()) {
            abort(403, "No tienes acceso a ningún módulo dentro de '{$moduloPadre->nombre}'");
        }

        // Buscar la primera pestaña accesible del primer hijo
        foreach ($modulosHijos as $hijo) {
            $primeraPestana = $this->getFirstAccessibleTab($hijo, $rolId);
            
            if ($primeraPestana) {
                // Construir ruta completa: /modulo-padre/modulo-hijo/pestaña
                $rutaCompleta = $moduloPadre->ruta . $hijo->ruta . $primeraPestana->ruta;
                return redirect($rutaCompleta);
            }
        }

        // Si ningún hijo tiene pestañas accesibles
        abort(403, "No tienes acceso a ninguna sección dentro de '{$moduloPadre->nombre}'");
    }

    /**
     * Redirige a la primera pestaña accesible de un módulo.
     * 
     * Lógica:
     * 1. Busca la primera pestaña del módulo con acceso según rol.
     * 2. Redirige a esa pestaña.
     * 
     * @param Modulo $modulo Instancia del módulo
     * @param \App\Models\Usuario $usuario Usuario autenticado
     * @return RedirectResponse
     */
    private function redirectToFirstTab(Modulo $modulo, $usuario): RedirectResponse
    {
        $rolId = $usuario->rol_id;

        // Buscar primera pestaña accesible
        $primeraPestana = $this->getFirstAccessibleTab($modulo, $rolId);

        // Validación: Si no tiene acceso a ninguna pestaña
        if (!$primeraPestana) {
            abort(403, "No tienes acceso a ninguna sección de '{$modulo->nombre}'");
        }

        // Obtener módulo padre si existe
        $moduloPadre = $modulo->moduloPadre;

        // Construir ruta completa
        $rutaCompleta = $moduloPadre 
            ? $moduloPadre->ruta . $modulo->ruta . $primeraPestana->ruta
            : $modulo->ruta . $primeraPestana->ruta;

        return redirect($rutaCompleta);
    }

    /**
     * Obtiene la primera pestaña accesible de un módulo según rol.
     * Usa la relación definida en el modelo Modulo.
     * 
     * @param Modulo $modulo Instancia del módulo
     * @param int $rolId ID del rol del usuario
     * @return Pestana|null Primera pestaña accesible o null si no hay
     */
    private function getFirstAccessibleTab(Modulo $modulo, int $rolId): ?Pestana
    {
        return $modulo->pestanas()
            ->whereHas('roles', function ($query) use ($rolId) {
                $query->where('rol_id', $rolId);
            })
            ->orderBy('id')
            ->first();
    }
}