import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { router } from "@inertiajs/react";
import { Save, Instagram, Facebook, Linkedin, Share2 } from "lucide-react";
import { toast } from "sonner";
import { handleUrlKeyDown } from "@/lib/keydownValidations";
import { TabInterface } from "@/Types/tabInterface";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "@/Components/ui/input-group";
import InputError from "@/Components/InputError";
import { Input } from "@/components/ui/input";

interface RedesSocialesProps {
    tabs: TabInterface[];
    moduloNombre: string;
    permisos: string[];
    configuracion: {
        rrss: {
            instagram?: string;
            facebook?: string;
            x?: string;
            linkedin?: string;
        };
    };
}

export default function RedesSociales({
    tabs,
    moduloNombre,
    permisos,
    configuracion,
}: RedesSocialesProps) {
    const puedeEditar = !permisos.includes("editar");

    const [formData, setFormData] = useState({
        instagram: configuracion.rrss.instagram || "",
        facebook: configuracion.rrss.facebook || "",
        x: configuracion.rrss.x || "",
        linkedin: configuracion.rrss.linkedin || "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!puedeEditar) {
            toast.error("No tienes permiso para editar las redes sociales");
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await fetch(route("configuracion.update-redes"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                }
                throw new Error(data.error || "Error al guardar");
            }

            toast.success(data.message || "Redes sociales actualizadas correctamente");
            router.reload({ only: ["configuracion"] });
        } catch (error: any) {
            toast.error(error.message || "Error al guardar las redes sociales");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Configuración de redes sociales con colores y metadata
    const socialNetworks = [
        {
            id: "instagram",
            name: "Instagram",
            icon: Instagram,
            placeholder: "https://www.instagram.com/...",
        },
        {
            id: "facebook",
            name: "Facebook",
            icon: Facebook,
            placeholder: "https://www.facebook.com/...",
        },
        {
            id: "x",
            name: "X (Twitter)",
            icon: (props: any) => (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            placeholder: "https://x.com/...",
        },
        {
            id: "linkedin",
            name: "LinkedIn",
            icon: Linkedin,
            placeholder: "https://linkedin.com/company/...",
        },
    ];

    return (
        <ModuleLayout
            moduloNombre={moduloNombre}
            tabs={tabs}
            activeTab={window.location.pathname}
        >
            <Card className="py-6 h-full flex flex-col shadow border-none">
                <CardHeader>
                    <CardTitle>Enlaces de Redes Sociales</CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Configura los enlaces a las redes sociales de la empresa. Deja en blanco las que no se utilicen.
                    </p>
                </CardHeader>

                <CardContent>
                    {!puedeEditar ? (
                        <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
                            <p className="text-sm text-destructive font-medium">
                                No tienes permiso para editar las redes sociales
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Grid de redes sociales con cards */}
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
                                                {/* Input con prefijo */}
                                                <Input
                                                    id={network.id}
                                                    name={network.id}
                                                    type="url"
                                                    value={formData[network.id as keyof typeof formData]}
                                                    onChange={handleInputChange}
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

                            {/* Preview de enlaces configurados */}
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
        </ModuleLayout>
    );
}

RedesSociales.layout = (page: any) => (
    <DashboardLayout header={page.props.moduloNombre} children={page} />
);