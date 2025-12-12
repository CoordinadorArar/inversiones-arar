/**
 * Página RedesSociales.
 * 
 * Gestión de enlaces a redes sociales de la empresa.
 * Renderiza formulario con cards para cada red social, usando hook personalizado para lógica.
 * Se integra con React via Inertia para mostrar y editar configuraciones.
 * 
 * @author Yariangel Aray
 * @date 2025-12-04
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { TabsLayout } from "@/Layouts/TabsLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { Save, Instagram, Facebook, Linkedin } from "lucide-react";
import { handleUrlKeyDown } from "@/lib/keydownValidations";
import { TabInterface } from "@/Types/tabInterface";
import InputError from "@/Components/InputError";
import { Input } from "@/components/ui/input";
import { ConfiguracionRRSS } from "../types/configuracionInterface";
import { useRedesSociales } from "../hooks/useRedesSociales";
import HelpManualButton from "@/Components/HelpManualButton";

/**
 * Interfaz para las props del componente RedesSociales.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
export interface RedesSocialesProps {
    tabs: TabInterface[]; // Pestañas accesibles del módulo.
    moduloNombre: string; // Nombre del módulo para el header.
    permisos: string[]; // Permisos del usuario para la pestaña.
    configuracion: { // Datos de configuración de redes sociales.
        rrss: ConfiguracionRRSS;
    };
}
/**
 * Componente principal para la página de Redes Sociales.
 * Renderiza formulario con cards para cada red social, manejando estado via hook personalizado.
 * Incluye preview de enlaces configurados.
 * 
 * @param {RedesSocialesProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function RedesSociales({
    tabs,
    moduloNombre,
    permisos,
    configuracion,
}: RedesSocialesProps) {
    const puedeEditar = permisos.includes("editar");

    // Aquí se usa el hook useRedesSociales para manejar estado, validaciones y envío del formulario.
    const {
        formData,
        errors, isSubmitting,
        handleChange,
        handleSubmit
    } = useRedesSociales({
        configuracion,
        puedeEditar,
    });

    // Configuración de redes sociales con metadata: define íconos, placeholders y nombres.
    const socialNetworks = [
        {
            id: "instagram" as const,
            name: "Instagram",
            icon: Instagram,
            placeholder: "https://www.instagram.com/...",
        },
        {
            id: "facebook" as const,
            name: "Facebook",
            icon: Facebook,
            placeholder: "https://www.facebook.com/...",
        },
        {
            id: "x" as const,
            name: "X (Twitter)",
            icon: (props: any) => (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            placeholder: "https://x.com/...",
        },
        {
            id: "linkedin" as const,
            name: "LinkedIn",
            icon: Linkedin,
            placeholder: "https://linkedin.com/company/...",
        },
    ];

    return (
        // Aquí se usa TabsLayout para envolver la página con navegación de pestañas y header del módulo.
        <TabsLayout
            moduloNombre={moduloNombre}
            tabs={tabs}
            activeTab={window.location.pathname}
        >
            <Card className="py-6 h-full flex flex-col shadow border-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-5">
                        Enlaces de Redes Sociales
                        {/* Aquí se incluye HelpManualButton para acceder al manual de gestión de empresas. */}
                        <HelpManualButton
                            url="/docs/Manual-RRSS.pdf"
                            variant="muted"
                        />
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Configura los enlaces a las redes sociales de la empresa. Deja en blanco las que no se utilicen.
                    </p>
                </CardHeader>

                <CardContent>
                    {!puedeEditar ? (
                        // Aquí se muestra un mensaje si el usuario no tiene permisos para editar.
                        <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
                            <p className="text-sm text-destructive font-medium">
                                No tienes permiso para editar las redes sociales
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            {/* Grid de redes sociales con cards: Renderiza una card por cada red social. */}
                            <div className="grid gap-4 sm:grid-cols-2 pt-2">
                                {socialNetworks.map((network) => {
                                    const Icon = network.icon;
                                    return (
                                        <div
                                            key={network.id}
                                            className={`overflow-hidden rounded-lg border transition-all ${formData[network.id as keyof typeof formData]
                                                ? "border-primary/30 bg-primary/5"
                                                : "border-border"
                                                }`}
                                        >
                                            <div className="relative p-4 space-y-3">
                                                {/* Header con icono y nombre */}
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`flex items-center justify-center h-8 w-8 rounded-lg ${formData[network.id as keyof typeof formData]
                                                            ? "bg-primary/15"
                                                            : "bg-primary/10"
                                                            }`}
                                                    >
                                                        <Icon className={`h-5 w-5 text-primary`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label
                                                            htmlFor={network.id}
                                                            className="p-0 m-0"
                                                        >
                                                            {network.name}
                                                        </Label>
                                                        {formData[network.id as keyof typeof formData] && (
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                                <span className="text-xs text-green-600 font-medium">
                                                                    Configurado
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Aquí se usa Input para el campo de URL de la red social. */}
                                                <Input
                                                    id={network.id}
                                                    name={network.id}
                                                    type="url"
                                                    value={formData[network.id as keyof typeof formData]}
                                                    onChange={(e) => handleChange(network.id, e.target.value)}
                                                    onKeyDown={handleUrlKeyDown}
                                                    placeholder={network.placeholder}
                                                    disabled={isSubmitting}
                                                    className={errors[network.id] ? "border-destructive" : ""}
                                                />
                                                {/* Error message */}
                                                <InputError message={errors[network.id]} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Preview de enlaces configurados: Muestra enlaces activos como badges. */}
                            {Object.values(formData).some((value) => value) && (
                                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                        Enlaces Configurados
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {socialNetworks.map((network) => {
                                            const value = formData[network.id as keyof typeof formData];
                                            if (!value) return null;

                                            const Icon = network.icon;
                                            return (
                                                <a
                                                    key={network.id}
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border border-primary/60 bg-primary/10 text-primary hover:shadow hover:bg-primary/15`}
                                                >
                                                    <Icon className="h-3.5 w-3.5" />
                                                    {network.name}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Botón de guardar */}
                            <div className="flex justify-end pt-6 border-t">
                                <Button type="submit" disabled={isSubmitting}>
                                    <Save className="h-4 w-4" />
                                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </TabsLayout>
    );
}

/**
 * Layout del componente: Envuelve la página en DashboardLayout con header dinámico.
 * Se usa para renderizar el componente dentro del layout principal.
 * 
 * @param {any} page - Página a renderizar.
 * @returns {JSX.Element} Elemento JSX con layout aplicado.
 */
RedesSociales.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);
