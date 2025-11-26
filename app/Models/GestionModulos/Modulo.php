<?php

namespace App\Models\GestionModulos;

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
 * @version 1.0
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
    ];

    // Deshabilitar timestamps automáticos (usa fecha_creacion/modificacion manuales).
    public $timestamps = false;

    // Campos tratados como fechas (para Carbon).
    protected $dates = [
        'fecha_creacion',     // Fecha de creación.
        'fecha_modificacion', // Fecha de modificación.
        'deleted_at'          // Fecha de eliminación suave.
    ];
}