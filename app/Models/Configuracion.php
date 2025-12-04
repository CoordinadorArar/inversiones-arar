<?php

namespace App\Models;

/**
 * Modelo Configuracion.
 * 
 * Este modelo representa la tabla configuraciones, que almacena settings globales clave-valor 
 * (ej. emails de contacto, URLs de RRSS). Usa un trait para auditoría automática y deshabilita 
 * timestamps automáticos de Laravel. Es ideal para configuraciones editables desde un panel 
 * admin sin tocar código.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-26
 */

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    /** @use HasFactory<\Database\Factories\ConfiguracionFactory> */
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente (ej. logs de quién modificó qué config).

    // Tabla específica.
    protected $table = 'configuraciones';

    /**
     * Campos mass assignable.
     * 
     * Solo 'nombre' y 'valor' son editables; timestamps se manejan manualmente.
     * 
     * @var array<int, string>
     */
    protected $fillable = ['nombre', 'valor'];

    public $timestamps = true;

    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_modificacion';

    // Campos tratados como fechas.
    protected $dates = [
        'fecha_creacion',
        'fecha_modificacion',
    ];
}
