/**
 * Componente React para el footer del sitio. Muestra logo, contacto, enlaces legales, redes sociales y copyright.
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-11
 */

import { Mail, Phone, FileText, Shield, Linkedin, ArrowUpRight, MapPin } from 'lucide-react';
import Copyright from './Copyright';

export default function Footer() {

    const rrss = [
        {
            name: 'LinkedIn de Inversiones Arar',
            href: 'https://co.linkedin.com/company/inversiones-arar',
            icon: Linkedin,
        },
    ]

    const contacto = [
        {
            name: 'Email',
            href: 'mailto:asistente@inversionesarar.com',
            icon: Mail,
            value: 'asistente@inversionesarar.com'
        },
        {
            name: 'Teléfono',
            href: 'tel:6076985203',
            icon: Phone,
            value: '607 698 5203'
        },
        {
            name: 'Ubicación',
            href: 'https://maps.app.goo.gl/mm8MPxAzZs99BV1D8',
            icon: MapPin,
            value: 'Ecoparque Natura · Floridablanca, Colombia'
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
                                src="images/logo-arar.png"
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

                                    <a
                                        key={index}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                                        aria-label={item.name}
                                    >
                                        <item.icon className="h-5 w-5" />
                                    </a>
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
                                        <a
                                            href={item.href}
                                            className="group flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mt-0.5">
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-foreground mb-0.5">{item.name}</div>
                                                <div className="break-all">{item.value}</div>
                                            </div>
                                        </a>
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