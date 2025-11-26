<?php

namespace App\Http\Controllers\PQRSD;

/**
 * Controlador para el sistema PQRSD (Peticiones, Quejas, Reclamos, Sugerencias y Denuncias)
 * Maneja el almacenamiento de denuncias y envío de correos a los responsables.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-13
 */

use App\Http\Controllers\Controller;
use App\Http\Requests\PQRSD\StorePQRSDRequest;
use App\Http\Requests\PQRSD\UpdatePQRSDRequest;
use App\Mail\PQRSDFormMail;
use App\Mail\PQRSDConfirmationMail;
use App\Models\Ciudad;
use App\Models\Departamento;
use App\Models\EmpresaWeb;
use App\Models\PQRSD\PQRSD;
use App\Models\PQRSD\TipoPqrs;
use App\Models\TipoIdentificacion;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class PQRSDController extends Controller
{
    /**
     * BLOQUE: Método index - Muestra la página de PQRSD.
     * 
     * Carga datos de departamentos, ciudades, tipos PQRs e identificaciones desde DB.
     * Pasa datos a componente React 'Public/PQRSD' vía Inertia.
     * 
     * Propósito: Renderizar formulario de PQRs con opciones dinámicas.
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
            'empresas' => function () {
                return EmpresaWeb::select('id', 'razon_social as name', 'siglas')
                    ->where('permitir_pqrsd', true)   // solo las que deben mostrarse
                    ->orderBy('razon_social')
                    ->get();
            },
        ]);
    }

    /**
     * BLOQUE: Método store - Procesa y guarda una nueva denuncia PQRSD.
     * 
     * Pasos:
     * 1. Valida datos con StorePQRSDRequest.
     * 2. Crea directorio para adjuntos (pqrsd/año/mes/dia/id).
     * 3. Guarda PQR en DB con estado inicial 1 (Pendiente).
     * 4. Procesa y guarda archivos adjuntos en storage.
     * 5. Envía emails a responsables y confirmación al denunciante.
     * 
     * Usa transacciones DB para rollback en errores. Elimina archivos si falla.
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

            $esAnonimo = $request->boolean('esAnonimo', false);

            // Preparar datos para guardar en BD
            $pqrsdData = [
                'empresa_web_id' => ($validated['tipoPqrs'] == 5) ? $validated['empresa'] :  1, // Si es denuncia, usar empresa seleccionada; si no, usar id 1 (Inversiones Arar)
                'tipo_pqrs_id' => $validated['tipoPqrs'],
                'anonimo' => $esAnonimo,
                // Si no es anonimo, se agrega la información personal del usuario
                ...(!$esAnonimo ? [
                    'nombre' => $validated['nombre'],
                    'apellido' => $validated['apellido'],
                    'tipo_identificacion_id' => $validated['tipoId'],
                    'numero_identificacion' => $validated['numId'],
                    'correo' => $validated['correo'],
                    'telefono' => $validated['telefono'],
                    'departamento_codigo' => $validated['dpto'],
                    'ciudad_codigo' => $validated['ciudad'],
                    'direccion' => $validated['direccion'],
                    'relacion' => $validated['relacion'],

                ] : []),
                'descripcion' => $validated['mensaje'],
                'estado_id' => 1,
            ];

            // Crear PQR en DB.
            $pqrsd = Pqrsd::create($pqrsdData);

            // Generar radicado (ID con padding).
            $radicado = str_pad($pqrsd->id, 6, '0', STR_PAD_LEFT);

            $attachments = [];

            // Procesar archivos adjuntos si existen
            if ($request->hasFile('files')) {
                Carbon::setLocale('es');

                $fechaAño  = now()->format('Y');
                $fechaMes  = ucfirst(now()->translatedFormat('F'));
                $fechaDia  = now()->format('d');

                $identificador = $esAnonimo ? "anonimo_{$radicado}" : $radicado;

                $directoryPath = "pqrsd/{$fechaAño}/{$fechaMes}/{$fechaDia}/{$identificador}";

                foreach ($request->file('files') as $index => $file) {
                    // Generar nombre único para el archivo
                    $extension = $file->getClientOriginalExtension();
                    $filename = "archivo_{$index}.{$extension}";

                    // Guardar en storage público.
                    $path = $file->storeAs($directoryPath, $filename, 'public');

                    $attachments[] = [
                        'nombre' => $filename,
                        'ruta' => $path,
                        'ruta_completa' => Storage::disk('public')->path($path)
                    ];
                }

                // Actualizar PQRS con adjuntos y directorio.
                $pqrsd->update([
                    'adjuntos' => json_encode($attachments),
                    'directorio' => $directoryPath,
                ]);
            }

            // Preparar datos para emails (consulta modelos para nombres).
            $empresa       = EmpresaWeb::find($pqrsdData['empresa_web_id'])->razon_social;
            $tipoPqrs      = TipoPqrs::find($validated['tipoPqrs']);

            // Si NO es anónimo, preparar datos completos del denunciante
            if (!$esAnonimo) {
                $tipoId = TipoIdentificacion::find($validated['tipoId'])->abreviatura;
                $departamento = Departamento::find($validated['dpto'])->f012_descripcion;
                $ciudad = Ciudad::where('f013_id_depto', $validated['dpto'])
                    ->where('f013_id', $validated['ciudad'])
                    ->first()
                    ->f013_descripcion;
                $nombreCompleto = trim($validated['nombre'] . ' ' . $validated['apellido']);
            }

            // Construir emailData según si es anónimo o no
            $emailData = [
                'id' => $pqrsd->id,
                'radicado' => $radicado,
                'empresa' => $empresa,
                'tipo_pqrs' => $tipoPqrs->nombre,
                'letra_pqrs' => $tipoPqrs->abreviatura,
                'anonimo' => $esAnonimo,
                'mensaje' => $validated['mensaje'],
                'tiene_adjuntos' => !empty($attachments),
                'cantidad_adjuntos' => count($attachments),
                'fecha' => now()->format('Y-m-d H:i:s')
            ];

            // Agregar datos personales solo si NO es anónimo
            if (!$esAnonimo) {
                $emailData += [
                    'nombre_completo' => $nombreCompleto,
                    'tipo_documento' => $tipoId,
                    'numero_documento' => $validated['numId'],
                    'correo' => $validated['correo'],
                    'telefono' => $validated['telefono'],
                    'ubicacion' => "{$ciudad}, {$departamento}",
                    'direccion' => $validated['direccion'] ?? 'No especificada',
                    'relacion' => ucfirst($validated['relacion']),
                ];
            }

            // Determinar destinatarios según relación con la empresa
            $destinatarios = $this->getDestinatarios($validated['relacion'] ?? null);

            // Enviar correo al área responsable con adjuntos
            Mail::to($destinatarios['principal'])
                ->bcc($destinatarios['copia'])
                ->send(new PQRSDFormMail($emailData, $attachments));

            // Enviar confirmación al denunciante SOLO si NO es anónimo
            if (!$esAnonimo) {
                Mail::to($validated['correo'])
                    ->bcc(['desarrollo01@inversionesarar.com'])
                    ->send(new PQRSDConfirmationMail([
                        'nombre' => $validated['nombre'],
                        'apellido' => $validated['apellido'],
                        'radicado' => $radicado,
                        'tipo_pqrs' => $tipoPqrs->nombre,
                        'letra_pqrs' => $tipoPqrs->abreviatura,
                    ]));
            }

            DB::commit();

            return response()->json([
                'message' => '¡PQRSD enviada correctamente!',
                'radicado' => $radicado
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            // Eliminar archivos si hubo error
            if (isset($directoryPath)) {
                Storage::disk('public')->deleteDirectory($directoryPath);
            }

            // Log del error para debugging
            \Log::error('Error en PQRSD: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al enviar la PQRSD. Por favor intenta más tarde.'
            ], 500);
        }
    }


    /**
     * BLOQUE: Método getDestinatarios - Determina emails según relación.
     * 
     * Lógica: Empleados van a control interno, otros a jurídico/desarrollo.
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
                'copia' => [],
                'principal' => 'desarrollo01@inversionesarar.com',
            ];
        }

        // Para otros casos (cliente, proveedor, otro)
        return [
            // 'principal' => 'juridico01@inversionesarar.com',
            // 'copia' => ['controlinterno@inversionesarar.com'],
            'copia' => [],
            'principal' => 'desarrollo01@inversionesarar.com',
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
