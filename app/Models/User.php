<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Mail\ResetPasswordMail;
use App\Traits\HasAuditoria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
}
