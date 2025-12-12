<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdministracionWeb\ConfiguracionRequest;
use App\Models\GestionModulos\Modulo;
use App\Services\ConfiguracionService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/**
 * Controlador para gestionar configuraciones generales del sistema.
 * Maneja vistas de información corporativa y redes sociales, operaciones de actualización,
 * integrándose con React via Inertia y verificando permisos por rol y pestaña.
 * Usa ConfiguracionService para obtener y actualizar configuraciones.
 * Maneja dos pestañas: Información Corporativa y Redes Sociales.
 *
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class ConfiguracionController extends Controller
{
    /**
     * ID fijo del módulo "Configuración General".
     * Se usa para obtener pestañas y nombre del módulo.
     *
     * @var int
     */
    protected int $moduloId = 7;

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
     * Muestra la vista de Información Corporativa en React via Inertia.
     * Renderiza el componente 'InformacionCorporativa' con configuraciones de contacto e imágenes, pestañas, permisos y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function informacionCorporativa()
    {
        // Obtiene permisos específicos de la pestaña 3 (Información Corporativa) para el rol.
        $permisos = $this->rol->getPermisosPestana(3);

        // Obtener configuraciones de contacto e imágenes usando ConfiguracionService.
        $contact = ConfiguracionService::getGroup('contact');
        $images = ConfiguracionService::getGroup('image');

        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:AdministracionWeb/ConfiguracionGeneral/pages/InformacionCorporativa', [
            'tabs' => $this->tabs,
            'moduloNombre' => $this->moduloNombre,
            'permisos' => $permisos,
            'configuracion' => [
                'contact' => $contact,
                'images' => $images,
            ]
        ]);
    }

    /**
     * Muestra la vista de Redes Sociales en React via Inertia.
     * Renderiza el componente 'RedesSociales' con configuraciones de redes sociales, pestañas, permisos y nombre del módulo.
     *
     * @return \Inertia\Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function redesSociales()
    {
        // Obtiene permisos específicos de la pestaña 4 (Redes Sociales) para el rol.
        $permisos = $this->rol->getPermisosPestana(4);

        // Obtener configuraciones de redes sociales usando ConfiguracionService.
        $rrss = ConfiguracionService::getGroup('rrss');

        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos:AdministracionWeb/ConfiguracionGeneral/pages/RedesSociales', [
            'tabs' => $this->tabs,
            'moduloNombre' => $this->moduloNombre,
            'permisos' => $permisos,
            'configuracion' => [
                'rrss' => $rrss,
            ]
        ]);
    }

    /**
     * Actualiza la información corporativa (contacto e imágenes).
     * Valida permisos, maneja subida de archivos (logo e icono eliminando anteriores si existen) y retorna respuesta JSON.
     *
     * @param ConfiguracionRequest $request Solicitud con datos validados para actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function updateInformacionCorporativa(ConfiguracionRequest $request)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana(3, 'editar')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar la configuración'
                ], 403);
            }

            $validated = $request->validated();
            $updates = [];

            // Preparar actualizaciones de campos de contacto.
            $contactFields = ['email', 'telefono', 'ubicacion', 'ubicacion_detalles', 'ubicacion_url'];
            foreach ($contactFields as $field) {
                if ($request->has($field)) {
                    $updates['contact.' . str_replace('_', '.', $field)] = $validated[$field] ?? '';
                }
            }

            // Manejar logo si existe: Eliminar anterior y subir nuevo.
            if ($request->hasFile('logo')) {
                // Eliminar logo anterior si existe.
                $currentLogo = ConfiguracionService::get('image.logo');
                if ($currentLogo && Storage::disk('public')->exists($currentLogo)) {
                    Storage::disk('public')->delete($currentLogo);
                }

                $file = $request->file('logo');
                $filename = 'logo-arar-' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('/identidad', $filename, 'public');
                $updates['image.logo'] = $path;
            }

            // Manejar icono si existe: Eliminar anterior y subir nuevo.
            if ($request->hasFile('icono')) {
                // Eliminar icono anterior si existe.
                $currentIcono = ConfiguracionService::get('image.icono');
                if ($currentIcono && Storage::disk('public')->exists($currentIcono)) {
                    Storage::disk('public')->delete($currentIcono);
                }

                $file = $request->file('icono');
                $filename = 'icono-arar-' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('identidad', $filename, 'public');
                $updates['image.icono'] = $path;
            }

            // Actualizar todas las configuraciones usando ConfiguracionService.
            ConfiguracionService::updateMultiple($updates);

            return response()->json([
                'message' => 'Configuración actualizada correctamente'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar configuración corporativa: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al actualizar la configuración. Por favor intenta más tarde.'
            ], 500);
        }
    }

    /**
     * Actualiza las redes sociales.
     * Valida permisos y retorna respuesta JSON.
     *
     * @param ConfiguracionRequest $request Solicitud con datos validados para actualizar.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito o error.
     */
    public function updateRedesSociales(ConfiguracionRequest $request)
    {
        try {
            // Validar permiso.
            if (!$this->rol->tienePermisoPestana(4, 'editar')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar las redes sociales'
                ], 403);
            }

            $validated = $request->validated();
            $updates = [];

            // Preparar actualizaciones de campos de redes sociales.
            $rrssFields = ['instagram', 'facebook', 'x', 'linkedin'];
            foreach ($rrssFields as $field) {
                if ($request->has($field)) {
                    $updates['rrss.' . $field] = $validated[$field] ?? '';
                }
            }

            // Actualizar todas las configuraciones usando ConfiguracionService.
            ConfiguracionService::updateMultiple($updates);

            return response()->json([
                'message' => 'Redes sociales actualizadas correctamente'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar redes sociales: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Hubo un error al actualizar las redes sociales. Por favor intenta más tarde.'
            ], 500);
        }
    }
}