<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'numero_documento' => 'required|string|max:15|regex:/^[0-9]+$/|exists:usuarios,numero_documento',
        ], [
            'numero_documento.required' => 'El número de documento es obligatorio',
            'numero_documento.max' => 'El número de documento debe tener máximo 15 caracteres',
            'numero_documento.regex' => 'El número de documento solo debe contener números',
            'numero_documento.exists' => 'No se encontró un registro con este número de documento',
        ]);

        // Buscar usuario por su número de documento
        $usuario = User::where('numero_documento', $request->numero_documento)->first();

        if (!$usuario) {
            throw ValidationException::withMessages([
                'numero_documento' => 'No existe un usuario con este número de documento.',
            ]);
        }

        // Verificar si tiene correo registrado
        if (!$usuario->email) {
            throw ValidationException::withMessages([
                'numero_documento' => 'El usuario no tiene un correo electrónico registrado.',
            ]);
        }


        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $status = Password::sendResetLink([
            'email' => $usuario->email
        ]);

        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', 'Hemos enviado el enlace de recuperación a su correo electrónico.');
        }

        throw ValidationException::withMessages([
            'numero_documento' => __('No se pudo enviar el enlace de recuperación. Inténtelo más tarde.'),
        ]);
    }
}
