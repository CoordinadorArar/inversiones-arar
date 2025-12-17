<?php

namespace App\Models;

use App\Models\GestionModulos\Modulo;
use App\Models\GestionModulos\Pestana;
use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Modelo Rol.
 * 
 * Propósito: Representar roles de usuario (ej. SuperAdmin, Estandar) en la tabla 'roles'.
 * Usado para asignar permisos y controlar acceso en el sistema.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-21
 */

class Rol extends Model
{
    /** @use HasFactory<\Database\Factories\RolFactory> */
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.
    use SoftDeletes;   // Soft deletes: marca deleted_at en lugar de eliminar.

    // Tabla específica.
    protected $table = 'roles';

    /**
     * Campos mass assignable.
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',      // Nombre del rol.
        'abreviatura', // Abreviatura del rol.
    ];

    // Deshabilitar timestamps automáticos (usa fecha_creacion/modificacion manuales).
    public $timestamps = false;

    // Campos tratados como fechas (para Carbon).
    protected $dates = [
        'fecha_creacion',     // Fecha de creación.
        'fecha_modificacion', // Fecha de modificación.
        'deleted_at'          // Fecha de eliminación suave.
    ];

    /**
     * Relación: Módulos (muchos a muchos)
     * Un rol puede tener acceso a muchos módulos.
     */
    public function modulos()
    {
        return $this->belongsToMany(
            Modulo::class,
            'modulo_rol',
            'rol_id',
            'modulo_id'
        )
            ->withPivot('permisos')
            ->withTimestamps();
    }

    /**
     * Relación: Pestañas (muchos a muchos)
     * Un rol puede tener acceso a muchas pestañas.
     */
    public function pestanas()
    {
        return $this->belongsToMany(
            Pestana::class,
            'pestana_rol',
            'rol_id',
            'pestana_id'
        )
            ->withPivot('permisos')
            ->withTimestamps();
    }

    public function usuarios()
    {
        return $this->hasMany(User::class, 'rol_id');
    }

    /**
     * Helper: Verificar si el rol tiene un permiso específico en un módulo.
     * 
     * @param int $moduloId ID del módulo
     * @param string $permiso Nombre del permiso (ej. 'crear', 'editar', 'aprobar_pago')
     * @return bool
     * 
     * @example
     * if ($rol->tienePermisoModulo(1, 'crear')) {
     *     // Mostrar botón "Crear"
     * }
     */
    public function tienePermisoModulo(int $moduloId, string $permiso): bool
    {
        $permisos = $this->getPermisosModulo($moduloId);
        
        return in_array($permiso, $permisos);

        return false;
    }

    /**
     * Verificar si el rol tiene un permiso específico en una pestaña.
     * 
     * @param int $pestanaId ID de la pestaña
     * @param string $permiso Nombre del permiso (ej. 'crear', 'exportar')
     * @return bool
     * 
     * @example
     * if ($rol->tienePermisoPestana(5, 'exportar')) {
     *     // Mostrar botón "Exportar"
     * }
     */
    public function tienePermisoPestana(int $pestanaId, string $permiso): bool
    {
        $permisos = $this->getPermisosPestana($pestanaId);
        
        // Verificar si el permiso está en el array
        return in_array($permiso, $permisos);
    }

    /**
     * Obtiene las pestañas accesibles de un módulo para este rol.
     * 
     * @param int $moduloId
     * @return \Illuminate\Support\Collection
     */
    public function getPestanasModulo(int $moduloId)
    {
        $modulo = Modulo::with('moduloPadre')->findOrFail($moduloId);

        $baseRuta = '';

        // Si tiene módulo padre, concatenarlo
        if ($modulo->moduloPadre) {
            $baseRuta .= $modulo->moduloPadre->ruta;
        }

        // Ruta del módulo actual
        $baseRuta .= $modulo->ruta;

        return $modulo->pestanas()
            ->whereHas('roles', function ($query) {
                $query->where('rol_id', $this->id);
            })
            ->get(['id', 'nombre', 'ruta'])
            ->map(function ($pestana) use ($baseRuta) {
                return [
                    'id'     => $pestana->id,
                    'nombre' => $pestana->nombre,
                    'ruta'   => $baseRuta . $pestana->ruta, // Ruta final
                ];
            });
    }


    /**
     * Obtiene los permisos de este rol para un módulo.
     * 
     * @param int $moduloId
     * @return array
     */
    public function getPermisosModulo(int $moduloId): array
    {
        $modulo = $this->modulos()
            ->where('modulo_id', $moduloId)
            ->first();

        if (!$modulo) {
            return [];
        }

        return json_decode($modulo->pivot->permisos, true) ?? [];
    }

    /**
     * Obtiene los permisos de este rol para una pestaña.
     * 
     * @param int $pestanaId
     * @return array
     */
    public function getPermisosPestana(int $pestanaId): array
    {
        $pestana = $this->pestanas()
            ->where('pestana_id', $pestanaId)
            ->first();

        if (!$pestana) {
            return [];
        }

        return json_decode($pestana->pivot->permisos, true) ?? [];
    }
}
