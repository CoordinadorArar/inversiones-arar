// Layouts/ModuleLayout.tsx
import { ReactNode } from "react";
import { Head, Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
    id: number;
    nombre: string;
    ruta: string;
}

interface ModuleLayoutProps {
    children: ReactNode;
    moduloNombre: string;
    tabs: Tab[];
    activeTab?: string;
}

// ✅ QUITAR DashboardLayout de aquí
export function ModuleLayout({
    children,
    moduloNombre,
    tabs,
    activeTab
}: ModuleLayoutProps) {
    return (
        <>
            <Head title={moduloNombre} />

            {/* Pestañas */}
            <Tabs value={activeTab} className="w-full h-full flex flex-col over">
                {/* Tabs con scroll horizontal en mobile */}
                <div className="overflow-x-auto pb-2 -mx-3 sm:mx-0">

                    <TabsList className="w-max sm:w-full justify-start p-0 gap-2 mx-3 sm:mx-0">
                        {tabs.map((tab) => (
                            <Link key={tab.id} href={tab.ruta}>
                                <TabsTrigger
                                    value={tab.ruta}
                                    className={cn(
                                        "px-4 py-2",
                                        activeTab === tab.ruta &&
                                        "!text-primary font-bold",
                                        activeTab !== tab.ruta &&
                                        "hover:text-foreground hover:bg-gray-400/5"
                                    )}
                                    onClick={e => {
                                        if (activeTab === tab.ruta) e.preventDefault();
                                    }}
                                >
                                    {tab.nombre}
                                </TabsTrigger>
                            </Link>
                        ))}
                    </TabsList>
                </div>

                {/* Contenido */}
                <div className="mt-2 flex-1 min-h-0">
                    {children}
                </div>
            </Tabs>
        </>
    );
}