<?php

namespace App\Providers;

use App\Models\EmpresaWeb;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

use App\Providers\CustomSqlServerConnector; // Importamos la clase del conector personalizado
use App\Services\ConfiguracionService;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
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
        // Solo ejecuta si la tabla 'configuracions' existe (para evitar errores durante migraciones)
        if (Schema::hasTable('configuracions')) {
            
            $images = ConfiguracionService::getGroup('image');
            View::share('images', $images);
        }
    }
}
