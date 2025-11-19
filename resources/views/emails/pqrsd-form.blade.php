@extends('emails.email-layout')

@section('title', 'Nueva Denuncia PQRSD')

@section('header')
<h1 class="email-title">Nueva @if($pqrsdData['letra_pqrs'] == 'D') Denuncia @else PQRS @endif Recibida</h1>
<span class="badge">{{ strtoupper($pqrsdData['tipo_pqrs']) }}</span>
@endsection

@section('content')
<!-- Número de radicado -->
<div class="radicado-box">
    <div class="radicado-label">Número de Radicado</div>
    <div class="radicado-number">{{ $pqrsdData['radicado'] }}</div>
</div>

<!-- Información de la PQRSD -->
<div class="card mb-4">
    <h3 class="section-title" style="display: flex; align-items: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
        Información de la @if($pqrsdData['letra_pqrs'] == 'D') Denuncia @else PQRS @endif
    </h3>

    <div class="field-group">
        <div class="field-label">Empresa</div>
        <div class="field-value">{{ $pqrsdData['empresa'] }}</div>
    </div>

    <div class="field-group">
        <div class="field-label">Tipo</div>
        <div class="field-value">{{ $pqrsdData['tipo_pqrs'] }}</div>
    </div>

    <div class="field-group mb-0">
        <div class="field-label">Fecha de Recepción</div>
        <div class="field-value">{{ $pqrsdData['fecha'] }}</div>
    </div>
</div>

<!-- Datos del propietario - Solo si NO es anónimo -->
@if(!($pqrsdData['anonimo'] ?? false))
<div class="card mb-4">
    <h3 class="section-title" style="display: flex; align-items: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
        Datos del Propietario
    </h3>

    <div class="field-group">
        <div class="field-label">Nombre</div>
        <div class="field-value">{{ $pqrsdData['nombre_completo'] }}</div>
    </div>

    <div class="field-group">
        <div class="field-label">Tipo de Documento</div>
        <div class="field-value">{{ $pqrsdData['tipo_documento'] }}</div>
    </div>

    <div class="field-group">
        <div class="field-label">Número de Documento</div>
        <div class="field-value">{{ $pqrsdData['numero_documento'] }}</div>
    </div>

    <div class="field-group">
        <div class="field-label">Correo Electrónico</div>
        <div class="field-value">
            <a href="mailto:{{ $pqrsdData['correo'] }}" class="link-primary">
                {{ $pqrsdData['correo'] }}
            </a>
        </div>
    </div>

    <div class="field-group">
        <div class="field-label">Teléfono</div>
        <div class="field-value">
            <a href="tel:{{ $pqrsdData['telefono'] }}" class="link-primary">
                {{ $pqrsdData['telefono'] }}
            </a>
        </div>
    </div>

    <div class="field-group">
        <div class="field-label">Ubicación</div>
        <div class="field-value">{{ $pqrsdData['ubicacion'] }}</div>
    </div>

    <div class="field-group">
        <div class="field-label">Dirección</div>
        <div class="field-value">{{ $pqrsdData['direccion'] }}</div>
    </div>

    <div class="field-group mb-0">
        <div class="field-label">Relación con la Empresa</div>
        <div class="field-value" style="text-transform: capitalize;">{{ $pqrsdData['relacion'] }}</div>
    </div>
</div>

@else
<!-- Indicador de denuncia anónima -->
<div class="card mb-4" style="background: #f3f4f6; border-left: 4px solid #6b7280;">
    <div style="display: flex; align-items: center; gap: 10px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span style="font-weight: 600; color: #374151; font-size: 14px;">Denuncia Anónima</span>
    </div>
    <p style="margin: 8px 0 0 20px; color: #6b7280; font-size: 14px;">
        El denunciante ha optado por mantener su identidad confidencial.
    </p>
</div>
@endif

<!-- Descripción -->
<hr class="divider">

<div class="mb-4">
    <div class="field-label mb-3" style="display: flex; align-items: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#847970" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Descripción de la @if($pqrsdData['letra_pqrs'] == 'D') Denuncia @else PQRS @endif
    </div>
    <div class="card card-highlight" style="white-space: pre-wrap; line-height: 1.7;">
        {{ $pqrsdData['mensaje'] }}
    </div>
</div>

<!-- Archivos adjuntos -->
<div class="card">
    <div class="field-label mb-2" style="display: flex; align-items: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#847970" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
        Archivos Adjuntos
    </div>
    @if($pqrsdData['tiene_adjuntos'])
    <div class="field-value">
        Esta denuncia contiene <strong>{{ $pqrsdData['cantidad_adjuntos'] }}</strong> archivo(s) adjunto(s)
    </div>
    @else
    <div class="text-muted" style="font-size: 14px;">Sin archivos adjuntos</div>
    @endif
</div>

<!-- Recordatorio legal -->
<div class="card card-warning mt-4">
    <div style="font-weight: 600; color: #d97706; font-size: 13px; margin-bottom: 8px; display: flex; align-items: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
        Recordatorio Legal
    </div>
    <p class="mb-0" style="color: #92400e; font-size: 12px; line-height: 1.6;">
        De conformidad con el artículo 14 de la ley 1755 de 2015, el término de respuesta es de <strong>15 días hábiles</strong>, contados a partir del día siguiente de la recepción de esta denuncia.
    </p>
</div>
@endsection

@section('footer')
<p>Sistema PQRSD - Inversiones Arar S.A.</p>
<p class="email-footer-small">Este correo fue generado automáticamente. Por favor no responder.</p>
@endsection