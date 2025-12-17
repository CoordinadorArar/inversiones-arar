<?php

use App\Http\Controllers\SeguridadAcceso\ControlAccesoController;
use App\Http\Controllers\ModuloRedirectController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;

/**
 * Archivo de rutas para el módulo "Seguridad y Acceso".
 * 
 * Propósito: Define rutas jerárquicas para el módulo padre "Seguridad y Acceso" y sus hijos.
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
 * /seguridad-acceso
 * 
 * // Módulo Hijo: Usuarios
 * /seguridad-acceso/usuarios
 * /seguridad-acceso/usuarios/listado
 * /seguridad-acceso/usuarios/gestion
 * /seguridad-acceso/usuarios/gestion/crear
 * /seguridad-acceso/usuarios/gestion/{id}
 * /seguridad-acceso/usuarios/buscar-documentos
 * 
 * // Módulo Hijo: Control de Acceso
 * /seguridad-acceso/control-accesos
 * /seguridad-acceso/control-accesos/accesos-modulos
 * /seguridad-acceso/control-accesos/accesos-modulos/{rolId}
 * /seguridad-acceso/control-accesos/accesos-pestanas
 * /seguridad-acceso/control-accesos/accesos-pestanas/{rolId}
 * 
 * @author Yariangel Aray
 * @date 2025-12-05
 */

// Grupo de rutas protegidas con middleware 'auth' (requiere login).
Route::middleware('auth')->group(function () {

    $moduloPadre = 'seguridad-acceso';

    // Módulo padre: Seguridad y Acceso - Usa ModuloRedirectController para chequear permisos y redirigir al primer módulo hijo accesible.
    Route::get('/' . $moduloPadre, function () use ($moduloPadre) {
        return app(ModuloRedirectController::class)
            ->redirectToFirstAccessible('/' . $moduloPadre);
    });

    // Prefijo para subrutas del módulo padre.
    Route::prefix($moduloPadre)->group(function () {

        $modulosHijos = ['usuarios', 'roles', 'control-accesos'];

        // Módulo hijo: Usuarios - Usa ModuloRedirectController para redirigir a primera pestaña accesible.
        Route::get('/' . $modulosHijos[0], function () use ($modulosHijos) {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[0]);
        });

        // Grupo de pestañas para Usuarios.
        Route::prefix($modulosHijos[0])->group(function () {

            // Vistas
            // Middleware: pestana.access:8 (ID de la pestaña en DB) para validar acceso a listado.
            Route::get('/listado', [UsuarioController::class, 'index'])
                ->name('usuario.listado')
                ->middleware('pestana.access:8');

            // Middleware: pestana.access:9 para gestión.
            Route::get('/gestion', [UsuarioController::class, 'gestion'])
                ->name('usuario.gestion')
                ->middleware('pestana.access:9');

            Route::get('/gestion/crear', [UsuarioController::class, 'create'])
                ->name('usuario.create')
                ->middleware('pestana.access:9');

            Route::get('/gestion/{id}', [UsuarioController::class, 'edit'])
                ->name('usuario.edit')
                ->middleware('pestana.access:9');

            // API para buscar documentos.
            Route::get('/buscar-documentos', [UsuarioController::class, 'buscarDocumentos'])
                ->name('usuario.buscar-documentos');

            // CRUD y acciones especiales.
            Route::prefix('gestion')->group(function () {
                Route::post('/', [UsuarioController::class, 'store'])->name('usuario.store');
                Route::put('/{id}', [UsuarioController::class, 'update'])->name('usuario.update');
                Route::delete('/{id}', [UsuarioController::class, 'destroy'])->name('usuario.destroy');

                // Acciones: Bloquear, desbloquear y restaurar contraseña.
                Route::post('/bloquear/{id}', [UsuarioController::class, 'bloquear'])->name('usuario.bloquear');
                Route::post('/desbloquear/{id}', [UsuarioController::class, 'desbloquear'])->name('usuario.desbloquear');
                Route::post('/restaurar-password/{id}', [UsuarioController::class, 'restaurarPassword'])->name('usuario.restaurar-password');
            });
        });

        // Módulo hijo: Roles -  Middleware 'modulo.access:10' (ID del módulo en DB) para validar acceso directo.
        Route::get('/' . $modulosHijos[1], [RolController::class, 'index'])->middleware('modulo.access:10');

        // CRUD para Roles.
        Route::prefix($modulosHijos[1])->group(function () {

            Route::post('/', [RolController::class, 'store'])->name('rol.store');
            Route::put('/{id}', [RolController::class, 'update'])->name('rol.update');
            Route::delete('/{id}', [RolController::class, 'destroy'])->name('rol.destroy');
        });

        // Módulo hijo: Control de Acceso - Usa ModuloRedirectController para redirigir a primera pestaña accesible.
        Route::get('/' . $modulosHijos[2], function () use ($modulosHijos) {
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[2]);
        });

        // Grupo de pestañas para Control de Acceso.
        Route::prefix($modulosHijos[2])->group(function () {

            // Vistas - Pestaña Accesos a Módulos
            // Middleware: pestana.access:10 (ID de la pestaña Módulos en DB)
            Route::get('/accesos-modulos', [ControlAccesoController::class, 'modulos'])
                ->name('control-acceso.modulos')
                ->middleware('pestana.access:10');

            // Vista con rol seleccionado
            Route::get('/accesos-modulos/{rolId}', [ControlAccesoController::class, 'modulos'])
                ->name('control-acceso.modulos.rol')
                ->middleware('pestana.access:10');

            // API - Asignación y desasignación de módulos
            Route::post('/asignar-modulo', [ControlAccesoController::class, 'asignarModulo'])
                ->name('control-acceso.asignar-modulo');

            Route::post('/desasignar-modulo', [ControlAccesoController::class, 'desasignarModulo'])
                ->name('control-acceso.desasignar-modulo');

            // API para cargar módulos por rol
            Route::get('/accesos-modulos/cargar/{rolId}', [ControlAccesoController::class, 'cargarModulosPorRol'])
                ->name('control-acceso.cargar-modulos');


            // Vistas - Pestaña Pestañas (para cuando la implementes)
            // Middleware: pestana.access:11 (ID de la pestaña Pestañas en DB)
            Route::get('/accesos-pestanas', [ControlAccesoController::class, 'pestanas'])
                ->name('control-acceso.pestanas')
                ->middleware('pestana.access:11');

            Route::get('/accesos-pestanas/{rolId}', [ControlAccesoController::class, 'pestanas'])
                ->name('control-acceso.pestanas.rol')
                ->middleware('pestana.access:11');

            // API - Asignación y desasignación de pestañas (para cuando las implementes)
            Route::post('/asignar-pestana', [ControlAccesoController::class, 'asignarPestana'])
                ->name('control-acceso.asignar-pestana');

            Route::post('/desasignar-pestana', [ControlAccesoController::class, 'desasignarPestana'])
                ->name('control-acceso.desasignar-pestana');

            // API para cargar pestañas por rol
            Route::get('/accesos-pestanas/cargar/{rolId}', [ControlAccesoController::class, 'cargarPestanasPorRol'])
                ->name('control-acceso.cargar-pestanas');
        });
    });
});
