<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    // Conexión a base de datos: Usa 'sqlsrv_second' (definida en config/database.php), no la primaria.    
    protected $connection = 'sqlsrv_second';
    
    // Tabla: Especifica 't012_mm_deptos' como tabla del modelo.    
    protected $table = 't012_mm_deptos'; 

    protected $primaryKey = 'f012_id';
}
