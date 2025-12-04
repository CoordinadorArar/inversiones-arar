<?php

namespace App\Services;

use App\Models\Configuracion;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * Servicio para gestionar configuraciones del sistema.
 * Permite obtener valores agrupados por prefijo con caché.
 * 
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class ConfiguracionService
{
    /**
     * Obtiene todas las configuraciones agrupadas por prefijo.
     * Ejemplo: contact.email -> ['contact' => ['email' => '...']]
     * 
     * @return Collection
     */
    public static function getAll(): Collection
    {
        return Cache::remember('config.all', 3600, function () {
            return Configuracion::all()->mapWithKeys(function ($config) {
                return [$config->nombre => $config->valor];
            });
        });
    }

    /**
     * Obtiene configuraciones de un grupo específico.
     * Ejemplo: getGroup('contact') -> ['email' => '...', 'telefono' => '...']
     * 
     * @param string $prefix Prefijo del grupo (contact, rrss, image)
     * @return array
     */
    public static function getGroup(string $prefix): array
    {
        $configs = self::getAll();
        $result = [];

        foreach ($configs as $key => $value) {
            if (str_starts_with($key, $prefix . '.')) {
                $subKey = str_replace($prefix . '.', '', $key);
                $result[$subKey] = $value;
            }
        }

        return $result;
    }

    /**
     * Obtiene un valor de configuración específico.
     * 
     * @param string $key Nombre completo de la config
     * @param mixed $default Valor por defecto
     * @return mixed
     */
    public static function get(string $key, $default = null)
    {
        return self::getAll()->get($key, $default);
    }

    /**
     * Actualiza múltiples configuraciones.
     * Limpia el caché después de actualizar.
     * 
     * @param array $configs Array con nombre => valor
     * @return bool
     */
    public static function updateMultiple(array $configs): bool
    {
        try {
            foreach ($configs as $nombre => $valor) {
                Configuracion::where('nombre', $nombre)->update([
                    'valor' => $valor,                    
                ]);
            }

            Cache::forget('config.all');
            return true;
        } catch (\Exception $e) {
            \Log::error('Error actualizando configs: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Limpia el caché de configuraciones.
     */
    public static function clearCache(): void
    {
        Cache::forget('config.all');
    }
}