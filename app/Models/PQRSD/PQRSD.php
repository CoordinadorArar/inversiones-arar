<?php

namespace App\Models\PQRSD;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Modelo PQRSD.
 * 
 * Propósito: Representar PQRs (Peticiones, Quejas, etc.) en la tabla 'pqrsds'.
 * Tabla central para gestionar PQRs con datos personales, contacto y seguimiento.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

class PQRSD extends Model
{
    /** @use HasFactory<\Database\Factories\PQRSDFactory> */
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.
    use SoftDeletes;   // Soft deletes: marca deleted_at en lugar de eliminar.

    // Tabla específica.
    protected $table = 'pqrsds';

    /**
     * Campos mass assignable (todos los campos editables).
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'empresa_web_id',
        'tipo_pqrs_id',
        'anonimo',
        'nombre',
        'apellido',
        'tipo_identificacion_id',
        'numero_identificacion',
        'correo',
        'telefono',
        'departamento_codigo',
        'ciudad_codigo',
        'direccion',
        'relacion',
        'descripcion',
        'adjuntos',
        'directorio',
        'estado_id',
        'usuario_asignado_id',
        'fecha_finalizacion',
    ];

    // Deshabilitar timestamps automáticos (usa fecha_creacion/modificacion manuales).
    public $timestamps = true;

    // Campos tratados como fechas.
    protected $dates = [
        'fecha_creacion',
        'fecha_modificacion',
        'fecha_finalizacion',
        'deleted_at'
    ];

    protected $casts = [
        'anonimo' => 'boolean',
    ];
}