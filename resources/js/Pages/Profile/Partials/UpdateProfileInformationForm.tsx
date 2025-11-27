import InputError from '@/Components/InputError';
import MessageStatus from '@/Components/MessageStatus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { z } from 'zod';

// Schema base
const emailSchemaBase = z.object({
    email: z.string()
        .email("Ingrese un correo electrónico válido")
        .min(1, "El correo electrónico es obligatorio"),
});

export default function UpdateProfileInformationForm({ email, dominios, status }) {
    const [formData, setFormData] = useState({
        email: email || '',
    });

    const [frontendErrors, setFrontendErrors] = useState<Record<string, string>>({});

    // Schema con validación de dominio empresarial
    const emailSchema = emailSchemaBase.refine(
        (data) => {
            const domain = data.email.split('@')[1];
            return dominios.includes(domain);
        },
        {
            message: "El correo electrónico debe pertenecer a una empresa autorizada.",
            path: ["email"],
        }
    );

    const { data, setData, patch, processing, errors: backendErrors, reset, recentlySuccessful } = useForm({
        email: email || '',
    });

    const errors = { ...frontendErrors, ...backendErrors };

    // Manejar cambios
    const handleInputChange = (value: string) => {
        setFormData({ email: value });
        setData('email', value);

        if (frontendErrors.email) {
            setFrontendErrors({});
        }
    };

    // Validar antes de enviar
    const validateForm = (): boolean => {
        const result = emailSchema.safeParse(data);

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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        patch(route('profile.update'), {
            preserveScroll: true,            
        });
    };

    return (
        <section>
            {(status == 'email-updated' && status) && (
                <MessageStatus status="Correo actualizado exitosamente." />
            )}
            <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                    <Label htmlFor="email">
                        Correo Electrónico Empresarial
                    </Label>

                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="usuario@empresa.com"
                        autoComplete="email"
                        className={errors.email ? "border-destructive" : ""}
                        required
                    />

                    <InputError message={errors.email} />
                </div>

                <Button
                    type="submit"
                    className="float-right px-6"
                    disabled={processing}
                >
                    {processing ? "Guardando..." : "Guardar"}
                </Button>
            </form>
        </section>
    );
}