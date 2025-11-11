<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Public/Contact');
    }

    /**
     * Procesa el formulario de contacto
     */
    public function store(StoreContactRequest $request)
    {
        $validated = $request->validated();

        try {
            Mail::to('desarrollo01@inversionesarar.com')->send(
                new ContactFormMail($validated)
            );

            return response()->json(['message' => '¡Mensaje enviado correctamente!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Hubo un error al enviar el mensaje. Por favor intenta más tarde.'], 500);
        }
    }
}
