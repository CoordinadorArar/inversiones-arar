<?php

namespace App\Http\Requests\Auth;

use App\Models\ContratoPropietario;
use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'numero_documento' => [
                'required',
                'string',
                'max:15',
                'regex:/^[0-9]+$/'
            ],
            'password' => ['required', 'string', 'max:20', 'regex:/^[a-zA-Z0-9@$!%*?&#+\-.]+$/'],
        ];
    }

    /**
     * Define mensajes de error personalizados en español.
     * 
     * @return array
     */
    public function messages(): array
    {
        return [
            'numero_documento.required' => 'El número de documento es obligatorio',
            'numero_documento.max' => 'El número de documento debe tener máximo 15 caracteres',
            'numero_documento.regex' => 'El número de documento solo debe contener números',

            'password.required' => 'La contraseña es obligatoria',
            'password.max' => 'La contraseña debe tener máximo 20 caracteres',
            'password.regex' => 'La contraseña contiene caracteres no permitidos',
        ];
    }

    /**
     * Configura los atributos personalizados para mensajes de error.
     * 
     * @return array
     */
    public function attributes(): array
    {
        return [
            'numero_documento' => 'número de documento',
            'password' => 'contraseña',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate()
    {

        if ($this->numero_documento == $this->password) {

            $usuarioContrato = ContratoPropietario::where('f200_id', $this->numero_documento)->first();

            // Usuario no existe en contratos
            if (!$usuarioContrato ||!$usuarioContrato->hasContratoActivo()) {
                throw ValidationException::withMessages([
                    'numero_documento' => 'No encontramos registros con este número de documento. Verifica que sea correcto o comunícate con el área encargada.',
                ]);
            }

            $usuario = User::where('numero_documento', $this->numero_documento)->first();

            // Usuario no existe en usuarios de la web
            if (!$usuario) {
                throw ValidationException::withMessages([
                    'redirectRegister' => true,
                    'status' => 'Tu documento fue validado, pero aún no tienes un usuario registrado en nuestra web. Completa los datos para continuar por favor.'
                ]);
            }


            // El usuario existe, pero debe colocar su contraseña habitual
            throw ValidationException::withMessages([
                'statusMessage' => 'Verificamos tu identidad y estas registrado en nuestra web. Ahora ingresa tu contraseña habitual para acceder.'
            ]);


        } else {
            $usuario = User::where('numero_documento', $this->numero_documento)->first();

            // Usuario no existe
            if (! $usuario) {
                throw ValidationException::withMessages([
                    'numero_documento' => 'No existe un usuario en nuestra web con este número de documento.',
                ]);
            }

            // Usuario bloqueado
            if ($usuario->bloqueado_at || $usuario->intentos_fallidos >= 3) {
                throw ValidationException::withMessages([
                    'numero_documento' => 'La cuenta está bloqueada. Contacte con un administrador.',
                ]);
            }

            // Intento de login -> contraseña incorrecta
            if (! Auth::attempt($this->only('numero_documento', 'password'), $this->boolean('remember'))) {

                // Sumar intento fallido
                $usuario->increment('intentos_fallidos');

                if ($usuario->intentos_fallidos >= 3) {
                    $usuario->update([
                        'bloqueado_at' => now(),
                    ]);

                    throw ValidationException::withMessages([
                        'numero_documento' => 'Cuenta bloqueada por múltiples intentos fallidos. Contacte con un administrador.',
                    ]);
                }

                throw ValidationException::withMessages([
                    'password' => 'La contraseña es incorrecta',
                ]);
            }

            // Login exitoso → reiniciar intentos
            $usuario->update([
                'intentos_fallidos' => 0,
                'bloqueado_at' => null,
            ]);

            $this->session()->regenerate();
        }
    }



    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }
}
