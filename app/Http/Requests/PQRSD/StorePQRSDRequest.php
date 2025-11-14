<?php

namespace App\Http\Requests\PQRSD;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request para validar datos del formulario PQRSD
 * Valida todos los campos del nuevo formulario multi-paso
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-14
 */

class StorePQRSDRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para realizar esta request.
     * Retorna true porque el formulario PQRSD es público.
     * 
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepara el request antes de validar.
     * 
     * Este método se ejecuta antes de aplicar las reglas de validación. Aquí, se fuerza
     * que el request espere una respuesta en formato JSON, lo que es útil cuando el
     * formulario se envía vía AJAX desde React (evitando redirecciones HTML).
     * 
     * @return void
     */
    protected function prepareForValidation(): void
    {
        $this->headers->set('Accept', 'application/json');
    }

    /**
     * Define las reglas de validación para el formulario PQRSD.
     * 
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Paso 1: Información de la PQRSD
            'empresa' => ['required', 'exists:sqlsrv_second.t010_mm_companias,f010_id'],
            'tipoPqrs' => ['required', 'exists:tipos_pqrs,id'],

            // Paso 2: Datos personales
            'nombre' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/'
            ],
            'apellido' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/'
            ],
            'tipoId' => ['required', 'exists:tipos_identificaciones,id'],
            'numId' => [
                'required',
                'string',
                'max:15',
                'regex:/^[0-9]+$/'
            ],

            // Paso 3: Información de contacto
            'correo' => [
                'required',
                'email',
                'max:50'
            ],
            'telefono' => [
                'required',
                'string',
                'max:15',
                'regex:/^\+?[0-9]+$/'
            ],
            'dpto' => ['required', 'exists:sqlsrv_second.t012_mm_deptos,f012_id'],
            'ciudad' => ['required', 'exists:sqlsrv_second.t013_mm_ciudades,f013_id'],
            'direccion' => [
                'nullable',
                'string',
                'max:100'
            ],
            'relacion' => [
                'required',
                Rule::in(['cliente', 'empleado', 'proveedor', 'otro'])
            ],

            // Paso 4: Descripción y archivos
            'mensaje' => [
                'required',
                'string',
                'min:20',
                'max:2000',
                'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:¿?¡!\-_()"\'\n]+$/'
            ],

            // Archivos adjuntos (opcionales)
            'files' => ['nullable', 'array', 'max:5'],
            'files.*' => [
                'file',
                'mimes:pdf,jpg,jpeg',
                'max:500' // 500KB
            ]
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
            // Paso 1
            'empresa.required' => 'Debe seleccionar una empresa',
            'empresa.exists' => 'La empresa seleccionada no es válida',

            'tipoPqrs.required' => 'Debe seleccionar el tipo de PQRSD',
            'tipoPqrs.exists' => 'El tipo de PQRSD seleccionado no es válido',

            // Paso 2
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.max' => 'El nombre debe tener máximo 50 caracteres',
            'nombre.regex' => 'El nombre solo debe contener letras',

            'apellido.required' => 'El apellido es obligatorio',
            'apellido.max' => 'El apellido debe tener máximo 50 caracteres',
            'apellido.regex' => 'El apellido solo debe contener letras',

            'tipoId.required' => 'Debe seleccionar el tipo de identificación',
            'tipoId.exists' => 'El tipo de identificación no es válido',

            'numId.required' => 'El número de documento es obligatorio',
            'numId.max' => 'El número de documento debe tener máximo 15 caracteres',
            'numId.regex' => 'El número de documento solo debe contener números',

            // Paso 3
            'correo.required' => 'El correo electrónico es obligatorio',
            'correo.email' => 'Ingrese un correo electrónico válido',
            'correo.max' => 'El correo debe tener máximo 50 caracteres',

            'telefono.required' => 'El teléfono es obligatorio',
            'telefono.max' => 'El teléfono debe tener máximo 15 caracteres',
            'telefono.regex' => 'Ingrese un número de teléfono válido',

            'dpto.required' => 'Debe seleccionar un departamento',
            'dpto.exists' => 'El departamento seleccionado no es válido',

            'ciudad.required' => 'Debe seleccionar una ciudad',
            'ciudad.exists' => 'La ciudad seleccionada no es válida',

            'direccion.max' => 'La dirección debe tener máximo 100 caracteres',

            'relacion.required' => 'Debe especificar su relación con la empresa',
            'relacion.in' => 'La relación seleccionada no es válida',

            // Paso 4
            'mensaje.required' => 'El mensaje es obligatorio',
            'mensaje.min' => 'El mensaje debe tener al menos 20 caracteres',
            'mensaje.max' => 'El mensaje debe tener máximo 2000 caracteres',
            'mensaje.regex' => 'El mensaje contiene caracteres no permitidos',

            // Archivos
            'files.array' => 'Los archivos deben ser enviados en formato válido',      
            'files.max' => 'Puede adjuntar máximo 5 archivos',      
            'files.*.file' => 'Uno o más archivos no son válidos',
            'files.*.mimes' => 'Solo se permiten archivos PDF y JPG',
            'files.*.max' => 'Cada archivo debe ser menor a 500KB',
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
            'empresa' => 'empresa',
            'tipoPqrs' => 'tipo de PQRSD',
            'nombre' => 'nombre',
            'apellido' => 'apellido',
            'tipoId' => 'tipo de identificación',
            'numId' => 'número de documento',
            'correo' => 'correo electrónico',
            'telefono' => 'teléfono',
            'dpto' => 'departamento',
            'ciudad' => 'ciudad',
            'direccion' => 'dirección',
            'relacion' => 'relación con la empresa',
            'mensaje' => 'mensaje',
            'files' => 'archivos adjuntos',
        ];
    }
}