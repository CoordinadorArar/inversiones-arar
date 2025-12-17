<?php

namespace App\Http\Controllers;

use App\Http\Requests\SeguridadAcceso\RolRequest;
use App\Models\Rol;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador para gestión de Roles.
 * Maneja vistas de listado y operaciones CRUD (crear, leer, actualizar, eliminar),
 * integrándose con React via Inertia y verificando permisos por módulo.
 * 
 * @author Yariangel Aray
 * @date 2025-12-17
 */
class RolController extends Controller
{
    /**
     * ID fijo del módulo Roles (no cambia).
     * Usado para acceder a datos relacionados con el módulo.
     *
     * @var int
     */
    protected int $moduloId = 10;

    /**
     * Rol del usuario autenticado (cargado en constructor).
     * Contiene el objeto rol para acceder a permisos.
     *
     * @var mixed
     */
    protected $rol;

    /**
     * Permisos del usuario en el módulo (cargado en constructor).
     * Lista de permisos para validar acciones.
     *
     * @var mixed
     */
    protected $permisos;

    /**
     * Nombre del módulo (para pasar a vistas).
     * Nombre del módulo usado en las vistas de Inertia.
     *
     * @var string
     */
    protected $moduloNombre;

    /**
     * Constructor: Inicializa propiedades con datos del usuario autenticado.
     * Carga rol, permisos y nombre del módulo para usar en métodos.
     * Se ejecuta automáticamente al instanciar el controlador.
     */
    public function __construct()
    {
        $this->rol = Auth::user()->rol;
        $this->permisos = $this->rol->getPermisosModulo($this->moduloId);
        $this->moduloNombre = 'Roles';
    }

    /**
     * Muestra la vista principal de roles en React via Inertia.
     * Renderiza el componente 'Roles' con lista de roles, permisos y flags de acceso a control de accesos.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        $roles = Rol::orderByDesc('id')->get();

        // Verificar si el usuario tiene el módulo Control de Accesos asignado.
        $tieneControlAccesos = $this->rol->modulos()->where('modulos.id', 15)->exists();

        // Verificar pestañas específicas.
        $tieneAccesosModulos = $this->rol->pestanas()->where('pestanas.id', 10)->exists();
        $tieneAccesosPestanas = $this->rol->pestanas()->where('pestanas.id', 11)->exists();

        return Inertia::render('Modulos:SeguridadAcceso/Roles/Roles', [
            'roles' => $roles,
            'moduloNombre' => $this->moduloNombre,
            'permisos' => $this->permisos,
            'tieneControlAccesos' => $tieneControlAccesos,
            'tieneAccesosModulos' => $tieneAccesosModulos,
            'tieneAccesosPestanas' => $tieneAccesosPestanas,
        ]);
    }

    /**
     * Crea un nuevo rol en la base de datos.
     * Valida permisos y retorna respuesta JSON.
     *
     * @param RolRequest $request Solicitud con datos validados para crear el rol.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function store(RolRequest $request)
    {
        if (!in_array('crear', $this->permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para crear roles'
            ], 403);
        }

        $validated = $request->validated();

        try {
            $rol = Rol::create([
                'nombre' => $validated['nombre'],
                'abreviatura' => $validated['abreviatura'],
            ]);

            return response()->json([
                'message' => 'Rol creado correctamente',
                'rol' => $rol,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error creando rol: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al crear el rol'
            ], 500);
        }
    }

    /**
     * Actualiza un rol existente en la base de datos.
     * Valida permisos y retorna respuesta JSON.
     *
     * @param RolRequest $request Solicitud con datos validados para actualizar.
     * @param int $id ID del rol a actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function update(RolRequest $request, int $id)
    {
        try {
            if (!$this->rol->tienePermisoModulo($this->moduloId, 'editar')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar roles'
                ], 403);
            }

            $validated = $request->validated();

            $rol = Rol::findOrFail($id);

            $rol->update($validated);

            return response()->json([
                'message' => 'Rol actualizado correctamente',
                'rol' => $rol->fresh(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error actualizando rol: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error al actualizar el rol'
            ], 500);
        }
    }

    /**
     * Elimina un rol de la base de datos (soft delete).
     * Valida permisos y verifica que no tenga usuarios asignados.
     *
     * @param Rol $rol Instancia del rol a eliminar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function destroy(int $id)
    {
        // Aquí se verifica si el usuario tiene permiso para eliminar roles.
        if (!in_array('eliminar', $this->permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para eliminar roles'
            ], 403);
        }
        
        
        try {
            $rol = Rol::findOrFail($id);

            // Aquí se cuenta la cantidad de usuarios asignados al rol.
            $usuarios = $rol->usuarios()->count();

            // Aquí se verifica si hay usuarios asignados; si sí, no permite eliminar.
            if ($usuarios > 0) {
                return response()->json([
                    'error' => 'No se puede eliminar el rol porque tiene ' . $usuarios . ' usuario(s) asignado(s)'
                ], 400);
            }

            // Aquí se elimina el rol si no hay usuarios asignados.
            $rol->delete();

            return response()->json([
                'message' => 'Rol eliminado correctamente',
            ]);
        } catch (\Exception $e) {
            // Aquí se registra el error en logs y retorna error genérico.
            \Log::error('Error eliminando rol: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al eliminar el rol'
            ], 500);
        }
    }
}
