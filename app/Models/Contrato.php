<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contrato extends Model
{
    // Conexión a base de datos: Usa 'sqlsrv_second' (definida en config/database.php), no la primaria.    
    protected $connection = 'sqlsrv_second';

    // Tabla: Especifica 't010_mm_companias' como tabla del modelo.    
    protected $table = 'w0550_contratos';

    protected $primaryKey = 'c0550_rowid';

    public function tercero()
    {
        return $this->belongsTo(
            ContratoPropietario::class, 
            'c0550_rowid_tercero', 
            'f200_rowid'
        );
    }
}
