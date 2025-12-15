<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsuarioSedeer extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'numero_documento' => '1098833391',
            'email' => 'desarrollo01@inversionesarar.com',
            'rol_id' => 1,
            'password' => bcrypt('1098833391Ya.')
        ]);
    }
}
