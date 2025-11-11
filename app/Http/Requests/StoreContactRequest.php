<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    protected function prepareForValidation(): void
    {
        // Forzar que siempre espere JSON
        $this->headers->set('Accept', 'application/json');
    }

    /**
     * Get the validation rules that apply to the request.
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
            'message' => ['required', 'string', 'max:300'],
            'acceptsPolicy' => ['required', 'accepted'],
        ];
    }

    /**
     * Get custom messages for validator errors.
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
