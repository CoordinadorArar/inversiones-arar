/**
 * Componente TabsLayout.
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
import { TabInterface } from "@/Types/tabInterface";


// Interface para props del componente.
interface TabsLayoutProps {
    children: ReactNode;     // Contenido a renderizar (flex-1).
    moduloNombre: string;    // Nombre del módulo para título de página.
    tabs: TabInterface[];    // Array de pestañas disponibles.
    activeTab?: string;      // Ruta de la pestaña activa (opcional).
}

// Componente funcional TabsLayout.
export function TabsLayout({
    children,
    moduloNombre,
    tabs,
    activeTab
}: TabsLayoutProps) {

    /**
         * Helper: Determina si un tab está activo
         * Compara exactamente O si activeTab empieza con la ruta del tab
         * 
         * Ejemplos:
         * - Tab "/gestion" está activo si activeTab es "/gestion" o "/gestion/crear"
         * - Tab "/listado" está activo solo si activeTab es "/listado"
         */
    const isTabActive = (tabRoute: string): boolean => {
        if (!activeTab) return false;

        // Comparación exacta
        if (activeTab === tabRoute) return true;

        // Si activeTab empieza con la ruta del tab + "/"
        // Ejemplo: activeTab="/gestion/crear" empieza con "/gestion/"
        return activeTab.startsWith(tabRoute + '/');
    };

    /**
     * Helper: Obtiene el valor del tab activo para Tabs
     * Necesario porque Tabs necesita un value exacto de la lista
     */
    const getActiveTabValue = (): string | undefined => {
        // Buscar el tab cuya ruta coincida con activeTab o sea prefijo de activeTab
        const matchedTab = tabs.find(tab => isTabActive(tab.ruta));
        return matchedTab?.ruta;
    };

    // Render: Fragment con Head y Tabs.
    return (
        <>
            {/* Head: Establece título de la página en navegador. */}
            <Head title={moduloNombre} />

            {/* Tabs: Contenedor principal con flex col, overflow hidden. */}
            {/* 
              value debe ser la ruta del TAB, no la ruta actual
              Por eso usamos getActiveTabValue()
            */}
            <Tabs value={getActiveTabValue()} className="w-full h-full flex flex-col over">
                {/* Contenedor de TabsList con scroll horizontal en mobile. */}
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
                    {/* TabsList: w-max en mobile (scroll), w-full en desktop, gap entre triggers. */}
                    <TabsList className="w-max sm:w-full justify-start p-0 gap-2 mx-3 sm:mx-0">
                        {/* Mapea tabs a TabsTrigger envueltos en Link. */}
                        {tabs.map((tab) => (
                            <Link key={tab.id} href={tab.ruta}>
                                <TabsTrigger
                                    value={tab.ruta}  // Valor para resaltar activo.
                                    className={cn(
                                        "relative px-3 sm:px-4 py-1.5 text-sm sm:text-base transition-all duration-200 whitespace-nowrap",
                                        "data-[state=active]:text-primary data-[state=active]:font-bold",
                                        "hover:bg-gray-400/5 hover:text-foreground",
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
                <div className="mt-2 flex-1 min-h-0 animate-fade">
                    {children}  {/* Renderiza el contenido del módulo. */}
                </div>
            </Tabs>
        </>
    );
}
