<?php

namespace App\Http\Controllers;

/**
 * Controlador EmpresaWebController.
 * 
 * Propósito: Maneja vistas y lógica para el módulo "Empresas" dentro de "Administración Web".
 * Usa permisos basados en roles y pestañas para controlar acceso. Renderiza componentes React via Inertia.
 * 
 * Propiedades:
 * - $moduloId: ID fijo del módulo (6, para Empresas).
 * - $rol: Rol del usuario autenticado.
 * - $tabs: Pestañas accesibles del módulo para el rol.
 * - $moduloNombre: Nombre del módulo (para UI).
 * 
 * Métodos:
 * - index: Vista de listado de empresas.
 * - gestion: Vista de gestión (crear/editar) de empresas.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-27
 */

use App\Models\EmpresaWeb;
use App\Http\Requests\AdministracionWeb\EmpresaWebRequest;
use App\Models\GestionModulos\Modulo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmpresaWebController extends Controller
{

    // ID fijo del módulo Empresas (no cambia).
    protected int $moduloId = 6;

    // Rol del usuario autenticado (cargado en constructor).
    protected $rol;

    // Pestañas accesibles del módulo para el rol (array de pestañas).
    protected $tabs;

    // Nombre del módulo (para pasar a vistas).
    protected $moduloNombre;

    /**
     * Constructor: Inicializa propiedades con datos del usuario autenticado.
     * 
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
     * BLOQUE: index - Vista de listado de empresas.
     * 
     * Renderiza componente 'Listado' con empresas, pestañas y nombre del módulo.
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos/AdministracionWeb/Empresas/Listado', [
            'tabs' => $this->tabs,              // Pestañas accesibles.
            'empresas' => EmpresaWeb::all(),    // Todas las empresas.
            'moduloNombre' => $this->moduloNombre,  // Nombre del módulo.
        ]);
    }


    /**
     * BLOQUE: gestion - Vista de gestión de empresas.
     * 
     * Renderiza componente 'Gestion' para crear/editar empresas.
     * Similar a index, pero con permisos de la pestaña 2 (Gestión).
     * 
     * @return \Inertia\Response
     */
    public function gestion()
    {
        // Obtiene permisos específicos de la pestaña 2 (Gestión) para el rol.
        $permisos = $this->rol->getPermisosPestana(2);

        // Si puede editar, enviar empresas; si no, array vacío
        $empresas = in_array('editar', $permisos) ? EmpresaWeb::all() : [];

        // Renderiza vista Inertia con datos.
        return Inertia::render('Modulos/AdministracionWeb/Empresas/Gestion', [
            'tabs' => $this->tabs,              // Pestañas accesibles.
            'empresas' => $empresas,
            'permisos' => $permisos,            // Permisos de la pestaña.
            'moduloNombre' => $this->moduloNombre,  // Nombre del módulo.
        ]);
    }


    /**
     * Crea una nueva empresa.
     * 
     * Valida permiso "crear" antes de procesar.
     * Retorna JSON para evitar recarga de página.
     * 
     * @param EmpresaWebRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(EmpresaWebRequest $request)
    {
        try {
            // Validar permiso
            if (!$this->rol->tienePermisoPestana(2, 'crear')) {
                return response()->json([
                    'error' => 'No tienes permiso para crear empresas'
                ], 403);
            }

            $validated = $request->validated();

            // Manejar logo si existe
            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('/logos_empresas', $filename, 'public');
                $validated['logo_url'] = $path;
            }

            // Crear empresa
            $empresa = EmpresaWeb::create($validated);

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
     * Actualiza una empresa existente.
     * 
     * Valida permiso "editar" antes de procesar.
     * Retorna JSON para evitar recarga de página.
     * 
     * @param EmpresaWebRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(EmpresaWebRequest $request, int $id)
    {
        try {
            // Validar permiso
            if (!$this->rol->tienePermisoPestana(2, 'editar')) {
                return response()->json([
                    'error' => 'No tienes permiso para editar empresas'
                ], 403);
            }

            $empresa = EmpresaWeb::findOrFail($id);
            $validated = $request->validated();

            // Manejar logo si existe
            if ($request->hasFile('logo')) {
                // Eliminar logo anterior si existe
                if ($empresa->logo_url) {
                    \Storage::disk('public')->delete($empresa->logo_url);
                }

                $file = $request->file('logo');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('/logos_empresas', $filename, 'public');
                $validated['logo_url'] = $path;
            }

            // Actualizar empresa
            $empresa->update($validated);

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
     * Elimina (soft delete) una empresa.
     * 
     * Valida permiso "eliminar" antes de procesar.
     * Retorna JSON para evitar recarga de página.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        try {
            // Validar permiso
            if (!$this->rol->tienePermisoPestana(2, 'eliminar')) {
                return response()->json([
                    'error' => 'No tienes permiso para eliminar empresas'
                ], 403);
            }

            $empresa = EmpresaWeb::findOrFail($id);

            // Soft delete
            $empresa->delete();

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
}
