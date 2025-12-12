/**
 * Componente React para el footer del sitio. Muestra logo, contacto, enlaces legales, redes sociales y copyright.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 
 * @date 2025-11-11
 */

import { Mail, Phone, FileText, Shield, Linkedin, ArrowUpRight, MapPin, Instagram, Facebook } from 'lucide-react';
import Copyright from './Copyright';
import { ConfiguracionContacto, ConfiguracionImages, ConfiguracionRRSS } from '@/Types/configuracionInterface';
import { formatLandlinePhoneNumberCO } from '@/lib/formatUtils';

interface FooterProps {
    configuracion: {
        contact: ConfiguracionContacto;
        images: ConfiguracionImages;
        rrss: ConfiguracionRRSS;
    }
}

export default function Footer({ configuracion }: FooterProps) {

    // Configuración de redes sociales con metadata: define íconos, placeholders y nombres.
    const rrss = [
        {
            id: "instagram" as const,
            name: "Instagram",
            icon: Instagram,
        },
        {
            id: "facebook" as const,
            name: "Facebook",
            icon: Facebook,
        },
        {
            id: "x" as const,
            name: "X (Twitter)",
            icon: (props: any) => (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
        {
            id: "linkedin" as const,
            name: "LinkedIn",
            icon: Linkedin,

        },
    ];

    const contacto = [
        {
            name: 'Email',
            href: `mailto:${configuracion.contact.email}`,
            icon: Mail,
            value: configuracion.contact.email
        },
        {
            name: 'Teléfono',
            href: `tel:${configuracion.contact.telefono}`,
            icon: Phone,
            value: formatLandlinePhoneNumberCO(configuracion.contact.telefono)
        },
        {
            name: 'Ubicación',
            href: configuracion.contact['ubicacion.url'],
            icon: MapPin,
            value: configuracion.contact.ubicacion
        },
    ]

    return (
        <footer className="relative border-t bg-gradient-to-b from-secondary/20 to-secondary/40 mt-auto overflow-hidden">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
                {/* Grid principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-10">

                    {/* Logo y descripción - Ocupa más espacio */}
                    <div className="space-y-6 lg:col-span-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={configuracion.images.logo ? "/storage" + configuracion.images.logo : "/images/logo-arar.png"}
                                alt="Logo Inversiones Arar"
                                className="h-20 hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            Holding empresarial comprometido con el crecimiento y desarrollo sostenible de nuestras empresas asociadas.
                        </p>

                        {/* Redes sociales más prominentes */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-foreground">Síguenos:</span>

                            {
                                rrss.map((item, index) => (
                                    configuracion.rrss[item.id] &&
                                    (
                                        <a
                                            key={index}
                                            href={configuracion.rrss[item.id]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                                            aria-label={item.name}
                                        >
                                            <item.icon className="h-5 w-5" />
                                        </a>
                                    )

                                ))
                            }
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="lg:col-span-4">
                        <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                            Contacto
                            <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                        </h3>
                        <ul className="space-y-4">

                            {
                                contacto.map((item, index) => (
                                    <li key={index}>
                                        {item.value && (
                                            <a
                                                href={item.href}
                                                className="group flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                                                target='_blank'
                                            >
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mt-0.5">
                                                    <item.icon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-foreground mb-0.5">{item.name}</div>
                                                    <div className="break-all">{item.value}</div>
                                                </div>
                                            </a>
                                        )}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    {/* Enlaces legales */}
                    <div className="lg:col-span-4">
                        <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                            Legal
                            <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="docs/Politica-Privacidad.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Shield className="h-4 w-4 text-primary" />
                                    <span>Política de privacidad</span>
                                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="docs/Manual-Sagrilaft.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span>Manual Sagrilaft</span>
                                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <Copyright className='border-t' />
            </div>
        </footer>
    );
}