<?php

use App\Http\Controllers\EmpresaWebController;
use App\Http\Controllers\ModuloRedirectController;
use App\Http\Controllers\TipoIdentificacionController;
use Illuminate\Support\Facades\Route;

/**
 * Archivo de rutas para el módulo "Administración Web".
 * 
 * Propósito: Define rutas jerárquicas para el módulo padre "Administración Web" y sus hijos.
 * Usa middleware 'auth' para proteger rutas. Incluye redirecciones dinámicas via ModuloRedirectController
 * para llevar al usuario al primer módulo/pestaña accesible según permisos.
 * 
 * Estructura jerárquica:
 * - Módulo padre: Redirige al primer hijo accesible.
 * - Módulos hijos: Redirigen a su primera pestaña accesible.
 * - Pestañas: Controladores específicos para acciones (listado, gestión, etc.).
 * 
 * Controladores usados:
 * - ModuloRedirectController: Maneja redirecciones basadas en permisos.
 * - EmpresaWebController: Para pestañas de Empresas.
 * - Otros comentados (por implementar).
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-27
 */

// Grupo de rutas protegidas con middleware 'auth' (requiere login).
Route::middleware('auth')->group(function () {

    // ===================================================================
    // MÓDULO PADRE: Administración Web
    // Ruta base: Redirige dinámicamente al primer módulo hijo accesible para el usuario.
    // Usa ModuloRedirectController para chequear permisos y redirigir.
    // ===================================================================
    Route::get('/administracion-web', function () {
        // Llama al método redirectToFirstAccessible con la ruta base.
        // Ej: Si usuario tiene acceso a 'empresas', redirige a /administracion-web/empresas.
        return app(ModuloRedirectController::class)
            ->redirectToFirstAccessible('/administracion-web');
    });

    // Prefijo para subrutas del módulo padre.
    Route::prefix('administracion-web')->group(function () {

        // ===============================================================
        // MÓDULO HIJO: Empresas
        // Ruta: Redirige a la primera pestaña accesible dentro de Empresas.
        // ===============================================================
        Route::get('/empresas', function () {
            // Redirige a primera pestaña accesible (ej. /listado si tiene permiso).
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/empresas');
        });

        // Grupo de pestañas para Empresas (prefijo /administracion-web/empresas).
        Route::prefix('empresas')->group(function () {

            // --- VISTAS ---

            // Pestaña: Listado de empresas.
            // Middleware: pestana.access:1 (ID de la pestaña en DB) para validar acceso.
            Route::get('/listado', [EmpresaWebController::class, 'index'])
                ->middleware('pestana.access:1');

            // Pestaña: Gestión de empresas (crear/editar).
            Route::get('/gestion', [EmpresaWebController::class, 'gestion']);

            // --- CRUD ---
            // Mantienen el prefijo /gestion, pero se separan para mayor claridad.
            Route::prefix('gestion')->group(function () {
                // Acción: Crear empresa (POST).
                Route::post('/', [EmpresaWebController::class, 'store'])->name('empresa.store');
                // Acción: Actualizar empresa (PUT con ID).
                Route::put('/{id}', [EmpresaWebController::class, 'update'])->name('empresa.update');
                // Acción: Eliminar empresa (DELETE con ID).
                Route::delete('/{id}', [EmpresaWebController::class, 'destroy'])->name('empresa.destroy');
            });
        });

        // ===============================================================
        // MÓDULO HIJO: Configuración General
        // Ruta: Redirige a la primera pestaña accesible.
        // ===============================================================
        Route::get('/configuracion-general', function () {
            // Redirige a primera pestaña accesible (ej. /informacion-corporativa).
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/configuracion-general');
        });

        // Grupo de pestañas para Configuración General (comentadas, por implementar).
        Route::prefix('configuracion-general')->group(function () {
            // Route::get('/informacion-corporativa', [ConfiguracionGeneralController::class, 'informacionCorporativa']);

            // Route::get('/redes-sociales', [ConfiguracionGeneralController::class, 'redesSociales']);
        });

        // ===============================================================
        // MÓDULO HIJO: Tablas Maestras
        // Ruta: Redirige a la primera pestaña accesible.
        // ===============================================================
        Route::get('/tablas-maestras', function () {
            // Redirige a primera pestaña accesible (ej. /tipos-identificaciones).
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/tablas-maestras');
        });

        // Grupo de pestañas para Tablas Maestras (comentadas, por implementar).
        Route::prefix('tablas-maestras')->group(function () {
            Route::get('/tipos-identificaciones', [TipoIdentificacionController::class, 'index'])->middleware('pestana.access:5');

            // --- CRUD ---
            // Mantienen el prefijo /tipos-identificaciones, pero se separan para mayor claridad.
            Route::prefix('tipos-identificaciones')->group(function () {
                // Acción: Crear tipo (POST).
                Route::post('/', [TipoIdentificacionController::class, 'store'])->name('tipo-identificacion.store');
                // Acción: Actualizar tipo (PUT con ID).
                Route::put('/{id}', [TipoIdentificacionController::class, 'update'])->name('tipo-identificacion.update');
                // Acción: Eliminar tipo (DELETE con ID).
                Route::delete('/{id}', [TipoIdentificacionController::class, 'destroy'])->name('tipo-identificacion.destroy');
            });

            // Route::get('/tipos-pqrsd', [TablasMaestrasController::class, 'tiposPqrsd']);

            // Route::get('/estados-pqrsd', [TablasMaestrasController::class, 'estadosPqrsd']);
        });
    });
});
