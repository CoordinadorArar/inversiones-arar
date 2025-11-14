<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Mailable para enviar correo de confirmación al denunciante (no anónimo)
 * Confirma la recepción de la denuncia y proporciona número de radicado
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-13
 */

class PQRSDConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Datos del denunciante y radicado
     * 
     * @var array
     */
    public $confirmationData;

    /**
     * Constructor del Mailable
     * 
     * @param array $confirmationData Datos de confirmación
     */
    public function __construct(array $confirmationData)
    {
        $this->confirmationData = $confirmationData;
    }

    /**
     * Configura el sobre del correo
     * 
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(            
            subject: "Confirmación de Denuncia PQRSD - Radicado #{$this->confirmationData['numero_radicado']}",
        );
    }

    /**
     * Configura el contenido del correo
     * 
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.pqrsd-confirmation',
            with: ['data' => $this->confirmationData]
        );
    }

    /**
     * No hay adjuntos en correos de confirmación
     * 
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}