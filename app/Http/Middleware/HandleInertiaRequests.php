<?php

namespace App\Http\Middleware;

use App\Models\GestionModulos\Modulo;
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
            $modulos = Modulo::all();

            $padres = $modulos->filter(fn($modulo) => $modulo->es_padre == 1);
            $hijos = $modulos->filter(fn($m) => $m->modulo_padre_id != null);

            $menu = $padres->map(function ($padre) use ($hijos) {
                $items = $hijos
                    ->where('modulo_padre_id', $padre->id)
                    ->map(fn($hijo) => [
                        'title' => $hijo->nombre,
                        'url'   => $hijo->ruta,
                        'icon'  => $hijo->icono,
                    ])
                    ->values();


                return [
                    'title' => $padre->nombre,
                    'icon'  => $padre->icono,
                    'url'   => $padre->ruta,
                    ...(count($items) > 0 ? ['items' => $items] : []),
                ];
            });
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'status' => fn() => session('status'),
            'menu' => $menu ?? [],
        ];
    }
}
