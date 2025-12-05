<?php

namespace App\Http\Controllers\PQRSD;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdministracionWeb\EstadoPqrsRequest;
use App\Models\GestionModulos\Modulo;
use App\Models\PQRSD\EstadoPqrs;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador para gestionar estados de PQRS en el módulo de Administración Web.
 * Maneja operaciones CRUD (crear, leer, actualizar, eliminar) para estados de PQRS,
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 *
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class EstadoPqrsController extends Controller
{
    /**
     * ID fijo del módulo Tablas Maestras (no cambia).
     * Usado para acceder a datos relacionados con el módulo.
     *
     * @var int
     */
    protected int $moduloId = 8;

    /**
     * ID fijo de la pestaña Estados de PQRS (no cambia).
     * Usado para verificar permisos específicos de la pestaña.
     *
     * @var int
     */
    protected int $pestanaId = 7;

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
        // Obtiene el rol del usuario logueado.
        $this->rol = Auth::user()->rol;

        // Obtiene pestañas accesibles del módulo para el rol (método en modelo Rol).
        $this->tabs = $this->rol->getPestanasModulo($this->moduloId);

        // Obtiene nombre del módulo por ID.
        $this->moduloNombre = Modulo::find($this->moduloId)->nombre;
    }

    /**
     * Muestra la lista de estados de PQRS en la vista de React via Inertia.
     * Recupera todos los estados ordenados por ID descendente, junto con pestañas, permisos y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        $permisos = $this->rol->getPermisosPestana($this->pestanaId);

        return Inertia::render('Modulos:AdministracionWeb/TablasMaestras/pages/EstadosPQRS', [
            'tabs' => $this->tabs,
            'estados' => EstadoPqrs::orderByDesc('id')->get(),
            'moduloNombre' => $this->moduloNombre,
            'permisos' => $permisos,
        ]);
    }

    /**
     * Crea un nuevo estado de PQRS en la base de datos.
     * Valida permisos, datos con EstadoPqrsRequest y maneja errores.
     *
     * @param EstadoPqrsRequest $request Solicitud con datos validados para crear el estado.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function store(EstadoPqrsRequest $request)
    {
        try {
            // Verificar permiso
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'crear')) {
                return response()->json([
                    'error' => 'No tienes permiso para crear estados de PQRS'
                ], 403);
            }

            // Obtener solo datos validados
            $validated = $request->validated();
            // Crear el estado
            $estado = EstadoPqrs::create($validated);

            return response()->json([
                'message' => 'Estado de PQRS creado correctamente',
                'tipo' => $estado,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear el estado de PQRS',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualiza un estado de PQRS existente en la base de datos.
     * Valida permisos, datos con EstadoPqrsRequest y maneja errores.
     *
     * @param EstadoPqrsRequest $request Solicitud con datos validados para actualizar.
     * @param int $id ID del estado de PQRS a actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function update(EstadoPqrsRequest $request, int $id)
    {
        try {
            // Verificar permiso
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'crear')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar estados de PQRS'
                ], 403);
            }

            $estadoPqrs = EstadoPqrs::findOrFail($id);
            // Obtener solo datos validados
            $validated = $request->validated();

            // Actualizar el estado
            $estadoPqrs->update($validated);

            return response()->json([
                'message' => 'Estado de PQRS actualizado correctamente',
                'tipo' => $estadoPqrs->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar el estado de PQRS',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Elimina un estado de PQRS de la base de datos (soft delete).
     * Valida permisos y maneja errores.
     *
     * @param int $id ID del estado de PQRS a eliminar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function destroy(int $id)
    {
        try {
            // Verificar permiso
            if (!$this->rol->tienePermisoPestana($this->pestanaId, 'eliminar')) {
                return response()->json([
                    'error' => 'No tienes permiso para eliminar estados de pqrs'
                ], 403);
            }

            $estadoPqrs = EstadoPqrs::findOrFail($id);
            // Soft delete
            $estadoPqrs->delete();

            return response()->json([
                'message' => 'Estado de PQRS eliminado correctamente',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar el estado de pqrs',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
