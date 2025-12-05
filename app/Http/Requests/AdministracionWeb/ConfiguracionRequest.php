<?php

namespace App\Http\Requests\AdministracionWeb;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request para validar datos de configuración general.
 * Incluye validaciones para información corporativa (email, teléfono, ubicación, imágenes) y redes sociales.
 * Usado en ConfiguracionController para actualizar configuraciones via API.
 *
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class ConfiguracionRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para esta petición.
     * Retorna true, ya que la autorización se maneja en el controlador.
     *
     * @return bool
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
     * Reglas de validación para campos de configuración.
     * Incluye validaciones para email, teléfono, ubicación, imágenes y redes sociales.
     *
     * @return array Reglas de validación por campo.
     */
    public function rules(): array
    {
        return [
            'email' => [
                'nullable',
                'email:rfc,dns',
                'max:255',
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            ],
            'telefono' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[0-9+\s]+$/',
            ],
            'ubicacion' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s·,.-]+$/',
            ],
            'ubicacion_detalles' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s·•,.-]+$/',
            ],
            'ubicacion_url' => [
                'nullable',
                'url',
                'max:500',
                'regex:/^https?:\/\/.+/',
            ],

            // Imágenes
            'logo' => [
                'nullable',
                'image',
                'mimes:png,jpg,jpeg,svg',
                'max:2048', // 2MB
            ],
            'icono' => [
                'nullable',
                'image',
                'mimes:png,jpg,jpeg,svg,ico',
                'max:1024', // 1MB
            ],

            // Redes sociales
            'instagram' => [
                'nullable',
                'url',
                'max:500',
                'regex:/^https?:\/\/(www\.)?instagram\.com\/.+/',
            ],
            'facebook' => [
                'nullable',
                'url',
                'max:500',
                'regex:/^https?:\/\/(www\.)?facebook\.com\/.+/',
            ],
            'x' => [
                'nullable',
                'url',
                'max:500',
                'regex:/^https?:\/\/(www\.)?(x\.com|twitter\.com)\/.+/',
            ],
            'linkedin' => [
                'nullable',
                'url',
                'max:500',
                'regex:/^https?:\/\/(www\.)?(co.linkedin|linkedin)\.com\/(company|in)\/.+/',
            ],
        ];
    }

    /**
     * Mensajes de error personalizados para validaciones.
     * Proporciona mensajes claros en español para cada regla fallida.
     *
     * @return array Mensajes de error por campo y regla.
     */
    public function messages(): array
    {
        return [
            // Email
            'email.email' => 'El email no tiene un formato válido',
            'email.regex' => 'El email debe tener un formato válido (ej: usuario@dominio.com)',

            // Teléfono
            'telefono.regex' => 'El teléfono solo puede contener números, espacios y el símbolo +',

            // Ubicación
            'ubicacion.regex' => 'La ubicación contiene caracteres no permitidos',
            'ubicacion_detalles.regex' => 'Los detalles de ubicación contienen caracteres no permitidos',
            'ubicacion_url.url' => 'La URL de ubicación no es válida',
            'ubicacion_url.regex' => 'La URL debe comenzar con http:// o https://',

            // Logo
            'logo.image' => 'El logo debe ser una imagen',
            'logo.mimes' => 'El logo debe ser PNG, JPG, JPEG o SVG',
            'logo.max' => 'El logo no debe superar 2MB',

            // Icono
            'icono.image' => 'El icono debe ser una imagen',
            'icono.mimes' => 'El icono debe ser PNG, JPG, JPEG, SVG o ICO',
            'icono.max' => 'El icono no debe superar 1MB',

            // Redes sociales
            'instagram.url' => 'La URL de Instagram no es válida',
            'instagram.regex' => 'Debe ser una URL válida de Instagram (https://www.instagram.com/...)',
            'facebook.url' => 'La URL de Facebook no es válida',
            'facebook.regex' => 'Debe ser una URL válida de Facebook (https://www.facebook.com/...)',
            'x.url' => 'La URL de X no es válida',
            'x.regex' => 'Debe ser una URL válida de X/Twitter (https://x.com/...)',
            'linkedin.url' => 'La URL de LinkedIn no es válida',
            'linkedin.regex' => 'Debe ser una URL válida de LinkedIn (https://linkedin.com/company/...)',
        ];
    }
}
