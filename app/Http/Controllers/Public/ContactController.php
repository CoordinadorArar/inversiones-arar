<?php

namespace App\Http\Controllers\Public;

/**
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-11
 */

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

class ContactController extends Controller
{
    /**
     * Método index - Muestra el formulario de contacto.
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        return inertia('Public/Contact');
    }

    /**
     * Método store - Procesa y envía el formulario de contacto.
     * 
     * Este método valida los datos enviados desde el formulario, intenta enviar un email
     * con la información, y retorna una respuesta JSON indicando éxito o error.     
     * 
     * - Parámetros:
     *   - $request: Instancia de StoreContactRequest, que valida automáticamente los datos
     *     (ej. email obligatorio, mensaje no vacío). Si falla la validación, Laravel lanza errores automáticamente.
     * - Lógica interna:
     *   - Valida los datos con $request->validated() (obtiene solo los campos validados).
     *   - Envía un email a 'asistente@inversionesarar.com' usando la clase ContactFormMail,
     *     que formatea el email con los datos del usuario.
     *   - Si el envío falla (ej. problemas con el servidor de email), captura la excepción y retorna error.
     * - Retorno:
     *   - Éxito: JSON con mensaje de confirmación y código 200.
     *   - Error: JSON con mensaje de error y código 500.     
     * 
     * @param StoreContactRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreContactRequest $request)
    {
        $validated = $request->validated();

        try {
            
            // Mail::to('julianalizarazo@inversionesarar.com')->send(
            //     new ContactFormMail($validated)
            // );
            Mail::to('desarrollo01@inversionesarar.com')->send(
                new ContactFormMail($validated)
            );

            return response()->json(['message' => '¡Mensaje enviado correctamente!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Hubo un error al enviar el mensaje. Por favor intenta más tarde.'], 500);
        }
    }
}
