/**
 * Componente de Registro de Usuario
 * Maneja el registro de nuevos usuarios con validaciones robustas en frontend y backend.
 * Incluye restricciones de entrada, validaciones con Zod, y manejo de errores combinados.
 * Valida que el correo sea empresarial usando dominios permitidos.
 * 
 * @author Yariangel Aray
 
 * @date 2025-11-21
 */

import InputError from '@/Components/InputError';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { CircleCheck, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import PasswordInput from '@/Components/PasswordInput';
import MessageStatus from '@/components/MessageStatus';

// Interfaz para los datos del formulario
interface RegisterFormData {
    numero_documento: string;
    email: string;
    password: string;
    password_confirmation: string;
}

// Constantes de límites para validaciones
const LIMITS = {
    numero_documento: 15,
    password: 20,
} as const;

// Schema de validación con Zod para el formulario de registro
const registerSchemaBase = z.object({
    numero_documento: z.string()
        .trim()
        .regex(/^[0-9]+$/, "El número de documento solo debe contener números")
        .min(6, "El número de documento debe tener al menos 6 dígitos")
        .max(LIMITS.numero_documento, `El número de documento debe tener máximo ${LIMITS.numero_documento} dígitos`)
        .min(1, "El número de documento es obligatorio"),

    email: z.string()
        .email("El correo electrónico debe tener un formato válido")
        .min(1, "El correo electrónico es obligatorio"),

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
    path: ["password_confirmation"], // Asigna el error al campo de confirmación
});

export default function Register({ status, document, dominios }) {
    const [formData, setFormData] = useState({
        numero_documento: document || '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [frontendErrors, setFrontendErrors] = useState<Record<string, string>>({});

    // Hook de Inertia para manejar el envío del formulario
    const { data, setData, post, processing, errors: backendErrors, reset } = useForm({
        numero_documento: document || '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Combina errores del frontend y backend para mostrarlos unificados
    const errors = { ...frontendErrors, ...backendErrors };

    // Refinamiento del schema: Valida que el dominio del email esté en la lista de dominios permitidos    
    const registerSchema = registerSchemaBase
        .refine(
            (data) => {
                // Extrae dominio: ej. "usuario@empresa.com" -> "empresa.com"
                const domain = data.email.split('@')[1];
                console.log(domain, dominios.includes(domain), dominios)
                // Verifica si el dominio está en la lista autorizada
                return dominios.includes(domain);
            },
            {
                // Mensaje de error.
                message: "El correo electrónico debe pertenecer a una empresa autorizada.",
                path: ["email"],
            }
        )

    // Maneja cambios en los inputs: actualiza estado local, Inertia, y limpia errores específicos
    const handleInputChange = (field: keyof RegisterFormData, value: string) => {

        // Actualizar estado local
        setFormData(prev => ({ ...prev, [field]: value }));

        // Actualiza el hook de Inertia
        setData(field, value as any);

        // Limpia el error del campo específico si existe
        if (frontendErrors[field]) {
            setFrontendErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Valida el formulario usando Zod antes de enviar, incluyendo dominio
    const validateForm = (): boolean => {
        // Primero valida con Zod base
        let result = registerSchema.safeParse(data);

        if (!result.success) {
            // Extrae errores y los asigna a frontendErrors
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    newErrors[err.path[0].toString()] = err.message;
                }
            });
            setFrontendErrors(newErrors);

            // Hace scroll al primer campo con error para mejorar UX
            const firstErrorField = Object.keys(newErrors)[0];
            document.getElementById(firstErrorField)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            return false;
        }

        // Limpia errores si la validación pasa
        setFrontendErrors({});
        return true;
    };

    // Maneja el envío del formulario
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Valida antes de enviar
        if (!validateForm()) {
            return;
        }

        // Envía el formulario a la ruta de registro
        post(route('register.store'), {
            onFinish: () => reset('password', 'password_confirmation'), // Resetea campos sensibles después
        });
    };

    return (
        <GuestLayout showBrandPanel={false} >
            <Head title="Registro de Usuario" />

            {/* Muestra mensaje de status si existe */}
            {status && (
                <MessageStatus status={status} />
            )}

            {/* Formulario de registro con validación no nativa del navegador */}
            <form onSubmit={submit} className='mt-2 grid md:grid-cols-2 gap-4 md:gap-5' noValidate>
                {/* Campo de número de documento, deshabilitado */}
                <div className="space-y-2">
                    <Label htmlFor="numero_documento" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                        Número de Documento
                    </Label>
                    <Input
                        id="numero_documento"
                        type="text"
                        name="numero_documento"
                        disabled
                        value={formData.numero_documento}
                        className="bg-gray-100 !cursor-not-allowed"
                        autoComplete="username"
                    />
                    <InputError message={errors.numero_documento} />
                </div>

                {/* Campo de correo electrónico */}
                <div className="space-y-2">
                    <Label htmlFor="email" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                        Correo Electrónico Empresarial
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Ingresa tu correo electrónico empresarial"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                        autoComplete="email"
                    />
                    <InputError message={errors.email} />
                </div>

                {/* Campo de contraseña */}
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
                        autoComplete="new-password"
                        hasError={!!errors.password}
                        tooltipMessage="Mínimo 8 caracteres: mayúscula, minúscula, número y símbolo."
                        showTooltip={true}
                        required
                        className="text-sm sm:text-base"
                    />
                    <div className="relative !mt-0">
                        <InputError message={errors.password} />
                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.password.length}/{LIMITS.password}
                        </span>
                    </div>
                </div>

                {/* Campo de confirmación de contraseña */}
                <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                        Confirmación de Contraseña
                    </Label>
                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                        placeholder="Confirma tu contraseña"
                        maxLength={LIMITS.password}
                        autoComplete="new-password"
                        hasError={!!errors.password_confirmation}
                        tooltipMessage="Repite la contraseña para confirmar."
                        showTooltip={true}
                        required
                        className="text-sm sm:text-base"
                    />
                    <div className="relative !mt-0">
                        <InputError message={errors.password_confirmation} />
                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.password_confirmation.length}/{LIMITS.password}
                        </span>
                    </div>
                </div>

                {/* Botón de envío */}
                <Button
                    type="submit"
                    className="w-full md:col-start-2 mt-2"
                    disabled={processing}
                >
                    {processing ? "Registrando..." : "Registrarse"}
                </Button>
            </form>
        </GuestLayout>
    );
}