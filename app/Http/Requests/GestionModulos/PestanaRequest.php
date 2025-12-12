<?php

namespace App\Http\Requests\GestionModulos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Form Request para validar datos de pestañas.
 * Incluye validaciones de módulo asociado y permisos extra.
 * 
 * @author Yariangel Aray
 * @date 2025-12-12
 */
class PestanaRequest extends FormRequest
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
        $pestanaId = $this->route('id');

        return [
            'nombre' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/',
            ],
            'ruta' => [
                'required',
                'string',
                'max:255',
                'regex:/^\/[a-z0-9\-\/]*$/',
                // Validar unicidad compuesta: modulo_id + ruta
                Rule::unique('pestanas')->where(function ($query) {
                    return $query->where('modulo_id', $this->modulo_id);
                })->ignore($pestanaId),
            ],
            'modulo_id' => [
                'required',
                'exists:modulos,id',
                function ($attribute, $value, $fail) {
                    $modulo = \App\Models\GestionModulos\Modulo::find($value);
                    if ($modulo && $modulo->es_padre) {
                        $fail('No se pueden asignar pestañas a módulos padre');
                    }
                }
            ],
            'permisos_extra' => [
                'nullable',
                'array',
            ],
            'permisos_extra.*' => [
                'string',
                'max:50',
                'regex:/^[a-z_]+$/',
            ],
        ];
    }

    /**
     * Mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre de la pestaña es obligatorio',
            'nombre.regex' => 'El nombre solo debe contener letras y espacios',
            'nombre.max' => 'El nombre no debe superar 50 caracteres',

            'ruta.required' => 'La ruta es obligatoria',
            'ruta.regex' => 'La ruta debe empezar con / y solo contener letras minúsculas, números y guiones',
            'ruta.unique' => 'Ya existe una pestaña con esta ruta en el módulo seleccionado',
            'ruta.max' => 'La ruta no debe superar 255 caracteres',

            'modulo_id.required' => 'Debe seleccionar un módulo',
            'modulo_id.exists' => 'El módulo seleccionado no existe',

            'permisos_extra.array' => 'Los permisos extra deben ser un array',
            'permisos_extra.*.regex' => 'Los permisos solo deben contener letras minúsculas y guiones bajos',
            'permisos_extra.*.max' => 'Cada permiso no debe superar 50 caracteres',
        ];
    }

    /**
     * Validación adicional.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar que la ruta no termine en /
            if ($this->ruta && substr($this->ruta, -1) === '/') {
                $validator->errors()->add('ruta', 'La ruta no debe terminar con /');
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
