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
                ter.f200_fecha_nacimiento as fecha_nacimiento,
                dat.c0541_correo as email_personal,
                dat.c0541_telefono_1 as telefono,
                dat.c0541_direccion_1 as direccion,
                dat.c0541_barrio as barrio,
                dpto.f012_descripcion as departamento,
                ciud.f013_descripcion as ciudad
            from UNOEEARAR..t200_mm_terceros ter 
            inner join UNOEEARAR..w0541_terceros_seleccion dat ON ter.f200_id = dat.c0541_id
            inner join UNOEEARAR..w0550_contratos con ON ter.f200_rowid = con.c0550_rowid_tercero
            inner join UNOEEARAR..w0763_gh01_cargos carg on con.c0550_rowid_cargo = carg.c0763_rowid
            inner join UNOEEARAR..t012_mm_deptos dpto on dat.c0541_dpto_contacto = dpto.f012_id
            inner join UNOEEARAR..t013_mm_ciudades ciud on dat.c0541_ciudad_contacto = ciud.f013_id 
                   and dat.c0541_dpto_contacto = ciud.f013_id_depto
            where ter.f200_id = ?
        ", [$numDoc]);

        return $datosCompletos;
    }
}
