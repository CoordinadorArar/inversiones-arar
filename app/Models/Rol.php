<?php

namespace App\Models;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Modelo Rol.
 * 
 * Propósito: Representar roles de usuario (ej. SuperAdmin, Estandar) en la tabla 'roles'.
 * Usado para asignar permisos y controlar acceso en el sistema.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-21
 */

class Rol extends Model
{
    /** @use HasFactory<\Database\Factories\RolFactory> */
    use HasFactory;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.
    use SoftDeletes;   // Soft deletes: marca deleted_at en lugar de eliminar.

    // Tabla específica.
    protected $table = 'roles';

    /**
     * Campos mass assignable.
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',      // Nombre del rol.
        'abreviatura', // Abreviatura del rol.
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