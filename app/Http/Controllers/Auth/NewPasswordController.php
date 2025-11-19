<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'numero_documento' => $request->numero_documento,
            'token' => $request->route('token'),
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'numero_documento' => 'required|string|regex:/^[0-9]+$/|exists:usuarios,numero_documento',
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'max:20',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-.])[A-Za-z\d@$!%*?&#+\-.]+$/',
            ]],
            [
                'token.required' => 'El token es obligatorio.',
                'numero_documento.required' => 'El número de documento es obligatorio.',                
                'numero_documento.regex' => 'El número de documento solo debe contener números',
                'numero_documento.exists' => 'No se encontró un usuario con ese número de documento.',
                'password.required' => 'La contraseña es obligatoria.',
                'password.confirmed' => 'Las contraseñas no coinciden.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
                'password.max' => 'La contraseña debe tener máximo 20 caracteres.',
                'password.regex' => 'La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo.',
            ],
        );

        $user = User::where('numero_documento', $request->numero_documento)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'numero_documento' => 'Usuario no encontrado.',
            ]);
        }

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $request->only('numero_documento', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        if ($status == Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', 'Tu contraseña ha sido restablecida exitosamente.');
        }
        
        throw ValidationException::withMessages([
            'numero_documento' => ($status == Password::INVALID_TOKEN)
                ? 'El enlace de restablecimiento es inválido o ha expirado.'
                : 'No se pudo restablecer la contraseña. Por favor, intenta de nuevo.',
        ]);
    }
}
