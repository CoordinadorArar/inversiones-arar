<?php

namespace App\Models\PQRSD;

use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EstadoPqrs extends Model
{
    /** @use HasFactory<\Database\Factories\EstadoPqrsFactory> */
    use HasFactory;
    use HasAuditoria;
    use SoftDeletes;

    protected $table = 'estados_pqrs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['nombre', 'abreviatura'];

    public $timestamps = false;

    protected $dates = [
        'fecha_creacion',
        'fecha_modificacion',
        'deleted_at'
    ];
}
