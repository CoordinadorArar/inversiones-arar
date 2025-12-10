/**
 * Hook useDocumentoSearch.
 * 
 * Maneja la lógica de búsqueda de documentos en BD externa con debounce,
 * fetch a API para obtener resultados, y selección de documento.
 * Se usa en combobox para autocompletar nombre al seleccionar documento.
 * 
 * @author Yariangel Aray
 * @date 2025-12-10
 */

import { useState, useEffect } from "react";

/**
 * Interfaz para opciones de documento.
 * Define la estructura de cada resultado de búsqueda.
 */
export interface DocumentoOption {
  documento: string; // Número de documento.
  nombre: string; // Nombre completo asociado.
  yaExiste: boolean; // Indica si ya existe en usuarios.
}

/**
 * Interfaz para props del hook useDocumentoSearch.
 * Define el callback para manejar selección.
 */
interface UseDocumentoSearchProps {
  onSelect: (documento: string, nombre: string, yaExiste: boolean) => void;
}
/**
 * Hook personalizado useDocumentoSearch.
 * 
 * Gestiona búsqueda de documentos con debounce, estado de opciones y selección.
 * Hace fetch a API para obtener resultados de BD externa.
 * 
 * @param {UseDocumentoSearchProps} props - Props del hook.
 * @returns {Object} Estado y handlers para el combobox.
 */
export function useDocumentoSearch({ onSelect }: UseDocumentoSearchProps) {

  // Aquí se usa useState para manejar el término de búsqueda.
  const [searchTerm, setSearchTerm] = useState("");
  // Aquí se usa useState para almacenar las opciones de documentos obtenidas.
  const [options, setOptions] = useState<DocumentoOption[]>([]);
  // Aquí se usa useState para indicar si se está buscando (loading).
  const [isSearching, setIsSearching] = useState(false);
  // Aquí se usa useState para controlar si el combobox está abierto.
  const [isOpen, setIsOpen] = useState(false);

  // Función para buscar documentos: Hace fetch a API si el término tiene al menos 5 caracteres.
  const buscarDocumentos = async (term: string) => {
    if (term.length < 5) {
      setOptions([]);
      return;
    }

    setIsSearching(true);
    try {
      // Aquí se hace fetch a la ruta de búsqueda de documentos.
      const response = await fetch(
        route("usuario.buscar-documentos", { search: term })
      );
      const data = await response.json();

      if (response.ok && data.resultados) {
        setOptions(data.resultados);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error("Error buscando documentos:", error);
      setOptions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Aquí se usa useEffect con debounce: Espera 500ms después de que cambie searchTerm para buscar.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 5) {
        buscarDocumentos(searchTerm);
      } else {
        setOptions([]);
      }
    }, 500);

    return () => clearTimeout(timer);  // Limpia el timer si searchTerm cambia antes.
  }, [searchTerm]);

  // Handler para seleccionar documento: Llama al callback, cierra combobox y limpia búsqueda.
  const handleSelect = (option: DocumentoOption) => {
    onSelect(option.documento, option.nombre, option.yaExiste);
    setIsOpen(false);
    setSearchTerm("");
  };

  return {
    searchTerm,
    setSearchTerm,
    options,
    isSearching,
    isOpen,
    setIsOpen,
    handleSelect,
  };
}
