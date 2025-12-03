<?php

namespace App\Models;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Modelo EmpresaWeb.
 * 
 * Propósito: Representar empresas visibles en el sitio web (header, portafolio, PQRsD).
 * Almacena info básica, visibilidad y integración con Siesa.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-18
 */

class EmpresaWeb extends Model
{
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.
    use SoftDeletes;   // Soft deletes: marca deleted_at en lugar de eliminar.

    // Tabla específica (no usa convención plural).
    protected $table = 'empresas_web';

    /**
     * Campos mass assignable.
     * 
     * Incluye campos editables: id_siesa, info básica, sitio/dominio, logo, flags de visibilidad.
     * Excluye timestamps manuales (fecha_creacion/modificacion).
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'id_siesa',              // ID de Siesa (nullable).
        'razon_social',          // Nombre legal.
        'siglas',                // Abreviatura.
        'tipo_empresa',          // Categoría (ej. "Holding Empresarial").
        'descripcion',           // Descripción breve.
        'sitio_web',             // URL del sitio.
        'dominio',               // Dominio para correos.
        'logo_url',              // Ruta al logo.
        'mostrar_en_header',     // Flag para mostrar en header.
        'mostrar_en_empresas',   // Flag para página empresas.
        'mostrar_en_portafolio', // Flag para portafolio.
        'permitir_pqrsd'         // Flag para permitir PQRSD.
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

    protected $casts = [
        'mostrar_en_header' => 'boolean',
        'mostrar_en_empresas' => 'boolean',
        'mostrar_en_portafolio' => 'boolean',
        'permitir_pqrsd' => 'boolean',
    ];
}
