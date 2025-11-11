<?php

namespace App\Mail;

/**
 * Clase ContactFormMail.
 * 
 * Esta clase extiende Mailable de Laravel y se utiliza para construir y enviar
 * emails basados en los datos del formulario de contacto.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-11
 */

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

     /**
     * Constructor - Inicializa la instancia del email.
     * 
     * Este método recibe los datos validados del formulario de contacto y los almacena
     * en una propiedad pública para usarlos en otros métodos.
     * 
     * - Parámetros:
     *   - $contactData: Array con los datos del formulario (ej. name, email, message).
     * 
     * @param array $contactData
     */
    public function __construct(public array $contactData)
    {}

    /**
     * Método envelope - Define el sobre del email.
     * 
     * Este método configura los metadatos del email, como el asunto y el remitente de respuesta.
     * El asunto incluye el subject del formulario para que sea descriptivo, y el replyTo
     * permite responder directamente al email del usuario.
     *
     * - Notas: El subject se construye dinámicamente con $this->contactData['subject'].
     * 
     * @return Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nuevo mensaje de contacto: ' . $this->contactData['subject'],
            replyTo: $this->contactData['email'],
        );
    }

    /**
     * Método content - Define el contenido del email.
     * 
     * Este método especifica la vista (template) que se usará para renderizar el cuerpo
     * del email. La vista 'emails.contact' es un archivo Blade que accede
     * a $contactData para mostrar los detalles del mensaje.
     * 
     * @return Content
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact',
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
