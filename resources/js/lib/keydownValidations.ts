/**
 * Funciones para validar entradas de teclado en React, previniendo caracteres no deseados en inputs/textareas.
 * Se usan en eventos onKeyDown para reforzar validaciones frontend (complemento a backend en Laravel).
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-11
 */

// allowedKeys: Teclas de control permitidas (navegación, borrado) en todas las funciones.
const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End', 'Control', 'Alt', 'Shift'];

// handleTextKeyDown: Permite solo letras (incluyendo acentos y ñ) y espacios.
// Uso: En inputs de nombre/apellido (ej. <input onKeyDown={handleTextKeyDown} />).
// Bloquea números/símbolos para campos de texto puro.
export const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
    }
};

// handleNumberKeyDown: Permite solo números y + (para teléfonos internacionales).
// Uso: En inputs de teléfono/números (ej. <input onKeyDown={handleNumberKeyDown} />).
// Bloquea letras para campos numéricos.
export const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[0-9+]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
    }
};

// handleNumberTextKeyDown: Permite números, letras (con acentos) y espacios.
// Uso: En inputs mixtos como códigos o direcciones (ej. <input onKeyDown={handleNumberTextKeyDown} />).
// Más flexible que handleTextKeyDown.
export const handleNumberTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[0-9a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
    }
};

// handleEmailKeyDown: Permite letras, números, @, ., guion, guion bajo, +.
// Uso: En inputs de email (ej. <input onKeyDown={handleEmailKeyDown} />).
// Alineado con formatos de email válidos.
export const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[a-zA-Z0-9@._+-]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
    }
};

// handleMessagesKeyDown: Permite letras, números, acentos, espacios y símbolos comunes (puntuación).
// Uso: En textareas de mensajes (ej. <textarea onKeyDown={handleMessagesKeyDown} />).
// Más permisivo para texto largo con formato.
export const handleMessagesKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const allowed = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-.,;:$#¿?¡!()"\n]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
    }
};

// handlePasswordKeyDown: Permite letras, números, mayúsculas y caracteres especiales válidos en contraseñas.
// Uso: En inputs de contraseña (ej. <input onKeyDown={handlePasswordKeyDown} />).
// Permite: a-z, A-Z, 0-9, @$!%*?&#_+-.
export const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[a-zA-Z0-9@$!%*?&#_+\-.]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
    }
};

// handleUrlKeyDown: Permite caracteres válidos para URLs.
// Uso: En inputs de sitio web (ej. <input onKeyDown={handleUrlKeyDown} />).
// Permite: letras, números, :, /, ., -, _, ?, =, &, #
export const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[a-zA-Z0-9:/.?\-_=&#]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
    }
};

// handleDominioKeyDown: Permite solo letras, números, puntos y guiones.
// Uso: En inputs de dominio de correo (ej. <input onKeyDown={handleDominioKeyDown} />).
// Permite: a-z, A-Z, 0-9, ., -
export const handleDominioKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[a-zA-Z0-9.-]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
    }
};