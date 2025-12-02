<?php

namespace App\Http\Controllers;

use App\Models\Auditoria;
use App\Models\GestionModulos\Modulo;
use Carbon\Carbon;

use Inertia\Inertia;

/**
 * Controlador AuditoriaController.
 * 
 * Propósito: Gestionar vistas de auditorías (listado).
 * Transforma datos para incluir usuario con detalles (nombre, email, rol, cargo).
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-12-02
 */

class AuditoriaController extends Controller
{
    // ID fijo del módulo Auditorias (no cambia).
    protected int $moduloId = 5;
    // Nombre del módulo (para pasar a vistas).
    protected $moduloNombre;

    public function __construct()
    {
        // Obtiene nombre del módulo por ID.
        $this->moduloNombre = Modulo::find($this->moduloId)->nombre;
    }

    /**
     * Mostrar listado de auditorías.
     * 
     * Transforma auditorías para incluir usuario como objeto (si existe).
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        $auditorias = Auditoria::with('usuario')->orderByDesc('id')->get()->map(function ($auditoria) {
            return [
                'id' => $auditoria->id,
                'tabla_afectada' => $auditoria->tabla_afectada,
                'id_registro_afectado' => $auditoria->id_registro_afectado,
                'accion' => $auditoria->accion,
                'usuario' => $auditoria->usuario ? [
                    'id' => $auditoria->usuario->id,
                    'name' => $auditoria->usuario->datos_completos->nombres,
                    'lastname' => $auditoria->usuario->datos_completos->apellidos,
                    'email' => $auditoria->usuario->email,
                    'rol' => $auditoria->usuario->rol->nombre ?? 'Sin rol',
                    'cargo' => $auditoria->usuario->datos_completos->cargo ?? 'Sin cargo', 
                ] : null,  // Si no hay usuario, null.
                'usuario_nombre' => $auditoria->usuario
                    ? $auditoria->usuario->datos_completos->nombres . ' ' . $auditoria->usuario->datos_completos->apellidos
                    : null,
                'fecha' => Carbon::parse($auditoria->fecha_creacion)->format('Y-m-d H:i:s'),  // Parsea y formatea.
                'cambios' => $auditoria->cambios ? json_decode($auditoria->cambios, true) : null,  // Array de cambios.
            ];
        });

        return Inertia::render('Modulos/Auditorias/Listado', [
            'auditorias' => $auditorias,
            'moduloNombre' => $this->moduloNombre,
        ]);
    }
}
