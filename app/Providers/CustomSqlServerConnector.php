<?php

namespace App\Providers;


/**
 * Conector SQL Server Personalizado.
 *
 * Esta clase extiende el conector predeterminado de Laravel para SQL Server.
 * Su propósito principal es solucionar un error específico de compatibilidad
 * entre ciertas versiones de PHP (especialmente 8.1+) y el controlador PDO SQLSRV.
 *
 * El error "SQLSTATE[IMSSP]: An invalid attribute was designated on the PDO object"
 * ocurre porque el controlador SQLSRV no admite el atributo PDO::ATTR_STRINGIFY_FETCHES.
 * Al anular la propiedad $options y omitir este atributo, se resuelve el problema.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-12
 */


use Illuminate\Database\Connectors\SqlServerConnector;
use PDO;

class CustomSqlServerConnector extends SqlServerConnector
{
    /**
     * Las opciones de PDO que deben usarse para la conexión.
     *
     * Se han redefinido las opciones predeterminadas de Laravel para excluir
     * PDO::ATTR_STRINGIFY_FETCHES, que causa problemas con el driver SQLSRV.
     *
     * @var array
     */
    protected $options = [
        PDO::ATTR_CASE => PDO::CASE_NATURAL,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_ORACLE_NULLS => PDO::NULL_NATURAL,
        // PDO::ATTR_STRINGIFY_FETCHES => false, // <-- Esta línea se comenta o se elimina
    ];
}
