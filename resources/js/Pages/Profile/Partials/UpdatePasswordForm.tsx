import InputError from '@/Components/InputError';
import PasswordInput from '@/Components/PasswordInput';
import { Button } from '@/Components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>

            <form onSubmit={updatePassword} className="space-y-4">
                <div>
                    <Label
                        htmlFor="current_password"
                    >
                        Contraseña Actual
                    </Label>

                    <PasswordInput
                        id="current_password"
                        name="current_password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        placeholder="Ingresa tu contraseña actual"
                        autoComplete="current-password"
                        hasError={!!errors.password}
                        tooltipMessage="Necesitamos que confirmes tu contraseña actual para poder realizar el cambio."
                        showTooltip={true}
                        required
                        className="text-sm sm:text-base"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label htmlFor="password" >
                        Nueva Contraseña
                    </Label>

                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Ingresa tu nueva contraseña"
                        autoComplete="new-password"
                        hasError={!!errors.password}
                        tooltipMessage="La contraseña debe tener al menos 8 caracteres e incluir una combinación de letras mayúsculas, minúsculas, números y símbolos."
                        showTooltip={true}
                        required
                        className="text-sm sm:text-base"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <Label
                        htmlFor="password_confirmation"
                    >
                        Confirmar Contraseña
                    </Label>

                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirma tu nueva contraseña"
                        autoComplete="new-password"
                        hasError={!!errors.password_confirmation}
                        tooltipMessage="Repite la contraseña para confirmar."
                        showTooltip={true}
                        required
                        className="text-sm sm:text-base"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>
                <Button
                    type="submit"
                    className="mt-2 float-right px-6"
                    disabled={processing}
                >
                    {processing ? "Guardandoo..." : "Guardar"}
                </Button>
            </form>
        </section>
    );
}
