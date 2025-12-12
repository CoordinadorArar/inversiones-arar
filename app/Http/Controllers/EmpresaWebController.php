<?php

namespace App\Http\Controllers;

use App\Models\EmpresaWeb;
use App\Http\Requests\AdministracionWeb\EmpresaWebRequest;
use App\Models\GestionModulos\Modulo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

/**
 * Controlador para gestionar empresas en el módulo de Administración Web.
 * Maneja vistas de listado y gestión, operaciones CRUD (crear, leer, actualizar, eliminar),
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 * Maneja dos pestañas: Listado y Gestión.
 *
 * @author Yariangel Aray
 * @date 2025-11-27
 */
class EmpresaWebController extends Controller
{
    /**
     * ID fijo del módulo "Empresas".
     * Se usa para obtener pestañas y nombre del módulo.
     *
     * @var int
     */
    protected int $moduloId = 6;

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
     * Muestra la vista de listado de empresas en React via Inertia.
     * Renderiza el componente 'Listado' con empresas ordenadas, pestañas y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index()
    {
        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:AdministracionWeb/Empresas/pages/Listado', [
            'tabs' => $this->tabs,
            'empresas' => $this->getEmpresasCacheadas(),
            'moduloNombre' => $this->moduloNombre,
        ]);
    }

    /**
     * Muestra la vista de gestión de empresas en React via Inertia.
     * Renderiza el componente 'Gestion' con empresas (si tiene permiso de editar), permisos de la pestaña 2 y datos del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function gestion()
    {
        // Obtiene permisos específicos de la pestaña 2 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(2);

        // Si puede editar, enviar empresas; si no, array vacío.
        $empresas = in_array('editar', $permisos)
            ? $this->getEmpresasCacheadas()
            : [];

        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:AdministracionWeb/Empresas/pages/Gestion', [
            'tabs' => $this->tabs,
            'empresas' => $empresas,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'idle',
            'initialEmpresaId' => null,
        ]);
    }

    /**
     * Vista: Gestión - Modo crear.
     * Renderiza la misma vista pero con el formulario en modo crear.
     * URL: /gestion/crear.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Obtiene permisos específicos de la pestaña 2 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(2);

        if (!in_array('crear', $permisos)) {
            // Retorna la vista de gestión con un error adicional (sin re-renderizar, solo agrega prop 'error').
            return $this->gestion()->with('error', 'No tienes permiso para crear empresas');
        }

        // Si puede editar, enviar empresas; si no, array vacío.
        $empresas = in_array('editar', $permisos)
            ? $this->getEmpresasCacheadas()
            : [];

        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:AdministracionWeb/Empresas/pages/Gestion', [
            'tabs' => $this->tabs,
            'empresas' => $empresas,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'create',
            'initialEmpresaId' => null,
        ]);
    }

    /**
     * Vista: Gestión - Modo editar.
     * Renderiza la misma vista pero con el formulario en modo editar.
     * URL: /gestion/{id}.
     *
     * @param int $id ID de la empresa a editar.
     * @return \Inertia\Response
     */
    public function edit(int $id)
    {
        $permisos = $this->rol->getPermisosPestana(2);

        if (!in_array('editar', $permisos)) {
            // Retorna la vista de gestión con un error adicional.
            return $this->gestion()->with('error', 'No tienes permiso para editar empresas');
        }

        // Verificar que la empresa existe.
        $empresa = EmpresaWeb::find($id);

        if (!$empresa) {
            // Retorna la vista de gestión con un error adicional.
            return $this->gestion()->with('error', 'La empresa no existe');
        }

        // Obtener todas las empresas para el select.
        $empresas = $this->getEmpresasCacheadas();

        return Inertia::render('Modulos:AdministracionWeb/Empresas/pages/Gestion', [
            'tabs' => $this->tabs,
            'empresas' => $empresas,
            'permisos' => $permisos,
            'moduloNombre' => $this->moduloNombre,
            'initialMode' => 'edit',
            'initialEmpresaId' => $id,
        ]);
    }

    /**
     * Crea una nueva empresa en la base de datos.
     * Valida permisos, maneja subida de logo y retorna respuesta JSON.
     *
     * @param EmpresaWebRequest $request Solicitud con datos validados para crear la empresa.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function store(EmpresaWebRequest $request)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana(2, 'crear')) {
                return response()->json([
                    'error' => 'No tienes permiso para crear empresas'
                ], 403);
            }

            $validated = $request->validated();

            // Manejar logo si existe: Subir archivo y guardar path.
            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('/logos_empresas', $filename, 'public');
                $validated['logo_url'] = $path;
            }

            // Crear empresa.
            $empresa = EmpresaWeb::create($validated);

            // Invalidar cache después de crear.
            Cache::forget('empresas_web_list');
            Cache::forget('dominios_empresas');
            return response()->json([
                'message' => 'Empresa creada correctamente',
                'empresa' => $empresa
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error al crear empresa: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al crear la empresa. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Actualiza una empresa existente en la base de datos.
     * Valida permisos, maneja subida de logo (eliminando anterior si existe) y retorna respuesta JSON.
     *
     * @param EmpresaWebRequest $request Solicitud con datos validados para actualizar.
     * @param int $id ID de la empresa a actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function update(EmpresaWebRequest $request, int $id)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana(2, 'editar')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar empresas'
                ], 403);
            }

            $empresa = EmpresaWeb::findOrFail($id);
            $validated = $request->validated();

            // Manejar logo si existe: Eliminar anterior y subir nuevo.
            if ($request->hasFile('logo')) {
                // Eliminar logo anterior si existe.
                if ($empresa->logo_url) {
                    \Storage::disk('public')->delete($empresa->logo_url);
                }
                $file = $request->file('logo');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('/logos_empresas', $filename, 'public');
                $validated['logo_url'] = $path;
            }

            // Actualizar empresa.
            $empresa->update($validated);

            // Invalidar cache después de actualizar.
            Cache::forget('empresas_web_list');
            Cache::forget('dominios_empresas');

            return response()->json([
                'message' => 'Empresa actualizada correctamente',
                'empresa' => $empresa
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar empresa: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al actualizar la empresa. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Elimina una empresa de la base de datos (soft delete).
     * Valida permisos y retorna respuesta JSON.
     *
     * @param int $id ID de la empresa a eliminar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function destroy(int $id)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana(2, 'eliminar')) {
                return response()->json([
                    'error' => 'No tienes permiso para eliminar empresas'
                ], 403);
            }

            $empresa = EmpresaWeb::findOrFail($id);

            // Soft delete.
            $empresa->delete();

            // Invalidar cache después de eliminar.
            Cache::forget('empresas_web_list');
            Cache::forget('dominios_empresas');
            return response()->json([
                'message' => 'Empresa eliminada correctamente'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al eliminar empresa: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al eliminar la empresa. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Método auxiliar para obtener empresas cacheadas.
     * Cachea por 5 minutos para evitar consultas repetidas.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getEmpresasCacheadas()
    {
        return Cache::remember('empresas_web_list', 300, function () { // 300 segundos = 5 minutos
            return EmpresaWeb::orderByDesc('id')->get();
        });
    }
}
