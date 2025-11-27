<?php

namespace App\Http\Requests;

use App\Models\EmpresaWeb;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $dominiosPermitidos = EmpresaWeb::pluck('dominio')->filter()->values()->toArray();
        return [            
            'email' => [
                'required',
                'string',
                'lowercase',
                'max:255',            
                'email',
                    function ($attribute, $value, $fail) use ($dominiosPermitidos) {
                        // Extrae dominio del email.
                        $domain = substr(strrchr($value, "@"), 1);
                        if (!in_array($domain, $dominiosPermitidos)) {
                            $fail('El correo electrónico debe pertenecer a una empresa autorizada.');
                        }
                    },
            ],
        ];
    }

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
