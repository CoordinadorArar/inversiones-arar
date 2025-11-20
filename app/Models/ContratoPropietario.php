<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContratoPropietario extends Model
{
    // Conexión a base de datos: Usa 'sqlsrv_second' (definida en config/database.php), no la primaria.    
    protected $connection = 'sqlsrv_second';
    
    // Tabla: Especifica 't010_mm_companias' como tabla del modelo.    
    protected $table = 't200_mm_terceros';

    protected $primaryKey = 'f200_rowid';

    public function contratos()
    {
        return $this->hasMany(
            Contrato::class, 
            'c0550_rowid_tercero',   // FK en contratos
            'f200_rowid'             // PK en terceros
        );
    }
    
    public function hasContratoActivo()
    {
        return $this->contratos()
            ->where(function ($q) {
                $q->whereNull('c0550_id_motivo_retiro')
                  ->orWhere('c0550_id_motivo_retiro', '');
            })
            ->exists();
    }
}
