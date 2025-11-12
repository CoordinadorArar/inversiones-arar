import InputError from '@/Components/InputError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Mail, Shield } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        // GuestLayout: Sin panel de branding, ancho 3xl.
        <GuestLayout showBrandPanel={false} maxWidth="4xl">
            <Head title="Recuperar Contraseña" />

            <div className="mb-6 flex gap-2">
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
                <div className="mb-4 p-4 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Número de Documento
                    </label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Ingresa tu número de documento"
                        className="w-full"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
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