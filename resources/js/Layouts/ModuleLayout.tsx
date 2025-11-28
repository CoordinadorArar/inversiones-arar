// Layouts/ModuleLayout.tsx
import { ReactNode } from "react";
import { DashboardLayout } from "./DashboardLayout";
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
    activeTab?: string; // Ruta activa actual
}

export function ModuleLayout({
    children,
    moduloNombre,
    tabs,
    activeTab
}: ModuleLayoutProps) {
    return (
        <DashboardLayout header={moduloNombre}>

            {/* Pestañas */}
            <Tabs value={activeTab} className="w-full">
                {/* Encabezado con pestañas */}
                <TabsList className="w-full justify-start p-0">
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
                            >
                                {tab.nombre}
                            </TabsTrigger>
                        </Link>
                    ))}
                </TabsList>

                {/* Contenido */}
                <div className="mt-4">
                    {children}
                </div>
            </Tabs>
        </DashboardLayout>
    );
}