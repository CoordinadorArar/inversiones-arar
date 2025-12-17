<?php

namespace App\Http\Requests\SeguridadAcceso;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request para asignar módulo a rol con permisos.
 * 
 * Valida datos de entrada para la asignación de módulos a roles,
 * incluyendo permisos base y extra. Mensajes en español.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */
class AsignarModuloRequest extends FormRequest
{
    /**
     * Determinar si el usuario está autorizado para hacer esta request.
     * Retorna true (autorización se maneja en el controlador por permisos de pestaña).
     * 
     * @return bool
     */
    public function authorize(): bool
    {
        // Autorización se maneja en el controlador (permisos por pestaña).
        return true;
    }

    /**
     * Reglas de validación para campos de asignación.
     * Valida existencia de rol y módulo, y formato de permisos.
     * 
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rol_id' => [
                'required',
                'integer',
                'exists:roles,id', // Verifica que el rol exista.
            ],
            'modulo_id' => [
                'required',
                'integer',
                'exists:modulos,id', // Verifica que el módulo exista.
            ],
            'permisos' => [                
                'array',
                'max:50', // Límite razonable para evitar arrays enormes.
            ],
            'permisos.*' => [
                'string',
                'max:50', // Longitud máxima por permiso.
                'regex:/^[a-zA-Z_]+$/', // Solo letras y guiones bajos (seguridad).
            ],
        ];
    }

    /**
     * Mensajes de error personalizados en español.
     * Proporciona mensajes amigables para cada regla.
     * 
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'rol_id.required' => 'El ID del rol es obligatorio.',
            'rol_id.integer' => 'El ID del rol debe ser un número entero.',
            'rol_id.exists' => 'El rol seleccionado no existe en el sistema.',

            'modulo_id.required' => 'El ID del módulo es obligatorio.',
            'modulo_id.integer' => 'El ID del módulo debe ser un número entero.',
            'modulo_id.exists' => 'El módulo seleccionado no existe en el sistema.',
            
            'permisos.array' => 'Los permisos deben ser una lista válida.',
            'permisos.max' => 'No puedes asignar más de 50 permisos.',

            'permisos.*.string' => 'Cada permiso debe ser una cadena de texto.',
            'permisos.*.max' => 'Cada permiso no puede exceder 50 caracteres.',
            'permisos.*.regex' => 'Los permisos solo pueden contener letras y guiones bajos.',
        ];
    }

    /**
     * Preparar datos para validación.
     * Fuerza header Accept a JSON y sanitiza permisos (trim y unique).
     */
    protected function prepareForValidation(): void
    {
        $this->headers->set('Accept', 'application/json');

        // Sanitiza permisos: Elimina duplicados y espacios.
        $this->merge([
            'permisos' => array_unique(array_map('trim', $this->input('permisos', []))),
        ]);
    }
}
