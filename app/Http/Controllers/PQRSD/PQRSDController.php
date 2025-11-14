<?php

namespace App\Http\Controllers\PQRSD;

use App\Http\Controllers\Controller;
use App\Http\Requests\PQRSD\StorePQRSDRequest;
use App\Http\Requests\PQRSD\UpdatePQRSDRequest;
use App\Mail\PQRSDFormMail;
use App\Mail\PQRSDConfirmationMail;
use App\Models\Ciudad;
use App\Models\Departamento;
use App\Models\Empresa;
use App\Models\PQRSD\PQRSD;
use App\Models\PQRSD\TipoPqrs;
use App\Models\TipoIdentificacion;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Controlador para el sistema PQRSD (Peticiones, Quejas, Reclamos, Sugerencias y Denuncias)
 * Maneja el almacenamiento de denuncias y envío de correos a los responsables.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-13
 */

class PQRSDController extends Controller
{
    /**
     * Método index - Muestra la página de PQRSD
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        $departamentos = Departamento::select('f012_id as id', 'f012_descripcion as name')
            ->where('f012_id_pais', 169)
            ->orderBy('f012_descripcion')
            ->get();
        $ciudades = Ciudad::select('f013_id as id', 'f013_descripcion as name', 'f013_id_depto as id_dpto')
            ->where('f013_id_pais', 169)
            ->orderBy('f013_descripcion')
            ->get();

        $tiposPqrs = TipoPqrs::all();
        $tiposId = TipoIdentificacion::all();

        return inertia('Public/PQRSD', [
            'departamentos' => $departamentos,
            'ciudades' => $ciudades,
            'tiposPqrs' => $tiposPqrs,
            'tiposId' => $tiposId,
        ]);
    }

    /**
     * Método store - Procesa y guarda una nueva denuncia PQRSD.
     * 
     * Este método:
     * 1. Valida los datos (mediante StorePQRSDRequest)
     * 2. Crea directorio personalizado para archivos adjuntos
     * 3. Guarda la denuncia en la base de datos
     * 4. Guarda archivos adjuntos en storage/app/public/pqrsd/{año}/{mes}/{dia}/{id_pqrs}
     * 5. Envía correos al área responsable y al denunciante 
     * 
     * @param StorePQRSDRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StorePQRSDRequest $request)
    {
        $validated = $request->validated();
        $directoryPath = null; 

        try {
            DB::beginTransaction();

            // Preparar datos para guardar en BD
            $pqrsdData = [
                'empresa_id' => $validated['empresa'],
                'tipo_pqrs_id' => $validated['tipoPqrs'],
                'nombre' => $validated['nombre'],
                'apellido' => $validated['apellido'],
                'tipo_identificacion_id' => $validated['tipoId'],
                'numero_identificacion' => $validated['numId'],
                'correo' => $validated['correo'],
                'telefono' => $validated['telefono'],
                'departamento_codigo' => $validated['dpto'],
                'ciudad_codigo' => $validated['ciudad'],
                'direccion' => $validated['direccion'] ?? null,
                'relacion' => $validated['relacion'],
                'descripcion' => $validated['mensaje'],
                'estado_id' => 1,
            ];

            // Guardar en base de datos
            $pqrsd = Pqrsd::create($pqrsdData);

            // ID → radicado organizado
            $id = str_pad($pqrsd->id, 6, '0', STR_PAD_LEFT);

            $attachments = [];

            // Procesar archivos adjuntos si existen
            if ($request->hasFile('files')) {
                Carbon::setLocale('es');

                $fechaAño  = now()->format('Y');
                $fechaMes  = ucfirst(now()->translatedFormat('F'));
                $fechaDia  = now()->format('d');

                $directoryPath = "pqrsd/{$fechaAño}/{$fechaMes}/{$fechaDia}/{$id}"; // Ahora se define aquí

                foreach ($request->file('files') as $index => $file) {
                    // Generar nombre único para el archivo
                    $extension = $file->getClientOriginalExtension();
                    $filename = "archivo_{$index}.{$extension}";

                    // Guardar archivo en storage/app/public/pqrsd/[directorio]
                    $path = $file->storeAs($directoryPath, $filename, 'public');

                    $attachments[] = [
                        'nombre' => $filename,
                        'ruta' => $path,
                        'ruta_completa' => Storage::disk('public')->path($path)
                    ];
                }

                // Se actualizan los datos de archivos adjuntos y directorio
                $pqrsd->update([
                    'adjuntos' => json_encode($attachments),
                    'directorio' => $directoryPath,
                ]);
            }

            // Preparar datos para los correos
            $empresa       = Empresa::find($validated['empresa'])->f010_razon_social;
            $tipoPqrs      = TipoPqrs::find($validated['tipoPqrs'])->nombre;
            $tipoId        = TipoIdentificacion::find($validated['tipoId'])->abreviatura;
            $departamento  = Departamento::find($validated['dpto'])->f012_descripcion;
            $ciudad        = Ciudad::where('f013_id_depto', $validated['dpto'])
                            ->where('f013_id', $validated['ciudad'])
                            ->first()
                            ->f013_descripcion;

            $nombreCompleto = trim($validated['nombre'] . ' ' . $validated['apellido']);

            $emailData = [
                'id' => $pqrsd->id,
                'radicado' => str_pad($pqrsd->id, 6, '0', STR_PAD_LEFT),
                'empresa' => $empresa,
                'tipo_pqrs' => $tipoPqrs,
                'nombre_completo' => $nombreCompleto,
                'tipo_documento' => $tipoId,
                'numero_documento' => $validated['numId'],
                'correo' => $validated['correo'],
                'telefono' => $validated['telefono'],
                'ubicacion' => "{$ciudad}, {$departamento}",
                'direccion' => $validated['direccion'] ?? 'No especificada',
                'relacion' => ucfirst($validated['relacion']),
                'mensaje' => $validated['mensaje'],
                'tiene_adjuntos' => !empty($attachments),
                'cantidad_adjuntos' => count($attachments),
                'fecha' => now()->format('Y-m-d H:i:s')
            ];

            // Determinar destinatarios según relación con la empresa
            $destinatarios = $this->getDestinatarios($validated['relacion'] ?? null);

            // Enviar correo al área responsable con adjuntos
            Mail::to($destinatarios['principal'])
                ->bcc($destinatarios['copia'])
                ->send(new PQRSDFormMail($emailData, $attachments));

            // Si no es anónimo, enviar correo de confirmación al denunciante
            Mail::to($validated['correo'])
                ->send(new PQRSDConfirmationMail([
                    'nombre' => $validated['nombre'],
                    'apellido' => $validated['apellido'],
                    'numero_radicado' => str_pad($pqrsd->id, 6, '0', STR_PAD_LEFT),
                    'tipo_pqrs' => $tipoPqrs
                ]));

            DB::commit();

            return response()->json([
                'message' => '¡PQRSD enviada correctamente!',
                'radicado' => str_pad($pqrsd->id, 6, '0', STR_PAD_LEFT)
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            // Eliminar archivos si hubo error (solo si el directorio se creó)
            if (isset($directoryPath)) {
                Storage::disk('public')->deleteDirectory($directoryPath);
            }

            // Log del error para debugging
            \Log::error('Error en PQRSD: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al enviar la denuncia. Por favor intenta más tarde.'
            ], 500);
        }
    }


    /**
     * Determina los destinatarios del correo según la relación con la empresa
     * 
     * @param string|null $relacion
     * @return array
     */
    private function getDestinatarios(?string $relacion): array
    {
        // Si es empleado, va a control interno
        if ($relacion === 'empleado') {
            return [
                // 'principal' => 'controlinterno@inversionesarar.com',
                'principal' => 'desarrollo01@inversionesarar.com',
                'copia' => []
            ];
        }

        // Para otros casos (cliente, proveedor, otro, anónimo)
        return [
            'principal' => 'desarrollo01@inversionesarar.com',
            // 'principal' => 'juridico01@inversionesarar.com',
            'copia' => []
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(PQRSD $pQRSD)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PQRSD $pQRSD)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePQRSDRequest $request, PQRSD $pQRSD)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PQRSD $pQRSD)
    {
        //
    }
}
