<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ciudad extends Model
{
    // Conexión a base de datos: Usa 'sqlsrv_second' (definida en config/database.php), no la primaria.    
    protected $connection = 'sqlsrv_second';
    
    // Tabla: Especifica 't013_mm_ciudades' como tabla del modelo.    
    protected $table = 't013_mm_ciudades'; 

    protected $primaryKey = 'f013_id';

    public function departamento()
    {
        return $this->belongsTo(
            Departamento::class, 
            'f013_id_depto', 
            'f012_id'
        );
    }
}
