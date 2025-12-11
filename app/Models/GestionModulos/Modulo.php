<?php

namespace App\Models\GestionModulos;

use App\Models\Rol;
use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Modelo Modulo.
 * 
 * Propósito: Representar módulos del sistema (ej. "PQRSD", "Usuarios") con permisos CRUD básicos
 * y permisos_extra específicos (JSON array). Soporta jerarquía (padre/hijo).
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-26
 */

class Modulo extends Model
{
    /** @use HasFactory<\Database\Factories\ModuloFactory> */
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.
    use SoftDeletes;   // Soft deletes: marca deleted_at en lugar de eliminar.

    // Tabla específica (no usa convención plural).
    protected $table = 'modulos';

    /**
     * Campos mass assignable.
     * 
     * Incluye nombre, icono, ruta, jerarquía, permisos_extra JSON.
     * 
     * @var array<int, string>
     */
    protected $fillable = ['nombre', 'icono', 'ruta', 'es_padre', 'modulo_padre_id', 'permisos_extra'];

    // Casts: Convierte permisos_extra de JSON a array automáticamente.
    protected $casts = [
        'permisos_extra' => 'array',  // Facilita manipulación como array en PHP.
        'es_padre' => 'boolean',
    ];

    // Deshabilitar timestamps automáticos (usa fecha_creacion/modificacion manuales).
    public $timestamps = true;
    
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_modificacion';

    // Campos tratados como fechas (para Carbon).
    protected $dates = [
        'fecha_creacion',     // Fecha de creación.
        'fecha_modificacion', // Fecha de modificación.
        'deleted_at'          // Fecha de eliminación suave.
    ];

    /**
     * Relación: Módulo padre
     * Un módulo puede pertenecer a un módulo padre.
    */
    public function moduloPadre()
    {
        return $this->belongsTo(Modulo::class, 'modulo_padre_id');
    }
    
    /**
     * Relación: Módulos hijos
     * Un módulo padre puede tener muchos módulos hijos.
    */
    public function modulosHijos()
    {
        return $this->hasMany(Modulo::class, 'modulo_padre_id');
    }

    /**
     * Relación: Pestañas
     * Un módulo puede tener muchas pestañas.
     */
    public function pestanas()
    {
        return $this->hasMany(Pestana::class, 'modulo_id');
    }

    /**
     * Relación: Roles (muchos a muchos)
     * Un módulo puede estar asignado a muchos roles.
     * Tabla pivote: modulo_rol (con columna 'permisos' JSON)
     */
    public function roles()
    {
        return $this->belongsToMany(
            Rol::class,
            'modulo_rol',
            'modulo_id',
            'rol_id'
        )
        ->withPivot('permisos') // Agregar columna JSON de permisos
        ->withTimestamps();
    }
}