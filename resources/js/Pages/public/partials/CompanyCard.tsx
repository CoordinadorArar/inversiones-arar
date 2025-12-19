/**
 * Componente CompanyCard.
 * 
 * Propósito: Tarjeta individual para mostrar información de una empresa del holding.
 * Usado en la página de Companies para listar todas las empresas.
 * 
 * Props:
 * - empresa: Objeto con datos de la empresa (id, razon_social, logo_url, tipo_empresa, descripcion, sitio_web)
 * 
 * Características:
 * - Header con logo grande y nombre
 * - Badge con tipo de empresa
 * - Descripción de la empresa
 * - Dos botones de acción: Sitio Web y Consultar Vacantes
 * - Efectos hover suaves en card y botones
 * - Links externos con target="_blank" y rel="noopener noreferrer"
 * - Diseño responsivo con altura completa
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Globe } from "lucide-react";

interface Empresa {
    id: number;
    razon_social: string;
    logo_url?: string;
    tipo_empresa: string;
    descripcion: string;
    sitio_web: string;
}

interface CompanyCardProps {
    empresa: Empresa;
}

export default function CompanyCard({ empresa }: CompanyCardProps) {
    return (
        <Card className="group w-full h-full overflow-hidden border border-primary/20 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 rounded-2xl bg-card">
            <CardContent className="p-6 flex flex-col h-full">
                {/* Header con logo y razón social */}
                <div className="flex items-center gap-4 mb-6">
                    {/* Logo de la empresa */}
                    <div className="relative h-28 w-28 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 p-2 flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-md">
                        {empresa.logo_url ? (
                            <img
                                src={"/storage/" + empresa.logo_url}
                                alt={`Logo de ${empresa.razon_social}`}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <span className="text-lg md:text-3xl font-bold text-primary capitalize">
                                {empresa.razon_social.charAt(0)}
                            </span>
                        )}
                    </div>

                    {/* Nombre y badge */}
                    <div className="flex-1">
                        <h3 className="capitalize text-xl font-bold mb-1 group-hover:text-primary transition-colors leading-tight">
                            {empresa.razon_social.toLowerCase()}
                        </h3>
                        <span className="inline-block text-xs bg-primary/10 text-primary text-center font-medium px-2.5 py-1 rounded-md capitalize tracking-wide">
                            {empresa.tipo_empresa.toLowerCase()}
                        </span>
                    </div>
                </div>

                {/* Descripción de la empresa */}
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                    {empresa.descripcion}
                </p>

                {/* Botones de acción - Stack vertical */}
                <div className="flex flex-col gap-2.5 w-full">
                    {/* Botón: Sitio Web */}
                    <a href={empresa.sitio_web} target='_blank' rel="noopener noreferrer" className="w-full">
                        <Button
                            variant="default"
                            className="w-full flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all group/btn"
                        >
                            <Globe className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                            Sitio Web
                        </Button>
                    </a>

                    {/* Botón: Consultar Vacantes */}
                    <a
                        href={`http://gh.inversionesarar.com:8900/AuthHv/LoginFormHVById?IdCia=${empresa.id}&NroConexion=1`}
                        target='_blank'
                        rel="noopener noreferrer"
                        className="w-full"
                    >
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all group/btn"
                        >
                            <Briefcase className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                            Consultar Vacantes
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}