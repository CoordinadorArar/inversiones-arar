<?php

use App\Http\Controllers\ModuloRedirectController;
use App\Http\Controllers\GestionModulos\ModuloController;
use App\Http\Controllers\GestionModulos\PestanaController;
use Illuminate\Support\Facades\Route;

/**
 * Archivo de rutas para el módulo "Gestión de Módulos".
 * 
 * Propósito: Define rutas jerárquicas para el módulo padre "Gestión de Módulos" y sus hijos.
 * Usa middleware 'auth' para proteger rutas. Incluye redirecciones dinámicas via ModuloRedirectController
 * para llevar al usuario al primer módulo/pestaña accesible según permisos.
 * 
 * Estructura jerárquica:
 * - Módulo padre: Redirige al primer hijo accesible.
 * - Módulos hijos: Redirigen a su primera pestaña accesible.
 * - Pestañas: Controladores específicos para acciones (listado, gestión, etc.).
 * 
 * Rutas disponibles:
 * 
 * // Módulo Padre
 * /gestion-modulos
 * 
 * // Módulo Hijo: Modulos
 * /gestion-modulos/modulos
 * /gestion-modulos/modulos/listado
 * /gestion-modulos/modulos/gestion
 * /gestion-modulos/modulos/gestion/crear
 * /gestion-modulos/modulos/gestion/{id}
 * 
 * // Módulo Hijo: Pestañas
 * /gestion-modulos/pestanas
 * /gestion-modulos/pestanas/listado
 * /gestion-modulos/pestanas/gestion
 * /gestion-modulos/pestanas/gestion/crear
 * /gestion-modulos/pestanas/gestion/{id}
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

// Grupo de rutas protegidas con middleware 'auth' (requiere login).
Route::middleware('auth')->group(function () {

    $moduloPadre = 'gestion-modulos';

    // Módulo padre: Gestión de Módulos - Usa ModuloRedirectController para chequear permisos y redirigir al primer módulo hijo accesible.
    Route::get('/' . $moduloPadre, function () use ($moduloPadre) {
        return app(ModuloRedirectController::class)
            ->redirectToFirstAccessible('/' . $moduloPadre);
    });

    // Prefijo para subrutas del módulo padre.
    Route::prefix($moduloPadre)->group(function () {

        $modulosHijos = ['modulos', 'pestanas'];

        // Módulo hijo: Modulos - Usa ModuloRedirectController para redirigir a primera pestaña accesible.
        Route::get('/' . $modulosHijos[0], function () use ($modulosHijos) {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[0]);
        });

        // Grupo de pestañas para Módulos.
        Route::prefix($modulosHijos[0])->group(function () {

            // Vistas
            // Middleware: pestana.access:12 (ID de la pestaña en DB) para validar acceso a listado de módulos.
            Route::get('/listado', [ModuloController::class, 'index'])
                ->name('modulo.listado')
                ->middleware('pestana.access:12');

            // Middleware: pestana.access:13 para gestión de módulos.
            Route::get('/gestion', [ModuloController::class, 'gestion'])
                ->name('modulo.gestion')
                ->middleware('pestana.access:13');

            Route::get('/gestion/crear', [ModuloController::class, 'create'])
                ->name('modulo.create')
                ->middleware('pestana.access:13');

            Route::get('/gestion/{id}', [ModuloController::class, 'edit'])
                ->name('modulo.edit')
                ->middleware('pestana.access:13');

            // CRUD
            Route::prefix('gestion')->group(function () {
                Route::post('/', [ModuloController::class, 'store'])->name('modulo.store');
                Route::post('/{id}', [ModuloController::class, 'update'])->name('modulo.update');
                Route::delete('/{id}', [ModuloController::class, 'destroy'])->name('modulo.destroy');
            });
        });

        // Módulo hijo: Pestañas - Usa ModuloRedirectController para redirigir a primera pestaña accesible.
        Route::get('/' . $modulosHijos[1], function () use ($modulosHijos) {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[1]);
        });

        // Grupo de pestañas para Pestañas.
        Route::prefix($modulosHijos[1])->group(function () {

            // Vistas
            // Middleware: pestana.access:14 (ID de la pestaña en DB) para validar acceso a listado de pestañas.
            Route::get('/listado', [PestanaController::class, 'index'])
                ->name('pestana.listado')
                ->middleware('pestana.access:14');

            // Middleware: pestana.access:15 para gestión de pestañas.
            Route::get('/gestion', [PestanaController::class, 'gestion'])
                ->name('pestana.gestion')
                ->middleware('pestana.access:15');

            Route::get('/gestion/crear', [PestanaController::class, 'create'])
                ->name('pestana.create')
                ->middleware('pestana.access:15');

            Route::get('/gestion/{id}', [PestanaController::class, 'edit'])
                ->name('pestana.edit')
                ->middleware('pestana.access:15');

            // CRUD
            Route::prefix('gestion')->group(function () {
                Route::post('/', [PestanaController::class, 'store'])->name('pestana.store');
                Route::post('/{id}', [PestanaController::class, 'update'])->name('pestana.update');
                Route::delete('/{id}', [PestanaController::class, 'destroy'])->name('pestana.destroy');
            });
        });
    });
});
