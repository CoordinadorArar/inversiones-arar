<?php

/**
 * Archivo de rutas web para la aplicación Laravel.
 * 
 * Define las rutas públicas y principales de la aplicación. Incluye páginas de home, contacto, portafolio,
 * empresas y PQRSD. Usa Inertia para renderizar componentes React. Todas son públicas (sin auth middleware).
 * También incluye rutas autenticadas para dashboard y perfil.
 * 
 * Rutas disponibles:
 * 
 * // Grupo 'public' (páginas públicas - sin login requerido)
 * / - Página de inicio (home).
 * /contacto - Formulario de contacto.
 * /contacto (POST) - Envío del formulario de contacto.
 * /portafolio - Página de portafolio.
 * /empresas - Página de empresas.
 * /pqrsd - Formulario de PQRSD.
 * /pqrsd (POST) - Envío del formulario de PQRSD.
 * 
 * // Grupo 'auth' (páginas autenticadas - requieren login)
 * /dashboard - Dashboard principal del usuario logueado.
 * /profile - Perfil del usuario.
 * /profile (PATCH) - Actualización del perfil.
 * 
 * @author Yariangel Aray
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
    // Home: Página de inicio con info de la empresa.
    Route::get('/', [HomeController::class, 'index'])->name('home');

    // Contacto: Formulario de contacto (GET) y envío (POST).
    Route::get('/contacto', [ContactController::class, 'index'])->name('contact');
    Route::post('/contacto', [ContactController::class, 'store'])->name('contact.store');

    // Portafolio: Servicios y clientes destacados.
    Route::get('/portafolio', [PortfolioController::class, 'index'])->name('portfolio');

    // Empresas: Lista de empresas asociadas.
    Route::get('/empresas', [CompaniesController::class, 'index'])->name('companies');

    // PQRSD: Formulario multi-paso (GET) y envío (POST).
    Route::get('/pqrsd', [PQRSDController::class, 'index'])->name('pqrsd');
    Route::post('/pqrsd', [PQRSDController::class, 'store'])->name('pqrsd.store');
});

/**
 * BLOQUE 2: Rutas Autenticadas - Páginas que requieren login.
 * 
 * Agrupadas en middleware 'auth' para proteger acceso. Usadas para dashboard y gestión de perfil.
 */
Route::middleware('auth')->group(function () {
    // Dashboard: Página principal del usuario logueado (renderiza componente Dashboard via Inertia).
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    // Perfil: Vista y actualización del perfil del usuario.
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

// Incluye rutas de autenticación (login, register, etc.).
require __DIR__ . '/auth.php';
// Incluye rutas de módulos jerárquicos.
require __DIR__ . '/Modulos/administracionWeb.php';
require __DIR__ . '/Modulos/seguridadAcceso.php';
require __DIR__ . '/Modulos/gestionModulos.php';
require __DIR__ . '/Modulos/recursosHumanos.php';

require __DIR__ . '/Modulos/modulosDirectos.php';