import { Mail, Phone, FileText, Shield, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t bg-secondary/10 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
                    {/* Logo y descripción */}
                    <div className="space-y-4 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2">
                            <img src="images/logo-arar.png" alt="Logo arar" className="h-20" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Holding empresarial comprometido con el crecimiento y desarrollo sostenible.
                        </p>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="font-semibold mb-4">Contacto</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <a href="mailto:asistente@inversionesarar.com" className="hover:text-foreground transition-colors">
                                    asistente@inversionesarar.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <a href="tel:6076985203" className="hover:text-foreground transition-colors">
                                    607 698 5203
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <a href="docs/Politica-Privacidad.pdf" target="_blank" className="hover:text-foreground transition-colors">
                                    Política de privacidad
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <a href="docs/Manual-Sagrilaft.pdf" target="_blank" className="hover:text-foreground transition-colors">
                                    Manual Sagrilaft
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Espacio para redes sociales o info adicional */}
                    <div>
                        <h3 className="font-semibold mb-4">Síguenos</h3>
                        <div className='flex gap-2'>
                            <a href="https://co.linkedin.com/company/inversiones-arar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn de Inversiones Arar">
                                <Linkedin />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Inversiones Arar. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}