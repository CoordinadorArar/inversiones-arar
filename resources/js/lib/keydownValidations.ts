const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

// Permitir solo letras
export const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
};

// Permitir solo números
export const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[0-9+]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
};

// Permitir solo números y letras
export const handleNumberTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
};

// Email: letras, números, @, ., guion, guion bajo
export const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /^[a-zA-Z0-9@._+-]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
};

// Mensajes
export const handleMessagesKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const allowed = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-.,;:$#]$/;
    if (!allowed.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
};
