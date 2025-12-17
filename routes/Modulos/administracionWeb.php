<?php

use App\Http\Controllers\AdministracionWeb\ConfiguracionController;
use App\Http\Controllers\AdministracionWeb\EmpresaWebController;
use App\Http\Controllers\ModuloRedirectController;
use App\Http\Controllers\AdministracionWeb\TablasMaestras\EstadoPqrsController;
use App\Http\Controllers\AdministracionWeb\TablasMaestras\TipoPqrsController;
use App\Http\Controllers\AdministracionWeb\TablasMaestras\TipoIdentificacionController;
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
 * Rutas disponibles:
 * 
 * // Módulo Padre
 * /administracion-web
 * 
 * // Módulo Hijo: Empresas
 * /administracion-web/empresas
 * /administracion-web/empresas/listado
 * /administracion-web/empresas/gestion
 * /administracion-web/empresas/gestion/crear
 * /administracion-web/empresas/gestion/{id}
 * 
 * // Módulo Hijo: Configuración General
 * /administracion-web/configuracion-general
 * /administracion-web/configuracion-general/informacion-corporativa
 * /administracion-web/configuracion-general/redes-sociales
 * 
 * // Módulo Hijo: Tablas Maestras
 * /administracion-web/tablas-maestras
 * /administracion-web/tablas-maestras/tipos-identificaciones
 * /administracion-web/tablas-maestras/tipos-pqrsd
 * /administracion-web/tablas-maestras/estados-pqrsd
 * 
 * @author Yariangel Aray
 * @date 2025-11-27
 */

// Grupo de rutas protegidas con middleware 'auth' (requiere login).
Route::middleware('auth')->group(function () {

    $moduloPadre = 'administracion-web';

    // Módulo padre: Admnistracioón  Web - Usa ModuloRedirectController para chequear permisos y redirigir al primer módulo hijo accesible.
    Route::get('/' . $moduloPadre, function () use ($moduloPadre) {
        return app(ModuloRedirectController::class)
            ->redirectToFirstAccessible('/' . $moduloPadre);
    });

    // Prefijo para subrutas del módulo padre.
    Route::prefix($moduloPadre)->group(function () {

        $modulosHijos = ['empresas', 'configuracion-general', 'tablas-maestras'];

        // Módulo hijo: Empresas - Usa ModuloRedirectController para redirigir a primera pestaña accesible.
        Route::get('/' . $modulosHijos[0], function () use ($modulosHijos) {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[0]);
        });

        // Grupo de pestañas para Empresas.
        Route::prefix($modulosHijos[0])->group(function () {

            // Vistas
            // Middleware: pestana.access:1 (ID de la pestaña en DB) para validar acceso a pestaña.
            Route::get('/listado', [EmpresaWebController::class, 'index'])
                ->name('empresa.listado')
                ->middleware('pestana.access:1');

            // Middleware: pestana.access:2 para gestión.
            Route::get('/gestion', [EmpresaWebController::class, 'gestion'])
                ->name('empresa.gestion')
                ->middleware('pestana.access:2');

            Route::get('/gestion/crear', [EmpresaWebController::class, 'create'])
                ->name('empresa.create')
                ->middleware('pestana.access:2');

            Route::get('/gestion/{id}', [EmpresaWebController::class, 'edit'])
                ->name('empresa.edit')
                ->middleware('pestana.access:2');

            // CRUD
            Route::prefix('gestion')->group(function () {
                Route::post('/', [EmpresaWebController::class, 'store'])->name('empresa.store');
                Route::put('/{id}', [EmpresaWebController::class, 'update'])->name('empresa.update');
                Route::delete('/{id}', [EmpresaWebController::class, 'destroy'])->name('empresa.destroy');
            });
        });

        // Módulo hijo: Configuración General - Usa ModuloRedirectController para redirigir a primera pestaña accesible.
        Route::get('/' . $modulosHijos[1], function () use ($modulosHijos) {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[1]);
        });

        // Grupo de pestañas para Configuración General.
        Route::prefix($modulosHijos[1])->group(function () {

            // Middleware: pestana.access:3 para información corporativa.
            Route::get('/informacion-corporativa', [ConfiguracionController::class, 'informacionCorporativa'])
                ->middleware('pestana.access:3');

            // Middleware: pestana.access:4 para redes sociales.
            Route::get('/redes-sociales', [ConfiguracionController::class, 'redesSociales'])
                ->middleware('pestana.access:4');

            Route::post('/update-corporativa', [ConfiguracionController::class, 'updateInformacionCorporativa'])
                ->name('update-corporativa');
            Route::post('/update-redes', [ConfiguracionController::class, 'updateRedesSociales'])
                ->name('update-redes');
        });

        // Módulo hijo: Tablas Maestras - Usa ModuloRedirectController para redirigir a primera pestaña accesible.
        Route::get('/' . $modulosHijos[2], function () use ($modulosHijos) {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[2]);
        });

        // Grupo de pestañas para Tablas Maestras.
        Route::prefix($modulosHijos[2])->group(function () {

            // Middleware: pestana.access:5 para tipos de identificaciones.
            Route::get('/tipos-identificaciones', [TipoIdentificacionController::class, 'index'])
                ->middleware('pestana.access:5');

            Route::prefix('tipos-identificaciones')->group(function () {
                Route::post('/', [TipoIdentificacionController::class, 'store'])->name('tipo-identificacion.store');
                Route::put('/{id}', [TipoIdentificacionController::class, 'update'])->name('tipo-identificacion.update');
                Route::delete('/{id}', [TipoIdentificacionController::class, 'destroy'])->name('tipo-identificacion.destroy');
            });

            // Middleware: pestana.access:6 para tipos de pqrsd.
            Route::get('/tipos-pqrsd', [TipoPqrsController::class, 'index'])
                ->middleware('pestana.access:6');

            Route::prefix('tipos-pqrsd')->group(function () {
                Route::post('/', [TipoPqrsController::class, 'store'])->name('tipo-pqrsd.store');
                Route::put('/{id}', [TipoPqrsController::class, 'update'])->name('tipo-pqrsd.update');
                Route::delete('/{id}', [TipoPqrsController::class, 'destroy'])->name('tipo-pqrsd.destroy');
            });

            // Middleware: pestana.access:7 para estados de pqrsd.
            Route::get('/estados-pqrsd', [EstadoPqrsController::class, 'index'])
                ->middleware('pestana.access:7');

            Route::prefix('estados-pqrsd')->group(function () {
                Route::post('/', [EstadoPqrsController::class, 'store'])->name('estado-pqrsd.store');
                Route::put('/{id}', [EstadoPqrsController::class, 'update'])->name('estado-pqrsd.update');
                Route::delete('/{id}', [EstadoPqrsController::class, 'destroy'])->name('estado-pqrsd.destroy');
            });
        });
    });
});