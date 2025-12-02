<?php

use App\Http\Controllers\AuditoriaController;
use Illuminate\Support\Facades\Route;

/**
 * Archivo de rutas para módulos directos.
 * 
 * Propósito: Centralizar rutas de módulos que no tienen pestañas ni submodulos.
 * Estos son módulos "simples" con una sola vista/controlador, sin jerarquía (padre/hijo).
 * Incluye validación de permisos para evitar acceso directo por URL.
 * 
 * Lógica de uso:
 * - Módulos sin pestañas: Aquí van rutas directas (ej. /auditorias -> vista única).
 * - Validación: Middleware 'modulo.access' con ID del módulo (ej. :5) para chequear permisos.
 * - Si no tiene acceso: 403 Forbidden.
 * 
 * @author Yariangel Aray - Rutas para módulos directos con validación por ID.
 * @version 1.1
 * @date 2025-12-02
 */

// Grupo de rutas protegidas con middleware 'auth'.
Route::middleware('auth')->group(function () {
    // Ruta para módulo Auditorías: Directa, sin pestañas/submodulos.
    // - Método: GET.
    // - URI: '/auditorias'.
    // - Controlador: AuditoriaController@index (renderiza vista única de auditorías).
    // - Validación: Middleware 'modulo.access:5' (ID del módulo en DB) chequear permisos; si no, 403.
    // - Propósito: Vista simple de auditorías, accesible solo con permisos.
    Route::get('/auditorias', [AuditoriaController::class, 'index'])->middleware('modulo.access:5');  // ID del módulo (Según DB).
});