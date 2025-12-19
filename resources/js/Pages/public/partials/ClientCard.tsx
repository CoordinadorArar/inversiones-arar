/**
 * Componente ClientCard.
 * 
 * Propósito: Tarjeta individual para mostrar información de un cliente.
 * Usado en la sección de clientes del portafolio.
 * 
 * Props:
 * - cliente: Objeto con datos del cliente (razon_social, logo_url, tipo_empresa)
 * 
 * Características:
 * - Muestra logo del cliente o inicial si no hay logo
 * - Badge con tipo de empresa
 * - Efectos hover suaves (scale, border, shadow)
 * - Gradiente de fondo en hover
 * - Diseño responsivo con min-height adaptativo
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Cliente {
  razon_social: string;
  logo_url?: string;
  tipo_empresa?: string;
}

interface ClientCardProps {
  cliente: Cliente;
}

export default function ClientCard({ cliente }: ClientCardProps) {
  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 bg-card w-full h-full">
      {/* Gradiente de fondo en hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[140px] md:min-h-[160px] relative">
        {/* Logo o inicial */}
        {cliente.logo_url ? (
          <div className="relative mb-3 md:mb-4">
            <img
              src={"/storage/" + cliente.logo_url}
              alt={`Logo de ${cliente.razon_social}`}
              className="h-12 md:h-16 w-auto object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-xl md:h-16 md:w-16 md:rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
            <span className="text-lg md:text-2xl font-bold text-primary-foreground">
              {cliente.razon_social.charAt(0)}
            </span>
          </div>
        )}

        {/* Nombre del cliente */}
        <h3 className="text-sm md:text-base font-bold text-center mb-1.5 md:mb-2 group-hover:text-primary transition-colors capitalize">
          {cliente.razon_social.toLowerCase()}
        </h3>

        {/* Badge de tipo de empresa */}
        {cliente.tipo_empresa && (
          <Badge className="inline-block text-xs bg-primary/10 text-primary text-center font-medium px-2 rounded-md capitalize tracking-wide">
            {cliente.tipo_empresa.toLowerCase()}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}