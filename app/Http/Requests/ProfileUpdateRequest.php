<?php

namespace App\Http\Requests;

use App\Models\EmpresaWeb;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request para validar datos al actualizar el perfil del usuario.
 * Valida que el email pertenezca a un dominio de empresa autorizada.
 *
 * @author Yariangel Aray
 * @date 2025-12-12 - Documentado
 */
class ProfileUpdateRequest extends FormRequest
{
    /**
     * Reglas de validación para actualizar el perfil.
     * Valida formato de email y que el dominio esté en la lista de empresas autorizadas.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obtener dominios permitidos de empresas autorizadas.
        $dominiosPermitidos = EmpresaWeb::pluck('dominio')->filter()->values()->toArray();

        return [            
            'email' => [
                'required',
                'string',
                'lowercase',
                'max:255',            
                'email',
                function ($attribute, $value, $fail) use ($dominiosPermitidos) {
                    // Extraer dominio del email (@ejemplo.com).
                    $domain = substr(strrchr($value, "@"), 1);

                    // Validar que el dominio esté en la lista de empresas autorizadas.
                    if (!in_array($domain, $dominiosPermitidos)) {
                        $fail('El correo electrónico debe pertenecer a una empresa autorizada.');
                    }
                },
            ],
        ];
    }

    /**
     * Mensajes de error personalizados para las validaciones.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingrese un correo electrónico válido.',
            'email.max' => 'El correo debe tener máximo 255 caracteres.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
        ];
    }
}