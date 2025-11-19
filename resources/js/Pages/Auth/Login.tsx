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
import { Shield, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleNumberKeyDown, handleLimit } from '@/lib/keydownValidations';
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

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    // Estado local para validaciones frontend
    const [formData, setFormData] = useState<LoginFormData>({
        numero_documento: '',
        password: '',
        remember: false,
    });

    const [frontendErrors, setFrontendErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
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
        const result = loginSchema.safeParse(formData);

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
        <GuestLayout showBrandPanel={true}>
            <Head title="Inicio de sesión" />

            {status && (
                <div className="mb-4 p-3 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg text-center">
                    {status}
                </div>
            )}

            {/* Mensaje informativo de seguridad */}
            {(visibleInfo && !status) && (
                <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg relative">
                    <button
                        onClick={() => setVisibleInfo(false)}
                        className="absolute top-0 right-0 p-1 rounded-md hover:bg-primary/10 transition"
                        aria-label="Cerrar mensaje"
                    >
                        <X className="w-4 h-4 text-primary" />
                    </button>

                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Ingresa tu número de documento y contraseña. Si es tu primer acceso,
                            usa tu número de documento como contraseña inicial.
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className='space-y-6 mt-2' noValidate>
                {/* Número de documento */}
                <div className="space-y-2">
                    <Label htmlFor="numero_documento" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                        Número de Documento
                    </Label>
                    <Input
                        id="numero_documento"
                        type="text"
                        name="numero_documento"
                        placeholder='Ingresa tu número de documento'
                        value={formData.numero_documento}
                        onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                        onKeyDown={(e) => {
                            handleNumberKeyDown(e);
                            handleLimit(e, formData.numero_documento, LIMITS.numero_documento);
                        }}
                        className={errors.numero_documento ? "border-destructive focus-visible:ring-destructive" : ""}
                        maxLength={LIMITS.numero_documento}
                        autoComplete="username"
                    />
                    <div className="relative">
                        <InputError className='absolute top-0 left-0 !-mt-1' message={errors.numero_documento} />
                    </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                    <Label htmlFor="password" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
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
                    />

                    <div className="relative">
                        <InputError className='absolute top-0 left-0 !-mt-1' message={errors.password} />
                    </div>

                    {/* Link de olvidó contraseña */}
                    <div className='text-right'>
                        <Link
                            href={route('password.request')}
                        >
                            <Button variant={'link'} className='h-auto pt-0'>
                                ¿Olvidaste tu contraseña?
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Botón de envío */}
                <Button
                    type="submit"
                    className="w-full !mt-2"
                    disabled={processing}
                >
                    {processing ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>

                {/* Link volver al inicio */}
                <Link href={route('home')}>
                    <Button variant={'link'} className='h-auto pb-0'>
                        Volver al inicio
                    </Button>
                </Link>
            </form>
        </GuestLayout>
    );
}