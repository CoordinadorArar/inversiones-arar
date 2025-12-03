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

/**
 * Request para login: Valida y autentica credenciales.
 * 
 * Lógica de authenticate() modificada:
 * - Si documento == password: Valida contratos, redirige a registro si no existe usuario en web.
 * - Si no: Login estándar con bloqueo por intentos fallidos.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-21
 */

class LoginRequest extends FormRequest
{
    /**
     * BLOQUE: authorize - Autorizar la request.
     * 
     * Siempre true (público).
     * 
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * BLOQUE: rules - Reglas de validación.
     * 
     * numero_documento: Obligatorio, string, max 15, solo números.
     * password: Obligatorio, string, max 20, regex para caracteres permitidos.
     * 
     * @return array
     */
    public function rules(): array
    {
        return [
            'numero_documento' => [
                'required',  // Obligatorio.
                'string',    // Debe ser string.
                'max:15',    // Máximo 15 caracteres.
                'regex:/^[0-9]+$/'  // Solo números.
            ],
            'password' => [
                'required',  // Obligatorio.
                'string',    // Debe ser string.
                'max:20',    // Máximo 20 caracteres.
                'regex:/^[a-zA-Z0-9@$!%*?&#+\-.]+$/'  // Caracteres permitidos (letras, números, símbolos específicos).
            ],
        ];
    }

    /**
     * BLOQUE: messages - Mensajes de error personalizados en español.
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
     * BLOQUE: attributes - Atributos personalizados para mensajes.
     * 
     * @return array
     */
    public function attributes(): array
    {
        return [
            'numero_documento' => 'número de documento',  // Para :attribute en mensajes.
            'password' => 'contraseña',
        ];
    }

    /**
     * BLOQUE: authenticate - Lógica de autenticación personalizada (modificada).
     * 
     * Si numero_documento == password: Modo "validación inicial" contra contratos.
     * - Busca en ContratoPropietario; si no existe/activo, error.
     * - Si no hay usuario web, lanza error para redirigir a registro.
     * - Si existe, pide contraseña habitual.
     * 
     * Si no: Login estándar.
     * - Busca usuario; si no existe, error.
     * - Si bloqueado o >=3 intentos, error.
     * - Intenta Auth::attempt; si falla, incrementa intentos, bloquea si >=3.
     * - Si éxito, reinicia intentos y regenera sesión.
     * 
     * @throws ValidationException
     */
    public function authenticate()
    {
        // Modo "validación inicial": Si documento == password (usuario no sabe contraseña web).
        if ($this->numero_documento == $this->password) {
            // Busca en contratos por f200_id (numero_documento).
            $usuarioContrato = ContratoPropietario::where('f200_id', $this->numero_documento)->first();

            // Si no existe en contratos o no tiene contrato activo, error.
            if (!$usuarioContrato || !$usuarioContrato->hasContratoActivo()) {
                throw ValidationException::withMessages([
                    'numero_documento' => 'No encontramos registros con este número de documento. Verifica que sea correcto o comunícate con el área encargada.',
                ]);
            }

            // Busca usuario en tabla usuarios web.
            $usuario = User::where('numero_documento', $this->numero_documento)->first();

            // Si no existe usuario web, lanza error para redirigir a registro.
            if (!$usuario) {
                throw ValidationException::withMessages([
                    'redirectRegister' => true,  // Flag para redireccionar.
                    'status' => 'Tu documento fue validado, pero aún no tienes un usuario registrado en nuestra web. Completa los datos para continuar por favor.'
                ]);
            }

            // Si existe usuario web, pide contraseña habitual (no valida aquí).
            throw ValidationException::withMessages([
                'statusMessage' => 'Verificamos tu identidad y estas registrado en nuestra web. Ahora ingresa tu contraseña habitual para acceder.'
            ]);
        } else {
            // Modo login estándar: documento != password.
            $usuario = User::where('numero_documento', $this->numero_documento)->first();

            // Si no existe usuario, error.
            if (!$usuario) {
                throw ValidationException::withMessages([
                    'numero_documento' => 'No existe un usuario en nuestra web con este número de documento.',
                ]);
            }

            $usuarioContrato = ContratoPropietario::where('f200_id', $this->numero_documento)->first();

            // Si no tiene contrato activo, error.
            if (!$usuarioContrato->hasContratoActivo()) {
                throw ValidationException::withMessages([
                    'numero_documento' => 'Lo sentimos, pero ya no formas parte de nuestro equipo.',
                ]);
            }

            // Si bloqueado o >=3 intentos, error.
            if ($usuario->bloqueado_at || $usuario->intentos_fallidos >= 3) {
                throw ValidationException::withMessages([
                    'numero_documento' => 'La cuenta está bloqueada. Contacte con un administrador.',
                ]);
            }

            // Intenta login con Auth::attempt (usa numero_documento como username).
            if (!Auth::attempt($this->only('numero_documento', 'password'), $this->boolean('remember'))) {
                // Falla: Incrementa intentos fallidos.
                $usuario->increment('intentos_fallidos');

                // Si llega a 3, bloquea cuenta.
                if ($usuario->intentos_fallidos >= 3) {
                    $usuario->update([
                        'bloqueado_at' => now(),  // Marca bloqueo.
                    ]);

                    throw ValidationException::withMessages([
                        'numero_documento' => 'Cuenta bloqueada por múltiples intentos fallidos. Contacte con un administrador.',
                    ]);
                }

                // Error de contraseña.
                throw ValidationException::withMessages([
                    'password' => 'La contraseña es incorrecta',
                ]);
            }

            // Éxito: Reinicia intentos y bloqueo, regenera sesión.
            $usuario->update([
                'intentos_fallidos' => 0,
                'bloqueado_at' => null,
            ]);

            $this->session()->regenerate();  // Regenera sesión.
        }
    }

    /**
     * BLOQUE: ensureIsNotRateLimited - Verificar rate limiting.
     * 
     * Si hay demasiados intentos, lanza Lockout y error.
     * 
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [  // Usa throttleKey (basado en email, pero adaptado).
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * BLOQUE: throttleKey - Clave para rate limiting.
     * 
     * Basada en email (aunque usas numero_documento, mantiene compatibilidad).
     * 
     * @return string
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }
}