<?php

namespace App\Http\Requests\SeguridadAcceso;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request para validar datos de roles.
 * Valida campos como nombre y abreviatura, asegurando unicidad.
 * Mensajes en español para errores de validación.
 *
 * @author Yariangel Aray
 * @date 2025-12-17
 */
class RolRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para hacer esta petición.
     * Retorna true (autorización manejada en controlador).
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación para los campos del rol.
     * Incluye unicidad ignorando el ID actual y soft deletes.
     *
     * @return array Reglas de validación.
     */
    public function rules(): array
    {
        $id = $this->route()->parameter('id') ?? null;

        return [
            'nombre' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/',
                Rule::unique('roles', 'nombre')
                    ->ignore($id)
                    ->whereNull('deleted_at'),
            ],
            'abreviatura' => [
                'required',
                'string',
                'max:10',
                'regex:/^[a-zA-Z]+$/',
                Rule::unique('roles', 'abreviatura')
                    ->ignore($id)
                    ->whereNull('deleted_at'),
            ],
        ];
    }

    /**
     * Mensajes de error personalizados para validaciones.
     * Proporciona mensajes amigables en español para cada regla.
     *
     * @return array Mensajes de error.
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.string' => 'El nombre debe ser una cadena de texto.',
            'nombre.max' => 'El nombre no puede exceder 50 caracteres.',
            'nombre.regex' => 'El nombre solo puede contener letras, números y espacios.',
            'nombre.unique' => 'Ya existe un rol con este nombre.',

            'abreviatura.required' => 'La abreviatura es obligatoria.',
            'abreviatura.string' => 'La abreviatura debe ser texto.',
            'abreviatura.max' => 'La abreviatura no puede exceder los 10 caracteres.',
            'abreviatura.regex' => 'La abreviatura solo puede contener letras sin espacios.',
            'abreviatura.unique' => 'Ya existe un rol con esta abreviatura.',
        ];
    }

    /**
     * Prepara la petición para validación.
     * Fuerza header Accept a JSON para respuestas consistentes.
     */
    protected function prepareForValidation(): void
    {
        $this->headers->set('Accept', 'application/json');
    }
}