/**
 * Componente de Recuperación de Contraseña con validaciones robustas
 * Implementa validaciones frontend con Zod, restricciones de teclado y límites de caracteres
 * 
 * @author Yariangel Aray
 * @version 1.0
 * @date 2025-11-19
 */

import InputError from '@/Components/InputError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Mail, Shield } from 'lucide-react';
import { useState } from 'react'; // Agregado para estado local
import { handleNumberKeyDown, handleLimit } from '@/lib/keydownValidations'; 
import { z } from 'zod';

// Interfaz para los datos del formulario
interface ForgotFormData {
    numero_documento: string;
}

// Constantes de límites 
const LIMITS = {
    numero_documento: 15,
} as const;

// Schema de validación con Zod (mantenido del original, pero ahora usado en validación frontend)
const forgotSchema = z.object({
    numero_documento: z.string()
        .trim()
        .regex(/^[0-9]+$/, "El número de documento solo debe contener números")
        .min(6, "El número de documento debe tener al menos 6 dígitos")
        .max(LIMITS.numero_documento, `El número de documento debe tener máximo ${LIMITS.numero_documento} dígitos`)
        .min(1, "El número de documento es obligatorio"),
});

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    // Estado local para validaciones frontend 
    const [formData, setFormData] = useState<ForgotFormData>({
        numero_documento: '',
    });

    const [frontendErrors, setFrontendErrors] = useState<Record<string, string>>({});

    // Hook de Inertia para el envío
    const { data, setData, post, processing, errors: backendErrors, reset } = useForm({
        numero_documento: '',
    });

    // Combinar errores del frontend y backend 
    const errors = { ...frontendErrors, ...backendErrors };

    // Manejar cambios en los inputs 
    const handleInputChange = (field: keyof ForgotFormData, value: string) => {
        // Actualizar estado local
        setFormData(prev => ({ ...prev, [field]: value }));

        // Actualizar Inertia form
        setData(field, value as any);

        // Limpiar error del campo específico
        if (frontendErrors[field]) {
            setFrontendErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Validar formulario antes de enviar
    const validateForm = (): boolean => {
        const result = forgotSchema.safeParse(formData);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    newErrors[err.path[0].toString()] = err.message;
                }
            });
            setFrontendErrors(newErrors);

            // Scroll al primer error
            const firstErrorField = Object.keys(newErrors)[0];
            document.getElementById(firstErrorField)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            return false;
        }

        setFrontendErrors({});
        return true;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar antes de enviar
        if (!validateForm()) {
            return;
        }

        post(route('password.email'), {
            onFinish: () => reset('numero_documento'), // Reset después de enviar
        });
    };

    return (
        <GuestLayout showBrandPanel={false} maxWidth="4xl">
            <Head title="Recuperar Contraseña" />

            <div className="mb-4 flex gap-2">
                {/* Card izquierda: Instrucciones para ingresar documento. */}
                <div className="flex-1 p-4 bg-primary/5 rounded-lg border border-primary/20 text-sm text-foreground/80 leading-relaxed">
                    <div className='flex gap-2 items-center mb-2'>
                        <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="font-semibold text-foreground">
                            ¿Olvidaste tu contraseña?
                        </p>
                    </div>
                    <p>
                        No hay problema. Ingresa tu <span className="font-medium text-primary">número de documento</span> y
                        te enviaremos un enlace al correo electrónico registrado para restablecer tu contraseña.
                    </p>
                </div>

                {/* Card derecha: Info si no hay correo registrado. */}
                <div className="flex-1 p-4 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground leading-relaxed">
                    <div className="flex gap-2 items-center mb-2">
                        <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="font-medium text-foreground">
                            ¿No tienes correo registrado?
                        </p>
                    </div>
                    <p>
                        Envía un correo a{' '}
                        <a
                            href="mailto:coordinadordesarrollo@inversionesarar.com"
                            className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            coordinadordesarrollo@inversionesarar.com
                        </a>
                        {' '}para solicitar el cambio o registro de tu correo electrónico.
                    </p>
                </div>
            </div>

            {status && (
                <div className="mb-4 p-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                    <label htmlFor="numero_documento" className="block text-sm font-medium text-foreground mb-2">
                        Número de Documento
                    </label>
                    <Input
                        id="numero_documento"
                        type="text" 
                        name="numero_documento"
                        value={formData.numero_documento} // Usar estado local
                        placeholder="Ingresa tu número de documento"
                        className={`w-full ${errors.numero_documento ? "border-destructive focus-visible:ring-destructive" : ""}`} // Estilo de error
                        onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                        onKeyDown={(e) => {
                            handleNumberKeyDown(e); // Restricción a números
                            handleLimit(e, formData.numero_documento, LIMITS.numero_documento); // Límite de caracteres
                        }}
                        maxLength={LIMITS.numero_documento} // Máximo de caracteres
                        autoComplete="username"
                    />
                    <div className="relative">
                        <InputError className='absolute top-0 left-0' message={errors.numero_documento} />
                    </div>                    
                </div>

                {/* Botón envío: Deshabilitado durante processing. */}
                <div className="flex items-center justify-end pt-2">
                    <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={processing}
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar enlace de recuperación
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}