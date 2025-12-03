<?php

namespace App\Http\Requests;

/**
 * Esta clase extiende FormRequest de Laravel y se utiliza para validar los datos
 * enviados desde el formulario de contacto en ContactController@store. Su propósito
 * es asegurar que los datos cumplan con reglas específicas antes de procesarlos,
 * previniendo errores o datos maliciosos. También configura el request para esperar
 * respuestas JSON.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-11
 */

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    /**
     * Método authorize - Determina si el usuario está autorizado.
     * 
     * Este método verifica si el usuario actual tiene permiso para realizar esta request.
     * En este caso, retorna true, lo que significa que cualquier usuario (incluso anónimo)
     * puede enviar el formulario de contacto, ya que es una funcionalidad pública.     
     * 
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Método prepareForValidation - Prepara el request antes de validar.
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
     * Método rules - Define las reglas de validación.
     * 
     * Este método especifica las reglas que deben cumplir los campos del formulario.
     * Cada campo tiene validaciones para asegurar datos correctos (ej. email válido,
     * longitud máxima, formato específico). Si alguna regla falla, Laravel detiene
     * el proceso y retorna errores automáticamente.
     * 
     * - Notas: Las regex permiten caracteres especiales como ñ o acentos, adaptados a español.
     * 
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'subject' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z1-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/'],
            'name' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/'],
            'email' => ['required', 'email', 'max:50'],
            'phone' => ['required', 'string', 'max:15', 'regex:/^\+?[0-9\s]+$/'],
            'company' => ['nullable', 'string', 'max:100'],
            'message' => ['required', 'string', 'max:500'],
            'acceptsPolicy' => ['required', 'accepted'],
        ];
    }

    /**
     * Método messages - Define mensajes de error personalizados.
     * 
     * Este método proporciona mensajes de error en español para cada regla de validación
     * que falle. Esto mejora la experiencia del usuario, ya que los mensajes son claros
     * y específicos, en lugar de los genéricos de Laravel.
     * 
     * - Estructura: Cada clave es 'campo.regla' y el valor es el mensaje personalizado.
     * - Notas: Asegúrate de que coincidan con las reglas en rules(). Si agregas reglas,
     *   añade mensajes aquí para mantener consistencia.
     * 
     * @return array
     */
    public function messages(): array
    {
        return [
            'subject.required' => 'El asunto es obligatorio',
            'subject.max' => 'El asunto debe tener máximo 50 caracteres',
            'subject.regex' => 'El asunto solo debe contener letras o números',

            'name.required' => 'El nombre es obligatorio',
            'name.max' => 'El nombre debe tener máximo 30 caracteres',
            'name.regex' => 'El nombre solo debe contener letras',

            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'Ingrese un correo electrónico válido',
            'email.max' => 'El correo debe tener máximo 50 caracteres',

            'phone.required' => 'El teléfono es obligatorio',
            'phone.max' => 'El teléfono debe tener máximo 15 caracteres',
            'phone.regex' => 'Ingrese un número de teléfono válido',

            'company.max' => 'El nombre de la empresa debe tener máximo 100 caracteres',

            'message.required' => 'El mensaje es obligatorio',
            'message.max' => 'El mensaje debe tener máximo 300 caracteres',

            'acceptsPolicy.required' => 'Debe aceptar la política de privacidad',
            'acceptsPolicy.accepted' => 'Debe aceptar la política de privacidad',
        ];
    }
}
