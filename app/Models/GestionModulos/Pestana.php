<?php

namespace App\Models\GestionModulos;

use App\Models\Rol;
use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Modelo Pestana.
 * 
 * Propósito: Representar pestañas/subpáginas dentro de módulos (ej. "Crear" en módulo "PQRSD").
 * Usado para control de acceso a secciones específicas dentro de módulos.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-26
 */

class Pestana extends Model
{
    /** @use HasFactory<\Database\Factories\PestanaFactory> */
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.
    use SoftDeletes;   // Soft deletes: marca deleted_at en lugar de eliminar.

    // Tabla específica (no usa convención plural).
    protected $table = 'pestanas';

    /**
     * Campos mass assignable.
     * 
     * Incluye FK a módulo, nombre/ruta, permisos_extra JSON.
     * 
     * @var array<int, string>
     */
    protected $fillable = ['modulo_id', 'nombre', 'ruta', 'permisos_extra'];

    // Casts: Convierte permisos_extra de JSON a array automáticamente.
    protected $casts = [
        'permisos_extra' => 'array',  // Facilita manipulación como array en PHP.
    ];

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
     * Relación: Módulo
     * Una pestaña pertenece a un módulo.
     */
    public function modulo()
    {
        return $this->belongsTo(Modulo::class, 'modulo_id');
    }

    /**
     * Relación: Roles (muchos a muchos)
     * Una pestaña puede estar asignada a muchos roles.
     * Tabla pivote: pestana_rol (con columna 'permisos' JSON)
     */
    public function roles()
    {
        return $this->belongsToMany(
            Rol::class,
            'pestana_rol',
            'pestana_id',
            'rol_id'
        )
        ->withPivot('permisos') // Agregar columna JSON de permisos
        ->withTimestamps();
    }
}
