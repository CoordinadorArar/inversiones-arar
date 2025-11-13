<?php
/**
 * Archivo de rutas web para la aplicación Laravel.
 * 
 * Este archivo define las rutas públicas y principales de la aplicación. 
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento y colaboración.
 * @version 1.0
 * @date 2025-11-11
 */
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CompaniesController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PQRSDController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * BLOQUE 1: Rutas Públicas - Páginas accesibles sin login.
 * 
 * Estas rutas corresponden a las páginas principales del sitio web, visibles para cualquier visitante.
 * Cada ruta llama a un método en un controlador específico, que a su vez renderiza un componente React
 * usando Inertia. No requieren middleware de autenticación, por lo que son públicas.
 */

// Ruta para la página de inicio (home).
// - Nombre de ruta: 'home' (para usar en helpers como route('home')).
Route::get('/', [HomeController::class, 'index'])->name('home');


// Rutas para la página de contacto.
// - Primera ruta: Muestra el formulario de contacto.
//   - Nombre: 'contact'
Route::get('/contacto', [ContactController::class, 'index'])->name('contact');
// - Segunda ruta: Procesa el envío del formulario.
//   - Propósito: Valida los datos del formulario, envía un email, y retorna un json con un mensaje de éxito o los errores.
//   - Nombre: 'contact.store'
Route::post('/contacto', [ContactController::class, 'store'])->name('contact.store');


// Ruta para la página de empresas.
// - Nombre: 'companies'
Route::get('/empresas', [CompaniesController::class, 'index'])->name('companies');


// Rutas para la página de pqrsd.
// - Nombre: 'pqrsd'
Route::get('/pqrsd', [PQRSDController::class, 'index'])->name('pqrsd');










Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
