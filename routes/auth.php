<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

/**
 * Archivo de rutas para autenticación (auth.php).
 * 
 * Propósito: Define rutas estándar de Laravel para manejar login, registro, recuperación de contraseña y verificación de email.
 * Usa middlewares 'guest' (para usuarios no autenticados) y 'auth' (para autenticados) para proteger rutas.
 * 
 * Rutas disponibles:
 * 
 * // Grupo 'guest' (usuarios no autenticados - registro, login, reset password)
 * /register/{document} - Formulario de registro con documento prellenado.
 * /register (POST) - Envía datos de registro.
 * /login - Formulario de login.
 * /login (POST) - Envía credenciales de login.
 * /forgot-password - Formulario para solicitar reset de contraseña.
 * /forgot-password (POST) - Envía email con link de reset.
 * /reset-password/{token} - Formulario para nueva contraseña con token.
 * /reset-password (POST) - Actualiza contraseña con nueva.
 * 
 * // Grupo 'auth' (usuarios autenticados - verificación email, confirmación password, logout)
 * /verify-email - Página que pide verificar email si no está verificado.
 * /verify-email/{id}/{hash} - Verifica email al hacer clic en link del email.
 * /email/verification-notification (POST) - Reenvía email de verificación.
 * /confirm-password - Formulario para confirmar contraseña actual (ej. antes de acción sensible).
 * /confirm-password (POST) - Confirma contraseña.
 * /password (PUT) - Actualiza contraseña del usuario logueado.
 * /logout (POST) - Cierra sesión.
 * 
 * @author Yariangel Aray
 * @date 2025-12-02
 */

// Grupo 'guest': Rutas para usuarios NO autenticados (no logueados). Usado para registro, login y recuperación de contraseña.
Route::middleware('guest')->group(function () {
    // Registro: Muestra formulario de registro con documento prellenado (ej. desde BD externa).
    Route::get('register/{document}', [RegisteredUserController::class, 'create'])
        ->name('register');

    // Registro: Envía datos del formulario para crear cuenta nueva.
    Route::post('register', [RegisteredUserController::class, 'store'])
        ->name('register.store');

    // Login: Muestra formulario de inicio de sesión.
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    // Login: Envía email/contraseña para autenticar usuario.
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // Recuperación: Muestra formulario para ingresar email y solicitar reset de contraseña.
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    // Recuperación: Envía email con link seguro para resetear contraseña.
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    // Reset: Muestra formulario para ingresar nueva contraseña (usando token del email).
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    // Reset: Actualiza contraseña en BD con la nueva.
    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

// Grupo 'auth': Rutas para usuarios YA autenticados (logueados). Usado para verificación de email, confirmación de contraseña y logout.
Route::middleware('auth')->group(function () {
    // Verificación email: Muestra página que pide verificar email si no está confirmado (ej. "Revisa tu email").
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    // Verificación email: Procesa el link del email para marcar email como verificado (con firma segura y límite de intentos).
    // Middleware adicional: 'signed' (verifica que el link no fue alterado) y 'throttle:6,1' (máximo 6 intentos por minuto para evitar abuso).
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    // Verificación email: Reenvía email de verificación si el usuario lo solicita (con límite de envíos).
    // Middleware: 'throttle:6,1' para no permitir spam de emails.
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Confirmación contraseña: Muestra formulario para confirmar contraseña actual (ej. antes de cambiar settings sensibles).
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    // Confirmación contraseña: Verifica que la contraseña actual es correcta.
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    // Actualizar contraseña: Cambia la contraseña del usuario logueado (desde perfil o settings).
    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    // Logout: Cierra la sesión actual del usuario.
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
