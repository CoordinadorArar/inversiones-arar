<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $connection = 'sqlsrv_second';
    protected $table = 't010_mm_companias'; 
    // protected $primaryKey = 'f010_id'; 
    // public $timestamps = false;
}
