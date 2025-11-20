/**
 * Componente de Registro de Usuario
 * Maneja el registro de nuevos usuarios con validaciones robustas en frontend y backend.
 * Incluye restricciones de entrada, validaciones con Zod, y manejo de errores combinados.
 * 
 * @author Yariangel Aray
 * @version 1.0
 * @date 2025-11-19
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
const registerSchema = z.object({
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

export default function Register({ status, document }) {
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

    // Valida el formulario usando Zod antes de enviar
    const validateForm = (): boolean => {
        const result = registerSchema.safeParse(data);

        if (!result.success) {
            // Extrae errores de Zod y los asigna a frontendErrors
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
                <div className="mb-4 px-3 sm:px-4 py-2 sm:py-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <CircleCheck className="w-5 h-5 text-green-600 mt-0.5" />
                    </div>
                          <p className="text-xs sm:text-sm text-green-700 font-medium">
                        {status}
                    </p>              
                </div>
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
                        tooltipMessage="La contraseña debe tener al menos 8 caracteres e incluir una combinación de letras mayúsculas, minúsculas, números y símbolos."
                        showTooltip={true}
                        required
                    />
                    <InputError message={errors.password} />
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
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                {/* Botón de envío */}
                <Button
                    type="submit"
                    className="w-full md:col-start-2"
                    disabled={processing}
                >
                    {processing ? "Registrando..." : "Registrarse"}
                </Button>
            </form>
        </GuestLayout>
    );
}
