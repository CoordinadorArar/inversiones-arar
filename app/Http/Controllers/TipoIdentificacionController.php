<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdministracionWeb\TipoIdentificacionRequest;
use App\Models\TipoIdentificacion;
use App\Models\GestionModulos\Modulo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TipoIdentificacionController extends Controller
{

    // ID fijo del módulo Empresas (no cambia).
    protected int $moduloId = 8;

    // ID fijo de la pestaña Tipos de Identificaciones (no cambia).
    protected int $pestanaId = 5;

    // Rol del usuario autenticado (cargado en constructor).
    protected $rol;

    // Pestañas accesibles del módulo para el rol (array de pestañas).
    protected $tabs;

    // Nombre del módulo (para pasar a vistas).
    protected $moduloNombre;

    /**
     * Constructor: Inicializa propiedades con datos del usuario autenticado.
     * 
     * Carga rol, pestañas accesibles y nombre del módulo para usar en métodos.
     * Se ejecuta automáticamente al instanciar el controlador.
     */
    public function __construct()
    {
        // Obtiene el rol del usuario logueado.
        $this->rol = Auth::user()->rol;

        // Obtiene pestañas accesibles del módulo para el rol (método en modelo Rol).
        $this->tabs = $this->rol->getPestanasModulo($this->moduloId);

        // Obtiene nombre del módulo por ID.
        $this->moduloNombre = Modulo::find($this->moduloId)->nombre;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permisos = $this->rol->getPermisosPestana($this->pestanaId);

        return Inertia::render('Modulos:AdministracionWeb/TablasMaestras/pages/TiposIdentificaciones', [
            'tabs' => $this->tabs,
            'tipos' => TipoIdentificacion::orderByDesc('id')->get(),
            'moduloNombre' => $this->moduloNombre,
            'permisos' => $permisos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TipoIdentificacionRequest $request)
    {
        try {
            // Verificar permiso
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'crear')) {
                return response()->json([
                    'error' => 'No tienes permiso para crear tipos de identificación'
                ], 403);
            }

            // Obtener solo datos validados
            $validated = $request->validated();
            // Crear el tipo
            $tipo = TipoIdentificacion::create($validated);

            return response()->json([
                'message' => 'Tipo de identificación creado correctamente',
                'tipo' => $tipo,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear el tipo de identificación',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TipoIdentificacionRequest $request, int $id)
    {
        try {
            // Verificar permiso
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'crear')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar tipos de identificación'
                ], 403);
            }

            $tipoIdentificacion = TipoIdentificacion::findOrFail($id);
            // Obtener solo datos validados
            $validated = $request->validated();

            // Actualizar el tipo
            $tipoIdentificacion->update($validated);

            return response()->json([
                'message' => 'Tipo de identificación actualizado correctamente',
                'tipo' => $tipoIdentificacion->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar el tipo de identificación',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try {
            // Verificar permiso
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'eliminar')) {
                return response()->json([
                    'error' => 'No tienes permiso para eliminar tipos de identificación'
                ], 403);
            }

            $tipoIdentificacion = TipoIdentificacion::findOrFail($id);
            // Soft delete
            $tipoIdentificacion->delete();

            return response()->json([
                'message' => 'Tipo de identificación eliminado correctamente',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar el tipo de identificación',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
