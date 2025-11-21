/**
 * Componente PQRSD - Formulario Multi-Paso para PQRs.
 * 
 * Permite enviar PQRs con validación por pasos, drag-and-drop de archivos, y envío AJAX.
 * Usa Zod para validación, y validaciones de teclado personalizadas.
 * 
 * @author Yariangel Aray
 * @version 2.0
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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import InputError from '@/Components/InputError';
import {
    handleTextKeyDown,
    handleEmailKeyDown,
    handleNumberKeyDown,
    handleMessagesKeyDown,
} from '@/lib/keydownValidations';
import { z } from 'zod';
import {
    Building2, User, MapPin, MessageSquare,
    ChevronLeft, ChevronRight, Send,
    LoaderCircle, X, FileText, CheckCircle,
    AlertCircle,
    HelpCircle,
    Clock,
    HatGlasses
} from 'lucide-react';
import { Progress } from '@/Components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from '@/Components/ui/checkbox';

// Interfaces: Tipos para props y datos del formulario.
interface FormData {
    empresa: string;
    tipoPqrs: string;
    esAnonimo: boolean;
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
    empresas: Array<{ id: number; name: string; siglas: string}>;
    departamentos: Array<{ id: number; name: string }>;
    ciudades: Array<{ id: number; name: string; id_dpto: number }>;
    tiposPqrs: Array<{ id: number; nombre: string; abreviatura: string }>;
    tiposId: Array<{ id: number; nombre: string; abreviatura: string }>;
}

// Constantes: Límites de caracteres para inputs.
const LIMITS = {
    nombre: 50,
    apellido: 50,
    correo: 50,
    numId: 15,
    telefono: 15,
    direccion: 100,
    mensaje: 2000,
} as const;

// Schemas de validación con Zod: Uno por paso para validación incremental.
const step1Schema = z.object({
    empresa: z.string().min(1, "Debe seleccionar una empresa"),
    tipoPqrs: z.string().min(1, "Debe seleccionar el tipo de PQRSD"),
});

const step2Schema = z.object({
    nombre: z.string().trim()
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras")
        .min(1, "El nombre es obligatorio")
        .max(LIMITS.nombre, `Máximo ${LIMITS.nombre} caracteres`),
    apellido: z.string().trim()
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras")
        .min(1, "El apellido es obligatorio")
        .max(LIMITS.apellido, `Máximo ${LIMITS.apellido} caracteres`),
    tipoId: z.string().min(1, "Debe seleccionar el tipo de identificación"),
    numId: z.string().trim()
        .regex(/^[0-9]+$/, "Solo se permiten números")
        .min(1, "El número de documento es obligatorio")
        .max(LIMITS.numId, `Máximo ${LIMITS.numId} caracteres`),
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
    // Estado para el paso actual del formulario (inicia en 1, va de 1 a 4).
    const [currentStep, setCurrentStep] = useState(1);

    // Estado para los datos del formulario: objeto con todos los campos del form.
    // Cada propiedad corresponde a un input/select del formulario.
    const [data, setData] = useState<FormData>({
        empresa: "",      // ID de la empresa seleccionada.
        tipoPqrs: "",     // ID del tipo de PQR seleccionado.
        esAnonimo: false,  // Indica si es una PQR anónima.
        nombre: "",       // Nombre del usuario.
        apellido: "",     // Apellido del usuario.
        tipoId: "",       // ID del tipo de identificación.
        numId: "",        // Número de documento.
        correo: "",       // Email de contacto.
        telefono: "",     // Teléfono de contacto.
        dpto: "",         // ID del departamento seleccionado.
        ciudad: "",       // ID de la ciudad seleccionada.
        direccion: "",    // Dirección opcional.
        relacion: "",     // Relación con la empresa (cliente, empleado, etc.).
        mensaje: "",      // Descripción de la PQR.
    });

    // Estado para archivos adjuntos: array de objetos File seleccionados.
    // Se llena con handleFileChange o handleDrop, máximo 5 archivos.
    const [files, setFiles] = useState<File[]>([]);

    // Estado para indicar si el usuario está arrastrando archivos sobre la zona de drop.
    // Se usa para cambiar estilos visuales (border, bg).
    const [isDragging, setIsDragging] = useState(false);

    // Estado para errores de validación: objeto con claves como nombres de campos y mensajes de error.
    // Se llena en validateStep si Zod falla, se muestra en InputError.
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estado para indicar si el formulario está procesando (enviando).
    // Deshabilita botones y muestra spinner durante fetch.
    const [processing, setProcessing] = useState(false);

    // Hook de toast para notificaciones: éxito, error, etc.
    // Se usa en validaciones de archivos y envío.
    const { toast } = useToast();

    // Constante para el tipo de PQRSD "Denuncia", usada en lógica condicional.
    // Si el tipo es denuncia se activa lógica especial para selección de empresa y anonimato.
    const tipoDenuncia = tiposPqrs.find(t => t.abreviatura === 'D');


    // Array constante con configuración de los 4 pasos del formulario.
    // Cada objeto tiene number (1-4), title, icon (de Lucide), description.
    // Se usa para renderizar indicadores de progreso y títulos dinámicos.
    const steps = data.esAnonimo
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

    // Cálculo del progreso: porcentaje basado en currentStep / total steps.
    // Se usa en la barra de progreso visual.
    const progress = (currentStep / steps.length) * 100;

    /**
     * Función validateStep: Valida los datos del paso actual usando schemas de Zod.
     * 
     * @param step Número del paso a validar (1-4).
     * @returns boolean True si válido, false si hay errores.
     * 
     * Lógica:
     * - Limpia errores previos con setErrors({}).
     * - Selecciona schema y data según paso (switch).
     * - Ejecuta safeParse de Zod.
     * - Si falla, mapea errores a newErrors y los setea.
     * - Hace scroll al primer campo con error.
     * - Retorna false para bloquear navegación/envío.
     */
    const validateStep = (step: number): boolean => {
        // Limpia errores previos para evitar acumulación.
        setErrors({});

        // Variables para schema y data a validar, se asignan en switch.
        let schema;
        let dataToValidate;

        // Switch para seleccionar qué validar según paso.
        if (data.esAnonimo) {
            // Si es anónimo, solo validar paso 1 y paso 2
            switch (step) {
                case 1:
                    schema = step1Schema;
                    dataToValidate = { empresa: data.empresa, tipoPqrs: data.tipoPqrs };
                    break;
                case 2:
                    // Paso 2 en anónimo = descripción
                    schema = step4Schema;
                    dataToValidate = { mensaje: data.mensaje };
                    break;
                default:
                    return true;
            }
        } else {
            // Si NO es anónimo, validación normal
            switch (step) {
                case 1:
                    // Paso 1: Solo empresa y tipoPqrs.
                    schema = step1Schema;
                    dataToValidate = { empresa: data.empresa, tipoPqrs: data.tipoPqrs };
                    break;
                case 2:
                    // Paso 2: Datos personales (nombre, apellido, tipoId, numId).
                    schema = step2Schema;
                    dataToValidate = {
                        nombre: data.nombre,
                        apellido: data.apellido,
                        tipoId: data.tipoId,
                        numId: data.numId
                    };
                    break;
                case 3:
                    // Paso 3: Contacto y ubicación (correo, telefono, dpto, ciudad, etc.).
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
                    // Paso 4: Solo mensaje.
                    schema = step4Schema;
                    dataToValidate = { mensaje: data.mensaje };
                    break;
                default:
                    // Si paso inválido, retorna true (no valida nada).
                    return true;
            }
        }

        // Ejecuta validación con Zod (safeParse no lanza excepciones).
        const result = schema.safeParse(dataToValidate);

        // Si validación falla (result.success es false).
        if (!result.success) {
            // Inicializa objeto para nuevos errores.
            const newErrors: Record<string, string> = {};

            // Itera sobre issues de Zod (cada error es un objeto con path y message).
            result.error.issues.forEach((err) => {
                // Verifica que path tenga elementos (err.path es array como ['nombre']).
                if (err.path.length > 0) {
                    // Usa el primer elemento de path como clave (ej. 'nombre').
                    newErrors[err.path[0].toString()] = err.message;
                }
            });

            // Setea errores en estado para mostrar en UI.
            setErrors(newErrors);

            // Scroll suave al primer campo con error después de un delay (para render).
            setTimeout(() => {
                // Obtiene la primera clave de errores.
                const firstErrorField = Object.keys(newErrors)[0];
                // Busca el elemento por ID y hace scroll.
                document.getElementById(firstErrorField)?.scrollIntoView({
                    behavior: 'smooth',  // Animación suave.
                    block: 'center'      // Centra el elemento en viewport.
                });
            }, 100);  // Delay de 100ms para asegurar render.

            // Retorna false para indicar fallo.
            return false;
        }

        // Si todo válido, retorna true.
        return true;
    };

    /**
     * Función nextStep: Avanza al siguiente paso si el actual es válido.
     * 
     * Llama a validateStep, si pasa, incrementa currentStep (máximo steps.length).
     * Hace scroll a top para mejor UX.
     */
    const nextStep = () => {
        // Valida el paso actual antes de avanzar.
        if (validateStep(currentStep)) {
            // Si es anónimo, salta del paso 1 al 2 (descripción)
            if (data.esAnonimo && currentStep === 1) {
                setCurrentStep(2);
            } else {
                setCurrentStep(prev => Math.min(prev + 1, steps.length));
            }
        }
    };

    /**
     * Función prevStep: Retrocede al paso anterior.
     * 
     * Decrementa currentStep (mínimo 1).
     * Hace scroll a top.
     */
    const prevStep = () => {
        // Decrementa paso, limita a mínimo.
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    /**
     * Función handleFileChange: Maneja selección de archivos desde input file.
     * 
     * Filtra archivos válidos (tipo PDF/JPG, tamaño <=500KB), muestra toasts para inválidos.
     * Agrega válidos a estado files.
     * 
     * @param e Evento de cambio del input.
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Verifica que haya archivos seleccionados.
        if (e.target.files) {
            // Convierte FileList a array y filtra válidos.
            const newFiles = Array.from(e.target.files).filter((file) => {
                // Verifica tipo MIME válido.
                const isValidType = file.type === "application/pdf" ||
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg";
                // Verifica tamaño (500KB = 500000 bytes).
                const isValidSize = file.size <= 500000;

                // Si tipo inválido, muestra toast y excluye.
                if (!isValidType) {
                    toast({
                        title: "Formato no válido",
                        description: `${file.name} debe ser PDF o JPG`,
                        variant: "destructive",
                    });
                    return false;
                }

                // Si tamaño inválido, muestra toast y excluye.
                if (!isValidSize) {
                    toast({
                        title: "Archivo muy grande",
                        description: `${file.name} debe ser menor a 500KB`,
                        variant: "destructive",
                    });
                    return false;
                }

                // Si válido, incluye en array.
                return true;
            });

            // Agrega archivos válidos al estado existente.
            setFiles([...files, ...newFiles]);
        }
    };

    /**
     * Función removeFile: Elimina un archivo del array por índice.
     * 
     * @param index Índice del archivo a eliminar.
     */
    const removeFile = (index: number) => {
        // Filtra el array excluyendo el índice.
        setFiles(files.filter((_, i) => i !== index));
    };

    /**
     * Función handleDrop: Maneja archivos soltados en zona de drag-and-drop.
     * 
     * Previene default, valida límite total (5 archivos), filtra válidos, agrega a estado.
     * Muestra toasts para errores.
     * 
     * @param e Evento de drop.
     */
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        // Previene comportamiento default del navegador.
        e.preventDefault();
        // Desactiva estado de dragging.
        setIsDragging(false);

        // Si hay archivos en el drop.
        if (e.dataTransfer.files) {
            // Convierte a array.
            const droppedFiles = Array.from(e.dataTransfer.files);

            // Chequea límite total antes de procesar (para evitar toasts innecesarios).
            if (files.length + droppedFiles.length > 5) {
                toast({
                    title: "Límite excedido",
                    description: "Máximo 5 archivos permitidos",
                    variant: "destructive",
                });
                return;  // Sale sin procesar.
            }

            // Filtra archivos válidos (reutiliza lógica de handleFileChange).
            const validFiles = droppedFiles.filter((file) => {
                const isValidType = file.type === "application/pdf" ||
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg";
                const isValidSize = file.size <= 500000;

                // Toasts para inválidos.
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

            // Agrega solo válidos al estado.
            setFiles([...files, ...validFiles]);
        }
    }

    /**
     * Función handleDragOver: Maneja evento drag over en zona de drop.
     * 
     * Previene default y activa estado de dragging para estilos.
     * 
     * @param e Evento drag over.
     */
    const handleDragOver = (e) => {
        e.preventDefault();  // Previene default.
        setIsDragging(true);  // Activa dragging.
    };

    /**
     * Función handleDragLeave: Maneja evento drag leave en zona de drop.
     * 
     * Previene default y desactiva estado de dragging.
     * 
     * @param e Evento drag leave.
     */
    const handleDragLeave = (e) => {
        e.preventDefault();  // Previene default.
        setIsDragging(false);  // Desactiva dragging.
    };


    /**
     * Función handleSubmit: Envía el formulario completo vía fetch.
     * 
     * Valida paso final, setea processing, construye FormData, envía POST.
     * Maneja respuesta: éxito (toast + reset), errores (422 setea errores, otros toast).
     * Catch para errores de red. Finally limpia processing.
     */
    const handleSubmit = async () => {
        // Valida paso actual (debería ser 4) antes de enviar.
        if (!validateStep(currentStep)) return;

        // Activa processing para UI.
        setProcessing(true);

        try {
            // Crea FormData para enviar datos + archivos.
            const formData = new FormData();

            // Agrega todos los campos de data como strings.
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            // Agrega archivos con clave files[index].
            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            formData.append('esAnonimo', data.esAnonimo ? '1' : '0');            

            // Fetch POST a ruta pqrsd.store.
            const response = await fetch(route('pqrsd.store'), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',  // Espera JSON.
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',  // Token CSRF.
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,  // Envía FormData.
            });

            // Parsea respuesta JSON.
            const result = await response.json();

            // Si respuesta OK (200).
            if (response.ok) {
                // Toast de éxito.
                toast({
                    title: "¡PQRSD enviada!",
                    variant: "success",
                    description: "Su solicitud ha sido recibida y será procesada en los próximos 15 días hábiles.",
                });

                // Reset completo: data, files, step.
                setData({
                    empresa: "",
                    tipoPqrs: "",
                    esAnonimo: false,
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
                // Errores de validación backend: setea en estado.
                setErrors(result.errors || {});
                toast({
                    title: "Error al enviar",
                    description: "Por favor revise los campos marcados.",
                    variant: "destructive",
                });
            } else {
                // Otros errores: toast genérico.
                toast({
                    title: "Error al enviar",
                    description: result.error || "Intenta de nuevo más tarde.",
                    variant: "destructive",
                });
            }

        } catch (error) {
            // Error de red/conexión.
            toast({
                title: "Error de conexión",
                description: "Revisa tu conexión e intenta de nuevo.",
                variant: "destructive",
            });
        } finally {
            // Siempre desactiva processing.
            setProcessing(false);
        }
    };

    return (
        <PublicLayout>
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
                                        <TooltipProvider delayDuration={200}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <a
                                                        href="/docs/Manual-PQRSD.pdf"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label='ayuda-pqrsd'
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                                                    >
                                                        <HelpCircle className="h-4 w-4 text-primary" />
                                                    </a>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-sm">Ver manual de ayuda</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
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
                                                Paso {currentStep} de {steps.length}
                                            </span>
                                            <span className="text-xs md:text-sm text-muted-foreground">
                                                {Math.round(progress)}% completado
                                            </span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>

                                    {/* Steps indicators */}
                                    <div className={`grid gap-1.5 md:gap-2` + (data.esAnonimo ? ' grid-cols-2' : ' grid-cols-4')}>
                                        {steps.map((step) => {
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
                                            {steps[currentStep - 1].title}
                                        </h2>
                                        <p className="text-sm md:text-base text-muted-foreground">
                                            {steps[currentStep - 1].description}
                                        </p>
                                    </div>

                                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4 md:space-y-6">
                                        {/* PASO 1 */}
                                        {currentStep === 1 && (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tipoPqrs" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Tipo de PQRSD
                                                        </Label>
                                                        <Select
                                                            value={data.tipoPqrs}
                                                            onValueChange={(value) => {
                                                                setData({ ...data, tipoPqrs: value })

                                                                if (tipoDenuncia && value !== tipoDenuncia.id.toString()) {
                                                                    const inversionesArar = empresas.find(e =>
                                                                        e.siglas == 'IA' // Siglas de Inversiones Arar S.A.
                                                                    );
                                                                    if (inversionesArar) {
                                                                        setData(prev => ({
                                                                            ...prev,
                                                                            tipoPqrs: value,
                                                                            empresa: inversionesArar.id.toString(),
                                                                            esAnonimo: false
                                                                        }));
                                                                    }
                                                                } else {
                                                                    setData(prev => ({ ...prev, tipoPqrs: value }));
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
                                                        <Label htmlFor="empresa" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Empresa
                                                        </Label>
                                                        <Select
                                                            value={data.empresa}
                                                            onValueChange={(value) => setData({ ...data, empresa: value })}
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
                                                                    onCheckedChange={(checked) => setData({ ...data, esAnonimo: checked as boolean })}
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
                                                        <Label htmlFor="nombre" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Nombres
                                                        </Label>
                                                        <Input
                                                            id="nombre"
                                                            placeholder="Ingrese sus nombres"
                                                            value={data.nombre}
                                                            onChange={(e) => setData({ ...data, nombre: e.target.value })}
                                                            onKeyDown={handleTextKeyDown}
                                                            className={errors.nombre ? "border-destructive" : ""}
                                                            maxLength={LIMITS.nombre}
                                                            autoComplete="given-name"
                                                        />
                                                        <div className="relative !mt-0">
                                                            <InputError message={errors.nombre} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.nombre.length}/{LIMITS.nombre}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="apellido" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Apellidos
                                                        </Label>
                                                        <Input
                                                            id="apellido"
                                                            placeholder="Ingrese sus apellidos"
                                                            value={data.apellido}
                                                            onChange={(e) => setData({ ...data, apellido: e.target.value })}
                                                            onKeyDown={handleTextKeyDown}
                                                            className={errors.apellido ? "border-destructive" : ""}
                                                            maxLength={LIMITS.apellido}
                                                            autoComplete='family-name'
                                                        />
                                                        <div className="relative !mt-0">
                                                            <InputError message={errors.apellido} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.apellido.length}/{LIMITS.apellido}
                                                            </span>
                                                        </div>
                                                    </div>

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

                                                        <InputError message={errors.tipoId} />

                                                    </div>

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
                                                            onKeyDown={handleNumberKeyDown}
                                                            className={errors.numId ? "border-destructive" : ""}
                                                            maxLength={LIMITS.numId}
                                                            autoComplete='document-number'
                                                        />
                                                        <div className="relative !mt-0">
                                                            <InputError message={errors.numId} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.numId.length}/{LIMITS.numId}
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
                                                        <Label htmlFor="correo" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                            Correo electrónico
                                                        </Label>
                                                        <Input
                                                            id="correo"
                                                            type="email"
                                                            placeholder="ejemplo@correo.com"
                                                            value={data.correo}
                                                            onChange={(e) => setData({ ...data, correo: e.target.value })}
                                                            onKeyDown={handleEmailKeyDown}
                                                            className={errors.correo ? "border-destructive" : ""}
                                                            maxLength={LIMITS.correo}
                                                            autoComplete="email"
                                                        />
                                                        <div className="relative !mt-0">
                                                            <InputError message={errors.correo} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.correo.length}/{LIMITS.correo}
                                                            </span>
                                                        </div>
                                                    </div>

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
                                                            onKeyDown={handleNumberKeyDown}
                                                            className={errors.telefono ? "border-destructive" : ""}
                                                            maxLength={LIMITS.telefono}
                                                            autoComplete="tel"
                                                        />
                                                        <div className="relative !mt-0">
                                                            <InputError message={errors.telefono} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.telefono.length}/{LIMITS.telefono}
                                                            </span>
                                                        </div>
                                                    </div>

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
                                                        <InputError message={errors.dpto} />
                                                    </div>

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
                                                            onChange={(e) => setData({ ...data, direccion: e.target.value })}                                                            
                                                            className={errors.direccion ? "border-destructive" : ""}
                                                            maxLength={LIMITS.direccion}
                                                            autoComplete="street-address"
                                                        />
                                                        <div className="relative !mt-0">
                                                            <InputError message={errors.direccion} />
                                                            <span className="text-xs text-muted-foreground absolute top-0 right-0">
                                                                {data.direccion.length}/{LIMITS.direccion}
                                                            </span>
                                                        </div>
                                                    </div>

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
                                                        <InputError message={errors.relacion} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* PASO 4: Descripción y Archivos */}
                                        {(currentStep === 4 || (data.esAnonimo && currentStep === 2)) && (
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                <div className="space-y-2 !mb-8">
                                                    <Label htmlFor="mensaje" className='after:ml-0.5 after:text-red-500 after:content-["*"]'>
                                                        Descripción de su {tipoDenuncia?.nombre.toLowerCase() || "PQRS"}
                                                    </Label>
                                                    <Textarea
                                                        id="mensaje"
                                                        placeholder="Describa detalladamente su petición, queja, reclamo, sugerencia o denuncia..."
                                                        className={`min-h-[150px] ${errors.mensaje ? "border-destructive" : ""}`}
                                                        value={data.mensaje}
                                                        onChange={(e) => setData({ ...data, mensaje: e.target.value })}
                                                        onKeyDown={handleMessagesKeyDown}
                                                        maxLength={LIMITS.mensaje}
                                                    />
                                                    <div className="relative !mt-0">
                                                        <InputError message={errors.mensaje} />
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
                                                            <FileText className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 text-muted-foreground" />
                                                            <p className="text-xs md:text-sm text-muted-foreground mb-2">
                                                                Arrastre archivos aquí o seleccionelos desde su dispositivo.
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
                                                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                                                            >
                                                                Seleccionar archivos
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground mt-2">
                                                                Solo PDF y JPG. Máximo 500KB por archivo. Hasta 5 archivos.
                                                            </p>
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

                                        {currentStep < steps.length ? (
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
        </PublicLayout>
    );
}