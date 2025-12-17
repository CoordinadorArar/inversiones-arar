<?php

namespace App\Models;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Modelo para documentos corporativos.
 * 
 * Representa documentos subidos al sistema (PDF, DOC, etc.) con metadata como ícono,
 * visibilidad en dashboard/footer, y auditoría automática.
 * Usa soft deletes para no perder datos.
 * 
 * @author Yariangel Aray
 * @date 2025-12-15
 */
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
     * Permite asignación masiva solo en estos campos para seguridad.
     * 
     * @var array<int, string>
     */
    protected $fillable = ['nombre', 'icono', 'ruta', 'mostrar_en_dashboard', 'mostrar_en_footer'];

    // Activar timestamps automáticos.
    public $timestamps = false;

    // Nombres personalizados para timestamps.
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_modificacion';

    // Campos tratados como fechas.
    protected $dates = [
        'fecha_creacion',
        'fecha_modificacion',
        'deleted_at'
    ];

    // Casts para convertir tipos automáticamente.
    protected $casts = [
        'mostrar_en_dashboard' => 'boolean',
        'mostrar_en_footer' => 'boolean',
    ];
}
