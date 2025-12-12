<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * Modelo Auditoria para registrar cambios en otras tablas.
 * Almacena logs de INSERT, UPDATE y DELETE con información del usuario que realizó la acción.
 * Usado para compliance, tracking de modificaciones y auditoría del sistema.
 *
 * @author Yariangel Aray
 * @date 2025-11-18
 */
class Auditoria extends Model
{
    /** @use HasFactory<\Database\Factories\AuditoriaFactory> */
    use HasFactory;

    /**
     * Deshabilitar timestamps automáticos.
     * Este modelo usa fecha_creacion manual en lugar de created_at/updated_at.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Campos asignables en masa.
     *
     * @var array<string>
     */
    protected $fillable = [
        'tabla_afectada',
        'id_registro_afectado',
        'accion',
        'usuario_id',
        'cambios',
        'fecha_creacion'
    ];

    /**
     * Campos que deben ser tratados como fechas.
     *
     * @var array<string>
     */
    protected $dates = [
        'fecha_creacion',
    ];

    /**
     * Registra una acción de auditoría en la base de datos.
     * Método estático para logging automático desde trait HasAuditoria.
     * Captura usuario actual, calcula cambios (para UPDATE) y crea registro de auditoría.
     *
     * @param Model $model Instancia del modelo afectado (ej. User, Configuracion).
     * @param string $accion Tipo de cambio: 'INSERT', 'UPDATE' o 'DELETE'.
     * @return void
     */
    public static function registrar($model, $accion)
    {
        // Obtener ID del usuario autenticado o null si no hay usuario logueado.
        $usuario = Auth::check() ? Auth::user()->id : null;

        $cambios = null;

        // Para UPDATE, calcular cambios comparando valores dirty vs original.
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

        // Crear registro de auditoría con información del cambio.
        self::create([
            'tabla_afectada'        => $model->getTable(),
            'id_registro_afectado'  => $model->id,
            'accion'                => $accion,
            'usuario_id'            => $usuario,
            'cambios'               => $cambios ? json_encode($cambios) : null,
        ]);
    }

    /**
     * Relación: Usuario que realizó la acción auditada.
     * Retorna el usuario que ejecutó el INSERT, UPDATE o DELETE.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id', 'id');
    }
}