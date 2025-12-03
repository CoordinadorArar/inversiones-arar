/**
 * Componente ModuleLayout.
 * 
 * Propósito: Layout reutilizable para módulos con pestañas (tabs) en la parte superior.
 * Usa Shadcn Tabs para navegación, con scroll horizontal en mobile. Integra Inertia Link
 * para navegación SPA. Resalta tab activa y previene recarga si ya está seleccionada.
 * 
 * Props:
 * - children: Contenido JSX del módulo (ej. tabla, formulario).
 * - moduloNombre: Nombre del módulo para <Head title>.
 * - tabs: Array de pestañas {id, nombre, ruta}.
 * - activeTab: Ruta de la tab activa (para resaltar).
 * 
 * Características:
 * - Responsive: TabsList con overflow-x-auto en mobile.
 * - Navegación: Links via Inertia, sin recarga si tab ya activa.
 * - Flex layout: Tabs arriba, contenido abajo con flex-1.
 * 
 * @author Yariangel Aray - Layout modular para pestañas.
 
 * @date 2025-11-26
 */

// Imports: React, Inertia, utils, componentes UI.
import { ReactNode } from "react";
import { Head, Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Interface para una pestaña.
interface Tab {
    id: number;     // ID único de la pestaña.
    nombre: string; // Nombre visible de la pestaña.
    ruta: string;   // Ruta para navegación (ej. "/listado").
}

// Interface para props del componente.
interface ModuleLayoutProps {
    children: ReactNode;     // Contenido a renderizar (flex-1).
    moduloNombre: string;    // Nombre del módulo para título de página.
    tabs: Tab[];             // Array de pestañas disponibles.
    activeTab?: string;      // Ruta de la pestaña activa (opcional).
}

// Componente funcional ModuleLayout.
export function ModuleLayout({
    children,
    moduloNombre,
    tabs,
    activeTab
}: ModuleLayoutProps) {
    // Render: Fragment con Head y Tabs.
    return (
        <>
            {/* Head: Establece título de la página en navegador. */}
            <Head title={moduloNombre} />

            {/* Tabs: Contenedor principal con flex col, overflow hidden. */}
            <Tabs value={activeTab} className="w-full h-full flex flex-col over">
                {/* Contenedor de TabsList con scroll horizontal en mobile. */}
                <div className="overflow-x-auto pb-2 -mx-3 sm:mx-0">
                    {/* TabsList: w-max en mobile (scroll), w-full en desktop, gap entre triggers. */}
                    <TabsList className="w-max sm:w-full justify-start p-0 gap-2 mx-3 sm:mx-0">
                        {/* Mapea tabs a TabsTrigger envueltos en Link. */}
                        {tabs.map((tab) => (
                            <Link key={tab.id} href={tab.ruta}>
                                <TabsTrigger
                                    value={tab.ruta}  // Valor para resaltar activo.
                                    className={cn(
                                        "px-4 py-2",
                                        // Si activo: texto primary, bold.
                                        activeTab === tab.ruta &&
                                        "!text-primary font-bold",
                                        // Si no activo: hover effects.
                                        activeTab !== tab.ruta &&
                                        "hover:text-foreground hover:bg-gray-400/5"
                                    )}
                                    onClick={e => {
                                        // Previene navegación si ya está activo (evita recarga).
                                        if (activeTab === tab.ruta) e.preventDefault();
                                    }}
                                >
                                    {tab.nombre}  {/* Nombre de la pestaña. */}
                                </TabsTrigger>
                            </Link>
                        ))}
                    </TabsList>
                </div>

                {/* Contenido: Área flexible para children (tab activo). */}
                <div className="mt-2 flex-1 min-h-0">
                    {children}  {/* Renderiza el contenido del módulo. */}
                </div>
            </Tabs>
        </>
    );
}
