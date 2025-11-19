@extends('emails.email-layout')

@section('title', 'Confirmación Denuncia PQRSD')

@section('header')
    <!-- Ícono de confirmación -->
    <div style="margin: 20px 0;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
    </div>
    <h1 class="email-title">¡Denuncia Recibida!</h1>
@endsection

@section('content')
    <!-- Saludo personalizado -->
    <div class="mb-4">
        <p class="mb-2" style="font-size: 16px;">
            Estimado(a) <strong>{{ $data['nombre'] }}</strong>,
        </p>
        <p class="text-muted" style="font-size: 15px; line-height: 1.7;">
            Hemos recibido satisfactoriamente su denuncia. Gracias por tomarse el tiempo de informarnos sobre esta situación.
        </p>
    </div>

    <!-- Número de radicado -->
    <div class="radicado-box">
        <div class="radicado-label">Su Número de Radicado</div>
        <div class="radicado-number">#{{ $data['numero_radicado'] }}</div>
        <div style="color: rgba(255, 255, 255, 0.9); font-size: 13px; margin-top: 8px;">
            Guarde este número para futuras consultas
        </div>
    </div>

    <!-- Próximos pasos -->
    <div class="card card-highlight mb-4">
        <h3 class="section-title" style="display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
                <polyline points="9 18 15 12 9 6"/>
            </svg>
            Próximos Pasos
        </h3>
        <div style="font-size: 14px; line-height: 1.8;">
            <div style="margin-bottom: 12px;">
                <span style="color: #ff6b18; font-weight: bold; margin-right: 10px;">1.</span>
                Su denuncia será revisada cuidadosamente por el área encargada
            </div>
            <div style="margin-bottom: 12px;">
                <span style="color: #ff6b18; font-weight: bold; margin-right: 10px;">2.</span>
                El proceso será tratado con la máxima confidencialidad
            </div>
            <div>
                <span style="color: #ff6b18; font-weight: bold; margin-right: 10px;">3.</span>
                Recibirá respuesta en un plazo máximo de <strong>15 días hábiles</strong>
            </div>
        </div>
    </div>

    <!-- Información legal -->
    <div class="card card-warning mb-4">
        <div style="font-weight: 600; color: #d97706; font-size: 13px; margin-bottom: 8px; display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Base Legal
        </div>
        <p class="mb-0" style="color: #92400e; font-size: 12px; line-height: 1.6;">
            De conformidad con el artículo 14 de la Ley 1755 de 2015, los términos de respuesta son de 15 días hábiles, contados a partir del día siguiente de este mensaje de confirmación.
        </p>
    </div>

    <!-- Agradecimiento -->
    <div class="text-center mt-4 mb-4" style="padding: 24px;">
        <p class="mb-2" style="font-size: 15px; line-height: 1.7;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6b18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: sub; margin-right: 6px;">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Gracias por colaborar con nosotros y ayudarnos a lograr un ambiente más seguro y respetuoso.
        </p>
        <p class="mb-0" style="color: #847970; font-weight: 600;">
            - Equipo de Inversiones Arar S.A.
        </p>
    </div>

    <!-- Confidencialidad -->
    <div class="card card-success">
        <div style="display: flex; align-items: start;">
            <div style="margin-right: 12px; flex-shrink: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
            </div>
            <div>
                <div style="font-weight: 600; color: #166534; font-size: 13px; margin-bottom: 6px;">
                    Confidencialidad Garantizada
                </div>
                <p class="mb-0" style="color: #15803d; font-size: 12px; line-height: 1.5;">
                    Toda la información proporcionada será manejada de manera estrictamente confidencial y solo será conocida por el personal autorizado del área competente.
                </p>
            </div>
        </div>
    </div>
@endsection

@section('footer')
    <p class="email-footer-small">Este es un correo de confirmación automático.</p>
    <p class="email-footer-small">Si tiene alguna pregunta, por favor conserve su número de radicado.</p>
@endsection