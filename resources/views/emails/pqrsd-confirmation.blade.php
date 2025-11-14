<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación Denuncia PQRSD</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2d2520; margin: 0; padding: 0; background-color: #fef6f0;">
    <div style="max-width: 600px; margin: 0 auto;">
        <!-- Header con logo -->
        <div style="background-color: #fef6f0; padding: 30px 30px 20px 30px; text-align: center;">
            <img src="{{ asset('images/logo-arar.png') }}" alt="Inversiones Arar" style="max-width: 120px; height: auto; margin-bottom: 15px;">
            
            <!-- Ícono de confirmación -->
            <div style="margin: 20px 0; display: flex; align-items: center; justify-content: center; gap: 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h1 style="margin: 0; font-size: 26px; font-weight: 600; color: #ff6b18;">¡Denuncia Recibida!</h1>
            </div>
            
        </div>
        
        <!-- Contenido principal -->
        <div style="background: #ffffff; padding: 40px 30px; border-radius: 8px; margin: 0 15px;">
            <!-- Saludo personalizado -->
            <div style="margin-bottom: 30px;">
                <p style="margin: 0 0 16px 0; font-size: 16px; color: #2d2520;">
                    Estimado(a) <strong>{{ $data['nombre'] }}</strong>,
                </p>
                <p style="margin: 0; font-size: 15px; color: #847970; line-height: 1.7;">
                    Hemos recibido satisfactoriamente su denuncia. Gracias por tomarse el tiempo de informarnos sobre esta situación.
                </p>
            </div>

            <!-- Número de radicado destacado -->
            <div style="background: linear-gradient(135deg, #ff6b18 0%, #ff8c42 100%); padding: 30px; border-radius: 8px; margin-bottom: 30px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="color: rgba(255, 255, 255, 0.9); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: 600;">
                    Su Número de Radicado
                </div>
                <div style="color: #ffffff; font-size: 36px; font-weight: bold; font-family: monospace; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
                    #{{ $data['numero_radicado'] }}
                </div>
                <div style="color: rgba(255, 255, 255, 0.9); font-size: 13px; margin-top: 8px;">
                    Guarde este número para futuras consultas
                </div>
            </div>

            <!-- Información del proceso -->
            <div style="background: #fef6f0; padding: 24px; border-radius: 6px; border-left: 4px solid #ff6b18; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #2d2520; font-size: 16px; font-weight: 600;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: sub; margin-right: 8px;">
                        <path d="M9 18l6-6-6-6" stroke="#ff6b18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Próximos Pasos
                </h3>
                <div style="color: #2d2520; font-size: 14px; line-height: 1.8;">
                    <div style="margin-bottom: 12px; padding-left: 5px; position: relative;">
                        <span style="margin-right: 10px; color: #ff6b18; font-weight: bold;">1.</span>
                        Su denuncia será revisada cuidadosamente por el área encargada
                    </div>
                    <div style="margin-bottom: 12px; padding-left: 5px; position: relative;">
                        <span style="margin-right: 10px; color: #ff6b18; font-weight: bold;">2.</span>
                        El proceso será tratado con la máxima confidencialidad
                    </div>
                    <div style="padding-left: 5px; position: relative;">
                        <span style="margin-right: 10px; color: #ff6b18; font-weight: bold;">3.</span>
                        Recibirá respuesta en un plazo máximo de <strong>15 días hábiles</strong>
                    </div>
                </div>
            </div>

            <!-- Caja de información legal -->
            <div style="background: #fff4e6; padding: 20px; border-radius: 6px; border: 1px solid #ffd699; margin-bottom: 24px;">
                <div style="font-weight: 600; color: #d97706; font-size: 13px; margin-bottom: 8px; display: flex; align-items: center;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Base Legal
                </div>
                <p style="margin: 0; color: #92400e; font-size: 12px; line-height: 1.6;">
                    De conformidad con el artículo 14 de la Ley 1755 de 2015, los términos de respuesta son de 15 días hábiles, contados a partir del día siguiente de este mensaje de confirmación.
                </p>
            </div>

            <!-- Agradecimiento -->
            <div style="padding: 24px; text-align: center;">
                <p style="margin: 0 0 12px 0; color: #2d2520; font-size: 15px; line-height: 1.7;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: sub; margin-right: 6px;">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#ff6b18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Gracias por colaborar con nosotros y ayudarnos a lograr un ambiente más seguro y respetuoso.
                </p>
                <p style="margin: 0; color: #847970; font-size: 14px; font-weight: 600;">
                    - Equipo de Inversiones Arar S.A.
                </p>
            </div>

            <!-- Recordatorio de confidencialidad -->
            <div style="background: #f8f7f6; padding: 16px; border-radius: 6px; border-left: 3px solid #22c55e;">
                <div style="display: flex; align-items: start;">
                    <div style="margin-right: 12px; flex-shrink: 0;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                    </div>
                    <div>
                        <div style="font-weight: 600; color: #166534; font-size: 13px; margin-bottom: 4px;">
                            Confidencialidad Garantizada
                        </div>
                        <p style="margin: 0; color: #15803d; font-size: 12px; line-height: 1.5;">
                            Toda la información proporcionada será manejada de manera estrictamente confidencial y solo será conocida por el personal autorizado del área competente.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 30px; color: #847970; font-size: 13px; background: #fef6f0;">
            <p style="margin: 5px 0; font-weight: 600;">Inversiones Arar S.A.</p>
            <p style="margin: 5px 0;">
                <a href="https://inversionesarar.com" style="color: #ff6b18; text-decoration: none;">inversionesarar.com</a>
            </p>
            <p style="margin: 15px 0 5px 0; font-size: 11px; color: #a8a29e;">
                Este es un correo de confirmación automático.
            </p>
            <p style="margin: 5px 0; font-size: 11px; color: #a8a29e;">
                Si tiene alguna pregunta, por favor conserve su número de radicado.
            </p>
        </div>
    </div>
</body>
</html>
