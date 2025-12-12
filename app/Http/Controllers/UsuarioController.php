<?php

namespace App\Http\Controllers;

use App\Http\Requests\SeguridadAcceso\UsuarioRequest;
use App\Mail\PasswordGeneradaMail;
use App\Models\ContratoPropietario;
use App\Models\EmpresaWeb;
use App\Models\GestionModulos\Modulo;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

/**
 * Controlador para gestionar usuarios en el módulo de Seguridad y Acceso.
 * Maneja vistas de listado y gestión, operaciones CRUD (crear, leer, actualizar, eliminar),
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 * Maneja dos pestañas: Listado y Gestión.
 *
 * @author Yariangel Aray
 * @date 2025-12-09
 */
class UsuarioController extends Controller
{
    /**
     * ID fijo del módulo "Usuarios".
     * Se usa para obtener pestañas y nombre del módulo.
     *
     * @var int
     */
    protected int $moduloId = 9;

    /**
     * Rol del usuario autenticado.
     * Contiene la lógica de permisos por pestaña.
     *
     * @var mixed
     */
    protected $rol;

    /**
     * Pestañas accesibles del módulo según el rol.
     *
     * @var mixed
     */
    protected $tabs;

    /**
     * Nombre del módulo cargado desde base de datos.
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
     * Muestra la vista de listado de usuarios en React via Inertia.
     * Renderiza el componente 'Listado' con usuarios ordenados, pestañas y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        return Inertia::render('Modulos:SeguridadAcceso/Usuarios/pages/Listado', [
            'tabs' => $this->tabs,
            'usuarios' => $this->getUsuariosCacheados(),
            'moduloNombre' => $this->moduloNombre,
        ]);
    }

    /**
     * Muestra la vista de gestión de usuarios en React via Inertia.
     * Renderiza el componente 'Gestion' con usuarios (si tiene permiso de editar), permisos de la pestaña 9, roles y datos del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function gestion()
    {
        // Obtiene permisos específicos de la pestaña 9 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(9);

        // Si puede editar, enviar usuarios; si no, array vacío.
        $usuarios = in_array('editar', $permisos) ? $this->getUsuariosCacheados() : [];

        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:SeguridadAcceso/Usuarios/pages/Gestion', [
            'tabs' => $this->tabs,
            'usuarios' => $usuarios,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'roles' => Rol::all(),
            'dominios' => (new EmpresaWeb())->getDominiosCacheados(),
            'initialMode' => 'idle',
            'initialUsuarioId' => null,
        ]);
    }

    /**
     * Vista: Gestión - Modo crear.
     * Renderiza la misma vista pero con el formulario en modo crear.
     * URL: /gestion/crear.
     *
     * @return \Inertia\Response Respuesta de Inertia con vista en modo crear.
     */
    public function create()
    {
        $permisos = $this->rol->getPermisosPestana(9);

        if (!in_array('crear', $permisos)) {
            // Retorna la vista de gestión con un error adicional.
            return $this->gestion()->with('error', 'No tienes permiso para crear usuarios');
        }

        $usuarios = in_array('editar', $permisos)
            ? $this->getUsuariosCacheados()
            : [];

        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:SeguridadAcceso/Usuarios/pages/Gestion', [
            'tabs' => $this->tabs,
            'usuarios' => $usuarios,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'roles' => Rol::all(),
            'dominios' => (new EmpresaWeb())->getDominiosCacheados(),
            'initialMode' => 'create',
            'initialUsuarioId' => null,
        ]);
    }

    /**
     * Vista: Gestión - Modo editar.
     * Renderiza la misma vista pero con el formulario en modo editar.
     * URL: /gestion/{id}.
     *
     * @param int $id ID del usuario a editar.
     * @return \Inertia\Response Respuesta de Inertia con vista en modo editar.
     */
    public function edit(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(9);

        if (!in_array('editar', $permisos)) {
            // Retorna la vista de gestión con un error adicional.
            return $this->gestion()->with('error', 'No tienes permiso para editar usuarios');
        }

        // Verificar que el usuario existe.
        $usuario = User::find($id);

        if (!$usuario) {
            // Retorna la vista de gestión con un error adicional.
            return $this->gestion()->with('error', 'El usuario no existe');
        }

        $usuarios = $this->getUsuariosCacheados();

        return Inertia::render('Modulos:SeguridadAcceso/Usuarios/pages/Gestion', [
            'tabs' => $this->tabs,
            'usuarios' => $usuarios,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'roles' => Rol::all(),
            'dominios' => (new EmpresaWeb())->getDominiosCacheados(),
            'initialMode' => 'edit',
            'initialUsuarioId' => $id,
        ]);
    }

    /**
     * API: Buscar documentos en BD externa con contratos activos.
     * Retorna lista de documentos que coinciden + indica si ya existen en users.
     *
     * @param Request $request Solicitud con parámetro 'search'.
     * @return \Illuminate\Http\JsonResponse Lista de resultados o error.
     */
    public function buscarDocumentos(Request $request)
    {
        $search = $request->input('search');

        if (strlen($search) < 5) {
            return response()->json([
                'resultados' => []
            ]);
        }

        try {
            // Buscar en tabla de terceros (BD externa) donde el documento coincida.
            $terceros = ContratoPropietario::where('f200_id', 'LIKE', '%' . $search . '%')
                ->get();

            $resultados = [];

            foreach ($terceros as $tercero) {
                // Verificar si tiene contrato activo.
                if (!$tercero->hasContratoActivo()) {
                    continue;
                }

                // Verificar si ya existe en tabla usuarios.
                $yaExiste = User::where('numero_documento', $tercero->f200_id)->exists();

                $resultados[] = [
                    'documento' => $tercero->f200_id,
                    'nombre' => trim($tercero->f200_razon_social),
                    'yaExiste' => $yaExiste,
                ];
            }

            return response()->json([
                'resultados' => $resultados
            ]);
        } catch (\Exception $e) {
            \Log::error('Error buscando documentos: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al buscar documentos'
            ], 500);
        }
    }

    /**
     * Crea un nuevo usuario en la base de datos.
     * Valida permisos, contrato activo, genera contraseña y envía email.
     *
     * @param UsuarioRequest $request Solicitud con datos validados.
     * @return \Illuminate\Http\JsonResponse Usuario creado o error.
     */
    public function store(UsuarioRequest $request)
    {
        $permisos = $this->rol->getPermisosPestana(9);

        if (!in_array('crear', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para crear usuarios'
            ], 403);
        }

        $validated = $request->validated();

        try {
            // Verificar que tiene contrato activo.
            $tercero = ContratoPropietario::where('f200_id', $validated['numero_documento'])->first();

            if (!$tercero || !$tercero->hasContratoActivo()) {
                return response()->json([
                    'errors' => [
                        'numero_documento' => 'Este documento no tiene un contrato activo'
                    ]
                ], 422);
            }

            $usuario = User::create([
                'numero_documento' => $validated['numero_documento'],
                'email' => $validated['email'],
                'rol_id' => $validated['rol_id'],
            ]);

            // Generar contraseña inicial: {documento}{LetraApellido}{LetraNombre}.
            $passwordInicial = $this->generarPasswordInicial(
                $validated['numero_documento'],
                $usuario->info_corta->nombres,
                $usuario->info_corta->apellidos
            );

            $usuario->update([
                'password' => Hash::make($passwordInicial),
            ]);

            // Enviar email.
            Mail::to($usuario->email)->send(
                new PasswordGeneradaMail($usuario, $passwordInicial)
            );

            // Limpiar caché.
            Cache::forget('usuarios_list');

            return response()->json([
                'message' => 'Usuario creado correctamente',
                'usuario' => [
                    'id' => $usuario->id,
                    'numero_documento' => $usuario->numero_documento,
                    'nombres' => $usuario->info_corta->nombres,
                    'apellidos' => $usuario->info_corta->apellidos,
                    'email' => $usuario->email,
                    'rol_id' => $usuario->rol_id,
                    'rol' => [
                        'id' => $usuario->rol->id,
                        'nombre' => $usuario->rol->nombre,
                    ],
                    'bloqueado_at' => null,
                ]
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creando usuario: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al crear el usuario'
            ], 500);
        }
    }

    /**
     * Actualizar usuario.
     *
     * @param UsuarioRequest $request Solicitud con datos validados.
     * @param int $id ID del usuario a actualizar.
     * @return \Illuminate\Http\JsonResponse Usuario actualizado o error.
     */
    public function update(UsuarioRequest $request, int $id)
    {
        $permisos = $this->rol->getPermisosPestana(9);

        if (!in_array('editar', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para editar usuarios'
            ], 403);
        }

        $usuario = User::findOrFail($id);

        $validated = $request->validated();

        try {
            $usuario->update([
                'email' => $validated['email'],
                'rol_id' => $validated['rol_id'],
            ]);

            Cache::forget('usuarios_list');

            return response()->json([
                'message' => 'Usuario actualizado correctamente',
                'usuario' => [
                    'id' => $usuario->id,
                    'numero_documento' => $usuario->numero_documento,
                    'nombres' => $usuario->info_corta->nombres,
                    'apellidos' => $usuario->info_corta->apellidos,
                    'email' => $usuario->email,
                    'rol_id' => $usuario->rol_id,
                    'rol' => [
                        'id' => $usuario->rol->id,
                        'nombre' => $usuario->rol->nombre,
                    ],
                    'bloqueado_at' => $usuario->bloqueado_at,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error actualizando usuario: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al actualizar el usuario'
            ], 500);
        }
    }

    /**
     * Bloquear usuario.
     *
     * @param int $id ID del usuario a bloquear.
     * @return \Illuminate\Http\JsonResponse Mensaje de éxito o error.
     */
    public function bloquear(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(9);

        if (!in_array('bloquear', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para bloquear usuarios'
            ], 403);
        }

        try {
            $usuario = User::findOrFail($id);
            $usuario->update(['bloqueado_at' => now()]);

            Cache::forget('usuarios_list');

            return response()->json([
                'message' => 'Usuario bloqueado correctamente'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error bloqueando usuario: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al bloquear el usuario'
            ], 500);
        }
    }

    /**
     * Desbloquear usuario.
     *
     * @param int $id ID del usuario a desbloquear.
     * @return \Illuminate\Http\JsonResponse Mensaje de éxito o error.
     */
    public function desbloquear(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(9);

        if (!in_array('bloquear', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para desbloquear usuarios'
            ], 403);
        }

        try {
            $usuario = User::findOrFail($id);
            $usuario->update(['bloqueado_at' => null]);

            Cache::forget('usuarios_list');

            return response()->json([
                'message' => 'Usuario desbloqueado correctamente'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error desbloqueando usuario: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al desbloquear el usuario'
            ], 500);
        }
    }

    /**
     * Restaurar contraseña con formato {documento}{LetraApellido}{LetraNombre}.
     *
     * @param int $id ID del usuario.
     * @return \Illuminate\Http\JsonResponse Mensaje de éxito o error.
     */
    public function restaurarPassword(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(9);

        if (!in_array('restaurar_password', $permisos)) {
            return response()->json([
                'error' => 'No tienes permiso para restaurar contraseñas'
            ], 403);
        }

        try {
            $usuario = User::findOrFail($id);

            // Generar contraseña: {documento}{LetraApellido}{LetraNombre}.
            $nuevaPassword = $this->generarPasswordInicial($usuario->numero_documento, $usuario->info_corta->nombres, $usuario->info_corta->apellidos);

            $usuario->update([
                'password' => Hash::make($nuevaPassword)
            ]);

            // Enviar email.
            Mail::to($usuario->email)
                ->cc(['desarrollo01@inversionesarar.com'])
                ->send(
                    new PasswordGeneradaMail($usuario, $nuevaPassword)
                );

            return response()->json([
                'message' => 'Contraseña restaurada. Se ha enviado un correo al usuario con la nueva contraseña.'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error restaurando contraseña: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al restaurar la contraseña'
            ], 500);
        }
    }

    /**
     * Método auxiliar para obtener usuarios cacheados.
     * Cachea por 5 minutos para evitar consultas repetidas.
     *
     * @return array Lista de usuarios formateados con rol incluido.
     */
    private function getUsuariosCacheados()
    {
        return Cache::remember('usuarios_list', 300, function () { // 300 segundos = 5 minutos
            return User::with('rol')->orderByDesc('id')->get()->map(function ($usuario) {
                return [
                    'id' => $usuario->id,
                    'numero_documento' => $usuario->numero_documento,
                    'nombres' => $usuario->info_corta->nombres,
                    'apellidos' => $usuario->info_corta->apellidos,
                    'email' => $usuario->email,
                    'rol' => [
                        'id' => $usuario->rol_id,
                        'nombre' => $usuario->rol->nombre,
                    ],
                    'rol_id' => $usuario->rol_id,
                    'bloqueado_at' => $usuario->bloqueado_at
                ];
            });
        });
    }

    /**
     * Genera contraseña inicial basada en documento y nombre.
     * Formato: {documento}{PrimeraLetraApellido}{PrimeraLetraNombre}.     
     *
     * @param string $documento Número de documento del usuario.
     * @param string $nombreCompleto Nombre completo (apellidos nombres).
     * @return string Contraseña generada.
     */
    private function generarPasswordInicial(string $documento, string $nombres, string $apellidos): string
    {
        $nombre = explode(' ', trim($nombres))[0];
        $apellido = explode(' ', trim($apellidos))[0];

        // Tomar primera letra del primer apellido (Apellido)
        $primeraLetraApellido = isset($apellido) ? strtoupper(substr($apellido, 0, 1)) : '';

        // Tomar primera letra del primer nombre (Nombre)
        $primeraLetraNombre = isset($nombre) ? strtolower(substr($nombre, 0, 1)) : '';

        // Formato: {documento}{LetraApellido}{LetraNombre}.
        return $documento . $primeraLetraApellido . $primeraLetraNombre . '.';
    }
}
