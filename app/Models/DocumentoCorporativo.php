<?php

namespace App\Models;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentoCorporativo extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentoCorporativoFactory> */
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.
    use SoftDeletes;   // Soft deletes: marca deleted_at en lugar de eliminar.

    // Tabla específica.
    protected $table = 'documentos_corporativos';

    /**
     * Campos mass assignable.
     * 
     * @var array<int, string>
     */
    protected $fillable = ['nombre', 'icono', 'ruta', 'mostrar_en_dashboard', 'mostrar_en_footer'];

    // Activar timestamps automáticos
    public $timestamps = false;

    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_modificacion';

    // Campos tratados como fechas.
    protected $dates = [
        'fecha_creacion',
        'fecha_modificacion',
        'deleted_at'
    ];
}
