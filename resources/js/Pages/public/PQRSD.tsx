/**
 * Componente PQRSD con formulario multi-paso
 * Diseño moderno y dinámico para mejorar la experiencia del usuario
 * 
 * @author Yariangel Aray
 * @version 2.0
 * @date 2025-11-13
 */

import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import InputError from '@/Components/InputError';
import {
    handleTextKeyDown,
    handleEmailKeyDown,
    handleNumberKeyDown,
    handleMessagesKeyDown,
    handleLimit
} from '@/lib/keydownValidations';
import { z } from 'zod';
import {
    Building2, User, MapPin, MessageSquare,
    ChevronLeft, ChevronRight, Send,
    LoaderCircle, X, FileText, CheckCircle,
    AlertCircle
} from 'lucide-react';
import { Progress } from '@/Components/ui/progress';

// Interfaces
interface FormData {
    empresa: string;
    tipoPqrs: string;
    nombre: string;
    apellido: string;
    tipoId: string;
    numId: string;
    correo: string;
    telefono: string;
    dpto: string;
    ciudad: string;
    direccion: string;
    relacion: string;
    mensaje: string;
}

interface PQRSDProps {
    empresas: Array<{ id: number; name: string }>;
    departamentos: Array<{ id: number; name: string }>;
    ciudades: Array<{ id: number; name: string; id_dpto: number }>;
    tiposPqrs: Array<{ id: number; nombre: string; abreviatura: string }>;
    tiposId: Array<{ id: number; nombre: string; abreviatura: string }>;
}

// Constantes
const LIMITS = {
    nombre: 50,
    apellido: 50,
    correo: 50,
    numId: 15,
    telefono: 15,
    direccion: 100,
    mensaje: 2000,
} as const;

// Schemas de validación por paso
const step1Schema = z.object({
    empresa: z.string().min(1, "Debe seleccionar una empresa"),
    tipoPqrs: z.string().min(1, "Debe seleccionar el tipo de PQRSD"),
});

const step2Schema = z.object({
    nombre: z.string().trim()
        .min(1, "El nombre es obligatorio")
        .max(LIMITS.nombre, `Máximo ${LIMITS.nombre} caracteres`)
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras"),
    apellido: z.string().trim()
        .min(1, "El apellido es obligatorio")
        .max(LIMITS.apellido, `Máximo ${LIMITS.apellido} caracteres`)
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras"),
    tipoId: z.string().min(1, "Debe seleccionar el tipo de identificación"),
    numId: z.string().trim()
        .min(1, "El número de documento es obligatorio")
        .max(LIMITS.numId, `Máximo ${LIMITS.numId} caracteres`)
        .regex(/^[0-9]+$/, "Solo se permiten números"),
});

const step3Schema = z.object({
    correo: z.string().trim()
        .email("Ingrese un correo válido")
        .max(LIMITS.correo, `Máximo ${LIMITS.correo} caracteres`),
    telefono: z.string().trim()
        .min(1, "El teléfono es obligatorio")
        .max(LIMITS.telefono, `Máximo ${LIMITS.telefono} caracteres`)
        .regex(/^\+?[0-9]+$/, "Ingrese un teléfono válido"),
    dpto: z.string().min(1, "Debe seleccionar un departamento"),
    ciudad: z.string().min(1, "Debe seleccionar una ciudad"),
    direccion: z.string().max(LIMITS.direccion, `Máximo ${LIMITS.direccion} caracteres`).optional(),
    relacion: z.string().min(1, "Debe especificar su relación con la empresa"),
});

const step4Schema = z.object({
    mensaje: z.string().trim()
        .min(20, "El mensaje debe tener al menos 20 caracteres")
        .max(LIMITS.mensaje, `Máximo ${LIMITS.mensaje} caracteres`),
});

export default function PQRSD({ empresas, departamentos, ciudades, tiposPqrs, tiposId }: PQRSDProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<FormData>({
        empresa: "",
        tipoPqrs: "",
        nombre: "",
        apellido: "",
        tipoId: "",
        numId: "",
        correo: "",
        telefono: "",
        dpto: "",
        ciudad: "",
        direccion: "",
        relacion: "",
        mensaje: "",
    });

    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false); // Estado para drag
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const { toast } = useToast();

    // Configuración de pasos
    const steps = [
        {
            number: 1,
            title: "Información PQRSD",
            icon: Building2,
            description: "Seleccione la empresa y tipo"
        },
        {
            number: 2,
            title: "Datos Personales",
            icon: User,
            description: "Complete su información personal"
        },
        {
            number: 3,
            title: "Contacto y Ubicación",
            icon: MapPin,
            description: "Datos de contacto y dirección"
        },
        {
            number: 4,
            title: "Descripción",
            icon: MessageSquare,
            description: "Describa su petición o denuncia"
        },
    ];

    const progress = (currentStep / steps.length) * 100;

    // Validación por paso
    const validateStep = (step: number): boolean => {
        setErrors({});
        let schema;
        let dataToValidate;

        switch (step) {
            case 1:
                schema = step1Schema;
                dataToValidate = { empresa: data.empresa, tipoPqrs: data.tipoPqrs };
                break;
            case 2:
                schema = step2Schema;
                dataToValidate = {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    tipoId: data.tipoId,
                    numId: data.numId
                };
                break;
            case 3:
                schema = step3Schema;
                dataToValidate = {
                    correo: data.correo,
                    telefono: data.telefono,
                    dpto: data.dpto,
                    ciudad: data.ciudad,
                    direccion: data.direccion,
                    relacion: data.relacion
                };
                break;
            case 4:
                schema = step4Schema;
                dataToValidate = { mensaje: data.mensaje };
                break;
            default:
                return true;
        }

        const result = schema.safeParse(dataToValidate);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path.length > 0) {
                    newErrors[err.path[0].toString()] = err.message;
                }
            });
            setErrors(newErrors);

            // Scroll al primer error
            setTimeout(() => {
                const firstErrorField = Object.keys(newErrors)[0];
                document.getElementById(firstErrorField)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);

            return false;
        }

        return true;
    };

    // Navegación entre pasos
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Manejo de archivos
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter((file) => {
                const isValidType = file.type === "application/pdf" ||
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg";
                const isValidSize = file.size <= 500000;

                if (!isValidType) {
                    toast({
                        title: "Formato no válido",
                        description: `${file.name} debe ser PDF o JPG`,
                        variant: "destructive",
                    });
                    return false;
                }

                if (!isValidSize) {
                    toast({
                        title: "Archivo muy grande",
                        description: `${file.name} debe ser menor a 500KB`,
                        variant: "destructive",
                    });
                    return false;
                }

                return true;
            });

            setFiles([...files, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // Función para validar y agregar archivos (reutiliza lógica de handleFileChange)
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            const droppedFiles = Array.from(e.dataTransfer.files);

            // Chequea límite total antes de procesar
            if (files.length + droppedFiles.length > 5) {
                toast({
                    title: "Límite excedido",
                    description: "Máximo 5 archivos permitidos",
                    variant: "destructive",
                });
                return;
            }
            // Filtra y valida archivos, mostrando toasts para inválidos
            const validFiles = droppedFiles.filter((file) => {
                const isValidType = file.type === "application/pdf" ||
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg";
                const isValidSize = file.size <= 500000;
                if (!isValidType) {
                    toast({
                        title: "Formato no válido",
                        description: `${file.name} debe ser PDF o JPG`,
                        variant: "destructive",
                    });
                    return false;
                }
                if (!isValidSize) {
                    toast({
                        title: "Archivo muy grande",
                        description: `${file.name} debe ser menor a 500KB`,
                        variant: "destructive",
                    });
                    return false;
                }
                return true;
            });
            // Agrega solo válidos
            setFiles([...files, ...validFiles]);
        }
    }

    // Handlers para drag
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // Envío del formulario
    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setProcessing(true);

        try {

            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            const response = await fetch(route('pqrsd.store'), {
                method: 'POST',
                headers: {                    
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: formData,
            });
            const result = await response.json();

            if (response.ok) {
                toast({
                    title: "¡PQRSD enviada!",
                    variant: "success",
                    description: "Su solicitud ha sido recibida y será procesada en los próximos 15 días hábiles.",
                });

                // Reset
                setData({
                    empresa: "",
                    tipoPqrs: "",
                    nombre: "",
                    apellido: "",
                    tipoId: "",
                    numId: "",
                    correo: "",
                    telefono: "",
                    dpto: "",
                    ciudad: "",
                    direccion: "",
                    relacion: "",
                    mensaje: "",
                });
                setFiles([]);
                setCurrentStep(1);
            } else if (response.status === 422) {
                setErrors(result.errors || {});
                toast({
                    title: "Error al enviar",
                    description: "Por favor revise los campos marcados.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Error al enviar",
                    description: result.error || "Intenta de nuevo más tarde.",
                    variant: "destructive",
                });
            }

        } catch (error) {
            toast({
                title: "Error de conexión",
                description: "Revisa tu conexión e intenta de nuevo.",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <PublicLayout>
            <Head title="PQRSD" />
            <main>
                {/* Header con información */}
                <section className="pb-5 pt-28 bg-gradient-to-br from-primary/20 via-accent/10 to-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl text-primary font-bold mb-6">
                                PQRSD
                            </h1>
                            <p className="text-lg text-accent-foreground/80 mb-4">
                                Bienvenido al módulo de <strong>PQRSD de Inversiones Arar S.A.</strong>
                            </p>
                            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                                Si desea realizar una Solicitud, Petición, Queja, Reclamo o Denuncia  relacionada con Inversiones Arar o alguna de sus empresas filiales,
                                complete el siguiente formulario. Recibirá respuesta en un máximo de
                                <strong> 15 días hábiles</strong> según el articulo 14 de la Ley 1755 de 2015.
                            </p>
                            <p className="text-primary font-semibold text-sm mt-5">
                                Agradecemos el uso responsable del formulario.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Formulario Multi-Paso */}
                <section className="py-12 bg-accent/30 border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Indicador de progreso */}
                            <Card className="mb-8">
                                <CardContent className="p-6">
                                    {/* Barra de progreso */}
                                    <div className="mb-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium text-primary">
                                                Paso {currentStep} de {steps.length}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {Math.round(progress)}% completado
                                            </span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>

                                    {/* Steps indicators */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {steps.map((step) => {
                                            const Icon = step.icon;
                                            const isActive = currentStep === step.number;
                                            const isCompleted = currentStep > step.number;

                                            return (
                                                <div
                                                    key={step.number}
                                                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${isActive
                                                        ? 'bg-primary/10 border-2 border-primary'
                                                        : isCompleted
                                                            ? 'bg-green-50 border-2 border-green-500'
                                                            : 'bg-muted border-2 border-transparent'
                                                        }`}
                                                >
                                                    <div
                                                        className={`rounded-full p-2 mb-2 ${isActive
                                                            ? 'bg-primary text-white'
                                                            : isCompleted
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-muted-foreground/20 text-muted-foreground'
                                                            }`}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle className="w-5 h-5" />
                                                        ) : (
                                                            <Icon className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-xs font-medium text-center ${isActive || isCompleted
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
                                <CardContent className="p-6 md:p-8">
                                    {/* Título del paso */}
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-primary mb-2">
                                            {steps[currentStep - 1].title}
                                        </h2>
                                        <p className="text-muted-foreground">
                                            {steps[currentStep - 1].description}
                                        </p>
                                    </div>

                                    {/* Formularios por paso */}
                                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                                        {/* PASO 1: Información PQRSD */}
                                        {currentStep === 1 && (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Empresa */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="empresa" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Empresa
                                                        </Label>
                                                        <Select
                                                            value={data.empresa}
                                                            onValueChange={(value) => setData({ ...data, empresa: value })}
                                                        >
                                                            <SelectTrigger
                                                                id="empresa"
                                                                className={errors.empresa ? "border-destructive" : ""}
                                                            >
                                                                <SelectValue placeholder="Seleccione empresa..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {empresas.map((emp) => (
                                                                    <SelectItem key={emp.id} value={emp.id.toString()}>
                                                                        {emp.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError className='absolute top-0 left-0 !-mt-1' message={errors.empresa} />
                                                    </div>

                                                    {/* Tipo de PQRS */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tipoPqrs" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Tipo de PQRSD
                                                        </Label>
                                                        <Select
                                                            value={data.tipoPqrs}
                                                            onValueChange={(value) => setData({ ...data, tipoPqrs: value })}
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
                                                        <InputError className='absolute top-0 left-0 !-mt-1' message={errors.tipoPqrs} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* PASO 2: Datos Personales */}
                                        {currentStep === 2 && (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Nombre */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="nombre" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Nombres
                                                        </Label>
                                                        <Input
                                                            id="nombre"
                                                            placeholder="Ingrese sus nombres"
                                                            value={data.nombre}
                                                            onChange={(e) => setData({ ...data, nombre: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                handleTextKeyDown(e);
                                                                handleLimit(e, data.nombre, LIMITS.nombre);
                                                            }}
                                                            className={errors.nombre ? "border-destructive" : ""}
                                                            maxLength={LIMITS.nombre}
                                                        />
                                                        <div className="relative">
                                                            <InputError className='absolute top-0 left-0 !-mt-1' message={errors.nombre} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.nombre.length}/{LIMITS.nombre}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Apellido */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="apellido" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Apellidos
                                                        </Label>
                                                        <Input
                                                            id="apellido"
                                                            placeholder="Ingrese sus apellidos"
                                                            value={data.apellido}
                                                            onChange={(e) => setData({ ...data, apellido: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                handleTextKeyDown(e);
                                                                handleLimit(e, data.apellido, LIMITS.apellido);
                                                            }}
                                                            className={errors.apellido ? "border-destructive" : ""}
                                                            maxLength={LIMITS.apellido}
                                                        />
                                                        <div className="relative">
                                                            <InputError className='absolute top-0 left-0 !-mt-1' message={errors.apellido} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.apellido.length}/{LIMITS.apellido}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Tipo ID */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tipoId" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Tipo de Identificación
                                                        </Label>
                                                        <Select
                                                            value={data.tipoId}
                                                            onValueChange={(value) => setData({ ...data, tipoId: value })}
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
                                                        <InputError className='absolute top-0 left-0 !-mt-1' message={errors.tipoId} />
                                                    </div>

                                                    {/* Número ID */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="numId" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            N° Documento
                                                        </Label>
                                                        <Input
                                                            id="numId"
                                                            type="tel"
                                                            placeholder="Ingrese su número"
                                                            value={data.numId}
                                                            onChange={(e) => setData({ ...data, numId: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                handleNumberKeyDown(e);
                                                                handleLimit(e, data.numId, LIMITS.numId);
                                                            }}
                                                            className={errors.numId ? "border-destructive" : ""}
                                                            maxLength={LIMITS.numId}
                                                        />
                                                        <div className="relative">
                                                            <InputError className='absolute top-0 left-0 !-mt-1' message={errors.numId} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.numId.length}/{LIMITS.numId}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* PASO 3: Contacto y Ubicación */}
                                        {currentStep === 3 && (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Correo */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="correo" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Correo electrónico
                                                        </Label>
                                                        <Input
                                                            id="correo"
                                                            type="email"
                                                            placeholder="ejemplo@correo.com"
                                                            value={data.correo}
                                                            onChange={(e) => setData({ ...data, correo: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                handleEmailKeyDown(e);
                                                                handleLimit(e, data.correo, LIMITS.correo);
                                                            }}
                                                            className={errors.correo ? "border-destructive" : ""}
                                                            maxLength={LIMITS.correo}
                                                        />
                                                        <div className="relative">
                                                            <InputError className='absolute top-0 left-0 !-mt-1' message={errors.correo} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.correo.length}/{LIMITS.correo}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Teléfono */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="telefono" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Teléfono
                                                        </Label>
                                                        <Input
                                                            id="telefono"
                                                            type="tel"
                                                            placeholder="Ingrese su teléfono"
                                                            value={data.telefono}
                                                            onChange={(e) => setData({ ...data, telefono: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                handleNumberKeyDown(e);
                                                                handleLimit(e, data.telefono, LIMITS.telefono);
                                                            }}
                                                            className={errors.telefono ? "border-destructive" : ""}
                                                            maxLength={LIMITS.telefono}
                                                        />
                                                        <div className="relative">
                                                            <InputError className='absolute top-0 left-0 !-mt-1' message={errors.telefono} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.telefono.length}/{LIMITS.telefono}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Departamento */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="dpto" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Departamento
                                                        </Label>
                                                        <Select
                                                            value={data.dpto}
                                                            onValueChange={(value) => {
                                                                setData({ ...data, dpto: value, ciudad: "" });
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
                                                        <InputError className='absolute top-0 left-0 !-mt-1' message={errors.dpto} />
                                                    </div>

                                                    {/* Ciudad */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="ciudad" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Ciudad
                                                        </Label>
                                                        <Select
                                                            value={data.ciudad}
                                                            onValueChange={(value) => setData({ ...data, ciudad: value })}
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
                                                        <InputError className='absolute top-0 left-0 !-mt-1' message={errors.ciudad} />
                                                    </div>

                                                    {/* Dirección */}
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label htmlFor="direccion">
                                                            Dirección (Opcional)
                                                        </Label>
                                                        <Input
                                                            id="direccion"
                                                            placeholder="Ingrese su dirección"
                                                            value={data.direccion}
                                                            onChange={(e) => setData({ ...data, direccion: e.target.value })}
                                                            onKeyDown={(e) => handleLimit(e, data.direccion, LIMITS.direccion)}
                                                            className={errors.direccion ? "border-destructive" : ""}
                                                            maxLength={LIMITS.direccion}
                                                        />
                                                        <div className="relative">
                                                            <InputError className='absolute top-0 left-0 !-mt-1' message={errors.direccion} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.direccion.length}/{LIMITS.direccion}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Relación */}
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label htmlFor="relacion" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Relación con la empresa
                                                        </Label>
                                                        <Select
                                                            value={data.relacion}
                                                            onValueChange={(value) => setData({ ...data, relacion: value })}
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
                                                        <InputError className='absolute top-0 left-0 !-mt-1' message={errors.relacion} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* PASO 4: Descripción y Archivos */}
                                        {currentStep === 4 && (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                {/* Mensaje */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="mensaje" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                        Descripción de su PQRSD
                                                    </Label>
                                                    <Textarea
                                                        id="mensaje"
                                                        placeholder="Describa detalladamente su petición, queja, reclamo, sugerencia o denuncia..."
                                                        className={`min-h-[100px] ${errors.mensaje ? "border-destructive" : ""}`}
                                                        value={data.mensaje}
                                                        onChange={(e) => setData({ ...data, mensaje: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            handleMessagesKeyDown(e);
                                                            handleLimit(e, data.mensaje, LIMITS.mensaje);
                                                        }}
                                                        maxLength={LIMITS.mensaje}
                                                    />
                                                    <div className="relative">
                                                        <InputError className='absolute top-0 left-0 !-mt-1' message={errors.mensaje} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.mensaje.length}/{LIMITS.mensaje}
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
                                                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors 
                                                                ${isDragging ? 'border-primary bg-primary/5' 
                                                                    : 'border-muted-foreground/25 hover:border-primary/50'}`}
                                                            onDragOver={handleDragOver}
                                                            onDragLeave={handleDragLeave}
                                                            onDrop={handleDrop}
                                                        >
                                                            <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                Arrastre archivos aquí o haga clic para seleccionar
                                                            </p>
                                                            <Input
                                                                type="file"
                                                                accept=".pdf,.jpg,.jpeg"
                                                                multiple
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                                id="file-upload"
                                                                disabled={files.length >= 5}
                                                            />
                                                            <Label
                                                                htmlFor="file-upload"
                                                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                                            >
                                                                Seleccionar archivos
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground mt-2">
                                                                Solo PDF y JPG. Máximo 500KB por archivo. Hasta 5 archivos.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Lista de archivos */}
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
                                    <div className="flex justify-between items-center mt-8 pt-6 border-t">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={prevStep}
                                            disabled={currentStep === 1 || processing}
                                            className="gap-2"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Anterior
                                        </Button>

                                        {currentStep < steps.length ? (
                                            <Button
                                                type="button"
                                                onClick={nextStep}
                                                disabled={processing}
                                                className="gap-2"
                                            >
                                                Siguiente
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={processing}
                                                className="gap-2"
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
        </PublicLayout>
    );
}