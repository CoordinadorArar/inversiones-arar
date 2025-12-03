<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Mailable para enviar correo de confirmación al denunciante.
 * Confirma la recepción de la denuncia y proporciona número de radicado.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-13
 */

class PQRSDConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Datos del denunciante y radicado.
     * 
     * @var array
     */
    public $confirmationData;

    /**
     * BLOQUE: Constructor - Inicializa datos de confirmación.
     * 
     * @param array $confirmationData Datos de confirmación
     */
    public function __construct(array $confirmationData)
    {
        $this->confirmationData = $confirmationData;
    }

    /**
     * BLOQUE: envelope - Configura sobre del correo (asunto con radicado).
     * 
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope(): Envelope
    {        
        $tipoPqrs = $this->confirmationData['letra_pqrs'];

        // Determinar texto según tipo
        $tipoTexto = $tipoPqrs == 'D' ? 'Denuncia' : 'PQRS';

        $subject = "Confirmación de {$tipoTexto} - Radicado #{$this->confirmationData['radicado']}";

        return new Envelope(subject: $subject);
    }

    /**
     * BLOQUE: content - Define vista y pasa datos.
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
     * BLOQUE: attachments - Sin adjuntos en confirmaciones.
     * 
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
