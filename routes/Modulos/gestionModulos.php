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
 * para llevar al modulo al primer módulo/pestaña accesible según permisos.
 * 
 * Estructura jerárquica:
 * - Módulo padre: Redirige al primer hijo accesible.
 * - Módulos hijos: Redirigen a su primera pestaña accesible.
 * - Pestañas: Controladores específicos para acciones (listado, gestión, etc.).
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

// Grupo de rutas protegidas con middleware 'auth' (requiere login).
Route::middleware('auth')->group(function () {

    $moduloPadre = 'gestion-modulos';
    // ===================================================================
    // MÓDULO PADRE: Gestión de Módulos
    // Ruta base: Redirige dinámicamente al primer módulo hijo accesible para el usuario.
    // Usa ModuloRedirectController para chequear permisos y redirigir.
    // ===================================================================
    Route::get('/' . $moduloPadre, function () use ($moduloPadre) {
        // Llama al método redirectToFirstAccessible con la ruta base.
        // Ej: Si usuario tiene acceso a 'modulos', redirige a /gestion-modulos/modulos.
        return app(ModuloRedirectController::class)
            ->redirectToFirstAccessible('/' . $moduloPadre);
    });

    // Prefijo para subrutas del módulo padre.
    Route::prefix($moduloPadre)->group(function () {

        $modulosHijos = ['modulos', 'pestanas'];

        // ===============================================================
        // MÓDULO HIJO: Modulos
        // Ruta: Redirige a la primera pestaña accesible dentro de Módulos.
        // ===============================================================
        Route::get('/' . $modulosHijos[0], function () use ($modulosHijos) {
            // Redirige a primera pestaña accesible (ej. /listado si tiene permiso).
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[0]);
        });

        // Grupo de pestañas para Módulos (prefijo /gestion-modulos/modulos).
        Route::prefix($modulosHijos[0])->group(function () {

            // --- VISTAS ---

            // Pestaña: Listado de modulos.
            // Middleware: pestana.access: (ID de la pestaña en DB) para validar acceso.
            Route::get('/listado', [ModuloController::class, 'index'])
                ->name('modulo.listado')
                ->middleware('pestana.access:13');

            // Pestaña: Gestión de modulos (crear/editar).
            Route::get('/gestion', [ModuloController::class, 'gestion'])
                ->name('modulo.gestion')
                ->middleware('pestana.access:14');

            // Pestaña: Gestión - Modo crear (URL amigable).
            Route::get('/gestion/crear', [ModuloController::class, 'create'])
                ->name('modulo.create')
                ->middleware('pestana.access:14');

            // Pestaña: Gestión - Modo editar (URL amigable con ID).
            Route::get('/gestion/{id}', [ModuloController::class, 'edit'])
                ->name('modulo.edit')
                ->middleware('pestana.access:14');

            // --- CRUD ---
            // Mantienen el prefijo /gestion, pero se separan para mayor claridad.
            Route::prefix('gestion')->group(function () {
                // Acción: Crear modulo (POST).
                Route::post('/', [ModuloController::class, 'store'])->name('modulo.store');
                // Acción: Actualizar modulo (PUT con ID).
                Route::post('/{id}', [ModuloController::class, 'update'])->name('modulo.update');
                // Acción: Eliminar modulo (DELETE con ID).                
                Route::delete('/{id}', [ModuloController::class, 'destroy'])->name('modulo.destroy');
            });
        });

        // ===============================================================
        // MÓDULO HIJO: Pestañas
        // Ruta: Redirige a la primera pestaña accesible dentro de Pestañas.
        // ===============================================================
        Route::get('/' . $modulosHijos[1], function () use ($modulosHijos) {
            // Redirige a primera pestaña accesible (ej. /listado si tiene permiso).
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[1]);
        });

        // Grupo de pestañas para Pestañas (prefijo /gestion-modulos/pestañas).
        Route::prefix($modulosHijos[1])->group(function () {

            // --- VISTAS ---

            // Pestaña: Listado de pestanas.
            // Middleware: pestana.access: (ID de la pestaña en DB) para validar acceso.
            Route::get('/listado', [PestanaController::class, 'index'])
                ->name('pestana.listado')
                ->middleware('pestana.access:15');

            // Pestaña: Gestión de pestanas (crear/editar).
            Route::get('/gestion', [PestanaController::class, 'gestion'])
                ->name('pestana.gestion')
                ->middleware('pestana.access:16');

            // Pestaña: Gestión - Modo crear (URL amigable).
            Route::get('/gestion/crear', [PestanaController::class, 'create'])
                ->name('pestana.create')
                ->middleware('pestana.access:16');

            // Pestaña: Gestión - Modo editar (URL amigable con ID).
            Route::get('/gestion/{id}', [PestanaController::class, 'edit'])
                ->name('pestana.edit')
                ->middleware('pestana.access:16');

            // --- CRUD ---
            // Mantienen el prefijo /gestion, pero se separan para mayor claridad.
            Route::prefix('gestion')->group(function () {
                // Acción: Crear pestana (POST).
                Route::post('/', [PestanaController::class, 'store'])->name('pestana.store');
                // Acción: Actualizar pestana (PUT con ID).
                Route::post('/{id}', [PestanaController::class, 'update'])->name('pestana.update');
                // Acción: Eliminar pestana (DELETE con ID).                
                Route::delete('/{id}', [PestanaController::class, 'destroy'])->name('pestana.destroy');
            });
        });
    });
});
