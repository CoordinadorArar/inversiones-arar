<?php

namespace App\Models\GestionModulos;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Modulo extends Model
{
    /** @use HasFactory<\Database\Factories\ModuloFactory> */
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.
    use SoftDeletes;   // Soft deletes: marca deleted_at en lugar de eliminar.

    // Tabla específica.
    protected $table = 'modulos';

    /**
     * Campos mass assignable.
     * 
     * @var array<int, string>
     */
    protected $fillable = ['nombre', 'icono', 'ruta', 'es_padre', 'modulo_padre_id', 'permisos_extra'];

    protected $casts = [
        'permisos_extra' => 'array',
    ];

    // Deshabilitar timestamps automáticos (usa fecha_creacion/modificacion manuales).
    public $timestamps = false;

    // Campos tratados como fechas.
    protected $dates = [
        'fecha_creacion',
        'fecha_modificacion',
        'deleted_at'
    ];
}
