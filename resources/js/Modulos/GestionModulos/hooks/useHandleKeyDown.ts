export function useHandleKeyDown () {
    // Aquí se define una lista de teclas permitidas para validaciones de teclado (comunes en inputs).
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End', 'Control', 'Alt', 'Shift'];

    /**
     * Handler para validación de teclado en permisos extra.
     * Permite solo letras minúsculas, guiones bajos y comas.
     * 
     * @param {React.KeyboardEvent<HTMLInputElement>} e - Evento de teclado.
     */
    const handlePermisosExtraKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = /^[a-zA-Z_, ]$/;
        if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }        
    };

    /**
     * Handler para validación de teclado en ruta de módulo.
     * Permite solo letras minúsculas, números, guiones y /.
     * 
     * @param {React.KeyboardEvent<HTMLInputElement>} e - Evento de teclado.
     */
    const handleRutaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = /^[a-z0-9\-/ ]$/;
        if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    };

    return {
        handlePermisosExtraKeyDown,
        handleRutaKeyDown
    };
}