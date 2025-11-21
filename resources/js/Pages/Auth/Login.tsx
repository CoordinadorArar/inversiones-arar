/**
 * Componente de Login con validaciones robustas
 * Implementa validaciones frontend con Zod y restricciones de teclado
 * 
 * @author Yariangel Aray
 * @version 2.0
 * @date 2025-11-19
 */

import InputError from '@/Components/InputError';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Shield, X, CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MessageStatus from '@/components/MessageStatus';
import { handleNumberKeyDown } from '@/lib/keydownValidations';
import { z } from 'zod';
import PasswordInput from '@/Components/PasswordInput';

// Interfaz para los datos del formulario
interface LoginFormData {
    numero_documento: string;
    password: string;
    remember: boolean;
}

// Constantes de límites
const LIMITS = {
    numero_documento: 15,
    password: 20,
} as const;

// Schema de validación con Zod
const loginSchema = z.object({
    numero_documento: z.string()
        .trim()
        .regex(/^[0-9]+$/, "El número de documento solo debe contener números")
        .min(6, "El número de documento debe tener al menos 6 dígitos")
        .max(LIMITS.numero_documento, `El número de documento debe tener máximo ${LIMITS.numero_documento} dígitos`)
        .min(1, "El número de documento es obligatorio"),

    password: z.string()
        .regex(
            /^[a-zA-Z0-9@$!%*?&#+\-.]+$/,
            "La contraseña contiene caracteres no permitidos"
        )
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .max(LIMITS.password, `La contraseña debe tener máximo ${LIMITS.password} caracteres`)
        .min(1, "La contraseña es obligatoria"),
});

export default function Login({ status }) {

    const [formData, setFormData] = useState({
        numero_documento: '',
        password: '',
        remember: false,
    });

    const [frontendErrors, setFrontendErrors] = useState<Record<string, string>>({});
    const [visibleInfo, setVisibleInfo] = useState(true);

    // Hook de Inertia para el envío
    const { data, setData, post, processing, errors: backendErrors, reset } = useForm({
        numero_documento: '',
        password: '',
        remember: false,
    });

    // Combinar errores del frontend y backend
    const errors = { ...frontendErrors, ...backendErrors };

    // Manejar cambios en los inputs
    const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {

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
        const result = loginSchema.safeParse(data);

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

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout showBrandPanel={true} >
            <Head title="Inicio de sesión" />

            {/* Mensaje de status*/}
            {status && (
                <MessageStatus status={status}/>
            )}

            {/* Mensaje informativo*/}
            {(visibleInfo && !status) && (
                <div className="mb-3 sm:mb-4 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg relative">
                    <button
                        onClick={() => setVisibleInfo(false)}
                        className="absolute top-1 right-1 p-1 rounded-md hover:bg-primary/10 transition"
                        aria-label="Cerrar mensaje"
                    >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    </button>

                    <div className="flex items-start gap-2 sm:gap-3 pr-6">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                            Si ya tienes cuenta en nuestra nueva web, ingresa tu contraseña.
                            Si no estás seguro, usa tu número de documento en la contraseña para validar tu identidad.                            
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className='space-y-3 sm:space-y-4 mt-2' noValidate>
                {/* Número de documento */}
                <div className="space-y-1.5 sm:space-y-2">
                    <Label
                        htmlFor="numero_documento"
                        className='text-xs sm:text-sm after:ml-0.5 after:text-red-500 after:content-["*"]'
                    >
                        Número de Documento
                    </Label>
                    <Input
                        id="numero_documento"
                        type="text"
                        name="numero_documento"
                        placeholder='Ingresa tu número de documento'
                        value={formData.numero_documento}
                        onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                        onKeyDown={handleNumberKeyDown}
                        className={`text-sm sm:text-base h-9 sm:h-10 ${errors.numero_documento ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        maxLength={LIMITS.numero_documento}
                        autoComplete="document-number"
                    />
                    <InputError message={errors.numero_documento} />
                </div>

                {/* Contraseña */}
                <div className="space-y-1.5 sm:space-y-2">
                    <Label
                        htmlFor="password"
                        className='text-xs sm:text-sm after:ml-0.5 after:text-red-500 after:content-["*"]'
                    >
                        Contraseña
                    </Label>

                    <PasswordInput
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        maxLength={LIMITS.password}
                        autoComplete="current-password"
                        hasError={!!errors.password}
                        tooltipMessage="Si es tu primera vez ingresando, usa tu número de documento como contraseña. El sistema te pedirá cambiarla después."
                        showTooltip={true}
                        required
                        className="text-sm sm:text-base h-9 sm:h-10"
                    />

                    <InputError message={errors.password} />

                    {/* Link de olvidó contraseña - Más compacto en mobile */}
                    <div className='text-right !mt-0'>
                        <Link href={route('password.request')}>
                            <Button
                                variant={'link'}
                                className='h-auto pb-0 text-xs sm:text-sm'
                            >
                                ¿Olvidaste tu contraseña?
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Botón de envío*/}
                <Button
                    type="submit"
                    className="w-full text-sm sm:text-base"
                    disabled={processing}
                >
                    {processing ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>

                {/* Link volver al inicio */}
                <Link href={route('home')}>
                    <Button
                        variant={'link'}
                        className='h-auto pb-0 text-xs sm:text-sm'
                    >
                        Volver al inicio
                    </Button>
                </Link>
            </form>
        </GuestLayout>
    );
}