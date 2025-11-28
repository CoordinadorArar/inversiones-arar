<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Mail\ResetPasswordMail;
use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasAuditoria;  // Trait para registrar cambios en auditoría automáticamente.

    protected $table = 'usuarios'; // Especifica la tabla 'usuarios'.

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'numero_documento',
        'email',
        'rol_id',
        'password',
        'intentos_fallidos',
        'bloqueado_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'bloqueado_at' => 'datetime',
        ];
    }

    public function sendPasswordResetNotification($token)
    {
        \Mail::to($this->email)
            ->bcc('desarrollo01@inversionesarar.com')
            ->send(new ResetPasswordMail($token, $this->numero_documento));
    }

    protected $appends = [
        'datos_completos',
    ];


    public function getDatosCompletosAttribute()
    {
        $numDoc = $this->numero_documento;

        $datosCompletos = DB::connection('sqlsrv_second')->selectOne("
            select 
                CONCAT(ter.f200_apellido1,' ',ter.f200_apellido2) as apellidos, 
                ter.f200_nombres as nombres, 
                carg.c0763_descripcion as cargo,
                CONVERT(DATE, ter.f200_fecha_nacimiento) as fecha_nacimiento,
                dat.f015_email as email_personal,
                dat.f015_telefono as telefono,
                dat.f015_direccion1 as direccion,
                dat.f015_id_barrio as barrio,
                dpto.f012_descripcion as departamento,
                ciud.f013_descripcion as ciudad,
                con.c0550_fecha_ingreso as fecha_ingreso
            from UNOEEARAR..t200_mm_terceros ter 
            inner join UNOEEARAR..t015_mm_contactos dat ON ter.f200_rowid_contacto = dat.f015_rowid
            inner join UNOEEARAR..t012_mm_deptos dpto on dat.f015_id_depto = dpto.f012_id
            inner join UNOEEARAR..w0550_contratos con ON ter.f200_rowid = con.c0550_rowid_tercero
            inner join UNOEEARAR..w0763_gh01_cargos carg on con.c0550_rowid_cargo = carg.c0763_rowid
            inner join UNOEEARAR..t013_mm_ciudades ciud on dat.f015_id_ciudad = ciud.f013_id and dat.f015_id_depto = ciud.f013_id_depto
            where ter.f200_id = ?
        ", [$numDoc]);

        return $datosCompletos;
    }

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }
}
