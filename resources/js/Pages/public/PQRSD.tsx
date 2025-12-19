/**
 * Componente PQRSD - Formulario Multi-Paso para PQRs.
 * 
 * Permite enviar PQRs con validación por pasos, drag-and-drop de archivos, y envío AJAX.
 * Usa Zod para validación, y validaciones de teclado personalizadas.
 * 
 * @author Yariangel Aray
 
 * @date 2025-11-19
 */


import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import InputError from '@/Components/InputError';
import {
    handleTextKeyDown,
    handleEmailKeyDown,
    handleNumberKeyDown,
    handleMessagesKeyDown,
} from '@/lib/keydownValidations';
import { Building2, User, MapPin, MessageSquare, ChevronLeft, ChevronRight, Send, LoaderCircle, X, FileText, CheckCircle, AlertCircle, Clock, HatGlasses, } from 'lucide-react';
import { Progress } from '@/Components/ui/progress';
import { Checkbox } from '@/Components/ui/checkbox';
import HelpManualButton from '@/Components/HelpManualButton';
import { usePQRSDForm } from './hooks/usePQRSDForm';
import { PQRSD_LIMITS } from './types/pqrsdForm.types';

// ============================================================================
// INTERFACES DE PROPS
// ============================================================================

interface PQRSDProps {
    empresas: Array<{ id: number; name: string; siglas: string }>;
    departamentos: Array<{ id: number; name: string }>;
    ciudades: Array<{ id: number; name: string; id_dpto: number }>;
    tiposPqrs: Array<{ id: number; nombre: string; abreviatura: string }>;
    tiposId: Array<{ id: number; nombre: string; abreviatura: string }>;
}

export default function PQRSD({ empresas, departamentos, ciudades, tiposPqrs, tiposId }: PQRSDProps) {

    // Hook personalizado: maneja toda la lógica del formulario
    const {
        currentStep,
        data,
        files,
        isDragging,
        errors,
        processing,
        fileInputRef,
        nextStep,
        prevStep,
        handleChange,
        handleFileChange,
        removeFile,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleSubmit,
    } = usePQRSDForm();

    // Constante para el tipo "Denuncia"
    const tipoDenuncia = tiposPqrs.find(t => t.abreviatura === 'D');

    // Configuración de pasos según modo (anónimo o normal)
    const stepsConfig = data.esAnonimo
        ? [
            { number: 1, title: "Información PQRSD", icon: Building2, description: "Seleccione tipo y empresa" },
            { number: 2, title: "Descripción", icon: MessageSquare, description: "Describa su denuncia" },
        ]
        : [
            { number: 1, title: "Información PQRSD", icon: Building2, description: "Seleccione tipo y empresa" },
            { number: 2, title: "Datos Personales", icon: User, description: "Complete su información personal" },
            { number: 3, title: "Contacto y Ubicación", icon: MapPin, description: "Datos de contacto y dirección" },
            { number: 4, title: "Descripción", icon: MessageSquare, description: "Describa su PQRS" },
        ];

    // Cálculo del progreso
    const progress = (currentStep / stepsConfig.length) * 100;

    // ============================================================================
    // RENDERIZADO
    // ============================================================================

    return (
        <>
            <Head title="PQRSD" />
            <main>
                {/* Header con información en dos columnas */}
                <section className="pb-8 pt-28 bg-gradient-to-br from-primary/30 via-accent/20 to-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">

                            {/* Contenido en dos columnas */}
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                {/* Columna izquierda - Bienvenida */}
                                <div className="text-center md:text-left">
                                    {/* Título */}
                                    <div className="flex items-start max-md:justify-center gap-3 mb-5">
                                        <h1 className="text-3xl md:text-4xl lg:text-5xl text-primary font-bold">
                                            PQRS y Denuncias
                                        </h1>
                                        <HelpManualButton url="/docs/Manual-PQRSD.pdf" variant="primary" />
                                    </div>
                                    <p className="text-base md:text-lg text-accent-foreground/80 mb-3">
                                        Canal oficial de <strong>Inversiones Arar S.A.</strong> para recibir sus inquietudes
                                    </p>
                                    <div className="text-muted-foreground text-sm space-y-2">
                                        <p>
                                            <strong className="text-foreground">PQRS:</strong> Peticiones, Quejas, Reclamos y Sugerencias dirigidas a Inversiones Arar S.A.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Denuncias:</strong> Puede realizarlas de forma <strong className="text-primary">anónima o identificada</strong> sobre cualquier empresa del grupo empresarial.
                                        </p>
                                    </div>
                                </div>

                                {/* Columna derecha - Información legal */}
                                <div className="space-y-4">
                                    {/* Card principal */}
                                    <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 shadow-md border border-primary/10">
                                        <div className="flex items-start gap-3 mb-2">
                                            <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                Recibirá respuesta en un máximo de <strong className="text-foreground">15 días hábiles</strong> según el artículo 14 de la Ley 1755 de 2015.
                                            </p>
                                        </div>
                                        <p className="text-primary font-semibold text-sm text-end">
                                            Agradecemos el uso responsable del formulario.
                                        </p>
                                    </div>

                                    {/* Card adicional para denuncias anónimas */}
                                    <div className="bg-primary/5 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
                                        <div className="flex items-start gap-3">
                                            <HatGlasses className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-primary">
                                                    Denuncias Anónimas
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Su identidad se mantendrá completamente confidencial. No recibirá confirmación por correo.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Formulario Multi-Paso */}
                <section className="py-10 bg-accent/30 border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Indicador de progreso */}
                            <Card className="mb-6 md:mb-8">
                                <CardContent className="p-4 md:p-6">
                                    <div className="mb-4 md:mb-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs md:text-sm font-medium text-primary">
                                                Paso {currentStep} de {stepsConfig.length}
                                            </span>
                                            <span className="text-xs md:text-sm text-muted-foreground">
                                                {Math.round(progress)}% completado
                                            </span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>

                                    {/* Steps indicators */}
                                    <div className={`grid gap-1.5 md:gap-2` + (data.esAnonimo ? ' grid-cols-2' : ' grid-cols-4')}>
                                        {stepsConfig.map((step) => {
                                            const Icon = step.icon;
                                            const isActive = currentStep === step.number;
                                            const isCompleted = currentStep > step.number;

                                            return (
                                                <div
                                                    key={step.number}
                                                    className={`flex flex-col items-center p-2 md:p-3 rounded-lg transition-all ${isActive
                                                        ? 'bg-primary/10 border-2 border-primary'
                                                        : isCompleted
                                                            ? 'bg-green-50 border-2 border-green-500'
                                                            : 'bg-muted border-2 border-transparent'
                                                        }`}
                                                >
                                                    <div
                                                        className={`rounded-full p-1.5 md:p-2 md:mb-2 ${isActive
                                                            ? 'bg-primary text-white'
                                                            : isCompleted
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-muted-foreground/20 text-muted-foreground'
                                                            }`}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                                                        ) : (
                                                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`hidden md:block md:text-xs font-medium text-center leading-tight ${isActive || isCompleted
                                                            ? 'text-foreground'
                                                            : 'text-muted-foreground'
                                                            }`}
                                                    >
                                                        {step.title}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contenido del paso actual */}
                            <Card>
                                <CardContent className="p-4 md:p-6 lg:p-8">
                                    <div className="mb-6 md:mb-8">
                                        <h2 className="text-xl md:text-2xl font-bold text-primary mb-2">
                                            {stepsConfig[currentStep - 1].title}
                                        </h2>
                                        <p className="text-sm md:text-base text-muted-foreground">
                                            {stepsConfig[currentStep - 1].description}
                                        </p>
                                    </div>

                                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4 md:space-y-6">
                                        {/* PASO 1 */}
                                        {currentStep === 1 && (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tipoPqrs" className=' after:text-red-500 after:content-["*"]'>
                                                            Tipo de PQRSD
                                                        </Label>
                                                        <Select
                                                            value={data.tipoPqrs}
                                                            onValueChange={(value) => {
                                                                handleChange('tipoPqrs', value);

                                                                if (tipoDenuncia && value !== tipoDenuncia.id.toString()) {
                                                                    const inversionesArar = empresas.find(e =>
                                                                        e.siglas == 'IA' // Siglas de Inversiones Arar S.A.
                                                                    );
                                                                    if (inversionesArar) {                                                                        
                                                                        handleChange('empresa', inversionesArar.id.toString());
                                                                        handleChange('esAnonimo', false);                                                  
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger
                                                                id="tipoPqrs"
                                                                className={errors.tipoPqrs ? "border-destructive" : ""}
                                                            >
                                                                <SelectValue placeholder="Seleccione tipo..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {tiposPqrs.map((tipo) => (
                                                                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                                        {`${tipo.abreviatura} - ${tipo.nombre}`}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError message={errors.tipoPqrs} />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="empresa" className=' after:text-red-500 after:content-["*"]'>
                                                            Empresa
                                                        </Label>
                                                        <Select
                                                            value={data.empresa}
                                                            onValueChange={(value) => handleChange('empresa', value)}
                                                            disabled={(() => {
                                                                return !tipoDenuncia || data.tipoPqrs !== tipoDenuncia.id.toString();
                                                            })()}
                                                        >
                                                            <SelectTrigger
                                                                id="empresa"
                                                                className={errors.empresa ? "border-destructive" : ""}
                                                            >
                                                                <SelectValue placeholder="Seleccione empresa..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {empresas.filter((emp) => {
                                                                    // Si no es denuncia, solo carga Inversiones Arar S.A.
                                                                    if (!tipoDenuncia || data.tipoPqrs !== tipoDenuncia.id.toString()) {
                                                                        return emp.siglas == 'IA'; // Id de Inversiones Arar S.A.
                                                                    }
                                                                    return true; // Carga todas las empresas para denuncias.
                                                                }).map((emp) => (
                                                                    <SelectItem key={emp.id} value={emp.id.toString()}>
                                                                        {emp.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError message={errors.empresa} />
                                                    </div>
                                                </div>

                                                {/* CHECKBOX ANÓNIMO - Solo si es Denuncia */}
                                                {(() => {
                                                    const tipoDenuncia = tiposPqrs.find(t => t.abreviatura === 'D');
                                                    return tipoDenuncia && data.tipoPqrs === tipoDenuncia.id.toString() && (


                                                        <Label htmlFor="esAnonimo" className="flex !py-2 text-primary items-center gap-2 rounded-lg border border-primary/40 p-4 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                                                            <HatGlasses className='!w-6 !h-6' />
                                                            <div className='flex-1 flex gap-2 items-center max-sm:text-[12px]'>
                                                                <Checkbox
                                                                    id="esAnonimo"
                                                                    checked={data.esAnonimo}
                                                                    onCheckedChange={(checked) => handleChange('esAnonimo', checked as boolean)}
                                                                    className="!mt-0 border-primary"
                                                                />
                                                                Marque esta casilla si desea realizar la denuncia de forma anónima
                                                            </div>
                                                        </Label>
                                                    );
                                                })()}
                                            </div>
                                        )}

                                        {/* PASO 2: Información personal - Solo si NO es anónimo */}
                                        {currentStep === 2 && !data.esAnonimo && (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="nombre" className=' after:text-red-500 after:content-["*"]'>
                                                            Nombres
                                                        </Label>
                                                        <Input
                                                            id="nombre"
                                                            placeholder="Ingrese sus nombres"
                                                            value={data.nombre}
                                                            onChange={(e) => handleChange('nombre', e.target.value)}
                                                            onKeyDown={handleTextKeyDown}
                                                            className={errors.nombre ? "border-destructive" : ""}
                                                            maxLength={PQRSD_LIMITS.nombre}
                                                            autoComplete="given-name"
                                                        />
                                                        <div className="relative">
                                                            <InputError message={errors.nombre} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.nombre.length}/{PQRSD_LIMITS.nombre}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="apellido" className=' after:text-red-500 after:content-["*"]'>
                                                            Apellidos
                                                        </Label>
                                                        <Input
                                                            id="apellido"
                                                            placeholder="Ingrese sus apellidos"
                                                            value={data.apellido}
                                                            onChange={(e) => handleChange('apellido', e.target.value)}
                                                            onKeyDown={handleTextKeyDown}
                                                            className={errors.apellido ? "border-destructive" : ""}
                                                            maxLength={PQRSD_LIMITS.apellido}
                                                            autoComplete='family-name'
                                                        />
                                                        <div className="relative">
                                                            <InputError message={errors.apellido} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.apellido.length}/{PQRSD_LIMITS.apellido}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="tipoId" className=' after:text-red-500 after:content-["*"]'>
                                                            Tipo de Identificación
                                                        </Label>
                                                        <Select
                                                            value={data.tipoId}
                                                            onValueChange={(value) => handleChange('tipoId', value)}
                                                        >
                                                            <SelectTrigger
                                                                id="tipoId"
                                                                className={errors.tipoId ? "border-destructive" : ""}
                                                            >
                                                                <SelectValue placeholder="Seleccione tipo..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {tiposId.map((tipo) => (
                                                                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                                        {`${tipo.abreviatura} - ${tipo.nombre}`}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>

                                                        <InputError message={errors.tipoId} />

                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="numId" className=' after:text-red-500 after:content-["*"]'>
                                                            N° Documento
                                                        </Label>
                                                        <Input
                                                            id="numId"
                                                            type="tel"
                                                            placeholder="Ingrese su número"
                                                            value={data.numId}
                                                            onChange={(e) => handleChange('numId', e.target.value)}
                                                            onKeyDown={handleNumberKeyDown}
                                                            className={errors.numId ? "border-destructive" : ""}
                                                            maxLength={PQRSD_LIMITS.numId}
                                                            autoComplete='document-number'
                                                        />
                                                        <div className="relative">
                                                            <InputError message={errors.numId} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.numId.length}/{PQRSD_LIMITS.numId}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* PASO 3: Contacto y Ubicación - Solo si NO es anónimo */}
                                        {currentStep === 3 && !data.esAnonimo && (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="correo" className=' after:text-red-500 after:content-["*"]'>
                                                            Correo electrónico
                                                        </Label>
                                                        <Input
                                                            id="correo"
                                                            type="email"
                                                            placeholder="ejemplo@correo.com"
                                                            value={data.correo}
                                                            onChange={(e) => handleChange('correo', e.target.value)}
                                                            onKeyDown={handleEmailKeyDown}
                                                            className={errors.correo ? "border-destructive" : ""}
                                                            maxLength={PQRSD_LIMITS.correo}
                                                            autoComplete="email"
                                                        />
                                                        <div className="relative">
                                                            <InputError message={errors.correo} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.correo.length}/{PQRSD_LIMITS.correo}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="telefono" className=' after:text-red-500 after:content-["*"]'>
                                                            Teléfono
                                                        </Label>
                                                        <Input
                                                            id="telefono"
                                                            type="tel"
                                                            placeholder="Ingrese su teléfono"
                                                            value={data.telefono}
                                                            onChange={(e) => handleChange('telefono', e.target.value)}
                                                            onKeyDown={handleNumberKeyDown}
                                                            className={errors.telefono ? "border-destructive" : ""}
                                                            maxLength={PQRSD_LIMITS.telefono}
                                                            autoComplete="tel"
                                                        />
                                                        <div className="relative">
                                                            <InputError message={errors.telefono} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.telefono.length}/{PQRSD_LIMITS.telefono}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="dpto" className=' after:text-red-500 after:content-["*"]'>
                                                            Departamento
                                                        </Label>
                                                        <Select
                                                            value={data.dpto}
                                                            onValueChange={(value) => {
                                                                handleChange('dpto', value);
                                                                handleChange('ciudad', "");
                                                            }}
                                                        >
                                                            <SelectTrigger
                                                                id="dpto"
                                                                className={errors.dpto ? "border-destructive" : ""}
                                                            >
                                                                <SelectValue placeholder="Seleccione..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {departamentos.map((dpto) => (
                                                                    <SelectItem key={dpto.id} value={dpto.id.toString()}>
                                                                        {dpto.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError message={errors.dpto} />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="ciudad" className=' after:text-red-500 after:content-["*"]'>
                                                            Ciudad
                                                        </Label>
                                                        <Select
                                                            value={data.ciudad}
                                                            onValueChange={(value) => handleChange('ciudad', value)}
                                                            disabled={!data.dpto}
                                                        >
                                                            <SelectTrigger
                                                                id="ciudad"
                                                                className={errors.ciudad ? "border-destructive" : ""}
                                                            >
                                                                <SelectValue placeholder="Seleccione..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {ciudades
                                                                    .filter(ciudad => ciudad.id_dpto == parseInt(data.dpto))
                                                                    .map((ciudad) => (
                                                                        <SelectItem key={ciudad.id} value={ciudad.id.toString()}>
                                                                            {ciudad.name}
                                                                        </SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError message={errors.ciudad} />
                                                    </div>

                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label htmlFor="direccion">
                                                            Dirección (Opcional)
                                                        </Label>
                                                        <Input
                                                            id="direccion"
                                                            placeholder="Ingrese su dirección"
                                                            value={data.direccion}
                                                            onChange={(e) => handleChange('direccion', e.target.value)}
                                                            className={errors.direccion ? "border-destructive" : ""}
                                                            maxLength={PQRSD_LIMITS.direccion}
                                                            autoComplete="street-address"
                                                        />
                                                        <div className="relative">
                                                            <InputError message={errors.direccion} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.direccion.length}/{PQRSD_LIMITS.direccion}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label htmlFor="relacion" className=' after:text-red-500 after:content-["*"]'>
                                                            Relación con la empresa
                                                        </Label>
                                                        <Select
                                                            value={data.relacion}
                                                            onValueChange={(value) => handleChange('relacion', value)}
                                                        >
                                                            <SelectTrigger
                                                                id="relacion"
                                                                className={errors.relacion ? "border-destructive" : ""}
                                                            >
                                                                <SelectValue placeholder="Seleccione..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="cliente">Cliente</SelectItem>
                                                                <SelectItem value="empleado">Empleado</SelectItem>
                                                                <SelectItem value="proveedor">Proveedor</SelectItem>
                                                                <SelectItem value="otro">Otro</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError message={errors.relacion} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* PASO 4: Descripción y Archivos */}
                                        {(currentStep === 4 || (data.esAnonimo && currentStep === 2)) && (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="space-y-2 !mb-8">
                                                    <Label htmlFor="mensaje" className=' after:text-red-500 after:content-["*"]'>
                                                        Descripción de su {tipoDenuncia?.nombre.toLowerCase() || "PQRS"}
                                                    </Label>
                                                    <Textarea
                                                        id="mensaje"
                                                        placeholder="Describa detalladamente su petición, queja, reclamo, sugerencia o denuncia..."
                                                        className={`min-h-[150px] ${errors.mensaje ? "border-destructive" : ""}`}
                                                        value={data.mensaje}
                                                        onChange={(e) => handleChange('mensaje', e.target.value)}
                                                        onKeyDown={handleMessagesKeyDown}
                                                        maxLength={PQRSD_LIMITS.mensaje}
                                                    />
                                                    <div className="relative">
                                                        <InputError message={errors.mensaje} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.mensaje.length}/{PQRSD_LIMITS.mensaje}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Archivos adjuntos */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label className="mb-2 block">
                                                            Archivos adjuntos (opcional)
                                                        </Label>
                                                        <div
                                                            className={`border-2 cursor-pointer border-dashed rounded-lg p-6 pb-2 text-center transition-colors 
                                                                ${isDragging ? 'border-primary bg-primary/5'
                                                                    : 'border-primary/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50'}`}
                                                            onDragOver={handleDragOver}
                                                            onDragLeave={handleDragLeave}
                                                            onDrop={handleDrop}
                                                            onClick={() => !processing && fileInputRef.current?.click()}
                                                        >
                                                            <div className="h-12 w-12 rounded-full bg-primary/10 inline-flex items-center justify-center">
                                                                <FileText className="h-6 w-6 text-primary" />
                                                            </div>
                                                            <p className="text-sm font-medium text-foreground mb-1 mt-2">
                                                                {isDragging ? "Suelta el archivo aqui" : "Subir archivos"}
                                                            </p>
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                accept=".pdf,.jpg,.jpeg,.doc"
                                                                multiple
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                                id="file-upload"
                                                                disabled={files.length >= 5}
                                                            />
                                                            <p className="text-xs text-muted-foreground">

                                                                {isDragging ? "Suelta para cargar" : "PDF, DOC o JPG (máx 500KB). Hasta 5 archivos."}
                                                            </p>
                                                            <Label
                                                                htmlFor="file-upload"
                                                                className="mt-4 cursor-pointer inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                                                            >
                                                                Seleccionar archivos
                                                            </Label>
                                                        </div>
                                                    </div>

                                                    {files.length > 0 && (
                                                        <div className="space-y-2">
                                                            <Label className="text-sm font-medium">
                                                                Archivos seleccionados ({files.length}/5)
                                                            </Label>
                                                            {files.map((file, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center gap-3 p-3 bg-muted rounded-lg group hover:bg-muted/80 transition-colors"
                                                                >
                                                                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium truncate">
                                                                            {file.name}
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {(file.size / 1024).toFixed(2)} KB
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => removeFile(index)}
                                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Aviso legal */}
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                    <div className="text-sm">
                                                        <p className="font-semibold text-amber-900 mb-1">
                                                            Aviso Legal
                                                        </p>
                                                        <p className="text-amber-800">
                                                            De conformidad con el artículo 14 de la Ley 1755 de 2015,
                                                            el término de respuesta es de <strong>15 días hábiles</strong>,
                                                            contados a partir del día siguiente al envío de este formulario.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </form>

                                    {/* Botones de navegación */}
                                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6 md:mt-8 pt-4 md:pt-6 border-t">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={prevStep}
                                            disabled={currentStep === 1 || processing}
                                            className="gap-2 w-full sm:w-auto order-2 sm:order-1"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Anterior
                                        </Button>

                                        {currentStep < stepsConfig.length ? (
                                            <Button
                                                type="button"
                                                onClick={nextStep}
                                                disabled={processing}
                                                className="gap-2 w-full sm:w-auto order-1 sm:order-2"
                                            >
                                                Siguiente
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={processing}
                                                className="gap-2 w-full sm:w-auto order-1 sm:order-2"
                                            >
                                                {processing ? (
                                                    <>
                                                        Enviando
                                                        <LoaderCircle className="w-4 h-4 animate-spin" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Enviar PQRSD
                                                        <Send className="w-4 h-4" />
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

PQRSD.layout = (page) => (
    <PublicLayout children={page} />
)