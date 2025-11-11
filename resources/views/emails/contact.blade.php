<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo mensaje de contacto</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .field {
            margin-bottom: 20px;
            background: white;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #667eea;
        }
        .field-label {
            font-weight: bold;
            color: #667eea;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .field-value {
            color: #333;
            font-size: 15px;
        }
        .message-box {
            background: white;
            padding: 20px;
            border-radius: 5px;
            border-left: 4px solid #667eea;
            white-space: pre-wrap;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">Nuevo Mensaje de Contacto</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Inversiones Arar</p>
    </div>
    
    <div class="content">
        <div class="field">
            <div class="field-label">Asunto</div>
            <div class="field-value">{{ $contactData['subject'] }}</div>
        </div>

        <div class="field">
            <div class="field-label">Nombre</div>
            <div class="field-value">{{ $contactData['name'] }}</div>
        </div>

        <div class="field">
            <div class="field-label">Correo Electrónico</div>
            <div class="field-value">
                <a href="mailto:{{ $contactData['email'] }}" style="color: #667eea; text-decoration: none;">
                    {{ $contactData['email'] }}
                </a>
            </div>
        </div>

        <div class="field">
            <div class="field-label">Teléfono</div>
            <div class="field-value">
                <a href="tel:{{ $contactData['phone'] }}" style="color: #667eea; text-decoration: none;">
                    {{ $contactData['phone'] }}
                </a>
            </div>
        </div>

        @if(!empty($contactData['company']))
        <div class="field">
            <div class="field-label">Empresa</div>
            <div class="field-value">{{ $contactData['company'] }}</div>
        </div>
        @endif

        <div style="margin-top: 30px;">
            <div class="field-label" style="margin-bottom: 10px;">Mensaje</div>
            <div class="message-box">{{ $contactData['message'] }}</div>
        </div>
    </div>

    <div class="footer">
        <p>Este correo fue enviado desde el formulario de contacto de inversionesarar.com</p>
        <p>{{ now()->format('d/m/Y H:i:s') }}</p>
    </div>
</body>
</html>