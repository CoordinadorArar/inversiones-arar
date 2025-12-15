<?php

namespace Database\Seeders;

use App\Models\DocumentoCorporativo;
use Illuminate\Database\Seeder;

class DocumentoCorporativoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documents = [
            [
                'nombre' => 'Política de privacidad',
                'icono' => 'shield',
                'ruta' => '/documentos_corporativos/Politica-Privacidad.pdf',
                'mostrar_en_footer' => true,
            ],
            [
                'nombre' => 'Manual Sagrilaft',
                'icono' => 'file-text',
                'ruta' => '/documentos_corporativos/Manual-Sagrilaft.pdf',
                'mostrar_en_footer' => true,
            ],
        ];

        foreach ($documents as $document) {
            DocumentoCorporativo::firstOrCreate(['nombre' => $document['nombre']], $document);
        }
    }
}
