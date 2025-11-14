<?php

namespace App\Models\PQRSD;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PQRSD extends Model
{
    /** @use HasFactory<\Database\Factories\PQRSDFactory> */
    use HasFactory;
    use HasAuditoria;
    use SoftDeletes;

    protected $table = 'pqrsds';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'empresa_id',
        'tipo_pqrs_id',
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


    public $timestamps = false;

    protected $dates = [
        'fecha_creacion',
        'fecha_modificacion',
        'fecha_finalizacion',
        'deleted_at'
    ];
}
