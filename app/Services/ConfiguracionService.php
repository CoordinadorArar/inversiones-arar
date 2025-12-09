<?php

namespace App\Services;

use App\Models\Configuracion;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * Servicio para gestionar configuraciones del sistema.
 * Permite obtener valores agrupados por prefijo con caché para mejorar rendimiento.
 * Usado en ConfiguracionController para recuperar y actualizar configuraciones.
 *
 * @author Yariangel Aray
 * @date 2025-12-04
 */
class ConfiguracionService
{
    /**
     * Obtiene todas las configuraciones agrupadas por nombre.
     * Usa caché por 1 hora para optimizar consultas.
     * Ejemplo: ['contact.email' => '...', 'rrss.instagram' => '...']
     *
     * @return Collection Colección de configuraciones con nombre como clave.
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
     * Obtiene configuraciones de un grupo específico por prefijo.
     * Filtra y estructura las configs en un array anidado.
     * Ejemplo: getGroup('contact') -> ['email' => '...', 'telefono' => '...']
     *
     * @param string $prefix Prefijo del grupo (ej. 'contact', 'rrss', 'image').
     * @return array Array asociativo con sub-claves del grupo.
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
     * Retorna valor por defecto si no existe.
     *
     * @param string $key Nombre completo de la configuración (ej. 'contact.email').
     * @param mixed $default Valor por defecto si no se encuentra.
     * @return mixed Valor de la configuración o defecto.
     */
    public static function get(string $key, $default = null)
    {
        return self::getAll()->get($key, $default);
    }

    /**
     * Actualiza múltiples configuraciones en la base de datos.
     * Limpia el caché después de actualizar para reflejar cambios.
     *
     * @param array $configs Array asociativo con nombre => valor.
     * @return bool True si se actualizaron correctamente, false en caso de error.
     */
    public static function updateMultiple(array $configs): bool
    {
        try {
            foreach ($configs as $nombre => $valor) {
                Configuracion::where('nombre', $nombre)->update([
                    'valor' => $valor === '' ? null : $valor, // Vacío -> null
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
     * Útil para forzar recarga de configs después de cambios manuales.
     */
    public static function clearCache(): void
    {
        Cache::forget('config.all');
    }
}
