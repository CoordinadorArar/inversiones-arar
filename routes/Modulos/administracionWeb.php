<?php

use App\Http\Controllers\EmpresaWebController;
use App\Http\Controllers\ModuloRedirectController;

use Illuminate\Support\Facades\Route;

/**
 * Rutas del módulo padre: Administración Web
 * 
 * Estructura:
 * - Ruta del módulo padre: Redirige al primer hijo accesible
 * - Rutas de módulos hijos: Redirigen a su primera pestaña accesible
 * - Rutas de pestañas: Controladores específicos
 */

Route::middleware('auth')->group(function () {
    
    // ===================================================================
    // MÓDULO PADRE: Administración Web
    // Redirige al primer módulo hijo con acceso
    // ===================================================================
    Route::get('/administracion-web', function () {
        return app(ModuloRedirectController::class)
            ->redirectToFirstAccessible('/administracion-web');
    });

    Route::prefix('administracion-web')->group(function () {
        
        // ===============================================================
        // MÓDULO HIJO: Empresas
        // Redirige a la primera pestaña accesible
        // ===============================================================
        Route::get('/empresas', function () {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/empresas');
        });

        // Pestañas del módulo Empresas
        Route::prefix('empresas')->group(function () {
            Route::get('/listado', [EmpresaWebController::class, 'index']);
            
            // Route::get('/gestion', [EmpresasController::class, 'gestion']);
        });

        // ===============================================================
        // MÓDULO HIJO: Configuración General
        // Redirige a la primera pestaña accesible
        // ===============================================================
        Route::get('/configuracion-general', function () {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/configuracion-general');
        });

        // Pestañas del módulo Configuración General
        Route::prefix('configuracion-general')->group(function () {
            // Route::get('/informacion-corporativa', [ConfiguracionGeneralController::class, 'informacionCorporativa']);
            
            // Route::get('/redes-sociales', [ConfiguracionGeneralController::class, 'redesSociales']);
        });

        // ===============================================================
        // MÓDULO HIJO: Tablas Maestras
        // Redirige a la primera pestaña accesible
        // ===============================================================
        Route::get('/tablas-maestras', function () {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/tablas-maestras');
        });

        Route::prefix('tablas-maestras')->group(function () {
            // Route::get('/tipos-identificaciones', [TablasMaestrasController::class, 'tiposIdentificaciones']);
            
            // Route::get('/tipos-pqrsd', [TablasMaestrasController::class, 'tiposPqrsd']);
            
            // Route::get('/estados-pqrsd', [TablasMaestrasController::class, 'estadosPqrsd']);
        });
    });
});