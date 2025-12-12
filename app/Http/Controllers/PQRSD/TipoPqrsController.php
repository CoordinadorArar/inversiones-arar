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
 * Maneja vista única con listado y formulario, operaciones CRUD (crear, leer, actualizar, eliminar),
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 * Maneja una pestaña: Tipos de PQRS.
 *
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class TipoPqrsController extends Controller
{
    /**
     * ID fijo del módulo "Tablas Maestras".
     * Se usa para obtener pestañas y nombre del módulo.
     *
     * @var int
     */
    protected int $moduloId = 8;

    /**
     * ID fijo de la pestaña "Tipos de PQRS".
     * Se usa para obtener permisos específicos de esta pestaña.
     *
     * @var int
     */
    protected int $pestanaId = 6;

    /**
     * Rol del usuario autenticado.
     * Contiene la lógica de permisos por pestaña.
     *
     * @var mixed
     */
    protected $rol;

    /**
     * Pestañas accesibles del módulo según el rol.
     *
     * @var mixed
     */
    protected $tabs;

    /**
     * Nombre del módulo cargado desde base de datos.
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
        // Obtiene el rol del usuario logueado.
        $this->rol = Auth::user()->rol;

        // Obtiene pestañas accesibles del módulo para el rol (método en modelo Rol).
        $this->tabs = $this->rol->getPestanasModulo($this->moduloId);

        // Obtiene nombre del módulo por ID.
        $this->moduloNombre = Modulo::find($this->moduloId)->nombre;
    }

    /**
     * Muestra la vista de tipos de PQRS en React via Inertia.
     * Renderiza el componente 'TiposPQRS' con tipos ordenados, pestañas, permisos y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        // Obtiene permisos específicos de la pestaña 6 (Tipos de PQRS) para el rol.
        $permisos = $this->rol->getPermisosPestana($this->pestanaId);

        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:AdministracionWeb/TablasMaestras/pages/TiposPQRS', [
            'tabs' => $this->tabs,
            'tipos' => TipoPqrs::orderByDesc('id')->get(),
            'moduloNombre' => $this->moduloNombre,
            'permisos' => $permisos,
        ]);
    }

    /**
     * Crea un nuevo tipo de PQRS en la base de datos.
     * Valida permisos y retorna respuesta JSON.
     *
     * @param TipoPqrsRequest $request Solicitud con datos validados para crear el tipo.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function store(TipoPqrsRequest $request)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'crear')) {
                return response()->json([
                    'error' => 'No tienes permiso para crear tipos de PQRS'
                ], 403);
            }

            $validated = $request->validated();

            // Crear tipo de PQRS.
            $tipo = TipoPqrs::create($validated);

            return response()->json([
                'message' => 'Tipo de PQRS creado correctamente',
                'tipo' => $tipo,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error al crear tipo de PQRS: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al crear el tipo de PQRS. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Actualiza un tipo de PQRS existente en la base de datos.
     * Valida permisos y retorna respuesta JSON.
     *
     * @param TipoPqrsRequest $request Solicitud con datos validados para actualizar.
     * @param int $id ID del tipo de PQRS a actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function update(TipoPqrsRequest $request, int $id)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'editar')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar tipos de PQRS'
                ], 403);
            }

            $tipoPqrs = TipoPqrs::findOrFail($id);
            $validated = $request->validated();

            // Actualizar tipo de PQRS.
            $tipoPqrs->update($validated);

            return response()->json([
                'message' => 'Tipo de PQRS actualizado correctamente',
                'tipo' => $tipoPqrs->fresh(),
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar tipo de PQRS: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al actualizar el tipo de PQRS. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Elimina un tipo de PQRS de la base de datos (soft delete).
     * Valida permisos y retorna respuesta JSON.
     *
     * @param int $id ID del tipo de PQRS a eliminar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function destroy(int $id)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'eliminar')) {
                return response()->json([
                    'error' => 'No tienes permiso para eliminar tipos de PQRS'
                ], 403);
            }

            $tipoPqrs = TipoPqrs::findOrFail($id);

            // Soft delete.
            $tipoPqrs->delete();

            return response()->json([
                'message' => 'Tipo de PQRS eliminado correctamente',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al eliminar tipo de PQRS: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al eliminar el tipo de PQRS. Por favor intenta más tarde.'
            ], 500);
        }
    }
}