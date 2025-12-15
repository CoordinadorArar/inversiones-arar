<?php

namespace App\Http\Requests\RecursosHumanos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Form Request para validar datos de documentos corporativos.
 * 
 * @author Yariangel Aray
 * @date 2025-12-11
 */
class DocumentoCorporativoRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado.
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
    }

    /**
     * Reglas de validación.
     */
    public function rules(): array
    {
        $documentoId = $this->route('id');
        $isCreating = $this->isMethod('post') && !$documentoId;

        $rules = [
            'nombre' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/',
                Rule::unique('documentos_corporativos', 'nombre')->ignore($documentoId),
            ],
            'mostrar_en_dashboard' => 'required|boolean',
            'mostrar_en_footer' => 'required|boolean',
        ];

        // Ícono es obligatorio si mostrar_en_footer o mostrar_en_dashboard está activo
        $mostrarEnFooter = $this->boolean('mostrar_en_footer');

        if ($mostrarEnFooter) {
            $rules['icono'] = [
                'required',
                'string',
                'max:50',
                'regex:/^[a-z-]+$/',
            ];
        } else {
            $rules['icono'] = [
                'nullable',
                'string',
                'max:50',
                'regex:/^[a-z-]+$/',
            ];
        }

        // Archivo es obligatorio en creación, opcional en edición
        if ($isCreating) {
            $rules['archivo'] = [
                'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:10240', // 10MB
            ];
        } else {
            $rules['archivo'] = [
                'nullable',
                'file',
                'mimes:pdf,doc,docx',
                'max:10240',
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
            'nombre.required' => 'El nombre del documento es obligatorio',
            'nombre.regex' => 'El nombre solo debe contener letras y espacios',
            'nombre.unique' => 'Ya existe un documento con este nombre',
            'nombre.max' => 'El nombre no debe superar 50 caracteres',

            'icono.required' => 'El ícono es obligatorio cuando se muestra en footer o dashboard',
            'icono.regex' => 'El ícono solo debe contener letras minúsculas y guiones',
            'icono.max' => 'El ícono no debe superar 50 caracteres',

            'archivo.required' => 'El archivo es obligatorio',
            'archivo.file' => 'Debe subir un archivo válido',
            'archivo.mimes' => 'El archivo debe ser PDF, DOC o DOCX',
            'archivo.max' => 'El archivo no debe superar 10MB',

            'mostrar_en_dashboard.required' => 'Debe especificar si se muestra en dashboard',
            'mostrar_en_dashboard.boolean' => 'El campo debe ser verdadero o falso',

            'mostrar_en_footer.required' => 'Debe especificar si se muestra en footer',
            'mostrar_en_footer.boolean' => 'El campo debe ser verdadero o falso',
        ];
    }
}