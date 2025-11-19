/**
 * Componente de Restablecimiento de Contraseña con validaciones robustas
 * Implementa validaciones frontend con Zod, estado local y manejo de errores
 * 
 * @author Yariangel Aray
 * @version 1.0
 * @date 2025-11-19
 */

import InputError from '@/Components/InputError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react'; // Agregado para estado local
import { z } from 'zod'; // Para validaciones
import PasswordInput from '@/Components/PasswordInput'; // Componente reutilizado

// Interfaz para los datos del formulario
interface ResetFormData {
    token: string;
    numero_documento: string;
    password: string;
    password_confirmation: string;
}

// Constantes de límites
const LIMITS = {
    password: 20,
} as const;

// Schema de validación con Zod
const resetSchema = z.object({
    password: z.string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-.])[A-Za-z\d@$!%*?&#+\-.]+$/,
            "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo"
        )
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(LIMITS.password, `La contraseña debe tener máximo ${LIMITS.password} caracteres`)
        .min(1, "La contraseña es obligatoria"),

    password_confirmation: z.string()
        .min(1, "La confirmación de contraseña es obligatoria"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"], // Error en el campo de confirmación
});

interface ResetPasswordProps {
    token: string;
    numero_documento: string;
}

export default function ResetPassword({ token, numero_documento }: ResetPasswordProps) {

    const [frontendErrors, setFrontendErrors] = useState<Record<string, string>>({});

    // Hook de Inertia para el envío
    const { data, setData, post, processing, errors: backendErrors, reset } = useForm({
        token: token,
        numero_documento: numero_documento,
        password: '',
        password_confirmation: '',
    });

    // Combinar errores del frontend y backend 
    const errors = { ...frontendErrors, ...backendErrors };

    // Manejar cambios en los inputs
    const handleInputChange = (field: keyof ResetFormData, value: string) => {
        // Actualizar campos
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
        const result = resetSchema.safeParse(data);

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
        console.log('Submitting data:', data);
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout showBrandPanel={false} maxWidth="xl">
            <Head title="Restablecer Contraseña" />

            <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                    <Label htmlFor="numero_documento">
                        Número de documento
                    </Label>

                    <Input
                        id="numero_documento"
                        type="text"
                        name="numero_documento"
                        disabled
                        value={data.numero_documento} // Usar estado local
                        className="mt-1 w-full bg-gray-100 !cursor-not-allowed"
                        autoComplete="username"
                        onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                    />
                    <InputError message={errors.numero_documento} />
                </div>

                <div>
                    <Label htmlFor="password" className='after:ml-0.5 after:text-red-500 after:content-["*"]'> {/* Agregado asterisco */}
                        Contraseña
                    </Label>

                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password} // Usar estado local
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Ingresa tu nueva contraseña"
                        maxLength={LIMITS.password}
                        autoComplete="new-password"
                        hasError={!!errors.password}
                        tooltipMessage="La contraseña debe tener al menos 8 caracteres e incluir una combinación de letras mayúsculas, minúsculas, números y símbolos."
                        showTooltip={true}
                        required
                        className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""} // Estilo de error
                    />

                    <InputError message={errors.password}/>
                </div>

                <div>
                    <Label htmlFor="password_confirmation" className='after:ml-0.5 after:text-red-500 after:content-["*"]'> {/* Agregado asterisco */}
                        Confirmación de Contraseña
                    </Label>

                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation} // Usar estado local
                        onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                        placeholder="Confirma tu nueva contraseña"
                        maxLength={LIMITS.password}
                        autoComplete="new-password"
                        hasError={!!errors.password_confirmation}
                        tooltipMessage="Repite la contraseña para confirmar."
                        showTooltip={true}
                        required
                        className={errors.password_confirmation ? "border-destructive focus-visible:ring-destructive" : ""} // Estilo de error
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end pt-2">
                    <Button className="w-full" disabled={processing}>
                        {processing ? "Restableciendo..." : "Restablecer Contraseña"}
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}