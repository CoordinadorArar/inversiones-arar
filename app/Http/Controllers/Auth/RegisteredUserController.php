<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ContratoPropietario;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/Register', [
            'status' => session('status'),
            'document' => $request->document,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate(
            [
                'numero_documento' => 'required|string|regex:/^[0-9]+$/',
                'email' => 'required|string|lowercase|email',
                'password' => [
                    'required',
                    'confirmed',
                    'min:8',
                    'max:20',
                    'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-.])[A-Za-z\d@$!%*?&#+\-.]+$/',
                ]
            ],
            [
                'numero_documento.required' => 'El número de documento es obligatorio.',
                'numero_documento.regex' => 'El número de documento solo debe contener números',
                'email.required' => 'El correo electrónico es obligatorio.',
                'email.email' => 'Debe ingresar un correo electrónico válido.',
                'password.required' => 'La contraseña es obligatoria.',
                'password.confirmed' => 'Las contraseñas no coinciden.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
                'password.max' => 'La contraseña debe tener máximo 20 caracteres.',
                'password.regex' => 'La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo.',
            ]
        );

        $usuarioContrato = ContratoPropietario::where('f200_id', $request->numero_documento)->first();

        // Usuario no existe en contratos
        if (!$usuarioContrato || !$usuarioContrato->hasContratoActivo()) {
            throw ValidationException::withMessages([
                'numero_documento' => 'No encontramos registros con este número de documento. Verifica que esté correcto o comunícate con el área encargada.',
            ]);
        }

        $usuario = User::where('numero_documento', $request->numero_documento)->first();

        // Usuario no existe en usuarios de la web
        if ($usuario) {
            return redirect()->route('login')->with('status', 'Ya te encuentras registrado en nuestra web. Por favor, inicia sesión.');
        }

        $user = User::create([
            'numero_documento' => $request->numero_documento,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
