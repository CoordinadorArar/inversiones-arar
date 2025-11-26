<?php

namespace App\Models;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    /** @use HasFactory<\Database\Factories\ConfiguracionFactory> */
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.

    // Tabla específica.
    protected $table = 'configuraciones';

    /**
     * Campos mass assignable.
     * 
     * @var array<int, string>
     */
    protected $fillable = ['nombre', 'valor'];

    // Deshabilitar timestamps automáticos (usa fecha_creacion/modificacion manuales).
    public $timestamps = false;

    // Campos tratados como fechas.
    protected $dates = [
        'fecha_creacion',
        'fecha_modificacion',
    ];
}
