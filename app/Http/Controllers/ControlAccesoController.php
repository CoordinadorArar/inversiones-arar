<?php

namespace App\Http\Controllers;

use App\Http\Requests\SeguridadAcceso\AsignarModuloRequest;
use App\Models\GestionModulos\Modulo;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * Controlador para Control de Acceso - Asignación de módulos/pestañas a roles.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */
class ControlAccesoController extends Controller
{
    protected int $moduloId = 15; // ID del módulo Control de Acceso
    protected $rol;
    protected $tabs;
    protected $moduloNombre;

    public function __construct()
    {
        $this->rol = Auth::user()->rol;
        $this->tabs = $this->rol->getPestanasModulo($this->moduloId);
        $this->moduloNombre = Modulo::find($this->moduloId)->nombre;
    }

    /**
     * Vista: Asignación de Módulos a Roles
     */
    public function modulos($rolId = null)
    {
        $permisos = $this->rol->getPermisosPestana(10); // ID pestaña módulos

        // Obtener todos los roles para el select
        $roles = Rol::orderBy('nombre')->get()->map(fn($r) => [
            'id' => $r->id,
            'nombre' => $r->nombre,
        ]);

        // Obtener módulos con estructura jerárquica
        $modulos = $this->obtenerModulosJerarquicos($rolId);

        // Permisos base del sistema
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
     * Obtener módulos con estructura jerárquica y estado de asignación
     */
    private function obtenerModulosJerarquicos($rolId = null)
    {
        $modulos = Modulo::with(['modulosHijos', 'pestanas'])
            ->whereNull('modulo_padre_id')
            ->orderBy('nombre')
            ->get();

        return $modulos->map(function ($modulo) use ($rolId) {
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

            // Si es padre, incluir hijos
            if ($modulo->es_padre) {
                $data['hijos'] = $modulo->modulosHijos->map(function ($hijo) use ($rolId) {
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
     * Asignar/actualizar módulo a rol con permisos
     */
    public function asignarModulo(AsignarModuloRequest $request)
    {
        $permisos = $this->rol->getPermisosPestana(10);

        // Validar permisos: necesita "crear" para asignar nuevos o "editar" para modificar existentes
        $asignacionExistente = DB::table('modulo_rol')
            ->where('rol_id', $request->rol_id)
            ->where('modulo_id', $request->modulo_id)
            ->exists();

        $permisoRequerido = $asignacionExistente ? 'editar' : 'crear';

        if (!in_array($permisoRequerido, $permisos)) {
            return response()->json([
                'error' => $asignacionExistente
                    ? 'No tienes permiso para editar asignaciones de módulos'
                    : 'No tienes permiso para crear asignaciones de módulos'
            ], 403);
        }

        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $modulo = Modulo::findOrFail($validated['modulo_id']);
            $rol = Rol::find($validated['rol_id']);

            // Si tiene padre, asignar también al padre (sin permisos)
            if ($modulo->modulo_padre_id) {
                $rol->modulos()->attach($modulo->modulo_padre_id, ['permisos' => null]);
            }

            $rol->modulos()->attach($validated['modulo_id'], ['permisos' => json_encode($validated['permisos'])]);

            DB::commit();

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
     * Desasignar módulo de rol
     */
    public function desasignarModulo(Request $request)
    {
        // Validación
        $validated = $request->validate([
            'rol_id' => 'required|integer|exists:roles,id', // ID del rol obligatorio, debe existir
            'modulo_id' => 'required|integer|exists:modulos,id', // ID del módulo obligatorio, debe existir
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

            // Eliminar asignación del módulo
            $rol->modulos()->detach($validated['modulo_id']);

            // Si tiene padre y no tiene hermanos asignados, desasignar padre también
            if ($modulo->modulo_padre_id) {
                // Verificar si quedan hermanos asignados al rol
                $hermanosAsignados = $rol->modulos()
                    ->where('modulo_padre_id', $modulo->modulo_padre_id)
                    ->where('modulos.id', '!=', $validated['modulo_id']) // Excluir el actual si ya se desasignó
                    ->count();
                if ($hermanosAsignados === 0) {
                    $rol->modulos()->detach($modulo->modulo_padre_id);
                }
            }


            DB::commit();

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
     * API: Cargar módulos para un rol específico (para carga dinámica)
     */
    public function cargarModulosPorRol($rolId)
    {
        $modulos = $this->obtenerModulosJerarquicos($rolId);
        return response()->json([
            'modulos' => $modulos,
        ]);
    }
}
