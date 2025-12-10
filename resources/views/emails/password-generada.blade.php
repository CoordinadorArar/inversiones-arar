@extends('emails.email-layout')

@section('title', 'Contraseña Generada')

@section('header')
    <h1 class="email-title">Contraseña Generada</h1>
    <span class="badge badge-warning">Acción Administrativa</span>
@endsection

@section('content')
    <!-- Alerta importante -->
    <div class="card card-warning mb-4">
        <div style="display: flex; align-items: center; gap: 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
                <div class="field-label" style="color: #d97706;">Atención</div>
                <div class="field-value" style="font-weight: 600;">
                    Tu contraseña ha sido generada por un administrador
                </div>
            </div>
        </div>
    </div>

    <!-- Información del usuario -->
    <div class="card">
        <h3 class="section-title">Información de tu Cuenta</h3>
        
        <div class="field-group">
            <div class="field-label">Nombre Completo</div>
            <div class="field-value">{{ $usuario->info_corta->apellidos }} {{ $usuario->info_corta->nombres }}</div>
        </div>

        <div class="field-group">
            <div class="field-label">Número de Documento</div>
            <div class="field-value" style="font-family: monospace;">{{ $usuario->numero_documento }}</div>
        </div>

        <div class="field-group mb-0">
            <div class="field-label">Correo Electrónico</div>
            <div class="field-value">
                <a href="mailto:{{ $usuario->email }}" class="link-primary">
                    {{ $usuario->email }}
                </a>
            </div>
        </div>
    </div>

    <hr class="divider">

    <!-- Nueva contraseña -->
    <div class="card card-highlight">
        <h3 class="section-title">Tu Nueva Contraseña</h3>
        
        <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 16px;">
            <div class="field-label text-center mb-2">Contraseña</div>
            <div style="font-family: monospace; font-size: 24px; font-weight: bold; text-align: center; color: #ff6b18; letter-spacing: 2px;">
                {{ $nuevaPassword }}
            </div>
        </div>

        <p class="text-small text-muted mb-0" style="line-height: 1.6;">
            <strong>Importante:</strong> Esta contraseña ha sido generada automáticamente. 
            Te recomendamos cambiarla por una de tu preferencia después de iniciar sesión.
        </p>
    </div>

    <!-- Información adicional -->
    <div class="card">
        <h3 class="section-title">¿Qué hacer ahora?</h3>
        
        <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Inicia sesión en <a href="{{ route('login') }}" class="link-primary">inversionesarar.com/login</a></li>
            <li>Usa tu número de documento y la contraseña proporcionada arriba</li>
            <li>Opcionalmente cambia tu contraseña por una de tu preferencia en tu perfil</li>
        </ol>
    </div>

    <!-- Información del administrador -->
    <div style="background: #f8f7f6; padding: 16px; border-radius: 6px; margin-top: 24px;">
        <p class="text-small text-muted mb-0">
            <strong>Fecha y hora:</strong> {{ now()->format('d/m/Y H:i:s') }}
        </p>
    </div>

    <!-- Ayuda -->
    <div class="text-center mt-4">
        <p class="text-small text-muted">
            Si no solicitaste esta generación o tienes alguna duda, por favor contacta con el administrador del sistema.
        </p>
    </div>
@endsection

@section('footer')
    <p>Este correo fue enviado automáticamente por el sistema de gestión de Inversiones Arar.</p>
    <p class="text-small">Por favor, no respondas a este correo. Si necesitas ayuda, contacta con soporte.</p>
@endsection