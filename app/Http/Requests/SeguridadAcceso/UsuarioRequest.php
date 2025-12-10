<?php

namespace App\Http\Requests\SeguridadAcceso;

use App\Http\Controllers\EmpresaWebController;
use App\Models\EmpresaWeb;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Form Request para validar datos de usuarios.
 * Incluye validaciones de dominio empresarial autorizado.
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */
class UsuarioRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para esta petición.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepara la petición para validación.
     * Establece el header Accept como application/json para respuestas JSON.
     */
    protected function prepareForValidation(): void
    {
        $this->headers->set('Accept', 'application/json');
    }

    /**
     * Reglas de validación.
     */
    public function rules(): array
    {
        // Obtiene dominios permitidos de empresas
        $dominiosPermitidos = EmpresaWeb::pluck('dominio')->filter()->values()->toArray();

        $rules = [
            'numero_documento' => [
                'required',
                'string',
                'max:20',
                'regex:/^[0-9]+$/',
            ],
            'nombre_completo' => 'required|string',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                function ($attribute, $value, $fail) use ($dominiosPermitidos) {
                    $domain = substr(strrchr($value, "@"), 1);

                    if (!in_array($domain, $dominiosPermitidos)) {
                        $fail('El correo electrónico debe pertenecer a una empresa autorizada.');
                    }
                },
            ],
            'rol_id' => 'required|exists:roles,id',
        ];

        // Si es creación, validar que el documento sea único
        if ($this->isMethod('post') && $this->routeIs('usuarios.store')) {
            $rules['numero_documento'][] = 'unique:usarios,numero_documento';
        }

        return $rules;
    }

    /**
     * Mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'numero_documento.required' => 'El número de documento es obligatorio',
            'numero_documento.regex' => 'El número de documento solo debe contener números',
            'numero_documento.unique' => 'Este número de documento ya está registrado',
            'numero_documento.max' => 'El número de documento no debe superar 20 caracteres',

            'nombre_completo.required' => 'El nombre completo es obligatorio',

            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'Debe ingresar un correo electrónico válido',
            'email.max' => 'El correo debe tener máximo 255 caracteres',

            'rol_id.required' => 'Debe seleccionar un rol',
            'rol_id.exists' => 'El rol seleccionado no es válido',
        ];
    }
}
