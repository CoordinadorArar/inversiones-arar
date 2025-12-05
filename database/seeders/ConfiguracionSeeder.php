<?php

namespace Database\Seeders;

use App\Models\Configuracion;
use Illuminate\Database\Seeder;

class ConfiguracionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Inserta configs predeterminadas para contacto, RRSS e imágenes.
     * Usa firstOrCreate para evitar duplicados por 'nombre'.
     * 
     * @return void
     */
    public function run(): void
    {
        $configs = [
            // Configs de contacto (email, teléfono, ubicación).
            [
                'nombre' => 'contact.email',
                'valor' => 'asistente@inversionesarar.com'
            ],
            [
                'nombre' => 'contact.telefono',
                'valor' => '6076985203'
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
            // Configs de RRSS (algunas null para placeholders).
            [
                'nombre' => 'rrss.instagram',
                'valor' => null  
            ],
            [
                'nombre' => 'rrss.facebook',
                'valor' => null 
            ],
            [
                'nombre' => 'rrss.x',  // X (anteriormente Twitter).
                'valor' => null 
            ],
            [
                'nombre' => 'rrss.linkedin',
                'valor' => 'https://co.linkedin.com/company/inversiones-arar'
            ],
            // Configs de imágenes (logos/iconos).
            [
                'nombre' => 'image.icono',
                'valor' => '/identidad/icono-arar.png'  // Ícono pequeño.
            ],
            [
                'nombre' => 'image.logo',
                'valor' => '/identidad/logo-arar.png'  // Logo completo.
            ],
        ];

        // Inserta cada config, evitando duplicados.
        foreach ($configs as $config) {
            Configuracion::firstOrCreate(['nombre' => $config['nombre']], $config);
        }
    }
}
