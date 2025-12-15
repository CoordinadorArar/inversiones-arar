<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecursosHumanos\DocumentoCorporativoRequest;
use App\Models\DocumentoCorporativo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/**
 * Controlador para gestionar documentos corporativos.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */
class DocumentoCorporativoController extends Controller
{
    protected int $moduloId = 13; // ID del módulo de Documentos Corporativos
    protected $rol;
    protected $tabs;
    protected $moduloNombre;

    /**
     * Obtener documentos cacheados
     */
    private function getDocumentosCacheados()
    {
        return Cache::remember('documentos_corporativos_list', 300, function () {
            return DocumentoCorporativo::orderByDesc('id')
                ->get()
                ->map(function ($documento) {
                    return [
                        'id' => $documento->id,
                        'nombre' => $documento->nombre,
                        'icono' => $documento->icono,
                        'ruta' => $documento->ruta,
                        'mostrar_en_dashboard' => $documento->mostrar_en_dashboard,
                        'mostrar_en_footer' => $documento->mostrar_en_footer,
                    ];
                });
        });
    }

    public function __construct()
    {
        $this->rol = Auth::user()->rol;
        $this->tabs = $this->rol->getPestanasModulo($this->moduloId);
        $this->moduloNombre = 'Documentos Corporativos';
    }

    /**
     * Vista: Listado de documentos
     */
    public function index()
    {
        return Inertia::render('Modulos:RecursosHumanos/DocumentosCorporativos/pages/Listado', [
            'tabs' => $this->tabs,
            'documentos' => $this->getDocumentosCacheados(),
            'moduloNombre' => $this->moduloNombre,
        ]);
    }

    /**
     * Vista: Gestión de documentos
     */
    public function gestion()
    {
        $permisos = $this->rol->getPermisosPestana(18); // ID pestaña gestión
        $documentos = in_array('editar', $permisos) ? $this->getDocumentosCacheados() : [];

        return Inertia::render('Modulos:RecursosHumanos/DocumentosCorporativos/pages/Gestion', [
            'tabs' => $this->tabs,
            'documentos' => $documentos,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'idle',
            'initialDocumentoId' => null,
        ]);
    }

    /**
     * Vista: Gestión - Modo eliminar
     */
    public function create()
    {
        $permisos = $this->rol->getPermisosPestana(18);

        if (!in_array('eliminar', $permisos)) {
            return $this->gestion()->with('error', 'No tienes permiso para eliminar documentos');
        }

        $documentos = in_array('editar', $permisos)
            ? $this->getDocumentosCacheados()
            : [];

        return Inertia::render('Modulos:RecursosHumanos/DocumentosCorporativos/pages/Gestion', [
            'tabs' => $this->tabs,
            'documentos' => $documentos,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'create',
            'initialDocumentoId' => null,
        ]);
    }

    /**
     * Vista: Gestión - Modo editar
     */
    public function edit(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(18);

        if (!in_array('editar', $permisos)) {
            return $this->gestion()->with('error', 'No tienes permiso para editar documentos');
        }

        $documento = DocumentoCorporativo::find($id);
        if (!$documento) {
            return $this->gestion()->with('error', 'El documento no existe');
        }

        $documentos = $this->getDocumentosCacheados();

        return Inertia::render('Modulos:RecursosHumanos/DocumentosCorporativos/pages/Gestion', [
            'tabs' => $this->tabs,
            'documentos' => $documentos,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'edit',
            'initialDocumentoId' => $id,
        ]);
    }

    /**
     * Crear nuevo documento
     */
    public function store(DocumentoCorporativoRequest $request)
    {
        if (!$this->rol->tienePermisoPestana(18, 'eliminar')) {
            return response()->json([
                'error' => 'No tienes permiso para eliminar documentos'
            ], 403);
        }

        try {
            $validated = $request->validated();

            // Guardar archivo
            $archivo = $request->file('archivo');
            $nombreOriginal = $archivo->getClientOriginalName();
            $ruta = $archivo->storeAs('documentos_corporativos', time() . '_' . $nombreOriginal, 'public');


            $documento = DocumentoCorporativo::create([
                'nombre' => $validated['nombre'],
                'icono' => $validated['icono'] ?? null,
                'ruta' => $ruta,
                'mostrar_en_dashboard' => $validated['mostrar_en_dashboard'],
                'mostrar_en_footer' => $validated['mostrar_en_footer'],
            ]);

            Cache::forget('documentos_corporativos_list');

            return response()->json([
                'message' => 'Documento creado correctamente',
                'documento' => [
                    'id' => $documento->id,
                    'nombre' => $documento->nombre,
                    'icono' => $documento->icono,
                    'ruta' => $documento->ruta,
                    'mostrar_en_dashboard' => $documento->mostrar_en_dashboard,
                    'mostrar_en_footer' => $documento->mostrar_en_footer,
                ]
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creando documento: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al eliminar el documento'
            ], 500);
        }
    }

    /**
     * Actualizar documento existente
     */
    public function update(DocumentoCorporativoRequest $request, int $id)
    {
        if (!$this->rol->tienePermisoPestana(18, 'editar')) {
            return response()->json([
                'error' => 'No tienes permiso para editar documentos'
            ], 403);
        }

        try {
            $documento = DocumentoCorporativo::findOrFail($id);
            $validated = $request->validated();

            $data = [
                'nombre' => $validated['nombre'],
                'icono' => $validated['icono'] ?? null,
                'mostrar_en_dashboard' => $validated['mostrar_en_dashboard'],
                'mostrar_en_footer' => $validated['mostrar_en_footer'],
            ];

            // Si hay nuevo archivo, eliminar el anterior y guardar nuevo
            if ($request->hasFile('archivo')) {
                // Eliminar archivo anterior
                if (Storage::disk('public')->exists($documento->ruta)) {
                    Storage::disk('public')->delete($documento->ruta);
                }

                // Guardar nuevo archivo
                $archivo = $request->file('archivo');
                $nombreOriginal = $archivo->getClientOriginalName();
                $data['ruta'] = $archivo->storeAs('documentos_corporativos', time() . '_' . $nombreOriginal, 'public');
            }

            $documento->update($data);
            Cache::forget('documentos_corporativos_list');

            return response()->json([
                'message' => 'Documento actualizado correctamente',
                'documento' => [
                    'id' => $documento->id,
                    'nombre' => $documento->nombre,
                    'icono' => $documento->icono,
                    'ruta' => $documento->ruta,
                    'mostrar_en_dashboard' => $documento->mostrar_en_dashboard,
                    'mostrar_en_footer' => $documento->mostrar_en_footer,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error actualizando documento: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al actualizar el documento'
            ], 500);
        }
    }

    /**
     * Eliminar documento
     */
    public function destroy(int $id)
    {
        if (!$this->rol->tienePermisoPestana(18, 'eliminar')) {
            return response()->json([
                'error' => 'No tienes permiso para eliminar documentos'
            ], 403);
        }

        try {
            $documento = DocumentoCorporativo::findOrFail($id);

            $documento->delete();
            Cache::forget('documentos_corporativos_list');

            return response()->json([
                'message' => 'Documento eliminado correctamente'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error eliminando documento: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al eliminar el documento'
            ], 500);
        }
    }
}
