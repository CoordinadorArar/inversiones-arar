<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Denuncia PQRSD</title>
</head>

<body
    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2d2520; margin: 0; padding: 0; background-color: #fef6f0;">
    <div style="max-width: 600px; margin: 0 auto;">
        <!-- Header con logo -->
        <div style="background-color: #fef6f0; padding: 30px 30px 20px 30px; text-align: center;">
            <img src="{{ asset('images/logo-arar.png') }}" alt="Inversiones Arar"
                style="max-width: 120px; height: auto; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 600; color: #ff6b18;">Nueva PQRSD Recibida</h1>

            <!-- Badge de tipo de PQRSD -->
            <div
                style="display: inline-block; background: #ff6b18; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; letter-spacing: 0.5px;">
                {{ strtoupper($pqrsdData['tipo_pqrs']) }}
            </div>
        </div>

        <!-- Contenido principal -->
        <div style="background: #ffffff; padding: 40px 30px; border-radius: 8px; margin: 0 15px;">
            <!-- Número de radicado -->
            <div
                style="background: #fef6f0; padding: 20px; border-radius: 6px; border-left: 4px solid #ff6b18; margin-bottom: 30px; text-align: center;">
                <div
                    style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                    Número de Radicado</div>
                <div style="color: #ff6b18; font-size: 28px; font-weight: bold; font-family: monospace;">{{
                    $pqrsdData['radicado'] }}</div>
            </div>

            <div style="background: #f8f7f6; padding: 24px; border-radius: 6px; margin-bottom: 24px;">
                <h3
                    style="margin: 0 0 20px 0; color: #2d2520; font-size: 16px; font-weight: 600; border-bottom: 2px solid #ff6b18; padding-bottom: 10px; display: flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
                        <path
                            d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                        <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                        <path d="M10 9H8" />
                        <path d="M16 13H8" />
                        <path d="M16 17H8" />
                    </svg>
                    Información de la PQRSD
                </h3>

                <div style="display: grid; gap: 16px;">
                    <!-- Empresa -->
                    <div>
                        <div
                            style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                            Empresa</div>
                        <div style="color: #2d2520; font-size: 15px;">{{ $pqrsdData['empresa'] }}</div>
                    </div>

                    <!-- Tipo de PQRSD -->
                    <div>
                        <div
                            style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                            Tipo</div>
                        <div style="color: #2d2520; font-size: 15px;">{{ $pqrsdData['tipo_pqrs'] }}</div>
                    </div>

                    <!-- Fecha -->
                    <div>
                        <div
                            style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                            Fecha de Recepción</div>
                        <div style="color: #2d2520; font-size: 15px;">{{ $pqrsdData['fecha'] }}</div>
                    </div>
                </div>
            </div>

            <!-- Datos del denunciante -->
            <div style="background: #f8f7f6; padding: 24px; border-radius: 6px; margin-bottom: 24px;">
                <h3
                    style="margin: 0 0 20px 0; color: #2d2520; font-size: 16px; font-weight: 600; border-bottom: 2px solid #ff6b18; padding-bottom: 10px; display: flex; align-items: center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        style="margin-right: 10px;">
                        <path
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                            fill="#847970" />
                    </svg>
                    Datos del Denunciante
                </h3>

                <!-- Nombre -->
                <div style="margin-bottom: 16px;">
                    <div
                        style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Nombre</div>
                    <div style="color: #2d2520; font-size: 15px;">{{ $pqrsdData['nombre_completo'] }}</div>
                </div>

                <!-- Tipo de Documento -->
                <div style="margin-bottom: 16px;">
                    <div
                        style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Tipo de Documento</div>
                    <div style="color: #2d2520; font-size: 15px;">{{ $pqrsdData['tipo_documento'] }}</div>
                </div>

                <!-- Número de Documento -->
                <div style="margin-bottom: 16px;">
                    <div
                        style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Número de Documento</div>
                    <div style="color: #2d2520; font-size: 15px;">{{ $pqrsdData['numero_documento'] }}</div>
                </div>

                <!-- Correo -->
                <div style="margin-bottom: 16px;">
                    <div
                        style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Correo Electrónico</div>
                    <div style="color: #2d2520; font-size: 15px;">
                        <a href="mailto:{{ $pqrsdData['correo'] }}" style="color: #ff6b18; text-decoration: none;">
                            {{ $pqrsdData['correo'] }}
                        </a>
                    </div>
                </div>

                <!-- Teléfono -->
                <div style="margin-bottom: 16px;">
                    <div
                        style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Teléfono</div>
                    <div style="color: #2d2520; font-size: 15px;">
                        <a href="tel:{{ $pqrsdData['telefono'] }}" style="color: #ff6b18; text-decoration: none;">
                            {{ $pqrsdData['telefono'] }}
                        </a>
                    </div>
                </div>

                <!-- Ubicación -->
                <div style="margin-bottom: 16px;">
                    <div
                        style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Ubicación</div>
                    <div style="color: #2d2520; font-size: 15px;">{{ $pqrsdData['ubicacion'] }}</div>
                </div>

                <!-- Dirección -->
                <div style="margin-bottom: 16px;">
                    <div
                        style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Dirección</div>
                    <div style="color: #2d2520; font-size: 15px;">{{ $pqrsdData['direccion'] }}</div>
                </div>

                <!-- Relación -->
                <div>
                    <div
                        style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Relación con la Empresa</div>
                    <div style="color: #2d2520; font-size: 15px; text-transform: capitalize;">{{ $pqrsdData['relacion']
                        }}</div>
                </div>
            </div>

            <!-- Descripción de la denuncia -->
            <div style="margin-top: 32px; padding-top: 32px; border-top: 2px solid #ff6b18;">
                <div
                    style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; display: flex; align-items: center;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        style="margin-right: 10px;">
                        <path d=" M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#847970" />
                    </svg>
                    Descripción de la Denuncia
                </div>
                <div
                    style="background: #fef6f0; padding: 20px; border-radius: 6px; border-left: 3px solid #ff6b18; white-space: pre-wrap; font-size: 15px; line-height: 1.7; color: #2d2520;">
                    {{ $pqrsdData['mensaje'] }}</div>
            </div>

            <!-- Información de archivos adjuntos -->
            <div style="margin-top: 24px; padding: 16px; background: #f8f7f6; border-radius: 6px;">
                <div
                    style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: flex; align-items: center;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        style="margin-right: 10px;">
                        <path
                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 1 2h10c1.1 0 2-.9 2-2V7l-4-4zm-1 16H8V7h9v14z"
                            fill="#847970" />
                    </svg>
                    Archivos Adjuntos
                </div>
                @if($pqrsdData['tiene_adjuntos'])
                <div style="color: #2d2520; font-size: 14px;">
                    Esta denuncia contiene <strong>{{ $pqrsdData['cantidad_adjuntos'] }}</strong> archivo(s) adjunto(s)
                </div>
                @else
                <div style="color: #847970; font-size: 14px;">
                    Sin archivos adjuntos
                </div>
                @endif
            </div>

            <!-- Recordatorio legal -->
            <div
                style="margin-top: 32px; padding: 20px; background: #fff4e6; border-radius: 6px; border: 1px solid #ffd699;">
                <div style="font-weight: 600; color: #d97706; font-size: 13px; margin-bottom: 8px;">
                    Recordatorio Legal
                </div>
                <p style="margin: 0; color: #92400e; font-size: 12px; line-height: 1.6;">
                    De conformidad con el artículo 14 de la ley 1755 de 2015, el término de respuesta es de <strong>15
                        días hábiles</strong>, contados a partir del día siguiente de la recepción de esta denuncia.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 30px; color: #847970; font-size: 13px; background: #fef6f0;">
            <p style="margin: 5px 0;">Sistema PQRSD - Inversiones Arar S.A.</p>
            <p style="margin: 5px 0;">
                <a href="https://inversionesarar.com"
                    style="color: #ff6b18; text-decoration: none;">inversionesarar.com</a>
            </p>
            <p style="margin: 5px 0; font-size: 11px; color: #a8a29e;">
                Este correo fue generado automáticamente. Por favor no responder.
            </p>
        </div>
    </div>
</body>

</html>