<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\EmpresaWeb;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador para gestionar el perfil del usuario autenticado.
 * Maneja vista de perfil, actualización de información y eliminación de cuenta,
 * integrándose con React via Inertia.
 * Maneja una vista: Perfil de Usuario.
 *
 * @author Yariangel Aray
 * @date 2025-12-12 - Documentado
 */
class ProfileController extends Controller
{
    /**
     * Muestra el formulario de perfil del usuario en React via Inertia.
     * Renderiza el componente 'Profile' con información del usuario, dominios permitidos y estado de sesión.
     *
     * @param Request $request Solicitud HTTP actual.
     * @return Response Respuesta de Inertia con la vista y datos necesarios.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        
        // Agregar flag de datos completos al usuario.
        $user->datos_completos = $user->datosCompletos();

        // Renderiza vista Inertia con datos.
        return Inertia::render('Profile/Profile', [
            'dominios' => (new EmpresaWeb())->getDominiosCacheados(),
            'status' => session('status'),
            'user' => $user,
        ]);
    }

    /**
     * Actualiza la información del perfil del usuario.
     * Valida datos con ProfileUpdateRequest y guarda cambios en la base de datos.
     *
     * @param ProfileUpdateRequest $request Solicitud con datos validados para actualizar.
     * @return RedirectResponse Redirección a la página anterior con mensaje de éxito.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // Llenar datos del usuario con datos validados.
        $request->user()->fill($request->validated());

        // Guardar cambios en base de datos.
        $request->user()->save();

        return back()->with('status', 'email-updated');
    }

    // /**
    //  * Elimina la cuenta del usuario (soft delete).
    //  * Valida contraseña, cierra sesión, elimina usuario e invalida la sesión.
    //  *
    //  * @param Request $request Solicitud HTTP actual.
    //  * @return RedirectResponse Redirección a la página de inicio.
    //  */
    // public function destroy(Request $request): RedirectResponse
    // {
    //     // Validar que la contraseña sea correcta.
    //     $request->validate([
    //         'password' => ['required', 'current_password'],
    //     ]);

    //     $user = $request->user();

    //     // Cerrar sesión del usuario.
    //     Auth::logout();

    //     // Soft delete del usuario.
    //     $user->delete();

    //     // Invalidar sesión actual y regenerar token CSRF.
    //     $request->session()->invalidate();
    //     $request->session()->regenerateToken();

    //     return Redirect::to('/');
    // }
}