<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador para sesiones autenticadas (login/logout).
 * 
 * Maneja la vista de login, autenticación y logout. Usa LoginRequest para validación personalizada.
 * Incluye lógica para redireccionar a registro si el usuario no existe en la web pero sí en contratos.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-21
 */

class AuthenticatedSessionController extends Controller
{
    /**
     * BLOQUE: create - Mostrar vista de login.
     * 
     * Renderiza componente React 'Auth/Login' con status de sesión (ej. mensajes de éxito).
     * 
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),  // Pasa mensajes de sesión (ej. de registro).
        ]);
    }

    /**
     * BLOQUE: store - Manejar solicitud de autenticación (login).
     * 
     * Usa LoginRequest para autenticar. Si falla, maneja excepciones para redireccionar a registro
     * o mostrar mensajes. Regenera sesión en éxito. Redirige a dashboard.
     * 
     * Lógica modificada: Integra validación contra contratos y usuarios web.
     * 
     * @param LoginRequest $request
     * @return RedirectResponse
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            // Llama a authenticate() en LoginRequest (lógica de login personalizada).
            $request->authenticate();

            // Regenera sesión para prevenir fixation attacks.
            $request->session()->regenerate();

            // Redirige a dashboard (o intended URL).
            return redirect()->intended(route('dashboard', absolute: false));
        } catch (ValidationException $e) {
            // Captura errores de validación desde LoginRequest.
            $errors = $e->errors();

            // Si hay error 'redirectRegister', redirige a registro con documento y mensaje.
            if (isset($errors['redirectRegister'])) {
                return redirect()
                    ->route('register', ['document' => $request->numero_documento])  // Pasa documento como param.
                    ->with('status', $errors['status'][0]);  // Mensaje de status.
            }

            // Si hay 'statusMessage', vuelve atrás con mensaje (ej. "ingresa contraseña habitual").
            if (isset($errors['statusMessage'])) {
                return back()->with('status', $errors['statusMessage'][0]);
            }

            // Si no es ninguno de los anteriores, relanza la excepción (errores estándar).
            throw $e;
        }
    }

    /**
     * BLOQUE: destroy - Destruir sesión autenticada (logout).
     * 
     * Logout del guard 'web', invalida sesión, regenera token CSRF, redirige a home.
     * 
     * @param Request $request
     * @return RedirectResponse
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Logout del usuario autenticado.
        Auth::guard('web')->logout();

        // Invalida la sesión actual.
        $request->session()->invalidate();

        // Regenera token CSRF para seguridad.
        $request->session()->regenerateToken();

        // Redirige a página de inicio.
        return redirect('/');
    }
}