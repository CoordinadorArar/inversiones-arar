import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// Nombre de la app: Desde .env (VITE_APP_NAME) o 'Laravel' por defecto.
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Configuración de Inertia para React:
//
// - title: Genera títulos dinámicos para cada página (ej. "Home - Laravel").
// - resolve: Localiza y carga el componente React correspondiente según el nombre
//   que se envía desde Laravel con Inertia::render().
//   • Si el nombre empieza con "Modulos:", se busca en ./Modulos/.
//   • En cualquier otro caso, se busca en ./Pages/.
//   Usa import.meta.glob para precargar todos los .tsx en esas carpetas.
// - setup: Monta el componente React en el DOM con las props enviadas desde Laravel.
// - progress: Muestra una barra de carga durante las transiciones de página.
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {

        if (name.startsWith('Modulos:')) {
            const clean = name.replace('Modulos:', '');
            // Busca dentro de ./Modulos
            return resolvePageComponent(`./Modulos/${clean}.tsx`, import.meta.glob('./Modulos/**/*.tsx'));
        }

        // Vistas normales dentro de Pages
        return resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx'));

    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#f97316',
    },
});
