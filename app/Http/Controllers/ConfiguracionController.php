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
 * Maneja dos pestañas: Información Corporativa y Redes Sociales.
 * 
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class ConfiguracionController extends Controller
{
    /**
     * ID fijo del módulo Empresas (no cambia).
     * Usado para acceder a datos relacionados con el módulo.
     *
     * @var int
     */
    protected int $moduloId = 7;

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
     * Muestra la vista de Información Corporativa.
     * 
     * @return \Inertia\Response
     */
    public function informacionCorporativa()
    {
        // Obtener permisos de la pestaña
        $permisos = $this->rol->getPermisosPestana(3);

        // Obtener configuraciones de contacto e imágenes        
        $contact = ConfiguracionService::getGroup('contact');
        $images = ConfiguracionService::getGroup('image');

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
     * Muestra la vista de Redes Sociales.
     * 
     * @return \Inertia\Response
     */
    public function redesSociales()
    {
        // Obtener permisos de la pestaña
        $permisos = $this->rol->getPermisosPestana(4);

        // Obtener configuraciones de redes sociales
        $rrss = ConfiguracionService::getGroup('rrss');

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
     * Actualiza la información corporativa.
     * 
     * @param ConfiguracionRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateInformacionCorporativa(ConfiguracionRequest $request)
    {
        try {
            // Validar permiso
            if (!$this->rol->tienePermisoPestana(3, 'editar')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar la configuración'
                ], 403);
            }

            $validated = $request->validated();
            $updates = [];

            // Preparar actualizaciones de contacto
            if (isset($validated['email'])) {
                $updates['contact.email'] = $validated['email'];
            }
            if (isset($validated['telefono'])) {
                $updates['contact.telefono'] = $validated['telefono'];
            }
            if (isset($validated['ubicacion'])) {
                $updates['contact.ubicacion'] = $validated['ubicacion'];
            }
            if (isset($validated['ubicacion_detalles'])) {
                $updates['contact.ubicacion.detalles'] = $validated['ubicacion_detalles'];
            }
            if (isset($validated['ubicacion_url'])) {
                $updates['contact.ubicacion.url'] = $validated['ubicacion_url'];
            }

            // Manejar logo
            if ($request->hasFile('logo')) {
                $currentLogo = ConfiguracionService::get('image.logo');
                if ($currentLogo && Storage::disk('public')->exists($currentLogo)) {
                    Storage::disk('public')->delete($currentLogo);
                }

                $file = $request->file('logo');
                $filename = 'logo-arar-' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('identidad', $filename, 'public');
                $updates['image.logo'] = $path;
            }

            // Manejar icono
            if ($request->hasFile('icono')) {
                $currentIcono = ConfiguracionService::get('image.icono');
                if ($currentIcono && Storage::disk('public')->exists($currentIcono)) {
                    Storage::disk('public')->delete($currentIcono);
                }

                $file = $request->file('icono');
                $filename = 'icono-arar-' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('identidad', $filename, 'public');
                $updates['image.icono'] = $path;
            }

            // Actualizar todas las configuraciones
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
     * 
     * @param ConfiguracionRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateRedesSociales(ConfiguracionRequest $request)
    {
        try {
            // Validar permiso
            if (!$this->rol->tienePermisoPestana(4, 'editar')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar las redes sociales'
                ], 403);
            }

            $validated = $request->validated();
            $updates = [];

            // Preparar actualizaciones de redes sociales
            if (isset($validated['instagram'])) {
                $updates['rrss.instagram'] = $validated['instagram'];
            }
            if (isset($validated['facebook'])) {
                $updates['rrss.facebook'] = $validated['facebook'];
            }
            if (isset($validated['x'])) {
                $updates['rrss.x'] = $validated['x'];
            }
            if (isset($validated['linkedin'])) {
                $updates['rrss.linkedin'] = $validated['linkedin'];
            }

            // Actualizar todas las configuraciones
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
