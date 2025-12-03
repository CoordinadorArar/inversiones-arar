<?php

namespace App\Http\Middleware;

use App\Models\GestionModulos\Pestana;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware CheckPestanaAccess.
 * 
 * Propósito: Validar acceso a pestañas por ID, basado en permisos del rol del usuario.
 * Bloquea acceso si el usuario no tiene relación con la pestaña via roles.
 * Usado en rutas de pestañas directos para evitar acceso directo por URL.
 * 
 * Parámetros:
 * - $idPestana: ID de la pestaña en DB (pasado desde ruta, ej. middleware('pestana.access:5')).
 * 
 * Lógica:
 * - Busca pestaña por ID.
 * - Chequea si el rol del usuario tiene relación con la pestaña.
 * - Si no: abort(403).
 * 
 * @author Yariangel Aray
 
 * @date 2025-12-02
 */

class CheckPestanaAccess
{
    /**
     * BLOQUE: handle - Valida acceso a pestaña.
     * 
     * Busca pestaña por ID, chequear permisos del rol.
     * 
     * @param Request $request
     * @param Closure $next
     * @param int $idPestana ID de la pestaña en DB.
     * @return Response
     */
    public function handle(Request $request, Closure $next, int $idPestana): Response
    {
        $usuario = Auth::user();

        // Buscar pestaña por ID.
        $pestana = Pestana::find($idPestana);

        // Validar: Si pestaña no existe o usuario no tiene acceso via rol.
        if (!$pestana || !$pestana->roles()->where('rol_id', $usuario->rol_id)->exists()) {
            abort(403, 'No tienes acceso a esta pestaña.');
        }

        return $next($request);
    }
}