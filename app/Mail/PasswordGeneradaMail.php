<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * 
 * Esta clase se utiliza para enviar emails cuando un administrador
 * restaura la contraseña de un usuario o crea un nuevo usuario.
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */
class PasswordGeneradaMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Constructor - Inicializa la instancia del email.
     * 
     * @param User $usuario Usuario al que se le generó la contraseña
     * @param string $nuevaPassword Nueva contraseña generada
     */
    public function __construct(
        public User $usuario,
        public string $nuevaPassword,
    ) {}

    /**
     * Método envelope - Define el sobre del email.
     * 
     * @return Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Contraseña generada',
        );
    }

    /**
     * Método content - Define el contenido del email.
     * 
     * @return Content
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.password-generada',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}