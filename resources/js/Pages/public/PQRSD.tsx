/**
 * Componente para el formulario de PQRSD (Peticiones, Quejas, Reclamos, Sugerencias y Denuncias)
 * Permite enviar denuncias anónimas o con datos personales, con adjuntos opcionales
 * 
 * @author Yariangel Aray - Documentado para facilitar el mantenimiento.
 * @version 1.0
 * @date 2025-11-12
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
import { Checkbox } from '@/Components/ui/checkbox';
import InputError from '@/Components/InputError';
import {
    handleTextKeyDown,
    handleEmailKeyDown,
    handleNumberKeyDown,
    handleMessagesKeyDown,
    handleLimit
} from '@/lib/keydownValidations';
import { z } from 'zod';
import { HatGlasses, LoaderCircle, Send, UserLock, X } from 'lucide-react';

// Interfaz para las empresas
interface Empresa {
    id: number;
    name: string;
}

// Interfaz para los datos del formulario
interface FormData {
    anonimo: boolean;
    empresa: string;
    nombre: string;
    correo: string;
    telefono: string;
    relacion: string;
    mensaje: string;
}

// Props del componente
interface CompaniesProps {
    empresas: Empresa[];
}

// Constantes de límites
const LIMITS = {
    nombre: 100,
    correo: 50,
    telefono: 15,
    mensaje: 1000,
} as const;

// Schema de validación con Zod
const pqrsdSchema = z.object({
    anonimo: z.boolean(),
    empresa: z.string()
        .min(1, "Debe seleccionar una empresa"),
    nombre: z.string()
        .trim()
        .max(LIMITS.nombre, `El nombre debe tener máximo ${LIMITS.nombre} caracteres`)
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/, "Solo se permiten letras")
        .optional()
        .or(z.literal('')),
    correo: z.string()
        .trim()
        .email("Ingrese un correo electrónico válido")
        .max(LIMITS.correo, `El correo debe tener máximo ${LIMITS.correo} caracteres`)
        .optional()
        .or(z.literal('')),
    telefono: z.string()
        .trim()
        .regex(/^(\+?[0-9]*)?$/, "Ingrese un número de teléfono válido")
        .max(LIMITS.telefono, `El teléfono debe tener máximo ${LIMITS.telefono} caracteres`)
        .optional()
        .or(z.literal('')),
    relacion: z.string()
        .optional()
        .or(z.literal('')),
    mensaje: z.string()
        .trim()
        .min(1, "El mensaje es obligatorio")
        .min(20, "El mensaje debe tener al menos 20 caracteres")
        .max(LIMITS.mensaje, `El mensaje debe tener máximo ${LIMITS.mensaje} caracteres`),
}).superRefine((data, ctx) => {
    // Si no es anónimo, validar campos obligatorios
    if (!data.anonimo) {
        if (!data.nombre || data.nombre.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "El nombre es obligatorio para denuncias no anónimas",
                path: ['nombre'],
            });
        }
        if (!data.correo || data.correo.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "El correo es obligatorio para denuncias no anónimas",
                path: ['correo'],
            });
        }
        if (!data.telefono || data.telefono.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "El teléfono es obligatorio para denuncias no anónimas",
                path: ['telefono'],
            });
        }
        if (!data.relacion || data.relacion.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La relación con la empresa es obligatoria para denuncias no anónimas",
                path: ['relacion'],
            });
        }
    }
});

export default function Companies({ empresas }: CompaniesProps) {
    // Estados del formulario
    const [data, setData] = useState<FormData>({
        anonimo: false,
        empresa: "",
        nombre: "",
        correo: "",
        telefono: "",
        relacion: "",
        mensaje: "",
    });

    const [files, setFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const { toast } = useToast();

    // Manejo de archivos
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter((file) => {
                const isValidType = file.type === "application/pdf" ||
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg";
                const isValidSize = file.size <= 500000; // 500KB

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

    // Envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validación con Zod
        const result = pqrsdSchema.safeParse(data);

        if (!result.success) {
            const newErrors: Record<string, string> = {};

            if (result.error instanceof z.ZodError) {
                result.error.issues.forEach((err) => {
                    if (err.path.length > 0) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
            }
            
            setErrors(newErrors);

            // Scroll al primer error
            const firstErrorField = Object.keys(newErrors)[0];
            document.getElementById(firstErrorField)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            return;
        }

        setProcessing(true);

        try {
            // Crear FormData para enviar archivos
            const formData = new FormData();

            // Agregar datos del formulario
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            // Agregar archivos
            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            // TODO: Descomentar cuando tengas la ruta
            /*
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
                    title: "¡Denuncia enviada!",
                    description: "Su denuncia ha sido recibida y será procesada en los próximos 15 días hábiles.",
                    variant: "success",
                });
                
                // Reset formulario
                setData({
                    anonimo: false,
                    empresa: "",
                    nombre: "",
                    correo: "",
                    telefono: "",
                    relacion: "",
                    mensaje: "",
                });
                setFiles([]);
            } else if (response.status === 422) {
                setErrors(result.errors || {});
            } else {
                toast({
                    title: "Error al enviar",
                    description: result.error || "Intenta de nuevo más tarde.",
                    variant: "destructive",
                });
            }
            */

            // SIMULACIÓN temporal (eliminar cuando tengas la ruta)
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: "¡Denuncia enviada!",
                description: "Su denuncia ha sido recibida y será procesada en los próximos 15 días hábiles.",
                variant: "success",
            });

            setData({
                anonimo: false,
                empresa: "",
                nombre: "",
                correo: "",
                telefono: "",
                relacion: "",
                mensaje: "",
            });
            setFiles([]);

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
                <section className="pb-20 pt-28 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className='grid md:grid-cols-2 gap-12'>
                            {/* Información */}
                            <div>
                                <h1 className="text-4xl md:text-5xl text-primary font-bold mb-6">
                                    PQRSD
                                </h1>
                                <Card className="py-0">
                                    <CardContent className="p-8">
                                        <p className="text-lg text-muted-foreground mb-4">
                                            Bienvenido al módulo de <strong>PQRSD de Inversiones Arar S.A.</strong>
                                        </p>
                                        <p className="text-muted-foreground mb-4">
                                            Apreciado usuario, si usted desea realizar una Solicitud, Petición, Queja,
                                            Reclamo o Denuncia relacionada con Inversiones Arar o alguna de sus empresas
                                            filiales, éste es el espacio para hacerlo.
                                        </p>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Tenga en cuenta que de conformidad con el artículo 14 de la ley 1755 de 2015,
                                            los términos de respuesta son de 15 días hábiles, contados a partir del día
                                            siguiente del mensaje de confirmación de recibo enviado al correo electrónico
                                            informado por usted en la petición.
                                        </p>
                                        <p className="text-primary font-semibold text-sm">
                                            Agradecemos el uso responsable del formulario.
                                        </p>
                                    </CardContent>
                                </Card>

                            </div>

                            {/* Formulario */}
                            <Card className='py-0'>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                        {/* Checkbox anónimo */}

                                        <Label htmlFor="anonimo" className="flex !py-3 text-primary items-center gap-4 rounded-lg border border-primary/40 p-4 bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                                            <div className="mt-1">
                                                <HatGlasses className='!w-10 !h-10' />
                                            </div>
                                            <div className='flex-1'>
                                                <div className='flex gap-2 items-center'>
                                                    <Checkbox
                                                        id="anonimo"
                                                        checked={data.anonimo}
                                                        className='border-primary'
                                                        onCheckedChange={(checked) => {
                                                            setData({
                                                                ...data,
                                                                anonimo: checked as boolean,
                                                                // Limpiar campos si se marca como anónimo
                                                                ...(checked ? {
                                                                    nombre: "",
                                                                    correo: "",
                                                                    telefono: "",
                                                                    relacion: "",
                                                                } : {})
                                                            });
                                                            // Limpiar errores de campos ocultos
                                                            if (checked) {
                                                                const newErrors = { ...errors };
                                                                delete newErrors.nombre;
                                                                delete newErrors.correo;
                                                                delete newErrors.telefono;
                                                                delete newErrors.relacion;
                                                                setErrors(newErrors);
                                                            }
                                                        }}
                                                    />
                                                    Anónimo
                                                </div>

                                                <p className="text-sm text-muted-foreground text-start mt-1">
                                                    Marque esta casilla si desea realizar la denuncia de forma anónima
                                                </p>
                                            </div>
                                        </Label>

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
                                                    className={errors.empresa ? "border-destructive focus-visible:ring-destructive" : ""}
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
                                            <InputError message={errors.empresa} />
                                        </div>

                                        {/* Campos condicionales (no anónimo) */}
                                        {!data.anonimo && (
                                            <>
                                                {/* Nombre */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="nombre" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                        Nombre completo
                                                    </Label>
                                                    <Input
                                                        id="nombre"
                                                        placeholder="Ingrese su nombre completo"
                                                        value={data.nombre}
                                                        onChange={(e) => setData({ ...data, nombre: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            handleTextKeyDown(e);
                                                            handleLimit(e, data.nombre, LIMITS.nombre);
                                                        }}
                                                        className={errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}
                                                        maxLength={LIMITS.nombre}
                                                    />
                                                    <div className="relative">
                                                        <InputError message={errors.nombre} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.nombre.length}/{LIMITS.nombre}
                                                        </span>
                                                    </div>
                                                </div>

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
                                                        className={errors.correo ? "border-destructive focus-visible:ring-destructive" : ""}
                                                        maxLength={LIMITS.correo}
                                                    />
                                                    <div className="relative">
                                                        <InputError message={errors.correo} />
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
                                                        className={errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}
                                                        maxLength={LIMITS.telefono}
                                                    />
                                                    <div className="relative">
                                                        <InputError message={errors.telefono} />
                                                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                            {data.telefono.length}/{LIMITS.telefono}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Relación */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="relacion" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                        Relación con la empresa
                                                    </Label>
                                                    <Select
                                                        value={data.relacion}
                                                        onValueChange={(value) => setData({ ...data, relacion: value })}
                                                    >
                                                        <SelectTrigger
                                                            id="relacion"
                                                            className={errors.relacion ? "border-destructive focus-visible:ring-destructive" : ""}
                                                        >
                                                            <SelectValue placeholder="Seleccione relación..." />
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
                                            </>
                                        )}

                                        {/* Mensaje */}
                                        <div className="space-y-2">
                                            <Label htmlFor="mensaje" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                Mensaje
                                            </Label>
                                            <Textarea
                                                id="mensaje"
                                                placeholder="Describa su petición, queja, reclamo, sugerencia o denuncia..."
                                                className={`min-h-[150px] ${errors.mensaje ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                value={data.mensaje}
                                                onChange={(e) => setData({ ...data, mensaje: e.target.value })}
                                                onKeyDown={(e) => {
                                                    handleMessagesKeyDown(e);
                                                    handleLimit(e, data.mensaje, LIMITS.mensaje);
                                                }}
                                                maxLength={LIMITS.mensaje}
                                            />
                                            <div className="relative">
                                                <InputError message={errors.mensaje} />
                                                <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                    {data.mensaje.length}/{LIMITS.mensaje}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Archivos adjuntos */}
                                        <div className="space-y-4">
                                            <Label>Archivos adjuntos (opcional)</Label>
                                            <div className="space-y-2">
                                                <Input
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg"
                                                    multiple
                                                    onChange={handleFileChange}
                                                    className="cursor-pointer"
                                                    disabled={files.length >= 5}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Solo archivos PDF y JPG, máximo 500KB por archivo.
                                                </p>
                                            </div>

                                            {files.length > 0 && (
                                                <div className="space-y-2">
                                                    {files.map((file, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 bg-muted rounded-md"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <span className="text-sm truncate block">{file.name}</span>
                                                                <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                    {(file.size / 1024).toFixed(2)} KB
                                                                </span>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeFile(index)}
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Botón envío */}
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            size="lg"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    Enviando
                                                    <LoaderCircle className="ml-2 h-5 w-5 animate-spin" />
                                                </>
                                            ) : (
                                                <>
                                                    Enviar denuncia
                                                    <Send className="ml-2 h-5 w-5" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}