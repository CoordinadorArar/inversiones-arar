<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * Modelo Auditoria.
 * 
 * Propósito: Registrar cambios en otras tablas para auditoría (logs de inserts/updates/deletes).
 * Usado para compliance, tracking de modificaciones y quién las hizo.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-18
 */

class Auditoria extends Model
{
    /** @use HasFactory<\Database\Factories\AuditoriaFactory> */
    use HasFactory;

    // Deshabilitar timestamps automáticos (usa fecha_creacion manual).
    public $timestamps = false;

    // Campos fillable para mass assignment.
    protected $fillable = [
        'tabla_afectada',
        'id_registro_afectado',
        'accion',
        'usuario_id',
        'cambios',
        'fecha_creacion'
    ];

    // Campos tratados como fechas.
    protected $dates = [
        'fecha_creacion',
    ];


    /**
     * BLOQUE: Método registrar - Crear entrada de auditoría.
     * 
     * Parámetros:
     * - $model: Instancia del modelo afectado (ej. User).
     * - $accion: Tipo de cambio ('INSERT', 'UPDATE', 'DELETE').
     * 
     * Lógica:
     * - Obtiene usuario actual (o null si no autenticado).
     * - Para UPDATE, calcula cambios comparando dirty vs original.
     * - Crea registro con tabla, ID, acción, usuario y cambios en JSON.
     * 
     * Propósito: Método estático para logging automático desde otros modelos.
     * 
     * @param Model $model
     * @param string $accion
     * @return void
     */
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

    /**
     * Relación: Usuario que realizó la acción.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id', 'id');
    }
}
