<?php

namespace App\Http\Requests\AdministracionWeb;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request para validar datos de configuración general.
 * Incluye validaciones para información corporativa y redes sociales.
 * 
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class ConfiguracionRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para esta petición.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación.
     */
    public function rules(): array
    {
        return [
            // Información de contacto
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'ubicacion' => 'nullable|string|max:255',
            'ubicacion_detalles' => 'nullable|string|max:255',
            'ubicacion_url' => 'nullable|url|max:500',
            
            // Imágenes
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'icono' => 'nullable|image|mimes:png,jpg,jpeg,svg,ico|max:1024',
            
            // Redes sociales
            'instagram' => 'nullable|url|max:500',
            'facebook' => 'nullable|url|max:500',
            'x' => 'nullable|url|max:500',
            'linkedin' => 'nullable|url|max:500',
        ];
    }

    /**
     * Mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'email.email' => 'El email no tiene un formato válido',
            'ubicacion_url.url' => 'La URL de ubicación no es válida',
            'logo.image' => 'El logo debe ser una imagen',
            'logo.mimes' => 'El logo debe ser PNG, JPG, JPEG o SVG',
            'logo.max' => 'El logo no debe superar 2MB',
            'icono.image' => 'El icono debe ser una imagen',
            'icono.mimes' => 'El icono debe ser PNG, JPG, JPEG, SVG o ICO',
            'icono.max' => 'El icono no debe superar 1MB',
            'instagram.url' => 'La URL de Instagram no es válida',
            'facebook.url' => 'La URL de Facebook no es válida',
            'x.url' => 'La URL de X no es válida',
            'linkedin.url' => 'La URL de LinkedIn no es válida',
        ];
    }
}