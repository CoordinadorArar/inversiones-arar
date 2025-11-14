<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

/**
 * Mailable para enviar correo de nueva denuncia PQRSD al área responsable
 * Incluye todos los datos de la denuncia y archivos adjuntos si existen
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-14
 */

class PQRSDFormMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Datos de la denuncia PQRSD
     * 
     * @var array
     */
    public $pqrsdData;

    /**
     * Archivos adjuntos de la denuncia
     * 
     * @var array
     */
    public $attachmentFiles;

    /**
     * Constructor del Mailable
     * 
     * @param array $pqrsdData Datos de la denuncia
     * @param array $attachmentFiles Archivos adjuntos
     */
    public function __construct(array $pqrsdData, array $attachmentFiles = [])
    {
        $this->pqrsdData = $pqrsdData;
        $this->attachmentFiles = $attachmentFiles;
    }

    /**
     * Configura el sobre del correo (asunto, remitente)
     * 
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope(): Envelope
    {        
        $radicado = str_pad($this->pqrsdData['id'], 6, '0', STR_PAD_LEFT);
        
        return new Envelope(            
            subject: "Nueva Denuncia PQRSD  - Radicado #{$radicado}",
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
            view: 'emails.pqrsd-form',
            with: ['pqrsdData' => $this->pqrsdData]
        );
    }

    /**
     * Adjunta archivos al correo si existen
     * 
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        foreach ($this->attachmentFiles as $file) {
            $attachments[] = Attachment::fromPath($file['ruta_completa'])
                ->as($file['nombre']);
        }

        return $attachments;
    }
}