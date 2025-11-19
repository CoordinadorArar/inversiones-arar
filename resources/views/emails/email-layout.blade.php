<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Inversiones Arar')</title>
    <style>
        /* Reset básico */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #2d2520;
            background-color: #fef6f0;
        }
        
        /* Clases de contenedor */
        .email-wrapper { max-width: 600px; margin: 0 auto; }
        
        /* Header */
        .email-header {
            background-color: #fef6f0;
            padding: 30px 30px 20px 30px;
            text-align: center;
        }
        .email-logo {
            max-width: 120px;
            height: auto;
            margin-bottom: 15px;
        }
        .email-title {
            margin: 0;
            font-size: 26px;
            font-weight: 600;
            color: #ff6b18;
        }
        
        /* Badge */
        .badge {
            display: inline-block;
            background: #ff6b18;
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .badge-success {
            background: #22c55e;
        }
        .badge-warning {
            background: #f59e0b;
        }
        .badge-info {
            background: #3b82f6;
        }
        
        /* Contenido principal */
        .email-body {
            background: #ffffff;
            padding: 40px 30px;
            border-radius: 8px;
            margin: 0 15px;
        }
        
        /* Cards y secciones */
        .card {
            background: #f8f7f6;
            padding: 24px;
            border-radius: 6px;
            margin-bottom: 24px;
        }
        .card-highlight {
            background: #fef6f0;
            border-left: 4px solid #ff6b18;
        }
        .card-warning {
            background: #fff4e6;
            border: 1px solid #ffd699;
        }
        .card-success {
            background: #f0fdf4;
            border-left: 3px solid #22c55e;
        }
        
        /* Títulos de sección */
        .section-title {
            margin: 0 0 20px 0;
            color: #2d2520;
            font-size: 16px;
            font-weight: 600;
            padding-bottom: 10px;
            border-bottom: 2px solid #ff6b18;
        }
        
        /* Labels y valores */
        .field-label {
            font-weight: 600;
            color: #847970;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .field-value {
            color: #2d2520;
            font-size: 15px;
        }
        .field-group {
            margin-bottom: 16px;
        }
        
        /* Enlaces */
        .link-primary {
            color: #ff6b18;
            text-decoration: none;
        }
        .link-primary:hover {
            text-decoration: underline;
        }
        
        /* Botones */
        .btn {
            display: inline-block;
            padding: 14px 32px;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 6px;
            text-align: center;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: #ff6b18;
            color: white;
        }
        .btn-primary:hover {
            background: #e55f15;
        }
        
        /* Número de radicado destacado */
        .radicado-box {
            background: #ff6b18;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(255, 107, 24, 0.2);
        }
        .radicado-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        .radicado-number {
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            font-family: monospace;
            letter-spacing: 2px;
        }
        
        /* Separadores */
        .divider {
            margin: 32px 0;
            border: 0;
            border-top: 2px solid #ff6b18;
        }
        
        /* Footer */
        .email-footer {
            text-align: center;
            padding: 30px;
            color: #847970;
            font-size: 13px;
            background: #fef6f0;
        }
        .email-footer p {
            margin: 5px 0;
        }
        .email-footer-small {
            font-size: 11px;
            color: #a8a29e;
        }
        
        /* Utilidades */
        .text-center { text-align: center; }
        .text-small { font-size: 13px; }
        .text-muted { color: #847970; }
        .mb-0 { margin-bottom: 0; }
        .mb-2 { margin-bottom: 8px; }
        .mb-3 { margin-bottom: 16px; }
        .mb-4 { margin-bottom: 24px; }
        .mt-4 { margin-top: 24px; }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="email-header">
            <img src="{{ asset('images/logo-arar.png') }}" alt="Inversiones Arar" class="email-logo">
            @yield('header')
        </div>
        
        <!-- Body -->
        <div class="email-body">
            @yield('content')
        </div>

        <!-- Footer -->
        <div class="email-footer">
            @yield('footer')
            
            <p><strong>Inversiones Arar S.A.</strong></p>
            <p>
                <a href="https://inversionesarar.com" class="link-primary">inversionesarar.com</a>
            </p>
            <p class="email-footer-small">
                {{ now()->format('d/m/Y H:i:s') }}
            </p>
        </div>
    </div>
</body>
</html>