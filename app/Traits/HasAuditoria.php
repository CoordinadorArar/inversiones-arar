<?php

namespace App\Traits;

use App\Models\Auditoria;

trait HasAuditoria
{
     public static function bootHasAuditoria()
    {
        static::created(function ($model) {
            Auditoria::registrar($model, 'INSERT');
        });

        static::updated(function ($model) {
            Auditoria::registrar($model, 'UPDATE');
        });

        static::deleted(function ($model) {
            Auditoria::registrar($model, 'DELETE');
        });
    }
}
