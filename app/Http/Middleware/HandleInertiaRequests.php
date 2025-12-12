<?php

namespace App\Http\Middleware;

use App\Models\GestionModulos\Modulo;
use App\Services\ConfiguracionService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user) {
            $modulos = $user->rol->modulos()->get();

            $menu = $modulos
                ->whereNull('modulo_padre_id') // solo módulos raíz (padres y los independientes)
                ->map(function ($modulo) use ($modulos) {

                    // hijos del módulo
                    $hijos = $modulos
                        ->where('modulo_padre_id', $modulo->id)
                        ->map(fn($hijo) => [
                            'title' => $hijo->nombre,
                            'url'   => $hijo->ruta,
                            'icon'  => $hijo->icono,
                        ])
                        ->values();

                    // si tiene hijos → menú desplegable
                    if ($hijos->isNotEmpty()) {
                        return [
                            'title' => $modulo->nombre,
                            'icon'  => $modulo->icono,
                            'url'   => $modulo->ruta,
                            'items' => $hijos,
                        ];
                    }

                    // si no tiene → item normal
                    return [
                        'title' => $modulo->nombre,
                        'url'   => $modulo->ruta,
                        'icon'  => $modulo->icono,
                    ];
                })
                ->values();
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ?? null,
            ],
            'status' => fn() => session('status'),
            'menu' => $menu ?? [],
            'images' => ConfiguracionService::getGroup('image')
        ];
    }
}
