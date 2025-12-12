<?php

namespace App\Traits;

use App\Models\Auditoria;

/**
 * Trait para registrar automáticamente cambios en auditoría.
 * Se aplica a modelos que requieren tracking de modificaciones (INSERT, UPDATE, DELETE).
 * Utiliza eventos de Eloquent para capturar cambios y delegarlos al modelo Auditoria.
 *
 * Uso: use HasAuditoria; en el modelo que necesite auditoría.
 *
 * @author Yariangel Aray
 * @date 2025-12-12
 */
trait HasAuditoria
{
    /**
     * Boot del trait: Registra listeners de eventos Eloquent para auditoría.
     * Se ejecuta automáticamente cuando el modelo usa este trait.
     * Captura eventos created, updated y deleted para registrar en tabla auditorias.
     *
     * @return void
     */
    public static function bootHasAuditoria()
    {
        // Registrar INSERT cuando se crea un modelo.
        static::created(function ($model) {
            Auditoria::registrar($model, 'INSERT');
        });

        // Registrar UPDATE cuando se actualiza un modelo.
        static::updated(function ($model) {
            Auditoria::registrar($model, 'UPDATE');
        });

        // Registrar DELETE cuando se elimina un modelo (soft o hard delete).
        static::deleted(function ($model) {
            Auditoria::registrar($model, 'DELETE');
        });
    }
}