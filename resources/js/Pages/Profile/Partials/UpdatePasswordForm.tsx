import InputError from '@/Components/InputError';
import MessageStatus from '@/Components/MessageStatus';
import PasswordInput from '@/Components/PasswordInput';
import { Button } from '@/Components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { z } from 'zod';

const LIMITS = {
    password: 20,
} as const;

const passwordSchema = z.object({
    current_password: z.string().min(1, "La contraseña actual es obligatoria"),
    password: z.string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-.])[A-Za-z\d@$!%*?&#+\-.]+$/,
            "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo"
        )
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(LIMITS.password, `La contraseña debe tener máximo ${LIMITS.password} caracteres`),
    password_confirmation: z.string().min(1, "La confirmación es obligatoria"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
});

export default function UpdatePasswordForm({ status }) {
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [frontendErrors, setFrontendErrors] = useState<Record<string, string>>({});

    const { data, setData, put, processing, errors: backendErrors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const errors = { ...frontendErrors, ...backendErrors };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setData(field as any, value);

        if (frontendErrors[field]) {
            setFrontendErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const result = passwordSchema.safeParse(data);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    newErrors[err.path[0].toString()] = err.message;
                }
            });
            setFrontendErrors(newErrors);
            return false;
        }

        setFrontendErrors({});
        return true;
    };

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {            
                setData({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
                setFormData({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            },
        });
    };

    return (
        <section>
            {(status == 'password-updated' && status) && (
                <MessageStatus status="Contraseña actualizada exitosamente." />
            )}
            <form onSubmit={updatePassword} className="space-y-4" noValidate>
                <div>
                    <Label htmlFor="current_password">
                        Contraseña Actual
                    </Label>

                    <PasswordInput
                        id="current_password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={(e) => handleInputChange('current_password', e.target.value)}
                        placeholder="Ingresa tu contraseña actual"
                        autoComplete="current-password"
                        hasError={!!errors.current_password}
                        tooltipMessage="Necesitamos confirmar tu contraseña actual."
                        showTooltip={true}
                        required
                    />
                    <InputError message={errors.current_password} />
                </div>

                <div>
                    <Label htmlFor="password">
                        Nueva Contraseña
                    </Label>

                    <PasswordInput
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Ingresa tu nueva contraseña"
                        maxLength={LIMITS.password}
                        autoComplete="new-password"
                        hasError={!!errors.password}
                        tooltipMessage="Mínimo 8 caracteres: mayúscula, minúscula, número y símbolo."
                        showTooltip={true}
                        required
                    />
                    <div className="relative">
                        <InputError message={errors.password} />
                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.password.length}/{LIMITS.password}
                        </span>
                    </div>
                </div>

                <div>
                    <Label htmlFor="password_confirmation">
                        Confirmar Contraseña
                    </Label>

                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                        placeholder="Confirma tu nueva contraseña"
                        maxLength={LIMITS.password}
                        autoComplete="new-password"
                        hasError={!!errors.password_confirmation}
                        tooltipMessage="Repite la contraseña para confirmar."
                        showTooltip={true}
                        required
                    />
                    <div className="relative">
                        <InputError message={errors.password_confirmation} />
                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.password_confirmation.length}/{LIMITS.password}
                        </span>
                    </div>
                </div>

                <Button
                    type="submit"
                    className=" px-6"
                    disabled={processing}
                >
                    {processing ? "Guardando..." : "Guardar"}
                </Button>
            </form>
        </section>
    );
}