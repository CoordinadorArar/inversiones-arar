<?php

namespace Database\Seeders;

use App\Models\Configuracion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConfiguracionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estados = [
            [
                'nombre' => 'contact.email',
                'valor' => 'asistente@inversionesarar.com'
            ],
            [
                'nombre' => 'contact.telefono',
                'valor' => '607 698 5203'
            ],
            [
                'nombre' => 'contact.ubicacion',
                'valor' => 'Ecoparque Natura · Floridablanca, Colombia'
            ],
            [
                'nombre' => 'contact.ubicacion.detalles',
                'valor' => 'Km 2 • Torre Uno • Oficina 206'
            ],
            [
                'nombre' => 'contact.ubicacion.url',
                'valor' => 'https://maps.app.goo.gl/mm8MPxAzZs99BV1D8'
            ],
            [
                'nombre' => 'rrss.instagram',
                'valor' => null
            ],
            [
                'nombre' => 'rrss.facebook',
                'valor' => null
            ],
            [
                'nombre' => 'rrss.x',
                'valor' => null
            ],
            [
                'nombre' => 'rrss.linkedin',
                'valor' => 'https://co.linkedin.com/company/inversiones-arar'
            ],
            [
                'nombre' => 'image.icono',
                'valor' => 'storage/identidad/logo-arar.png'
            ],
            [
                'nombre' => 'image.logo',
                'valor' => 'storage/identidad/logo-arar.png'
            ],
        ];

        foreach ($estados as $estado) {
            Configuracion::firstOrCreate(['nombre' => $estado['nombre']], $estado);
        }
    }
}
