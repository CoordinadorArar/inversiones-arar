/**
 * Layout reutilizable para páginas públicas (ej. Home, Contact). Envuelve children con Header, Footer y Toaster.
 * Se usa en componentes de Pages para estructura común, manteniendo consistencia en UI.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-11
 */

import Footer from "@/Components/Footer";
import { Empresa } from "@/Components/Header/header.types";
import { PublicHeader } from "@/Components/Header/Public/PublicHeader";
import ScrollToTop from "@/Components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster"
import { PageProps } from '@inertiajs/core';
import { usePage } from "@inertiajs/react";

// Definir interfaz para las props que vienen de la página (de Inertia.js)
interface PagePropsHeader extends PageProps {
    empresasHeader: Empresa[];
    [key: string]: any;
}

export default function PublicLayout({ children }) {

    // Extraer 'empresasHeader' de props compartidas via middleware SharePublicData.
    // - Viene de Inertia::share() en Laravel, accesible via usePage().props.
    // - Array de empresas visibles en header, usado para dropdown/select.
    const empresas: Empresa[] = usePage<PagePropsHeader>().props.empresasHeader;

    return (
        <div className="min-h-screen bg-background">
            {/* Header: Navegación superior común a todas las páginas públicas. */}
            <PublicHeader empresas= {empresas} />
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
