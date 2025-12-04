<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdministracionWeb\TipoIdentificacionRequest;
use App\Models\TipoIdentificacion;
use App\Models\GestionModulos\Modulo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador para gestionar tipos de identificación en el módulo de Administración Web.
 * Maneja operaciones CRUD (crear, leer, actualizar, eliminar) para tipos de identificación,
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 *
 * @author Yariangel Aray
 * @date 2025-12-03
 */
class TipoIdentificacionController extends Controller
{
    /**
     * ID fijo del módulo Tablas Maestras (no cambia).
     */
    protected int $moduloId = 8;

    /**
     * ID fijo de la pestaña Tipos de Identificaciones (no cambia).
     */
    protected int $pestanaId = 5;

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
     * Muestra la lista de tipos de identificación en la vista de React via Inertia.
     * Recupera todos los tipos ordenados por ID descendente, junto con pestañas, permisos y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
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
     * Crea un nuevo tipo de identificación en la base de datos.
     * Valida los datos con TipoIdentificacionRequest, verifica permisos y maneja errores.
     *
     * @param TipoIdentificacionRequest $request Solicitud con datos validados para crear el tipo.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
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
     * Actualiza un tipo de identificación existente en la base de datos.
     * Valida los datos con TipoIdentificacionRequest, verifica permisos y maneja errores.
     *
     * @param TipoIdentificacionRequest $request Solicitud con datos validados para actualizar.
     * @param int $id ID del tipo de identificación a actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
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
     * Elimina un tipo de identificación de la base de datos (soft delete).
     * Verifica permisos y maneja errores.
     *
     * @param int $id ID del tipo de identificación a eliminar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
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
