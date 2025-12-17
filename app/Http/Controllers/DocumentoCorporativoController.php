<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecursosHumanos\DocumentoCorporativoRequest;
use App\Models\DocumentoCorporativo;
use App\Models\GestionModulos\Modulo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/**
 * Controlador para gestionar documentos corporativos.
 * Maneja vistas de listado y gestión, operaciones CRUD (crear, leer, actualizar, eliminar),
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 * Maneja dos pestañas: Listado y Gestión.
 *
 * @author Yariangel Aray
 * @date 2025-12-15
 */
class DocumentoCorporativoController extends Controller
{
    /**
     * ID fijo del módulo Documentos Corporativos (no cambia).
     * Usado para acceder a datos relacionados con el módulo.
     *
     * @var int
     */
    protected int $moduloId = 13;

    /**
     * Rol del usuario autenticado (cargado en constructor).
     * Contiene el objeto rol para acceder a permisos y pestañas.
     *
     * @var mixed
     */
    protected $rol;

    /**
     * Pestañas accesibles del módulo para el rol (array de pestañas).
     * Lista de pestañas que el usuario puede ver según su rol.
     *
     * @var mixed
     */
    protected $tabs;

    /**
     * Nombre del módulo (para pasar a vistas).
     * Nombre del módulo obtenido de la base de datos, usado en las vistas de Inertia.
     *
     * @var mixed
     */
    protected $moduloNombre;

    /**
     * Constructor: Inicializa propiedades con datos del usuario autenticado.
     * Carga rol, pestañas accesibles y nombre del módulo para usar en métodos.
     * Se ejecuta automáticamente al instanciar el controlador.
     */
    public function __construct()
    {
        $this->rol = Auth::user()?->rol;
        $this->tabs = $this->rol?->getPestanasModulo($this->moduloId);
        $this->moduloNombre = Modulo::find($this->moduloId)->nombre;
    }

    /**
     * Muestra la vista de listado de documentos en React via Inertia.
     * Renderiza el componente 'Listado' con documentos ordenados, pestañas y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
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
     * Muestra la vista de gestión de documentos en React via Inertia.
     * Renderiza el componente 'Gestion' con documentos (si tiene permiso de editar), permisos de la pestaña 17 y datos del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function gestion()
    {
        // Obtiene permisos específicos de la pestaña 17 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(17);

        // Si puede editar, enviar documentos; si no, array vacío.
        $documentos = in_array('editar', $permisos) ? $this->getDocumentosCacheados() : [];

        // Renderiza vista Inertia con datos.
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
     * Vista: Gestión - Modo crear.
     * Renderiza la misma vista pero con el formulario en modo crear.
     * URL: /gestion/crear.
     *
     * @return \Inertia\Response Respuesta de Inertia con vista en modo crear.
     */
    public function create()
    {
        $permisos = $this->rol->getPermisosPestana(17);

        if (!in_array('eliminar', $permisos)) {
            // Retorna la vista de gestión con un error adicional.
            return $this->gestion()->with('error', 'No tienes permiso para eliminar documentos');
        }

        $documentos = in_array('editar', $permisos)
            ? $this->getDocumentosCacheados()
            : [];

        // Renderiza vista Inertia con datos.
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
     * Vista: Gestión - Modo editar.
     * Renderiza la misma vista pero con el formulario en modo editar.
     * URL: /gestion/{id}.
     *
     * @param int $id ID del documento a editar.
     * @return \Inertia\Response Respuesta de Inertia con vista en modo editar.
     */
    public function edit(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(17);

        if (!in_array('editar', $permisos)) {
            // Retorna la vista de gestión con un error adicional.
            return $this->gestion()->with('error', 'No tienes permiso para editar documentos');
        }

        // Verificar que el documento existe.
        $documento = DocumentoCorporativo::find($id);
        if (!$documento) {
            // Retorna la vista de gestión con un error adicional.
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
     * Crea un nuevo documento en la base de datos.
     * Valida permisos, maneja subida de archivo y retorna respuesta JSON.
     *
     * @param DocumentoCorporativoRequest $request Solicitud con datos validados para crear el documento.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function store(DocumentoCorporativoRequest $request)
    {
        if (!$this->rol->tienePermisoPestana(17, 'eliminar')) {
            return response()->json([
                'error' => 'No tienes permiso para eliminar documentos'
            ], 403);
        }

        try {
            $validated = $request->validated();

            // Manejar archivo: Subir y guardar ruta.
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

            // Invalidar cache después de crear.
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
     * Actualiza un documento existente en la base de datos.
     * Valida permisos, maneja subida de archivo (eliminando anterior si existe) y retorna respuesta JSON.
     *
     * @param DocumentoCorporativoRequest $request Solicitud con datos validados para actualizar.
     * @param int $id ID del documento a actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function update(DocumentoCorporativoRequest $request, int $id)
    {
        if (!$this->rol->tienePermisoPestana(17, 'editar')) {
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

            // Manejar archivo si existe: Eliminar anterior y subir nuevo.
            if ($request->hasFile('archivo')) {
                // Eliminar archivo anterior si existe.
                if (Storage::disk('public')->exists($documento->ruta)) {
                    Storage::disk('public')->delete($documento->ruta);
                }

                // Guardar nuevo archivo.
                $archivo = $request->file('archivo');
                $nombreOriginal = $archivo->getClientOriginalName();
                $data['ruta'] = $archivo->storeAs('documentos_corporativos', time() . '_' . $nombreOriginal, 'public');
            }

            $documento->update($data);
            // Invalidar cache después de actualizar.
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
     * Elimina un documento de la base de datos (soft delete).
     * Valida permisos y retorna respuesta JSON.
     *
     * @param int $id ID del documento a eliminar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function destroy(int $id)
    {
        if (!$this->rol->tienePermisoPestana(17, 'eliminar')) {
            return response()->json([
                'error' => 'No tienes permiso para eliminar documentos'
            ], 403);
        }

        try {
            $documento = DocumentoCorporativo::findOrFail($id);

            $documento->delete();
            // Invalidar cache después de eliminar.
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

    /**
     * Método auxiliar para obtener documentos cacheados.
     * Cachea por 5 minutos para evitar consultas repetidas.
     *
     * @return array Lista de documentos formateados.
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
}
