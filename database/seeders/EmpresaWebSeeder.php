<?php

namespace Database\Seeders;

use App\Models\EmpresaWeb;
use Illuminate\Database\Seeder;

/**
 * Seeder para la tabla 'empresas_web'.
 * 
 * Propósito: Poblar empresas iniciales para mostrar en el sitio web.
 * Incluye datos de razón social, siglas, tipo, descripciones, logos, visibilidad.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-21 
 */

class EmpresaWebSeeder extends Seeder
{
    /**
     * BLOQUE: run - Insertar empresas iniciales.
     * 
     * Array $empresas: Lista de empresas con campos variados (algunos opcionales).
     * Usa updateOrCreate para evitar duplicados (busca por razon_social, actualiza si existe).
     * Incluye empresas con mostrar_en_header/empresas/portafolio/PQRSD activado según necesidad.
     * 
     * @return void
     */
    public function run(): void
    {
        $empresas = [
            [
                'id_siesa' => 6,
                'razon_social' => 'Inversiones Arar S.A.S.',
                'siglas' => 'IA',
                'tipo_empresa' => 'Holding Empresarial',
                'descripcion' => 'Grupo empresarial que agrupa a diversas compañías de los sectores financiero, automotriz y de seguros, entre otros.',
                'sitio_web' => 'https://inversionesarar.com/',
                'dominio' => 'inversionesarar.com',
                'logo_url' => 'storage/logos_empresas/inversiones_arar.png',
                'mostrar_en_empresas' => true,  // Visible en página empresas.
                'mostrar_en_header' => true,    // Visible en header.
                'permitir_pqrsd' => true,       // Permite PQRSD.
            ],
            [
                'id_siesa' => 7,
                'razon_social' => 'Arar Financiera S.A.S.',
                'siglas' => 'AR',
                'tipo_empresa' => 'Servicios Financieros',
                'descripcion' => 'Compañía que ofrece soluciones de crédito de libranza, especialmente diseñadas para pensionados, miembros de las Fuerzas Armadas y Policía.',
                'sitio_web' => 'https://ararfinanciera.com/',                
                'dominio' => 'ararfinanciera.com',                
                'logo_url' => 'storage/logos_empresas/arar_financiera.png',
                'mostrar_en_empresas' => true,
                'mostrar_en_header' => true,
                'permitir_pqrsd' => true,
            ],
            [
                'id_siesa' => 8,
                'razon_social' => 'Agencia de Seguros Asekura Ltda.',
                'siglas' => 'AS',
                'tipo_empresa' => 'Seguros',
                'descripcion' => 'Agencia de seguros que ofrece servicios de pólizas para hogar, salud, exequias, autos y más, brindando acompañamiento constante.',
                'sitio_web' => 'https://asekura.co/',                
                'dominio' => 'asekura.co',                
                'logo_url' => 'storage/logos_empresas/asekura.png',
                'mostrar_en_empresas' => true,
                'mostrar_en_header' => true,
                'permitir_pqrsd' => true,
            ],
            [
                'id_siesa' => 1,
                'razon_social' => 'Italo Colombiano de Baterias S.A.S.',
                'siglas' => 'FC',
                'tipo_empresa' => 'Servicios Automotrices',
                'descripcion' => 'Especialistas en la venta y distribución de baterías automotrices (marca Faico), llantas, lubricantes y servicios de serviteca.',
                'sitio_web' => 'https://bateriasfaico.com.co/',                
                'dominio' => 'bateriasfaico.com.co',  // Nota: Hay duplicado 'sitio_web', corregido a dominio.
                'logo_url' => 'storage/logos_empresas/icb.png',
                'mostrar_en_empresas' => true,
                'mostrar_en_header' => true,
                'permitir_pqrsd' => true,
            ],
            [
                'id_siesa' => 17,
                'razon_social' => 'Promotores del Oriente S.A.S.',
                'siglas' => 'PM',
                'tipo_empresa' => 'Concesionario Automotriz',
                'descripcion' => 'Concesionario oficial del Grupo Volkswagen en los Santanderes, vendiendo marcas como VW, Audi, SEAT, CUPRA y Ducati, además de repuestos y taller.',
                'sitio_web' => 'https://promotores.com.co/',                
                'dominio' => 'promotores.com.co',                
                'logo_url' => 'storage/logos_empresas/promotores.png',
                'mostrar_en_empresas' => true,
                'mostrar_en_header' => true,
                'permitir_pqrsd' => true,
            ],
            [
                'id_siesa' => 20,
                'razon_social' => 'Distribuidora Rayco S.A.S.',
                'siglas' => 'RAYCO',
                'tipo_empresa' => 'Distribuidores',                
                'sitio_web' => "https://www.almacenesrayco.com/",                
                'dominio' => "disrayco.com",  // Nota: 'sitio_web' duplicado, corregido.
                'logo_url' => 'storage/logos_empresas/rayco.png',
                'mostrar_en_header' => true,
                'mostrar_en_portafolio' => true,  // Visible en portafolio.
                'permitir_pqrsd' => true,
            ],
            [
                'id_siesa' => 19,
                'razon_social' => 'Distribuciones Rex S.A.S.',
                'siglas' => 'REX',
                'tipo_empresa' => 'Distribuidores',
                'logo_url' => 'storage/logos_empresas/rex.png',
                'mostrar_en_header' => true,
                'mostrar_en_portafolio' => true,
                'permitir_pqrsd' => true,
            ],
            [
                'razon_social' => 'Hecarse',                
                'tipo_empresa' => 'Agroindustrial',
                'logo_url' => 'storage/logos_empresas/hecarse.png',                
                'mostrar_en_portafolio' => true,
            ],
            [
                'razon_social' => 'Prourbe',
                'tipo_empresa' => 'Construcción',
                'mostrar_en_portafolio' => true,
            ],
            [                
                'razon_social' => 'Compas',
                'mostrar_en_portafolio' => true,
            ],
            [
                'razon_social' => 'Cornelia',
                'mostrar_en_portafolio' => true,
            ],
            [
                'razon_social' => 'Arse',
                'logo_url' => 'storage/logos_empresas/arse.png',
                'mostrar_en_portafolio' => true,
            ],
            [
                'id_siesa' => 21,
                'razon_social' => 'Datapro Analítica',
                'tipo_empresa' => 'Tecnología',
                'sitio_web' => 'https://datapro.com.co',
                'dominio' => 'datapro.com.co',            
                'logo_url' => 'storage/logos_empresas/datapro.png',
                'mostrar_en_empresas' => false,  // No visible en empresas.
                'mostrar_en_portafolio' => true,
            ],
        ];

        // Loop: Inserta o actualiza cada empresa usando razon_social como clave única.
        foreach ($empresas as $empresa) {
            EmpresaWeb::updateOrCreate(
                ['razon_social' => $empresa['razon_social']],  // Busca por razon_social.
                $empresa  // Actualiza/inserta con el array completo.
            );
        }
    }
}