<?php

namespace App\Providers;

use App\Models\Empresa;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;

use App\Providers\CustomSqlServerConnector; // Importamos la clase del conector personalizado
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Registra cualquier servicio de la aplicación.
     *
     * Este método se utiliza para vincular clases o interfaces en el contenedor de servicios de Laravel.
     * En este caso, se realiza una sobreescritura (override) del conector de base de datos 'sqlsrv'.
     *
     * @return void
     */
    public function register(): void
    {
        /**
         * Sobreescritura del conector SQL Server predeterminado de Laravel.
         *
         * Vinculamos nuestro 'CustomSqlServerConnector' personalizado a la clave 'db.connector.sqlsrv'.
         * Esto asegura que cada vez que Laravel intente establecer una conexión SQL Server,
         * utilice nuestra clase personalizada en lugar de la versión incluida en el núcleo de Laravel.
         *
         * El objetivo es aplicar la corrección para el error "An invalid attribute was designated",
         * tal como se definió en la clase CustomSqlServerConnector.
         */
        $this->app->bind('db.connector.sqlsrv', CustomSqlServerConnector::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        /**
         * 🔹 Datos compartidos globalmente a las vistas de Inertia.
         * 
         * En este caso compartimos la lista de empresas solo para las páginas públicas.
         * 
         * - Se usa 'Inertia::share()' para enviar datos accesibles desde React mediante `usePage().props`.
         * - La consulta obtiene únicamente los campos necesarios, reduciendo carga innecesaria.
         * - Se filtran las empresas por su ID según los valores requeridos.
         */
        Inertia::share([
            'empresas' => function () {
                // Retorna una colección con las empresas específicas
                return Empresa::select('f010_id as id', 'f010_razon_social as name')
                    ->whereIn('f010_id', [1, 2, 5, 6, 7, 8, 17, 18, 19, 20])
                    ->get();
            },
        ]);
    }
}
