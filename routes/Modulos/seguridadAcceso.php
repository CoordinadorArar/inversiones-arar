<?php

use App\Http\Controllers\ModuloRedirectController;
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
 * @author Yariangel Aray
 * @date 2025-12-05
 */

// Grupo de rutas protegidas con middleware 'auth' (requiere login).
Route::middleware('auth')->group(function () {

    $moduloPadre = 'seguridad-acceso';
    // ===================================================================
    // MÓDULO PADRE: Seguridad y Acceso
    // Ruta base: Redirige dinámicamente al primer módulo hijo accesible para el usuario.
    // Usa ModuloRedirectController para chequear permisos y redirigir.
    // ===================================================================
    Route::get('/' . $moduloPadre, function () use ($moduloPadre) {
        // Llama al método redirectToFirstAccessible con la ruta base.
        // Ej: Si usuario tiene acceso a 'usuarios', redirige a /seguridad-acceso/usuarios.
        return app(ModuloRedirectController::class)
            ->redirectToFirstAccessible('/' . $moduloPadre);
    });

    // Prefijo para subrutas del módulo padre.
    Route::prefix($moduloPadre)->group(function () {

        $modulosHijos = ['usuarios', 'roles'];

        // ===============================================================
        // MÓDULO HIJO: Usuarios
        // Ruta: Redirige a la primera pestaña accesible dentro de Usuarios.
        // ===============================================================
        Route::get('/' . $modulosHijos[0], function () use ($modulosHijos) {
            // Redirige a primera pestaña accesible (ej. /listado si tiene permiso).
            return app(ModuloRedirectController::class)
                ->redirectToFirstAccessible('/' . $modulosHijos[0]);
        });

        // Grupo de pestañas para Usuarios (prefijo /seguridad-acceso/usuarios).
        Route::prefix($modulosHijos[0])->group(function () {

            // --- VISTAS ---

            // Pestaña: Listado de usuarios.
            // Middleware: pestana.access:8 (ID de la pestaña en DB) para validar acceso.
            Route::get('/listado', [UsuarioController::class, 'index'])
                ->name('usuario.listado')
                ->middleware('pestana.access:8');

            // Pestaña: Gestión de usuarios (crear/editar).
            Route::get('/gestion', [UsuarioController::class, 'gestion'])
                ->name('usuario.gestion')
                ->middleware('pestana.access:9');

            // Pestaña: Gestión - Modo crear (URL amigable).
            Route::get('/gestion/crear', [UsuarioController::class, 'create'])
                ->name('usuario.create')
                ->middleware('pestana.access:9');

            // Pestaña: Gestión - Modo editar (URL amigable con ID).
            Route::get('/gestion/{id}', [UsuarioController::class, 'edit'])
                ->name('usuario.edit')
                ->middleware('pestana.access:9');

            // Pestaña: Gestión - Modo editar (URL amigable con ID).
            Route::get('/buscar-documentos', [UsuarioController::class, 'buscarDocumentos'])
                ->name('usuario.buscar-documentos');

            // --- CRUD ---
            // Mantienen el prefijo /gestion, pero se separan para mayor claridad.
            Route::prefix('gestion')->group(function () {
                // Acción: Crear usuario (POST).
                Route::post('/', [UsuarioController::class, 'store'])->name('usuario.store');
                // Acción: Actualizar usuario (PUT con ID).
                Route::post('/{id}', [UsuarioController::class, 'update'])->name('usuario.update');
                // Acción: Eliminar usuario (DELETE con ID).                
                Route::delete('/{id}', [UsuarioController::class, 'destroy'])->name('usuario.destroy');

                // Acción: Bloquear usuario
                Route::post('/bloquear/{id}', [UsuarioController::class, 'bloquear'])->name('usuario.bloquear');
                // Acción: Desbloquear usuario
                Route::post('/desbloquear/{id}', [UsuarioController::class, 'desbloquear'])->name('usuario.desbloquear');

                // Acción: Eliminar usuario
                Route::post('/restaurar-password/{id}', [UsuarioController::class, 'restaurarPassword'])->name('usuario.restaurar-password');
            });
        });
    });
});
