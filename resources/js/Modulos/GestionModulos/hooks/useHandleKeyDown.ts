/**
 * Hook personalizado para manejar validaciones de teclado en inputs.
 * 
 * Proporciona handlers para restringir caracteres permitidos en campos específicos,
 * como permisos extra y rutas de módulo. Previene entrada de caracteres no válidos.
 * 
 * @returns {Object} Objeto con handlers de teclado.
 * @property {function} handlePermisosExtraKeyDown - Handler para permisos extra.
 * @property {function} handleRutaKeyDown - Handler para rutas de módulo.
 * 
 * @author Yariangel Aray
 * @date 2025-12-09
 */
export function useHandleKeyDown() {
    // Lista de teclas permitidas para navegación y edición básica (comunes en inputs).
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End', 'Control', 'Alt', 'Shift'];

    /**
     * Handler para validación de teclado en permisos extra.
     * Permite solo letras minúsculas, mayúsculas, guiones bajos, comas y espacios.
     * Bloquea otros caracteres para mantener formato válido.
     * 
     * @param {React.KeyboardEvent<HTMLInputElement>} e - Evento de teclado.
     */
    const handlePermisosExtraKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = /^[a-zA-Z_, ]$/;
        // Si la tecla no es permitida y no es una tecla especial o combinación Ctrl/Meta, previene el evento.
        if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }        
    };

    /**
     * Handler para validación de teclado en ruta de módulo.
     * Permite solo letras minúsculas, números, guiones, barras y espacios.
     * Bloquea otros caracteres para mantener formato de URL válido.
     * 
     * @param {React.KeyboardEvent<HTMLInputElement>} e - Evento de teclado.
     */
    const handleRutaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = /^[a-z0-9\-/ ]$/;
        // Si la tecla no es permitida y no es una tecla especial o combinación Ctrl/Meta, previene el evento.
        if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    };

    return {
        handlePermisosExtraKeyDown,
        handleRutaKeyDown
    };
}
