<?php

namespace App\Mail;

/**
 * Clase ResetPasswordMail.
 * 
 * Esta clase extiende Mailable y se encarga de construir el correo de 
 * restablecimiento de contraseña para los usuarios que lo solicitan.
 * 
 * El correo incluye un enlace seguro generado con el token y el email 
 * del usuario, permitiendo iniciar el proceso de cambio de contraseña.
 * 
 * @author Yariangel 
 
 * @date 2025-11-14
 */

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Token de restablecimiento enviado por Laravel.
     * 
     * @var string
     */
    public string $token;

    /**
     * Número de documento del usuario que solicitó el restablecimiento.
     * 
     * @var string
     */
    public string $numero_documento;

    /**
     * Constructor - Inicializa la instancia del correo.
     * 
     * Recibe tanto el token como el número de documento para construir posteriormente
     * la URL de restablecimiento.
     * 
     * @param string $token
     * @param string $numero_documento
     */
    public function __construct(string $token, string $numero_documento)
    {
        $this->token = $token;
        $this->numero_documento = $numero_documento;
    }

    /**
     * Método envelope - Define el sobre del email.
     * 
     * Incluye:
     * - subject: Asunto del correo.
     * - replyTo: Correo del usuario (por si se necesita responder).
     * 
     * @return Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Restablecimiento de Contraseña'            
        );
    }

    /**
     * Método content - Define la vista del correo.
     * 
     * Genera la URL del enlace de restablecimiento utilizando la ruta
     * 'password.reset', sin forzar dominio absoluto.
     * 
     * La vista markdown 'emails.reset-password' recibe:
     * - url
     * - email
     *
     * @return Content
     */
    public function content(): Content
    {
        $url = url(route('password.reset', [
            'token' => $this->token,
            'numero_documento' => $this->numero_documento,
        ], false));

        return new Content(
            markdown: 'emails.reset-password',
            with: [
                'url'   => $url,
                'numero_documento' => $this->numero_documento,
            ]
        );
    }

    /**
     * Método attachments - Adjuntos del mensaje.
     * 
     * Este correo no requiere archivos adjuntos, pero el método se 
     * mantiene por compatibilidad con la estructura estándar de Mailable.
     * 
     * @return array
     */
    public function attachments(): array
    {
        return [];
    }
}
