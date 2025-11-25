import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { DashboardLayout } from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Briefcase, Calendar, Phone, MapPin, Building2, Shield } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <>
            <Head title="Perfil" />

            <div className="space-y-6">
                {/* Header del Perfil */}
                <Card>
                    <CardContent className="py-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Avatar */}
                            <Avatar className="h-24 w-24 border-4 border-primary/10">
                                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                    NA
                                </AvatarFallback>
                            </Avatar>

                            {/* Info Principal */}
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-foreground">Nombre Apellido</h2>
                                <p className="text-muted-foreground mt-1">Nombre del Cargo</p>
                                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                                    <Badge variant="secondary">
                                        <Building2 className="h-3 w-3 mr-1" />
                                        Inversiones Arar
                                    </Badge>
                                    <Badge variant="outline">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Activo
                                    </Badge>
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
                                <p className="text-base">Usuario Nomre Completo</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Documento de Identidad</p>
                                <p className="text-base">CC 1.098.765.432</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <p className="text-base">15 de Marzo, 1992</p>
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
                                <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <p className="text-base">usuario@inversionesarar.com</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <p className="text-base">+57 312 456 789</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <p className="text-base">Bucaramanga, Santander</p>
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
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
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
