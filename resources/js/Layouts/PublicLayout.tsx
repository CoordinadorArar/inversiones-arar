/**
 * Layout reutilizable para páginas públicas (ej. Home, Contact). Envuelve children con Header, Footer y Toaster.
 * Se usa en componentes de Pages para estructura común, manteniendo consistencia en UI.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-11
 */

import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import ScrollToTop from "@/Components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster"

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header: Navegación superior común a todas las páginas públicas. */}
            <Header />
            {/* children: Contenido dinámico de la página (ej. secciones de Home). */}
            {children}
            <ScrollToTop />
            {/* Toaster: Componente para mostrar notificaciones/toasts (ej. éxito/error)*/}
            <Toaster />
            {/* Footer: Pie de página común con info/contacto. */}
            <Footer />
        </div>
    );
}
