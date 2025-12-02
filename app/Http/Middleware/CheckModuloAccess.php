<?php

namespace App\Http\Middleware;

use App\Models\GestionModulos\Modulo;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware CheckModuloAccess.
 * 
 * Propósito: Validar acceso a módulos por ID, basado en permisos del rol del usuario.
 * Bloquea acceso si el usuario no tiene relación con el módulo via roles.
 * Usado en rutas de módulos directos para evitar acceso directo por URL.
 * 
 * Parámetros:
 * - $idModulo: ID del módulo en DB (pasado desde ruta, ej. middleware('modulo.access:5')).
 * 
 * Lógica:
 * - Busca módulo por ID.
 * - Chequea si el rol del usuario tiene relación con el módulo.
 * - Si no: abort(403).
 * 
 * @author Yariangel Aray
 * @version 1.0
 * @date 2025-12-02
 */

class CheckModuloAccess
{
    /**
     * BLOQUE: handle - Valida acceso al módulo.
     * 
     * Busca módulo por ID, chequear permisos del rol.
     * 
     * @param Request $request
     * @param Closure $next
     * @param int $idModulo ID del módulo en DB.
     * @return Response
     */
    public function handle(Request $request, Closure $next, int $idModulo): Response
    {
        $usuario = Auth::user();

        // Buscar módulo por ID.
        $modulo = Modulo::find($idModulo);

        // Validar: Si módulo no existe o usuario no tiene acceso via rol.
        if (!$modulo || !$modulo->roles()->where('rol_id', $usuario->rol_id)->exists()) {
            abort(403, 'No tienes acceso a este módulo.');
        }

        return $next($request);
    }
}