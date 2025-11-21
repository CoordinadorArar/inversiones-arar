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

/**
 * Controlador para registro de usuarios.
 * 
 * Maneja vista de registro y creación de usuarios. Valida contratos antes de registrar.
 * Asigna rol 'Estandar' por defecto. Loguea al usuario después de registrar.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-21
 */

class RegisteredUserController extends Controller
{
    /**
     * BLOQUE: create - Mostrar vista de registro.
     * 
     * Renderiza 'Auth/Register' con status y documento (si viene de login).
     * 
     * @param Request $request
     * @return Response
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/Register', [
            'status' => session('status'),  // Mensajes de sesión.
            'document' => $request->document,  // Documento pasado desde login.
        ]);
    }

    /**
     * BLOQUE: store - Manejar solicitud de registro (modificado).
     * 
     * Valida datos. Verifica existencia/activo en contratos. Si ya existe usuario web, redirige a login.
     * Crea usuario con rol 'Estandar', hashea password, loguea y redirige a dashboard.
     * 
     * @param Request $request
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        // Valida con reglas personalizadas (numero_documento, email, password).
        $request->validate(
            [
                'numero_documento' => 'required|string|regex:/^[0-9]+$/',
                'email' => 'required|string|lowercase|email',  // lowercase: Normaliza email.
                'password' => [
                    'required',
                    'confirmed',  // Debe coincidir con password_confirmation.
                    'min:8',
                    'max:20',
                    'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-.])[A-Za-z\d@$!%*?&#+\-.]+$/',  // Complejidad.
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

        // Verifica existencia en contratos.
        $usuarioContrato = ContratoPropietario::where('f200_id', $request->numero_documento)->first();

        // Si no existe o no activo, error.
        if (!$usuarioContrato || !$usuarioContrato->hasContratoActivo()) {
            throw ValidationException::withMessages([
                'numero_documento' => 'No encontramos registros con este número de documento. Verifica que esté correcto o comunícate con el área encargada.',
            ]);
        }

        // Verifica si ya existe usuario web.
        $usuario = User::where('numero_documento', $request->numero_documento)->first();

        // Si existe, redirige a login con mensaje.
        if ($usuario) {
            return redirect()->route('login')->with('status', 'Ya te encuentras registrado en nuestra web. Por favor, inicia sesión.');
        }

        // Crea usuario: numero_documento, rol_id=2 (Estandar), email, password hasheada.
        $user = User::create([
            'numero_documento' => $request->numero_documento,
            'rol_id' => 2,  // Rol Estandar.
            'email' => $request->email,
            'password' => Hash::make($request->password),  // Hashea password.
        ]);

        // Evento Registered comentado (opcional).
        // event(new Registered($user));

        // Loguea al usuario recién creado.
        Auth::login($user);

        // Redirige a dashboard.
        return redirect(route('dashboard', absolute: false));
    }
}