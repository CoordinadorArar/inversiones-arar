@extends('emails.email-layout')

@section('title', 'Recuperación de contraseña')

@section('header')
    <!-- Ícono de seguridad -->
    <div style="margin: 20px 0;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
    </div>
    <h1 class="email-title">Recuperación de Contraseña</h1>
@endsection

@section('content')
    <!-- Mensaje principal -->
    <div class="mb-4">
        <p style="font-size: 16px; line-height: 1.7; margin-bottom: 16px;">
            Hola,
        </p>
        <p style="font-size: 15px; color: #847970; line-height: 1.7; margin-bottom: 24px;">
            Hemos recibido una solicitud para restablecer la contraseña de la cuenta asociada al documento:
        </p>
    </div>

    <!-- Número de documento destacado -->
    <div class="card card-highlight mb-4">
        <div class="field-label mb-2">Número de Documento</div>
        <div style="font-size: 18px; font-weight: 600; color: #ff6b18;">
            {{ $numero_documento }}
        </div>
    </div>

    <!-- Instrucciones -->
    <div class="card mb-4">
        <h3 class="section-title" style="display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Instrucciones
        </h3>
        <div style="font-size: 14px; line-height: 1.8; color: #2d2520;">
            <div style="margin-bottom: 12px;">
                <span style="color: #ff6b18; font-weight: bold; margin-right: 10px;">1.</span>
                Haga clic en el botón "Restablecer Contraseña" que aparece a continuación
            </div>
            <div style="margin-bottom: 12px;">
                <span style="color: #ff6b18; font-weight: bold; margin-right: 10px;">2.</span>
                Será redirigido a una página segura para crear su nueva contraseña
            </div>
            <div>
                <span style="color: #ff6b18; font-weight: bold; margin-right: 10px;">3.</span>
                Ingrese y confirme su nueva contraseña
            </div>
        </div>
    </div>

    <!-- Botón de acción -->
    <div class="text-center mb-4" style="padding: 32px 0;">
        <a href="{{ $url }}" class="btn btn-primary" style="box-shadow: 0 4px 12px rgba(255, 107, 24, 0.3); display: inline-flex; align-items: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Restablecer Contraseña
        </a>
    </div>

    <!-- Enlace alternativo -->
    <div class="card" style="background: #f8f7f6;">
        <div class="text-small text-muted mb-2" style="font-weight: 600; display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            ¿El botón no funciona?
        </div>
        <p class="text-small text-muted mb-2">
            Copie y pegue el siguiente enlace en su navegador:
        </p>
        <div style="padding: 12px; background: white; border-radius: 4px; border: 1px solid #e5e7eb; word-break: break-all; font-size: 12px; font-family: monospace; color: #6b7280;">
            {{ $url }}
        </div>
    </div>

    <!-- Advertencias de seguridad -->
    <div class="card card-warning mt-4">
        <div style="font-weight: 600; color: #d97706; font-size: 13px; margin-bottom: 12px; display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Importante - Seguridad
        </div>
        <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 8px;">
                Este enlace es de <strong>un solo uso</strong> y expirará en <strong>60 minutos</strong>
            </li>
            <li style="margin-bottom: 8px;">
                Si no solicitó restablecer su contraseña, <strong>ignore este mensaje</strong>
            </li>
            <li>
                Por seguridad, le recomendamos cambiar su contraseña regularmente
            </li>
        </ul>
    </div>

    <!-- Mensaje de soporte -->
    <div class="text-center mt-4" style="padding: 20px;">
        <p class="text-muted text-small mb-0" style="line-height: 1.6; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>
                Si no realizó esta solicitud o tiene alguna pregunta sobre la seguridad de su cuenta, contáctenos de inmediato en 
                <a href="mailto:asistente@inversionesarar.com" class="link-primary"> asistente@inversionesarar.com</a>
            </span>
        </p>
    </div>
@endsection

@section('footer')
    <p><strong>Equipo de Soporte</strong></p>
    <p>
        <a href="mailto:asistente@inversionesarar.com" class="link-primary">asistente@inversionesarar.com</a>
    </p>
    <p class="email-footer-small">Este es un correo automático. Por favor no responder directamente a este mensaje.</p>
@endsection