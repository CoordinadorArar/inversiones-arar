import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/Components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import GuestLayout from '@/Layouts/GuestLayout';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, InfoIcon } from 'lucide-react';
import { useState } from 'react';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import { Button } from '@/components/ui/button';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });


    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout showBrandPanel={true}>
            <Head title="Inicio de sesión" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className='mt-3'>
                <div>
                    <Label htmlFor="email">
                        Número de Documento
                    </Label>

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder='Ingresa tú número de documento'
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <Label htmlFor="password">
                        Contraseña
                    </Label>

                    <InputGroup>
                        <InputGroupAddon align="inline-start">

                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <InputGroupButton
                                            variant="ghost"
                                            aria-label="Info"
                                            size="icon-xs"
                                        >
                                            <InfoIcon />
                                        </InputGroupButton>
                                    </TooltipTrigger>
                                    <TooltipContent side='top' align='start' className='rounded-full'>
                                        <p>Si es la primera vez que ingresa al sistema, por favor, digite su documento.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                        </InputGroupAddon>
                        <InputGroupInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            autoComplete='current-password'
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                size="icon-xs"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>

                    <InputError message={errors.password} className="mt-2" />
                    <div className='text-right'>
                        <Link
                            href={route('password.request')}
                        >
                            <Button variant={'link'}>
                                ¿Olvidaste tu contraseña?
                            </Button>
                        </Link>
                    </div>
                </div>

                <Button className="w-full mt-6" disabled={processing}>
                    Iniciar Sesión
                </Button>
                <Link href={route('home')}>
                    <Button variant={'link'}>
                        Volver al inicio
                    </Button>
                </Link>
            </form>
        </GuestLayout>
    );
}
