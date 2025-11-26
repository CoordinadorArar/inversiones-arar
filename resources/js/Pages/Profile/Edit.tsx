import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { DashboardLayout } from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Briefcase, Calendar, Phone, MapPin, Building2, Shield, Award } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { calcularAntiguedadExacta, formatPhoneNumberCO, formatToSpanishDate } from '@/lib/formatUtils';

export default function Edit({ auth: { user: { datos_completos, numero_documento } } }) {

    const nombreCorto = (datos_completos.nombres.split(" ")[0] + " " + datos_completos.apellidos.split(" ")[0]).toLowerCase();
    const nombreCompleto = (datos_completos.nombres + " " + datos_completos.apellidos).toLowerCase();

    const formatter = new Intl.NumberFormat('es-ES');

    return (
        <>
            <Head title="Perfil" />

            <div className="space-y-6">
                {/* Header del Perfil */}
                <Card>
                    <CardContent className="py-5">
                        <div>

                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {/* Avatar */}
                                <Avatar className="h-16 w-16 border-4 border-primary/10">
                                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                                        {(nombreCorto.split(" ")[0].charAt(0) + nombreCorto.split(" ")[1].charAt(0)).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Info Principal */}
                                <div className="flex-1 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground capitalize">{nombreCorto}</h2>
                                        <p className="text-muted-foreground text-sm capitalize">{datos_completos.cargo.toLowerCase()}</p>
                                    </div>

                                    <Badge variant={'secondary'} className='bg-green-500/20 text-green-700 h-min mt-3 ' >
                                        <Shield className="h-3 w-3" />
                                        Cuenta Activa
                                    </Badge>
                                </div>
                            </div>
                            <div className='flex justify-between border-t mt-4 pt-3 px-4'>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 mb-1">Ingreso</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <Calendar className="h-4 w-4 text-orange-500" />
                                        <p className="font-medium text-sm text-gray-900">{formatToSpanishDate(datos_completos.fecha_ingreso)}</p>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <p className="text-xs text-gray-500 mb-1">Antigüedad</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <Award className="h-4 w-4 text-orange-500" />
                                        <p className="font-medium text-sm text-gray-900">{calcularAntiguedadExacta(datos_completos.fecha_ingreso)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Grid de 2 columnas */}
                <div className="grid gap-6 md:grid-cols-2">

                    {/* Información Personal */}
                    <Card className='py-5 gap-4'>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Información Personal
                            </CardTitle>
                            <CardDescription>
                                Datos generales de tu perfil
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                                <p className="text-base capitalize">{nombreCompleto}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Documento de Identidad</p>
                                <p className="text-base">{formatter.format(numero_documento)}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <p className="text-base">{formatToSpanishDate(datos_completos.fecha_nacimiento)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información de Contacto */}
                    <Card className='py-5 gap-4'>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                Información de Contacto
                            </CardTitle>
                            <CardDescription>
                                Cómo contactarte
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Correo Electrónico Personal</p>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <p className="text-base">{datos_completos.email_personal}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <p className="text-base">{formatPhoneNumberCO(datos_completos.telefono)}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-primary mt-2" />
                                    <p className="text-base leading-tight">
                                        {datos_completos.direccion} <br />
                                        <strong className='text-muted-foreground font-semibold'>
                                            {datos_completos.ciudad}, {datos_completos.departamento}
                                        </strong>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Editar Email */}
                    <Card className='py-5 gap-4 h-min'>
                        <CardHeader>
                            <CardTitle>Actualizar Correo</CardTitle>
                            <CardDescription>
                                Modifica tu dirección de correo electrónico
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UpdateProfileInformationForm />
                        </CardContent>
                    </Card>
                    {/* Cambiar Contraseña */}
                    <Card className='py-5 gap-4'>
                        <CardHeader>
                            <CardTitle>Cambiar Contraseña</CardTitle>
                            <CardDescription>
                                Asegúrate de usar una contraseña segura para proteger tu cuenta
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UpdatePasswordForm />
                        </CardContent>
                    </Card>
                </div>


            </div>
        </>
    );
}

Edit.layout = (page) => (
    <DashboardLayout header='Perfil de Usuario' children={page} />
);
