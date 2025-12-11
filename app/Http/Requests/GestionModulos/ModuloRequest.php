<?php

namespace App\Http\Requests\GestionModulos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Form Request para validar datos de módulos.
 * Incluye validaciones condicionales según tipo de módulo (padre, hijo o directo).
 * 
 * @author Yariangel Aray
 * @date 2025-12-11
 */
class ModuloRequest extends FormRequest
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

        // Convertir permisos_extra a array si viene como string
        if ($this->has('permisos_extra') && is_string($this->permisos_extra)) {
            $this->merge([
                'permisos_extra' => array_filter(
                    array_map('trim', explode(',', $this->permisos_extra))
                )
            ]);
        }
    }

    /**
     * Reglas de validación.
     */
    public function rules(): array
    {
        $moduloId = $this->route('id'); // ID del módulo en edición
        $esPadre = $this->boolean('es_padre');

        $rules = [
            'nombre' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/', // Solo letras y espacios
                Rule::unique('modulos', 'nombre')->ignore($moduloId),
            ],
            'icono' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-z-]+$/', // Solo letras minúsculas y guiones
            ],
            'ruta' => [
                'required',
                'string',
                'max:255',
                'regex:/^\/[a-z0-9\-\/]*$/', // Debe empezar con / y solo minúsculas, números, guiones
                Rule::unique('modulos', 'ruta')->ignore($moduloId),
            ],
            'es_padre' => 'required|boolean',
        ];

        // Validaciones condicionales según tipo de módulo
        if ($esPadre) {
            // Si es módulo padre: NO debe tener padre ni permisos extra
            $rules['modulo_padre_id'] = 'nullable|in:'; // Fuerza que sea null
            $rules['permisos_extra'] = 'nullable|array|max:0'; // Array vacío
        } else {
            // Si NO es módulo padre: puede tener padre y permisos extra
            $rules['modulo_padre_id'] = [
                'nullable',
                'exists:modulos,id',
                function ($attribute, $value, $fail) use ($moduloId) {
                    if ($value && $value == $moduloId) {
                        $fail('Un módulo no puede ser su propio padre');
                    }
                }
            ];

            $rules['permisos_extra'] = [
                'nullable',
                'array'
            ];

            $rules['permisos_extra.*'] = [
                'string',
                'max:50',
                'regex:/^[a-z_]+$/', // Solo letras minúsculas y guiones bajos
            ];
        }

        return $rules;
    }

    /**
     * Mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del módulo es obligatorio',
            'nombre.regex' => 'El nombre solo debe contener letras y espacios',
            'nombre.unique' => 'Ya existe un módulo con este nombre',
            'nombre.max' => 'El nombre no debe superar 50 caracteres',

            'icono.required' => 'El ícono es obligatorio',
            'icono.regex' => 'El ícono solo debe contener letras minúsculas y guiones',
            'icono.max' => 'El ícono no debe superar 50 caracteres',

            'ruta.required' => 'La ruta es obligatoria',
            'ruta.regex' => 'La ruta debe empezar con / y solo contener letras minúsculas, números y guiones',
            'ruta.unique' => 'Ya existe un módulo con esta ruta',
            'ruta.max' => 'La ruta no debe superar 255 caracteres',

            'es_padre.required' => 'Debe especificar si es módulo padre',
            'es_padre.boolean' => 'El campo es_padre debe ser verdadero o falso',

            'modulo_padre_id.exists' => 'El módulo padre seleccionado no existe',

            'permisos_extra.array' => 'Los permisos extra deben ser un array',
            'permisos_extra.*.regex' => 'Los permisos solo deben contener letras y guiones bajos',
            'permisos_extra.*.max' => 'Cada permiso no debe superar 50 caracteres',
        ];
    }

    /**
     * Validación adicional después de las reglas básicas.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar que la ruta no termine en /
            if ($this->ruta && substr($this->ruta, -1) === '/') {
                $validator->errors()->add('ruta', 'La ruta no debe terminar con /');
            }

            // Si tiene módulo padre, validar que el padre sea efectivamente un módulo padre
            if ($this->modulo_padre_id) {
                $padre = \App\Models\GestionModulos\Modulo::find($this->modulo_padre_id);
                if ($padre && !$padre->es_padre) {
                    $validator->errors()->add('modulo_padre_id', 'El módulo seleccionado no es un módulo padre');
                }
            }

            // Validar permisos duplicados
            if ($this->permisos_extra && is_array($this->permisos_extra)) {
                $permisos = array_map('strtolower', $this->permisos_extra);
                if (count($permisos) !== count(array_unique($permisos))) {
                    $validator->errors()->add('permisos_extra', 'No se permiten permisos duplicados');
                }
            }

            /**
             * Configura validaciones adicionales después de la validación principal.
             * Reasigna errores de array (permisos_extra.*) a un campo general con detalles específicos.
             */
            $errors = $validator->errors();

            // Recopila errores de permisos_extra.* con detalles por índice
            $permisosErrors = [];
            foreach ($errors->get('permisos_extra.*') as $index => $errorMessages) {
                // $index es el número del permiso (0, 1, 2...), $errorMessages es array de strings
                $permisosErrors[] = "Permiso " . ((int)$index + 1) . ": " . implode(', ', $errorMessages); //175
            }

            if (!empty($permisosErrors)) {
                // Crea un mensaje detallado: "Permiso 1: regex error. Permiso 2: max error."
                $detailedMessage = implode('. ', $permisosErrors) . '.';
                $validator->errors()->add('permisos_extra', $detailedMessage);

                // Remueve los errores indexados para evitar duplicados
                $errors->forget('permisos_extra.*');
            }
        });
    }
}
