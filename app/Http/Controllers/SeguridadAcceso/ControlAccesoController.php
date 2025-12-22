<?php

namespace App\Http\Controllers\SeguridadAcceso;

use App\Http\Controllers\Controller;
use App\Http\Requests\SeguridadAcceso\AsignarModuloRequest;
use App\Http\Requests\SeguridadAcceso\AsignarPestanaRequest;
use App\Models\Auditoria;
use App\Models\GestionModulos\Modulo;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * Controlador para Control de Acceso - Asignación de módulos/pestañas a roles.
 * Maneja vistas de asignación de módulos y pestañas, operaciones de asignar/desasignar con permisos,
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 * Maneja dos pestañas: Módulos y Pestañas.
 *
 * @author Yariangel Aray
 * @date 2025-12-16
 */
class ControlAccesoController extends Controller
{
    /**
     * ID fijo del módulo Control de Acceso (no cambia).
     * Usado para acceder a datos relacionados con el módulo.
     *
     * @var int
     */
    protected int $moduloId = 15;

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
        $this->rol = Auth::user()->rol;
        $this->tabs = $this->rol->getPestanasModulo($this->moduloId);
        $this->moduloNombre = Modulo::find($this->moduloId)->nombre;
    }

    /**
     * Muestra la vista de asignación de módulos a roles en React via Inertia.
     * Renderiza el componente 'AccesosModulos' con roles, módulos jerárquicos, permisos y datos del módulo.
     *
     * @param int|null $rolId ID opcional del rol seleccionado para cargar asignaciones.
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function modulos($rolId = null)
    {
        $permisos = $this->rol->getPermisosPestana(10); // ID pestaña módulos

        // Obtener todos los roles para el select.
        $roles = Rol::orderBy('nombre')->get()->map(fn($r) => [
            'id' => $r->id,
            'nombre' => $r->nombre,
        ]);

        // Obtener módulos con estructura jerárquica.
        $modulos = $this->obtenerModulosJerarquicos($rolId);

        // Permisos base del sistema.
        $permisosBase = config('permisos.base', ['crear', 'editar', 'eliminar']);

        return Inertia::render('Modulos:SeguridadAcceso/ControlAccesos/pages/AccesosModulos', [
            'tabs' => $this->tabs,
            'roles' => $roles,
            'modulos' => $modulos,
            'permisosBase' => $permisosBase,
            'selectedRolId' => $rolId,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
        ]);
    }

    /**
     * Muestra la vista de asignación de pestañas a roles en React via Inertia.
     * Renderiza el componente 'AccesosPestanas' con roles, pestañas jerárquicas, permisos y datos del módulo.
     *
     * @param int|null $rolId ID opcional del rol seleccionado para cargar asignaciones.
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function pestanas($rolId = null)
    {
        $permisos = $this->rol->getPermisosPestana(11); // ID pestaña pestañas

        // Obtener todos los roles para el select.
        $roles = Rol::orderBy('nombre')->get()->map(fn($r) => [
            'id' => $r->id,
            'nombre' => $r->nombre,
        ]);

        // Obtener pestañas con estructura jerárquica.
        $pestanas = $this->obtenerPestanasJerarquicas($rolId);

        // Permisos base del sistema.
        $permisosBase = config('permisos.base', ['crear', 'editar', 'eliminar']);

        return Inertia::render('Modulos:SeguridadAcceso/ControlAccesos/pages/AccesosPestanas', [
            'tabs' => $this->tabs,
            'roles' => $roles,
            'pestanas' => $pestanas,
            'permisosBase' => $permisosBase,
            'selectedRolId' => $rolId,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
        ]);
    }

    /**
     * Asigna o actualiza un módulo a un rol con permisos específicos.
     * Usa attach para evitar duplicados: Si NO existe la relación → la crea, Si YA existe → la actualiza (permisos), Nunca duplica registros.
     * Si el módulo tiene padre, lo asigna automáticamente sin permisos.
     *
     * @param AsignarModuloRequest $request Solicitud con datos validados.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function asignarModulo(AsignarModuloRequest $request)
    {
        $permisos = $this->rol->getPermisosPestana(10);

        $asignacionExistente = DB::table('modulo_rol')
            ->where('rol_id', $request->rol_id)
            ->where('modulo_id', $request->modulo_id)
            ->first();

        $permisoRequerido = $asignacionExistente ? 'editar' : 'crear';

        if (!in_array($permisoRequerido, $permisos)) {
            return response()->json([
                'error' => $asignacionExistente
                    ? 'No tienes permiso para editar asignaciones de módulos'
                    : 'No tienes permiso para crear asignaciones de módulos'
            ], 403);
        }

        $validated = $request->validated();

        // Preparar permisos: si está vacío, usar null.
        $permisosParaGuardar = !empty($validated['permisos']) ? json_encode($validated['permisos']) : null;

        try {
            DB::beginTransaction();

            $modulo = Modulo::findOrFail($validated['modulo_id']);
            $rol = Rol::find($validated['rol_id']);

            // Si tiene padre, asignar también al padre (sin permisos) y registrar auditoría.
            if ($modulo->modulo_padre_id) {
                // Verificar si la relación ya existe
                $padreYaAsignado = $rol->modulos()->where('modulo_id', $modulo->modulo_padre_id)->exists();
                if (!$padreYaAsignado) {
                    $rol->modulos()->attach($modulo->modulo_padre_id, ['permisos' => null]);
                    // Registrar auditoría solo si se creó
                    Auditoria::registrarSinModelo(
                        'modulo_rol',
                        "{$validated['rol_id']}-{$modulo->modulo_padre_id}",
                        'INSERT',
                        null
                    );
                }
                // Si ya existe, no hacer nada
            }

            // Asignar o actualizar el módulo con permisos.
            if ($rol->modulos()->where('modulo_id', $validated['modulo_id'])->exists()) {
                $rol->modulos()->updateExistingPivot($validated['modulo_id'], ['permisos' => $permisosParaGuardar]);
            } else {
                $rol->modulos()->attach($validated['modulo_id'], ['permisos' => $permisosParaGuardar]);
            }

            DB::commit();

            // Registrar auditoría.
            $esNuevaAsignacion = !$asignacionExistente;

            Auditoria::registrarSinModelo(
                'modulo_rol',
                "{$validated['rol_id']}-{$validated['modulo_id']}",
                $esNuevaAsignacion ? 'INSERT' : 'UPDATE',
                $esNuevaAsignacion ? null : [
                    [
                        'columna' => 'permisos',
                        'antes' => $asignacionExistente ? json_decode($asignacionExistente->permisos, true) : null,
                        'despues' => $validated['permisos'],
                    ]
                ]
            );

            return response()->json([
                'message' => 'Módulo asignado correctamente al rol',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error asignando módulo: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al asignar el módulo'
            ], 500);
        }
    }

    /**
     * Asigna o actualiza una pestaña a un rol con permisos específicos.
     * Verifica existencia para evitar duplicados: Si existe → actualiza permisos, Si no → crea.
     *
     * @param AsignarPestanaRequest $request Solicitud con datos validados.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function asignarPestana(AsignarPestanaRequest $request)
    {
        $permisos = $this->rol->getPermisosPestana(11);

        // Validar permisos.
        $asignacionExistente = DB::table('pestana_rol')
            ->where('rol_id', $request->rol_id)
            ->where('pestana_id', $request->pestana_id)
            ->first();

        $permisoRequerido = $asignacionExistente ? 'editar' : 'crear';

        if (!in_array($permisoRequerido, $permisos)) {
            return response()->json([
                'error' => $asignacionExistente
                    ? 'No tienes permiso para editar asignaciones de pestañas'
                    : 'No tienes permiso para crear asignaciones de pestañas'
            ], 403);
        }

        $validated = $request->validated();
        // Preparar permisos: si está vacío, usar null.
        $permisosParaGuardar = !empty($validated['permisos']) ? json_encode($validated['permisos']) : null;

        try {
            DB::beginTransaction();

            $rol = Rol::find($validated['rol_id']);

            // Asignar o actualizar la pestaña con permisos.
            if ($rol->pestanas()->where('pestana_id', $validated['pestana_id'])->exists()) {
                $rol->pestanas()->updateExistingPivot($validated['pestana_id'], ['permisos' => $permisosParaGuardar]);
            } else {
                $rol->pestanas()->attach($validated['pestana_id'], ['permisos' => $permisosParaGuardar]);
            }
            DB::commit();

            // Registrar auditoría.
            $esNuevaAsignacion = !$asignacionExistente;
            Auditoria::registrarSinModelo(
                'pestana_rol',
                "{$validated['rol_id']}-{$validated['pestana_id']}",
                $esNuevaAsignacion ? 'INSERT' : 'UPDATE',
                $esNuevaAsignacion ? null : [
                    [
                        'columna' => 'permisos',
                        'antes' => $asignacionExistente ? json_decode($asignacionExistente->permisos, true) : null,
                        'despues' => $validated['permisos'],
                    ]
                ]
            );

            return response()->json([
                'message' => 'Pestaña asignada correctamente al rol',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error asignando pestaña: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al asignar la pestaña'
            ], 500);
        }
    }

    /**
     * Desasigna un módulo de un rol.
     * Si el módulo tiene padre y no quedan hermanos asignados, desasigna también al padre.
     *
     * @param Request $request Solicitud con rol_id y modulo_id.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function desasignarModulo(Request $request)
    {
        // Validación.
        $validated = $request->validate([
            'rol_id' => 'required|integer|exists:roles,id',
            'modulo_id' => 'required|integer|exists:modulos,id',
        ], [
            'rol_id.required' => 'El ID del rol es obligatorio.',
            'rol_id.integer' => 'El ID del rol debe ser un número entero.',
            'rol_id.exists' => 'El rol seleccionado no existe en el sistema.',
            'modulo_id.required' => 'El ID del módulo es obligatorio.',
            'modulo_id.integer' => 'El ID del módulo debe ser un número entero.',
            'modulo_id.exists' => 'El módulo seleccionado no existe en el sistema.',
        ]);

        try {
            DB::beginTransaction();

            $modulo = Modulo::findOrFail($validated['modulo_id']);
            $rol = Rol::findOrFail($validated['rol_id']);

            // Eliminar asignación del módulo.
            $rol->modulos()->detach($validated['modulo_id']);

            // Si tiene padre y no tiene hermanos asignados, desasignar padre también.
            if ($modulo->modulo_padre_id) {
                // Verificar si quedan hermanos asignados al rol.
                $hermanosAsignados = $rol->modulos()
                    ->where('modulo_padre_id', $modulo->modulo_padre_id)
                    ->where('modulos.id', '!=', $validated['modulo_id']) // Excluir el actual si ya se desasignó.
                    ->count();
                if ($hermanosAsignados === 0) {
                    $rol->modulos()->detach($modulo->modulo_padre_id);

                    Auditoria::registrarSinModelo(
                        'modulo_rol',
                        "{$validated['rol_id']}-{$modulo->modulo_padre_id}",
                        'DELETE',
                        null
                    );
                }
            }

            DB::commit();

            Auditoria::registrarSinModelo(
                'modulo_rol',
                "{$validated['rol_id']}-{$validated['modulo_id']}",
                'DELETE',
                null
            );

            return response()->json([
                'message' => 'Módulo desasignado correctamente',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error desasignando módulo: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al desasignar el módulo'
            ], 500);
        }
    }

    /**
     * Desasigna una pestaña de un rol.
     *
     * @param Request $request Solicitud con rol_id y pestana_id.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function desasignarPestana(Request $request)
    {
        $validated = $request->validate([
            'rol_id' => 'required|integer|exists:roles,id',
            'pestana_id' => 'required|integer|exists:pestanas,id',
        ], [
            'rol_id.required' => 'El ID del rol es obligatorio.',
            'rol_id.integer' => 'El ID del rol debe ser un número entero.',
            'rol_id.exists' => 'El rol seleccionado no existe en el sistema.',
            'pestana_id.required' => 'El ID de la pestaña es obligatorio.',
            'pestana_id.integer' => 'El ID de la pestaña debe ser un número entero.',
            'pestana_id.exists' => 'La pestaña seleccionada no existe en el sistema.',
        ]);

        try {
            DB::beginTransaction();

            $rol = Rol::findOrFail($validated['rol_id']);
            $rol->pestanas()->detach($validated['pestana_id']);

            DB::commit();

            // Registrar auditoría.
            Auditoria::registrarSinModelo(
                'pestana_rol',
                "{$validated['rol_id']}-{$validated['pestana_id']}",
                'DELETE',
                null
            );

            return response()->json([
                'message' => 'Pestaña desasignada correctamente',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error desasignando pestaña: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al desasignar la pestaña'
            ], 500);
        }
    }

    /**
     * API: Carga módulos jerárquicos para un rol específico (para carga dinámica).
     *
     * @param int $rolId ID del rol.
     * @return \Illuminate\Http\JsonResponse Lista de módulos con asignaciones.
     */
    public function cargarModulosPorRol($rolId)
    {
        $modulos = $this->obtenerModulosJerarquicos($rolId);
        return response()->json([
            'modulos' => $modulos,
        ]);
    }

    /**
     * API: Carga pestañas jerárquicas para un rol específico (para carga dinámica).
     *
     * @param int $rolId ID del rol.
     * @return \Illuminate\Http\JsonResponse Lista de pestañas con asignaciones.
     */
    public function cargarPestanasPorRol($rolId)
    {
        $pestanas = $this->obtenerPestanasJerarquicas($rolId);
        return response()->json([
            'pestanas' => $pestanas,
        ]);
    }
    /**
     * Método auxiliar para obtener módulos con estructura jerárquica y estado de asignación.
     * Incluye padres e hijos, con info de asignación al rol si se pasa $rolId.
     *
     * @param int|null $rolId ID del rol para cargar asignaciones (opcional).
     * @return array Lista de módulos jerárquicos con asignaciones.
     */
    private function obtenerModulosJerarquicos($rolId = null)
    {
        // Obtener módulos padres con hijos y pestañas.
        $modulos = Modulo::with(['modulosHijos', 'pestanas'])
            ->whereNull('modulo_padre_id')
            ->get();

        return $modulos->map(function ($modulo) use ($rolId) {
            // Verificar asignación del módulo al rol.
            $asignacion = null;
            if ($rolId) {
                $asignacion = DB::table('modulo_rol')
                    ->where('rol_id', $rolId)
                    ->where('modulo_id', $modulo->id)
                    ->first();
            }

            $data = [
                'id' => $modulo->id,
                'nombre' => $modulo->nombre,
                'icono' => $modulo->icono,
                'es_padre' => $modulo->es_padre,
                'permisos_extra' => $modulo->permisos_extra ?? [],
                'tiene_pestanas' => $modulo->pestanas->count() > 0,
                'cant_pestanas' => $modulo->pestanas->count(),
                'asignado' => $asignacion !== null,
                'permisos_asignados' => $asignacion ? json_decode($asignacion->permisos, true) : [],
            ];

            // Si es padre, incluir hijos con su asignación.
            if ($modulo->es_padre) {
                $data['hijos'] = $modulo->modulosHijos->map(function ($hijo) use ($rolId) {
                    // Verificar asignación del hijo al rol.
                    $asignacionHijo = null;
                    if ($rolId) {
                        $asignacionHijo = DB::table('modulo_rol')
                            ->where('rol_id', $rolId)
                            ->where('modulo_id', $hijo->id)
                            ->first();
                    }

                    return [
                        'id' => $hijo->id,
                        'nombre' => $hijo->nombre,
                        'icono' => $hijo->icono,
                        'es_padre' => false,
                        'permisos_extra' => $hijo->permisos_extra ?? [],
                        'tiene_pestanas' => $hijo->pestanas()->count() > 0,
                        'cant_pestanas' => $hijo->pestanas()->count(),
                        'asignado' => $asignacionHijo !== null,
                        'permisos_asignados' => $asignacionHijo ? json_decode($asignacionHijo->permisos, true) : [],
                    ];
                });
            }

            return $data;
        });
    }

    /**
     * Método auxiliar para obtener pestañas con estructura jerárquica y estado de asignación.
     * Solo incluye módulos asignados al rol (de modulo_rol), y sus pestañas.
     * Si no hay módulos asignados, retorna array vacío.
     *
     * @param int|null $rolId ID del rol para cargar asignaciones (opcional).
     * @return array Lista de pestañas jerárquicas con asignaciones, solo para módulos asignados.
     */
    private function obtenerPestanasJerarquicas($rolId = null)
    {
        if (!$rolId) {
            return []; // Si no hay rolId, no hay asignaciones
        }

        // Obtener IDs de módulos asignados al rol (solo hijos, ya que padres se asignan automáticamente)
        $modulosAsignadosIds = DB::table('modulo_rol')
            ->where('rol_id', $rolId)
            ->pluck('modulo_id')
            ->toArray();

        if (empty($modulosAsignadosIds)) {
            return []; // Si no hay módulos asignados, retornar vacío
        }

        // Obtener módulos padres de los asignados (para mantener jerarquía)
        $modulosPadresIds = Modulo::whereIn('id', $modulosAsignadosIds)
            ->whereNotNull('modulo_padre_id')
            ->pluck('modulo_padre_id')
            ->unique()
            ->toArray();

        // Obtener módulos padres con hijos y pestañas, filtrados por asignados
        $modulosPadres = Modulo::with(['modulosHijos' => function ($query) use ($modulosAsignadosIds) {
            $query->whereIn('id', $modulosAsignadosIds)->with('pestanas'); // Solo hijos asignados
        }])
            ->whereIn('id', $modulosPadresIds) // Solo padres de asignados
            ->get();

        $resultado = [];

        foreach ($modulosPadres as $padre) {
            // Filtrar hijos que tienen pestañas.
            $hijosAsignadosConPestanas = $padre->modulosHijos->filter(function ($hijo) {
                return $hijo->pestanas->count() > 0;
            });


            if ($hijosAsignadosConPestanas->count() > 0) {
                $resultado[] = [
                    'id' => $padre->id,
                    'nombre' => $padre->nombre,
                    'icono' => $padre->icono,
                    'es_padre' => true,
                    'hijos' => $hijosAsignadosConPestanas->map(function ($hijo) use ($rolId) {
                        return [
                            'modulo_id' => $hijo->id,
                            'modulo_nombre' => $hijo->nombre,
                            'modulo_icono' => $hijo->icono,
                            'pestanas' => $hijo->pestanas->map(function ($pestana) use ($rolId) {
                                // Verificar asignación de la pestaña al rol.

                                $asignacion = DB::table('pestana_rol')
                                    ->where('rol_id', $rolId)
                                    ->where('pestana_id', $pestana->id)
                                    ->first();


                                return [
                                    'id' => $pestana->id,
                                    'nombre' => $pestana->nombre,
                                    'permisos_extra' => $pestana->permisos_extra ? json_decode($pestana->permisos_extra, true) : [],
                                    'asignado' => $asignacion !== null,
                                    'permisos_asignados' => $asignacion ? json_decode($asignacion->permisos, true) : [],
                                ];
                            }),
                        ];
                    })->values(),
                ];
            }
        }

        // Agregar módulos sin padre que tengan pestañas.
        $modulosSinPadreAsignados  = Modulo::with('pestanas')
            ->whereIn('id', $modulosAsignadosIds)
            ->whereNull('modulo_padre_id')
            ->has('pestanas')
            ->orderBy('nombre')
            ->get();

        foreach ($modulosSinPadreAsignados as $modulo) {
            $resultado[] = [
                'id' => $modulo->id,
                'nombre' => $modulo->nombre,
                'icono' => $modulo->icono,
                'es_padre' => false,
                'hijos' => [[
                    'modulo_id' => $modulo->id,
                    'modulo_nombre' => $modulo->nombre,
                    'modulo_icono' => $modulo->icono,
                    'pestanas' => $modulo->pestanas->map(function ($pestana) use ($rolId) {

                        // Verificar asignación de la pestaña al rol.
                        $asignacion = DB::table('pestana_rol')
                            ->where('rol_id', $rolId)
                            ->where('pestana_id', $pestana->id)
                            ->first();


                        return [
                            'id' => $pestana->id,
                            'nombre' => $pestana->nombre,
                            'icono' => $pestana->icono,
                            'permisos_extra' => $pestana->permisos_extra ? json_decode($pestana->permisos_extra, true) : [],
                            'asignado' => $asignacion !== null,
                            'permisos_asignados' => $asignacion ? json_decode($asignacion->permisos, true) : [],
                        ];
                    }),
                ]],
            ];
        }

        return $resultado;
    }
}
