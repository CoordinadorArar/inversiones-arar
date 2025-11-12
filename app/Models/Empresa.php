<?php

namespace App\Models;

/**
 * Modelo Empresa.
 * 
 * Representa la tabla 't010_mm_companias' en la conexión 'sqlsrv_second' (base de datos secundaria, UNOEEARAR).
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-12
 */

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    // Conexión a base de datos: Usa 'sqlsrv_second' (definida en config/database.php), no la primaria.    
    protected $connection = 'sqlsrv_second';
    
    // Tabla: Especifica 't010_mm_companias' como tabla del modelo (no usa convención snake_case).    
    protected $table = 't010_mm_companias'; 
}
