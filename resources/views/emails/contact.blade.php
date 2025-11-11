<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo mensaje de contacto</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2d2520; margin: 0; padding: 0; background-color: #fef6f0;">
    <div style="max-width: 600px; margin: 0 auto;">
        <!-- Header con logo -->
        <!-- Muestra el logo de la empresa y título del email. El logo se carga desde public/images/logo-arar.png. -->
        <div style="background-color: #fef6f0; padding: 30px 30px 20px 30px; text-align: center;">
            <img src="{{ asset('images/logo-arar.png') }}" alt="Inversiones Arar" style="max-width: 120px; height: auto; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 600; color: #ff6b18;">Nuevo Mensaje de Contacto</h1>
        </div>
        
        <!-- Contenido principal -->
        <!-- Aquí se muestran los datos del formulario de contacto. Los datos provienen del array $contactData, pasado desde ContactFormMail en el controlador ContactController@store. -->
        <div style="background: #ffffff; padding: 40px 30px; border-radius: 8px; margin: 0 15px;">
            <!-- Asunto: Viene de $contactData['subject'] (validado en StoreContactRequest). -->
            <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e8e5e1;">
                <div style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Asunto</div>
                <div style="color: #2d2520; font-size: 16px;">{{ $contactData['subject'] }}</div>
            </div>

            <!-- Nombre: Viene de $contactData['name'] (validado en StoreContactRequest). -->
            <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e8e5e1;">
                <div style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Nombre</div>
                <div style="color: #2d2520; font-size: 16px;">{{ $contactData['name'] }}</div>
            </div>

            <!-- Email: Viene de $contactData['email'] (validado en StoreContactRequest). Enlace directo para responder. -->
            <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e8e5e1;">
                <div style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Correo Electrónico</div>
                <div style="color: #2d2520; font-size: 16px;">
                    <a href="mailto:{{ $contactData['email'] }}" style="color: #ff6b18; text-decoration: none;">
                        {{ $contactData['email'] }}
                    </a>
                </div>
            </div>

            <!-- Teléfono: Viene de $contactData['phone'] (validado en StoreContactRequest). Enlace para llamar. -->
            <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e8e5e1;">
                <div style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Teléfono</div>
                <div style="color: #2d2520; font-size: 16px;">
                    <a href="tel:{{ $contactData['phone'] }}" style="color: #ff6b18; text-decoration: none;">
                        {{ $contactData['phone'] }}
                    </a>
                </div>
            </div>

            <!-- Empresa: Opcional, viene de $contactData['company'] si no está vacío (validado en StoreContactRequest). Solo se muestra si existe. -->
            @if(!empty($contactData['company']))
            <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e8e5e1;">
                <div style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Empresa</div>
                <div style="color: #2d2520; font-size: 16px;">{{ $contactData['company'] }}</div>
            </div>
            @endif

            <!-- Mensaje: Viene de $contactData['message'] (validado en StoreContactRequest). Se muestra con formato pre-wrap para preservar saltos de línea. -->
            <div style="margin-top: 32px; padding-top: 32px; border-top: 2px solid #ff6b18;">
                <div style="font-weight: 600; color: #847970; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Mensaje</div>
                <div style="background: #fef6f0; padding: 20px; border-radius: 6px; border-left: 3px solid #ff6b18; white-space: pre-wrap; font-size: 15px; line-height: 1.7; color: #2d2520;">{{ $contactData['message'] }}</div>
            </div>
        </div>

        <!-- Footer -->
        <!-- Información estática: enlace al sitio y fecha/hora actual generada por Laravel (now()). -->
        <div style="text-align: center; padding: 30px; color: #847970; font-size: 13px; background: #fef6f0;">
            <p style="margin: 5px 0;">Enviado desde el formulario de contacto de <a href="https://inversionesarar.com" style="color: #ff6b18; text-decoration: none;">inversionesarar.com</a></p>
            <p style="margin: 5px 0;">{{ now()->format('d/m/Y H:i:s') }}</p>
        </div>
    </div>
</body>
</html>