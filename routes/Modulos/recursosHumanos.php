<?php

use App\Http\Controllers\DocumentoCorporativoController;
use App\Http\Controllers\ModuloRedirectController;
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
 * - Calendario: Controladores específicos para acciones (listado, gestión, etc.).
 * 
 * Rutas disponibles:
 * 
 * // Módulo Padre
 * /recursos-humanos
 * 
 * // Módulo Hijo: Documentos Corporativos
 * /recursos-humanos/modulos
 * /recursos-humanos/modulos/listado
 * /recursos-humanos/modulos/gestion
 * /recursos-humanos/modulos/gestion/crear
 * /recursos-humanos/modulos/gestion/{id}
 * 
 * // Módulo Hijo: Calendario
 * ...
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

// Grupo de rutas protegidas con middleware 'auth' (requiere login).
Route::middleware('auth')->group(function () {

    $moduloPadre = 'recursos-humanos';

    // Módulo padre: Gestión de Módulos - Usa ModuloRedirectController para chequear permisos y redirigir al primer módulo hijo accesible.
    Route::get('/' . $moduloPadre, function () use ($moduloPadre) {
        return app(ModuloRedirectController::class)
            ->redirectToFirstAccessible('/' . $moduloPadre);
    });

    // Prefijo para subrutas del módulo padre.
    Route::prefix($moduloPadre)->group(function () {

        $modulosHijos = ['documentos', 'calendario'];

        // Módulo hijo: Documentos Corporativos - Usa ModuloRedirectController para redirigir a primera pestaña accesible.
        Route::get('/' . $modulosHijos[0], function () use ($modulosHijos) {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[0]);
        });

        // Grupo de pestañas para Módulos.
        Route::prefix($modulosHijos[0])->group(function () {

            // Vistas
            // Middleware: pestana.access:17 (ID de la pestaña en DB) para validar acceso a listado de módulos.
            Route::get('/listado', [DocumentoCorporativoController::class, 'index'])
                ->name('documento.listado')
                ->middleware('pestana.access:17');

            // Middleware: pestana.access:18 para gestión de módulos.
            Route::get('/gestion', [DocumentoCorporativoController::class, 'gestion'])
                ->name('documento.gestion')
                ->middleware('pestana.access:18');

            Route::get('/gestion/crear', [DocumentoCorporativoController::class, 'create'])
                ->name('documento.create')
                ->middleware('pestana.access:18');

            Route::get('/gestion/{id}', [DocumentoCorporativoController::class, 'edit'])
                ->name('documento.edit')
                ->middleware('pestana.access:18');

            // CRUD
            Route::prefix('gestion')->group(function () {
                Route::post('/', [DocumentoCorporativoController::class, 'store'])->name('documento.store');
                Route::post('/{id}', [DocumentoCorporativoController::class, 'update'])->name('documento.update');
                Route::delete('/{id}', [DocumentoCorporativoController::class, 'destroy'])->name('documento.destroy');
            });
        });

        // // Módulo hijo: Calendario - Usa ModuloRedirectController para redirigir a primera pestaña accesible.
        // Route::get('/' . $modulosHijos[1], function () use ($modulosHijos) {
        //     return app(ModuloRedirectController::class)
        //         ->redirectToFirstAccessible('/' . $modulosHijos[1]);
        // });

        // // Grupo de pestañas para Calendario.
        // Route::prefix($modulosHijos[1])->group(function () {

        //     // Vistas
        //     // Middleware: pestana.access:19 (ID de la pestaña en DB) para validar acceso a listado de pestañas.
        //     Route::get('/listado', [PestanaController::class, 'index'])
        //         ->name('pestana.listado')
        //         ->middleware('pestana.access:19');

        //     // Middleware: pestana.access:16 para gestión de pestañas.
        //     Route::get('/gestion', [PestanaController::class, 'gestion'])
        //         ->name('pestana.gestion')
        //         ->middleware('pestana.access:16');

        //     Route::get('/gestion/crear', [PestanaController::class, 'create'])
        //         ->name('pestana.create')
        //         ->middleware('pestana.access:16');

        //     Route::get('/gestion/{id}', [PestanaController::class, 'edit'])
        //         ->name('pestana.edit')
        //         ->middleware('pestana.access:16');

        //     // CRUD
        //     Route::prefix('gestion')->group(function () {
        //         Route::post('/', [PestanaController::class, 'store'])->name('pestana.store');
        //         Route::post('/{id}', [PestanaController::class, 'update'])->name('pestana.update');
        //         Route::delete('/{id}', [PestanaController::class, 'destroy'])->name('pestana.destroy');
        //     });
        // });
    });
});
