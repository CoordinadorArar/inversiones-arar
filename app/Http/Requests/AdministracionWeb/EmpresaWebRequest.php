<?php

namespace App\Http\Requests\AdministracionWeb;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request de validación para Empresas Web.
 * 
 * Valida datos de creación/actualización con reglas condicionales
 * según los switches activados.
 * 
 * @author Yariangel Aray
 * @date 2025-12-01
 */
class EmpresaWebRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para hacer este request.
     */
    public function authorize(): bool
    {
        return true; // La autorización se maneja con Policies
    }

    /**
     * Reglas de validación.
     */
    public function rules(): array
    {
        $rules = [
            'id_siesa' => 'nullable|string|max:20|exists:sqlsrv_second.t010_mm_companias,f010_id',
            'razon_social' => 'required|string|max:50|regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s&.,()-]+$/',
            'siglas' => 'nullable|string|max:10|regex:/^[A-Z]*$/',
            'tipo_empresa' => 'nullable|string|max:50',
            'descripcion' => 'nullable|string|max:150',
            'sitio_web' => 'nullable|url|max:100',
            'dominio' => 'nullable|string|max:50|regex:/^[a-zA-Z0-9.-]*$/',
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'mostrar_en_header' => 'boolean',
            'mostrar_en_empresas' => 'boolean',
            'mostrar_en_portafolio' => 'boolean',
            'permitir_pqrsd' => 'boolean',
        ];

        // Regla condicional: Si mostrar_en_header o mostrar_en_empresas está activo
        if ($this->input('mostrar_en_header') || $this->input('mostrar_en_empresas')) {
            $rules['id_siesa'] = 'required|string|max:20|exists:sqlsrv_second.t010_mm_companias,f010_id';
        }

        // Regla condicional: Si mostrar_en_empresas está activo
        if ($this->input('mostrar_en_empresas')) {
            $rules['descripcion'] = 'required|string|max:150';
            $rules['sitio_web'] = 'required|url|max:100';
            $rules['tipo_empresa'] = 'required|string|max:50';
        }

        return $rules;
    }

    /**
     * Mensajes de validación personalizados en español.
     */
    public function messages(): array
    {
        return [
            // id_siesa
            'id_siesa.required' => 'El ID de Siesa es obligatorio cuando se activa "Mostrar en Header" o "Mostrar en Empresas"',
            'id_siesa.max' => 'El ID de Siesa no debe superar :max caracteres',
            'id_siesa.exists' => 'El ID de Siesa no existe en los registros correspondientes',

            // razon_social
            'razon_social.required' => 'La razón social es obligatoria',
            'razon_social.max' => 'La razón social no debe superar :max caracteres',
            'razon_social.regex' => 'La razón social solo puede contener letras, números y caracteres especiales básicos (&.,()-)',

            // siglas
            'siglas.max' => 'Las siglas no deben superar :max caracteres',
            'siglas.regex' => 'Las siglas solo pueden contener letras mayúsculas sin espacios',

            // tipo_empresa
            'tipo_empresa.required' => 'El tipo de empresa es obligatorio cuando se activa "Mostrar en Empresas"',
            'tipo_empresa.max' => 'El tipo de empresa no debe superar :max caracteres',

            // descripcion
            'descripcion.required' => 'La descripción es obligatoria cuando se activa "Mostrar en Empresas"',
            'descripcion.max' => 'La descripción no debe superar :max caracteres',

            // sitio_web
            'sitio_web.required' => 'El sitio web es obligatorio cuando se activa "Mostrar en Empresas"',
            'sitio_web.url' => 'El sitio web debe ser una URL válida (ej: https://ejemplo.com)',
            'sitio_web.max' => 'El sitio web no debe superar :max caracteres',

            // dominio
            'dominio.max' => 'El dominio no debe superar :max caracteres',
            'dominio.regex' => 'El dominio solo puede contener letras, números, puntos y guiones',

            // logo
            'logo.image' => 'El archivo debe ser una imagen',
            'logo.mimes' => 'El logo debe ser un archivo PNG, JPG, JPEG o SVG',
            'logo.max' => 'El logo no debe superar 2MB',

            // boolean
            'mostrar_en_header.boolean' => 'El campo "Mostrar en Header" debe ser verdadero o falso',
            'mostrar_en_empresas.boolean' => 'El campo "Mostrar en Empresas" debe ser verdadero o falso',
            'mostrar_en_portafolio.boolean' => 'El campo "Mostrar en Portafolio" debe ser verdadero o falso',
            'permitir_pqrsd.boolean' => 'El campo "Permitir PQRSD" debe ser verdadero o falso',
        ];
    }

    /**
     * Atributos personalizados para mensajes de error.
     */
    public function attributes(): array
    {
        return [
            'id_siesa' => 'ID de Siesa',
            'razon_social' => 'razón social',
            'siglas' => 'siglas',
            'tipo_empresa' => 'tipo de empresa',
            'descripcion' => 'descripción',
            'sitio_web' => 'sitio web',
            'dominio' => 'dominio',
            'logo' => 'logo',
            'mostrar_en_header' => 'mostrar en header',
            'mostrar_en_empresas' => 'mostrar en empresas',
            'mostrar_en_portafolio' => 'mostrar en portafolio',
            'permitir_pqrsd' => 'permitir PQRSD',
        ];
    }
}