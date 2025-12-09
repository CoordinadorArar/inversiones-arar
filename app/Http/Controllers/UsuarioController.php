<?php

namespace App\Http\Controllers;

use App\Models\GestionModulos\Modulo;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function PHPSTORM_META\map;

class UsuarioController extends Controller
{
    /**
     * ID fijo del módulo Usuarios (no cambia).
     * Usado para acceder a datos relacionados con el módulo.
     *
     * @var int
     */
    protected int $moduloId = 9;

    /**
     * Rol del usuario autenticado (cargado en constructor).
     * Contiene el objeto rol para acceder a permisos y pestañas.
     *
     * @var mixed
     */
    protected $rol;

    /**
     * Pestañas accesibles del módulo para el rol (array de pestañas).
     * Lista de pestañas que el usuario puede ver según su rol.
     *
     * @var mixed
     */
    protected $tabs;

    /**
     * Nombre del módulo (para pasar a vistas).
     * Nombre del módulo obtenido de la base de datos, usado en las vistas de Inertia.
     *
     * @var mixed
     */
    protected $moduloNombre;

    /**
     * Constructor: Inicializa propiedades con datos del usuario autenticado.
     * Carga rol, pestañas accesibles y nombre del módulo para usar en métodos.
     * Se ejecuta automáticamente al instanciar el controlador.
     */
    public function __construct()
    {
        // Obtiene el rol del usuario logueado.
        $this->rol = Auth::user()->rol;

        // Obtiene pestañas accesibles del módulo para el rol (método en modelo Rol).
        $this->tabs = $this->rol->getPestanasModulo($this->moduloId);

        // Obtiene nombre del módulo por ID.
        $this->moduloNombre = Modulo::find($this->moduloId)->nombre;
    }

    /**
     * Muestra la lista de estados de PQRS en la vista de React via Inertia.
     * Recupera todos los estados ordenados por ID descendente, junto con pestañas, permisos y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        $permisos = $this->rol->getPermisosPestana(8);

        $usuarios = User::with('rol')->orderByDesc('id')->get()->map(function ($usuario) {
            return [
                'id' => $usuario->id,
                'numero_documento' => $usuario->numero_documento,
                'nombre_completo' => $usuario->info_corta->nombres . " " . $usuario->info_corta->apellidos,
                'email' => $usuario->email,
                'rol' => [
                    'id' => $usuario->rol_id,
                    'nombre' => $usuario->rol->nombre,
                ],
                'rol_id' => $usuario->rol_id,
                'bloqueado_at' => $usuario->bloqueado_at
            ];
        });

        return Inertia::render('Modulos:SeguridadAcceso/Usuarios/pages/Listado', [
            'tabs' => $this->tabs,
            'usuarios' => $usuarios,            
            'moduloNombre' => $this->moduloNombre,
            'permisos' => $permisos,
        ]);
    }

    public function gestion()
    {
        // Obtiene permisos específicos de la pestaña 2 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(9);

        // Si puede editar, enviar empresas; si no, array vacío
        $usuarios = in_array('editar', $permisos) ? User::with('rol')->orderByDesc('id')->get()->map(function ($usuario) {
            return [
                'id' => $usuario->id,
                'numero_documento' => $usuario->numero_documento,
                'nombre_completo' => $usuario->info_corta->nombres . " " . $usuario->info_corta->apellidos,
                'email' => $usuario->email,
                'rol' => [
                    'id' => $usuario->rol_id,
                    'nombre' => $usuario->rol->nombre,
                ],
                'rol_id' => $usuario->rol_id,
                'bloqueado_at' => $usuario->bloqueado_at
            ];
        }) : [];        

        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:SeguridadAcceso/Usuarios/pages/Gestion', [
            'tabs' => $this->tabs,              // Pestañas accesibles.
            'usuarios' => $usuarios,
            'permisos' => $permisos,            // Permisos de la pestaña.
            'moduloNombre' => $this->moduloNombre,  // Nombre del módulo.
            'roles' => Rol::all()
        ]);
    }
}
