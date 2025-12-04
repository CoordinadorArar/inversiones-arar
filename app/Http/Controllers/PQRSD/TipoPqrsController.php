<?php

namespace App\Http\Controllers\PQRSD;

use App\Http\Controllers\Controller;
use App\Models\PQRSD\TipoPqrs;
use App\Http\Requests\AdministracionWeb\TipoPqrsRequest;
use App\Models\GestionModulos\Modulo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador para gestionar tipos de PQRS en el módulo de Administración Web.
 * Maneja operaciones CRUD (crear, leer, actualizar, eliminar) para tipos de PQRS,
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 *
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class TipoPqrsController extends Controller
{
    /**
     * ID fijo del módulo Tablas Maestras (no cambia).
     */
    protected int $moduloId = 8;

    /**
     * ID fijo de la pestaña Tipos de PQRS (no cambia).
     */
    protected int $pestanaId = 6;

    /**
     * Rol del usuario autenticado (cargado en constructor).
     * Contiene el objeto rol para acceder a permisos y pestañas.
     */
    protected $rol;

    /**
     * Pestañas accesibles del módulo para el rol (array de pestañas).
     * Lista de pestañas que el usuario puede ver según su rol.
     */
    protected $tabs;

    /**
     * Nombre del módulo (para pasar a vistas).
     * Nombre del módulo obtenido de la base de datos, usado en las vistas de Inertia.
     */
    protected $moduloNombre;

    /**
     * Constructor: Inicializa propiedades con datos del usuario autenticado.
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
     * Muestra la lista de tipos de PQRS en la vista de React via Inertia.
     * Recupera todos los tipos ordenados por ID descendente, junto con pestañas, permisos y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        $permisos = $this->rol->getPermisosPestana($this->pestanaId);

        return Inertia::render('Modulos:AdministracionWeb/TablasMaestras/pages/TiposPQRS', [
            'tabs' => $this->tabs,
            'tipos' => TipoPqrs::orderByDesc('id')->get(),
            'moduloNombre' => $this->moduloNombre,
            'permisos' => $permisos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TipoPqrsRequest $request)
    {
        try {
            // Verificar permiso
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'crear')) {
                return response()->json([
                    'error' => 'No tienes permiso para crear tipos de pqrs'
                ], 403);
            }

            // Obtener solo datos validados
            $validated = $request->validated();
            // Crear el tipo
            $tipo = TipoPqrs::create($validated);

            return response()->json([
                'message' => 'Tipo de pqrs creado correctamente',
                'tipo' => $tipo,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear el tipo de pqrs',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TipoPqrsRequest $request, int $id)
    {
        try {
            // Verificar permiso
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'crear')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar tipos de pqrs'
                ], 403);
            }

            $tipoPqrs = TipoPqrs::findOrFail($id);
            // Obtener solo datos validados
            $validated = $request->validated();

            // Actualizar el tipo
            $tipoPqrs->update($validated);

            return response()->json([
                'message' => 'Tipo de pqrs actualizado correctamente',
                'tipo' => $tipoPqrs->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar el tipo de pqrs',
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
                    'error' => 'No tienes permiso para eliminar tipos de pqrs'
                ], 403);
            }

            $tipoPqrs = TipoPqrs::findOrFail($id);
            // Soft delete
            $tipoPqrs->delete();

            return response()->json([
                'message' => 'Tipo de pqrs eliminado correctamente',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar el tipo de pqrs',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
