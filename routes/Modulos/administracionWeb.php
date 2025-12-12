<?php

use App\Http\Controllers\ConfiguracionController;
use App\Http\Controllers\EmpresaWebController;
use App\Http\Controllers\ModuloRedirectController;
use App\Http\Controllers\PQRSD\EstadoPqrsController;
use App\Http\Controllers\PQRSD\TipoPqrsController;
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
 * @author Yariangel Aray
 * @date 2025-11-27
 */


// Grupo de rutas protegidas con middleware 'auth' (requiere login).
Route::middleware('auth')->group(function () {

    $moduloPadre = 'administracion-web';

    // ===================================================================
    // MÓDULO PADRE: Administración Web
    // Ruta base: Redirige dinámicamente al primer módulo hijo accesible para el usuario.
    // Usa ModuloRedirectController para chequear permisos y redirigir.
    // ===================================================================
    Route::get('/' . $moduloPadre, function () use ($moduloPadre) {
        // Llama al método redirectToFirstAccessible con la ruta base.
        // Ej: Si usuario tiene acceso a 'empresas', redirige a /administracion-web/empresas.
        return app(ModuloRedirectController::class)
            ->redirectToFirstAccessible('/' . $moduloPadre);
    });

    // Prefijo para subrutas del módulo padre.
    Route::prefix($moduloPadre)->group(function () {

        $modulosHijos = ['empresas', 'configuracion-general', 'tablas-maestras'];

        // ===============================================================
        // MÓDULO HIJO: Empresas
        // Ruta: Redirige a la primera pestaña accesible dentro de Empresas.
        // ===============================================================
        Route::get('/' . $modulosHijos[0], function () use ($modulosHijos) {
            // Redirige a primera pestaña accesible (ej. /listado si tiene permiso).
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[0]);
        });

        // Grupo de pestañas para Empresas (prefijo /administracion-web/empresas).
        Route::prefix($modulosHijos[0])->group(function () {

            // --- VISTAS ---

            // Pestaña: Listado de empresas.
            // Middleware: pestana.access:1 (ID de la pestaña en DB) para validar acceso.
            Route::get('/listado', [EmpresaWebController::class, 'index'])
                ->name('empresa.listado')
                ->middleware('pestana.access:1');

            // Pestaña: Gestión de empresas (modo idle - sin crear ni editar).
            Route::get('/gestion', [EmpresaWebController::class, 'gestion'])
                ->name('empresa.gestion')
                ->middleware('pestana.access:2');

            // Pestaña: Gestión - Modo crear (URL amigable).
            Route::get('/gestion/crear', [EmpresaWebController::class, 'create'])
                ->name('empresa.create')
                ->middleware('pestana.access:2');

            // Pestaña: Gestión - Modo editar (URL amigable con ID).
            Route::get('/gestion/{id}', [EmpresaWebController::class, 'edit'])
                ->name('empresa.edit')
                ->middleware('pestana.access:2');


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
        Route::get('/' . $modulosHijos[1], function () use ($modulosHijos) {
            // Redirige a primera pestaña accesible (ej. /informacion-corporativa).
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[1]);
        });

        // Grupo de pestañas para Configuración General.
        Route::prefix($modulosHijos[1])->group(function () {

            Route::get('/informacion-corporativa', [ConfiguracionController::class, 'informacionCorporativa'])
                ->middleware('pestana.access:3');

            Route::get('/redes-sociales', [ConfiguracionController::class, 'redesSociales'])
                ->middleware('pestana.access:4');

            Route::post('/update-corporativa', [ConfiguracionController::class, 'updateInformacionCorporativa'])
                ->name('update-corporativa');
            Route::post('/update-redes', [ConfiguracionController::class, 'updateRedesSociales'])
                ->name('update-redes');
        });

        // ===============================================================
        // MÓDULO HIJO: Tablas Maestras
        // Ruta: Redirige a la primera pestaña accesible.
        // ===============================================================
        Route::get('/' . $modulosHijos[2], function () use ($modulosHijos) {
            // Redirige a primera pestaña accesible (ej. /tipos-identificaciones).
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[2]);
        });

        // Grupo de pestañas para Tablas Maestras.
        Route::prefix($modulosHijos[2])->group(function () {
            // Aquí se define la ruta para la pestaña de tipos de identificaciones, con middleware para acceso.
            Route::get('/tipos-identificaciones', [TipoIdentificacionController::class, 'index'])
                ->middleware('pestana.access:5');

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

            // Aquí se define la ruta para la pestaña de tipos de pqrsd, con middleware para acceso.
            Route::get('/tipos-pqrsd', [TipoPqrsController::class, 'index'])
                ->middleware('pestana.access:6');

            // --- CRUD ---
            // Mantienen el prefijo /tipos-pqrsd, pero se separan para mayor claridad.
            Route::prefix('tipos-pqrsd')->group(function () {
                // Acción: Crear tipo (POST).
                Route::post('/', [TipoPqrsController::class, 'store'])->name('tipo-pqrsd.store');
                // Acción: Actualizar tipo (PUT con ID).
                Route::put('/{id}', [TipoPqrsController::class, 'update'])->name('tipo-pqrsd.update');
                // Acción: Eliminar tipo (DELETE con ID).
                Route::delete('/{id}', [TipoPqrsController::class, 'destroy'])->name('tipo-pqrsd.destroy');
            });

            // Aquí se define la ruta para la pestaña de estados de pqrsd, con middleware para acceso.
            Route::get('/estados-pqrsd', [EstadoPqrsController::class, 'index'])
                ->middleware('pestana.access:7');

            // --- CRUD ---
            // Mantienen el prefijo /estados-pqrsd, pero se separan para mayor claridad.
            Route::prefix('estados-pqrsd')->group(function () {
                // Acción: Crear tipo (POST).
                Route::post('/', [EstadoPqrsController::class, 'store'])->name('estado-pqrsd.store');
                // Acción: Actualizar tipo (PUT con ID).
                Route::put('/{id}', [EstadoPqrsController::class, 'update'])->name('estado-pqrsd.update');
                // Acción: Eliminar tipo (DELETE con ID).
                Route::delete('/{id}', [EstadoPqrsController::class, 'destroy'])->name('estado-pqrsd.destroy');
            });
        });
    });
});
