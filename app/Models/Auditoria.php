<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Auditoria extends Model
{
    /** @use HasFactory<\Database\Factories\AuditoriaFactory> */
    use HasFactory;

    public $timestamps = false;
    protected $fillable = [
        'tabla_afectada', 'id_registro_afectado', 'accion', 'usuario_id', 'cambios', 'fecha_creacion'
    ];

    public static function registrar($model, $accion)
    {
         $usuario = Auth::check() ? Auth::user()->id : null;


        $cambios = null;
        if ($accion === 'UPDATE') {
            $cambios = [];
            foreach ($model->getDirty() as $campo => $nuevoValor) {
                $cambios[] = [
                    'columna' => $campo,
                    'antes' => $model->getOriginal($campo),
                    'despues' => $nuevoValor,
                ];
            }
        }

        self::create([
            'tabla_afectada'        => $model->getTable(),
            'id_registro_afectado'  => $model->id,
            'accion'                => $accion,
            'usuario_id'            => $usuario,
            'cambios'               => $cambios ? json_encode($cambios) : null,
        ]);
    }
}
