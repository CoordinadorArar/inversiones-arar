<?php

/**
 * Archivo de rutas web para la aplicación Laravel.
 * 
 * Define las rutas públicas y principales de la aplicación. Incluye páginas de home, contacto, portafolio,
 * empresas y PQRSD. Usa Inertia para renderizar componentes React. Todas son públicas (sin auth middleware).
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento y colaboración.
 
 * @date 2025-11-18 
 */

use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\CompaniesController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\PortfolioController;
use App\Http\Controllers\PQRSD\PQRSDController;
use App\Http\Controllers\ProfileController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



/**
 * BLOQUE 1: Rutas Públicas - Páginas accesibles sin login.
 * 
 * Agrupadas en middleware 'public' para compartir 'empresasHeader' globalmente via SharePublicData.
 * Cada ruta renderiza componente React vía Inertia. No requieren auth.
 * 
 * Por qué middleware 'public':
 * - Comparte datos (empresas para header) sin repetir queries en controladores.
 * - Optimiza rendimiento y mantiene código DRY.
 */
Route::middleware('public')->group(function () {
    // Ruta para la página de inicio (home).
    // - Método HTTP: GET (solo lectura, no modifica datos).
    // - URL: '/' (raíz del sitio).
    // - Controlador: HomeController@index (renderiza componente Home con info de la empresa).
    // - Nombre de ruta: 'home' (usado en helpers como route('home') para navegación SPA).
    Route::get('/', [HomeController::class, 'index'])->name('home');

    // Rutas para la página de contacto.
    // - Primera ruta: Muestra el formulario de contacto.
    //   - Método: GET.
    //   - URL: '/contacto'.
    //   - Controlador: ContactController@index (renderiza form de contacto).
    //   - Nombre: 'contact'.
    Route::get('/contacto', [ContactController::class, 'index'])->name('contact');

    // - Segunda ruta: Procesa el envío del formulario de contacto.
    //   - Método: POST (envía datos del form).
    //   - URL: '/contacto' (misma que GET, pero método diferente).
    //   - Controlador: ContactController@store (valida datos, envía email, retorna JSON con éxito o errores).
    //   - Propósito: Backend para submit del form; usa validación Zod/frontend y Laravel/backend.
    //   - Nombre: 'contact.store'.
    Route::post('/contacto', [ContactController::class, 'store'])->name('contact.store');

    // Ruta para la página de portafolio.
    // - Método: GET.
    // - URL: '/portafolio'.
    // - Controlador: PortfolioController@index (renderiza servicios y clientes destacados).
    // - Nombre: 'portfolio'.
    Route::get('/portafolio', [PortfolioController::class, 'index'])->name('portfolio');

    // Ruta para la página de empresas.
    // - Método: GET.
    // - URL: '/empresas'.
    // - Controlador: CompaniesController@index (renderiza lista de empresas asociadas).
    // - Nombre: 'companies'.
    Route::get('/empresas', [CompaniesController::class, 'index'])->name('companies');

    // Rutas para PQRSD (Peticiones, Quejas, Reclamos, Sugerencias, Denuncias).
    // - Primera ruta: Muestra el formulario multi-paso de PQRSD.
    //   - Método: GET.
    //   - URL: '/pqrsd'.
    //   - Controlador: PQRSDController@index (renderiza form con pasos).
    //   - Nombre: 'pqrsd'.
    Route::get('/pqrsd', [PQRSDController::class, 'index'])->name('pqrsd');

    // - Segunda ruta: Procesa el envío del formulario de PQRsD.
    //   - Método: POST.
    //   - URL: '/pqrsd'.
    //   - Controlador: PQRSDController@store (valida, guarda en DB, envía emails, maneja archivos).
    //   - Propósito: Backend para submit; incluye transacciones DB y manejo de adjuntos.
    //   - Nombre: 'pqrsd.store'.
    Route::post('/pqrsd', [PQRSDController::class, 'store'])->name('pqrsd.store');
});




Route::middleware('auth')->group(function () {

    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // EJEMPLO

    // Route::prefix('gh')->name('gh.')->group(function () {  // MODULO NIVEL PADRE

    //     Route::prefix('contratos')->name('contratos.')->group(function () { // MODULO NIVEL 2

    //         Route::prefix('tipos')->name('tipos.')->group(function () { // PESTAÑA 

    //             Route::get('/', fn() => Inertia::render('GH/Contratos/Tipos/Index'))
    //                 ->name('index');

    //             Route::get('/crear', fn() => Inertia::render('GH/Contratos/Tipos/Create'))
    //                 ->name('crear'); // Nivel 4

    //             Route::get(
    //                 '/{id}/editar',
    //                 fn($id) =>
    //                 Inertia::render('GH/Contratos/Tipos/Edit', ['id' => $id])
    //             )->name('editar'); // Nivel 4
    //         });
    //     });
    // });
});


require __DIR__ . '/auth.php';
require __DIR__ . '/Modulos/administracionWeb.php';
require __DIR__ . '/Modulos/seguridadAcceso.php';
require __DIR__ . '/Modulos/modulosDirectos.php';
