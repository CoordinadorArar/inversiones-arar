<?php

namespace App\Models;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Modelo TipoIdentificacion.
 * 
 * Propósito: Representar tipos de identificación (ej. CC, CE) en la tabla 'tipos_identificaciones'.
 * Usado en formularios de PQRs para seleccionar tipo de documento.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

class TipoIdentificacion extends Model
{
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.
    use SoftDeletes;   // Soft deletes: marca deleted_at en lugar de eliminar.

    // Tabla específica.
    protected $table = 'tipos_identificaciones';

    /**
     * Campos mass assignable.
     * 
     * @var array<int, string>
     */
    protected $fillable = ['nombre', 'abreviatura'];

    // Deshabilitar timestamps automáticos (usa fecha_creacion/modificacion manuales).
    public $timestamps = true;
    
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_modificacion';

    // Campos tratados como fechas.
    protected $dates = [
        'fecha_creacion',
        'fecha_modificacion',
        'deleted_at'
    ];
}