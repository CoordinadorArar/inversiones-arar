@extends('emails.email-layout')

@section('title', 'Nuevo mensaje de contacto')

@section('header')
    <h1 class="email-title">Nuevo Mensaje de Contacto</h1>
@endsection

@section('content')
    <!-- Asunto destacado -->
    <div class="card card-highlight mb-4">
        <div class="field-label">Asunto</div>
        <div class="field-value" style="font-size: 18px; font-weight: 600; color: #ff6b18;">
            {{ $contactData['subject'] }}
        </div>
    </div>

    <!-- Información del contacto -->
    <div class="card">
        <h3 class="section-title" style="display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
            Información del Contacto
        </h3>
        
        <div class="field-group">
            <div class="field-label">Nombre</div>
            <div class="field-value">{{ $contactData['name'] }}</div>
        </div>

        <div class="field-group">
            <div class="field-label">Correo Electrónico</div>
            <div class="field-value">
                <a href="mailto:{{ $contactData['email'] }}" class="link-primary">
                    {{ $contactData['email'] }}
                </a>
            </div>
        </div>

        <div class="field-group">
            <div class="field-label">Teléfono</div>
            <div class="field-value">
                <a href="tel:{{ $contactData['phone'] }}" class="link-primary">
                    {{ $contactData['phone'] }}
                </a>
            </div>
        </div>

        @if(!empty($contactData['company']))
        <div class="field-group mb-0">
            <div class="field-label">Empresa</div>
            <div class="field-value">{{ $contactData['company'] }}</div>
        </div>
        @endif
    </div>

    <!-- Mensaje -->
    <hr class="divider">
    
    <div>
        <div class="field-label mb-3" style="display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#847970" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Mensaje
        </div>
        <div class="card card-highlight" style="white-space: pre-wrap; line-height: 1.7;">
            {{ $contactData['message'] }}
        </div>
    </div>
@endsection

@section('footer')
    <p>Enviado desde el formulario de contacto de 
        <a href="https://inversionesarar.com" class="link-primary">inversionesarar.com</a>
    </p>
@endsection