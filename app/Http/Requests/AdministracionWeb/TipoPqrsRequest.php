<?php

namespace App\Http\Requests\AdministracionWeb;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request para validar Tipos de PQRSD
 * 
 * @author Yariangel Aray
 * @date 2025-12-03
 */
class TipoPqrsRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para hacer esta petición
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación
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
                Rule::unique('tipos_pqrs', 'nombre')
                    ->ignore($id)
                    ->whereNull('deleted_at'),
            ],
            'abreviatura' => [
                'required',
                'string',
                'max:10',
                'regex:/^[a-zA-Z]+$/',
                Rule::unique('tipos_pqrs', 'abreviatura')
                    ->ignore($id)
                    ->whereNull('deleted_at'),
            ],
        ];
    }

    /**
     * Mensajes de error personalizados
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.string' => 'El nombre debe ser texto',
            'nnombre.max' => 'El nombre no puede exceder los 50 caracteres',
            'nombre.regex' => 'El nombre solo puede contener letras, números y espacios',
            'nombre.unique' => 'Ya existe un tipo de pqrs con este nombre',

            'abreviatura.required' => 'La abreviatura es obligatoria',
            'abreviatura.string' => 'La abreviatura debe ser texto',
            'abreviatura.max' => 'La abreviatura no puede exceder los 10 caracteres',
            'abreviatura.regex' => 'La abreviatura solo puede contener letras sin espacios',
            'abreviatura.unique' => 'Ya existe un tipo de pqrs con esta abreviatura',
        ];
    }

    /**
     * Prepara los datos antes de la validación
     * Convierte la abreviatura a mayúsculas
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('abreviatura')) {
            $this->merge([
                'abreviatura' => strtoupper($this->abreviatura),
            ]);
        }
    }
}