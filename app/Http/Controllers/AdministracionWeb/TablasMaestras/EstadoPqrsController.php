<?php

namespace App\Http\Controllers\AdministracionWeb\TablasMaestras;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdministracionWeb\EstadoPqrsRequest;
use App\Models\GestionModulos\Modulo;
use App\Models\PQRSD\EstadoPqrs;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador para gestionar estados de PQRS en el módulo de Administración Web.
 * Maneja vista única con listado y formulario, operaciones CRUD (crear, leer, actualizar, eliminar),
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 * Maneja una pestaña: Estados de PQRS.
 *
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class EstadoPqrsController extends Controller
{
    /**
     * ID fijo del módulo "Tablas Maestras".
     * Se usa para obtener pestañas y nombre del módulo.
     *
     * @var int
     */
    protected int $moduloId = 8;

    /**
     * ID fijo de la pestaña "Estados de PQRS".
     * Se usa para obtener permisos específicos de esta pestaña.
     *
     * @var int
     */
    protected int $pestanaId = 7;

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
     * Muestra la vista de estados de PQRS en React via Inertia.
     * Renderiza el componente 'EstadosPQRS' con estados ordenados, pestañas, permisos y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        // Obtiene permisos específicos de la pestaña 7 (Estados de PQRS) para el rol.
        $permisos = $this->rol->getPermisosPestana($this->pestanaId);

        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:AdministracionWeb/TablasMaestras/pages/EstadosPQRS', [
            'tabs' => $this->tabs,
            'estados' => EstadoPqrs::orderByDesc('id')->get(),
            'moduloNombre' => $this->moduloNombre,
            'permisos' => $permisos,
        ]);
    }

    /**
     * Crea un nuevo estado de PQRS en la base de datos.
     * Valida permisos y retorna respuesta JSON.
     *
     * @param EstadoPqrsRequest $request Solicitud con datos validados para crear el estado.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function store(EstadoPqrsRequest $request)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'crear')) {
                return response()->json([
                    'error' => 'No tienes permiso para crear estados de PQRS'
                ], 403);
            }

            $validated = $request->validated();

            // Crear estado de PQRS.
            $estado = EstadoPqrs::create($validated);

            return response()->json([
                'message' => 'Estado de PQRS creado correctamente',
                'tipo' => $estado,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error al crear estado de PQRS: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al crear el estado de PQRS. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Actualiza un estado de PQRS existente en la base de datos.
     * Valida permisos y retorna respuesta JSON.
     *
     * @param EstadoPqrsRequest $request Solicitud con datos validados para actualizar.
     * @param int $id ID del estado de PQRS a actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function update(EstadoPqrsRequest $request, int $id)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'editar')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar estados de PQRS'
                ], 403);
            }

            $estadoPqrs = EstadoPqrs::findOrFail($id);
            $validated = $request->validated();

            // Actualizar estado de PQRS.
            $estadoPqrs->update($validated);

            return response()->json([
                'message' => 'Estado de PQRS actualizado correctamente',
                'tipo' => $estadoPqrs->fresh(),
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar estado de PQRS: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al actualizar el estado de PQRS. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Elimina un estado de PQRS de la base de datos (soft delete).
     * Valida permisos y retorna respuesta JSON.
     *
     * @param int $id ID del estado de PQRS a eliminar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function destroy(int $id)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'eliminar')) {
                return response()->json([
                    'error' => 'No tienes permiso para eliminar estados de PQRS'
                ], 403);
            }

            $estadoPqrs = EstadoPqrs::findOrFail($id);

            // Soft delete.
            $estadoPqrs->delete();

            return response()->json([
                'message' => 'Estado de PQRS eliminado correctamente',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al eliminar estado de PQRS: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al eliminar el estado de PQRS. Por favor intenta más tarde.'
            ], 500);
        }
    }
}