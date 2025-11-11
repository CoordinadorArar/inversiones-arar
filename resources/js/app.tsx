import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// Nombre de la app: Desde .env (VITE_APP_NAME) o 'Laravel' por defecto.
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Configuración de Inertia para React:
// - title: Función para generar títulos dinámicos (ej. "Home - Laravel").
// - resolve: Busca y carga el componente React desde ./Pages/ basado en el nombre (ej. 'Home' -> Home.tsx).
//   Usa import.meta.glob para precargar todos los .tsx en Pages/.
// - setup: Monta el componente React en el DOM (el) con props desde Laravel.
// - progress: Barra de carga con color gris durante transiciones.
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
