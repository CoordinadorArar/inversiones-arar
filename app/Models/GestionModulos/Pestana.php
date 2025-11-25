<?php

namespace App\Models\GestionModulos;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pestana extends Model
{
    /** @use HasFactory<\Database\Factories\PestanaFactory> */
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.
    use SoftDeletes;   // Soft deletes: marca deleted_at en lugar de eliminar.

    // Tabla específica.
    protected $table = 'pestanas';

    /**
     * Campos mass assignable.
     * 
     * @var array<int, string>
     */
    protected $fillable = ['modulo_id', 'nombre', 'ruta', 'permisos_extra'];

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
