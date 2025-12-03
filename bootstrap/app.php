<?php

/**
 * Archivo de configuración principal de la aplicación Laravel.
 * 
 * Configura routing, middlewares y excepciones. Define grupo 'public' para compartir datos
 * globales (ej. empresas) a vistas públicas sin autenticación, optimizando consultas.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-25
 */

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    // Configurar rutas: web, console, health check.
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',          // Rutas web públicas.
        commands: __DIR__ . '/../routes/console.php', // Rutas de comandos.
        health: '/up',                                // Endpoint de health check.
    )
    // Configurar middlewares.
    ->withMiddleware(function (Middleware $middleware) {
        // Middlewares para grupo 'web' (aplicados a rutas web por defecto).
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,           // Maneja requests de Inertia (compartir datos a React).
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class, // Headers para preloading de assets.
        ]);

        // Grupo personalizado 'public': Para rutas públicas que necesitan datos compartidos globales.
        // - Propósito: Compartir info como empresas visibles en header, sin repetir consultas en cada controlador.
        // - Usa SharePublicData para enviar datos a Inertia (accesibles en React via usePage().props).
        // - Aplica a rutas públicas (home, contacto, etc.) para optimizar rendimiento y mantener DRY.
        $middleware->group('public', [
            \App\Http\Middleware\SharePublicData::class,  // Comparte empresasHeader a vistas públicas.
        ]);

        // ALIASES PARA MIDDLEWARES CON PARÁMETROS
        $middleware->alias([
            // Alias 'modulo.access': Para validar acceso a módulos por ID.
            // - Middleware: CheckModuloAccess (busca Modulo::find($idModulo)).
            // - Uso: middleware('modulo.access:ID_DEL_MODULO') en rutas de módulos directos.
            // - Ejemplo: middleware('modulo.access:5') valida módulo con ID 5.
            'modulo.access' => \App\Http\Middleware\CheckModuloAccess::class,
            // Alias 'pestana.access': Para validar acceso a pestañas por ID.
            // - Middleware: CheckPestanaAccess (busca Pestana::find($idPestana)).
            // - Uso: middleware('pestana.access:ID_DE_LA_PESTANA') en rutas de pestañas.
            // - Ejemplo: middleware('pestana.access:1') valida pestaña con ID 1.
            // - Agregado para pestañas: Extiende validación a subniveles de módulos.
            'pestana.access' => \App\Http\Middleware\CheckPestanaAccess::class,
        ]);
    })
    // Configurar manejo de excepciones (vacío por ahora).
    ->withExceptions(function (Exceptions $exceptions) {
        // Aquí irían configuraciones de excepciones personalizadas si fueran necesarias.
    })
    // Crear la aplicación.
    ->create();
