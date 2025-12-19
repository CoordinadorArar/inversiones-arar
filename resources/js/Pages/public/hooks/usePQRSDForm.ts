/**
 * Hook personalizado usePQRSDForm
 * 
 * Maneja toda la lógica del formulario multi-paso de PQRSD:
 * - Navegación entre pasos (4 pasos normales, 2 si es anónimo)
 * - Validación por paso con Zod
 * - Gestión de archivos adjuntos (drag & drop)
 * - Envío al backend con FormData
 * - Manejo de errores y estados
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { useState, useRef } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
    PQRSDFormData,
    PQRSD_INITIAL_DATA,
    step1Schema,
    step2Schema,
    step3Schema,
    step4Schema,
} from "../types/pqrsdForm.types";

/**
 * Interface para las props del hook
 */
interface UsePQRSDFormProps {
    onSuccess?: () => void;  // Callback opcional tras envío exitoso
}

/**
 * Hook personalizado usePQRSDForm
 */
export function usePQRSDForm({ onSuccess }: UsePQRSDFormProps = {}) {
    // ============================================================================
    // ESTADOS PRINCIPALES
    // ============================================================================
    
    // Paso actual del formulario (1-4, o 1-2 si es anónimo)
    const [currentStep, setCurrentStep] = useState(1);
    
    // Datos del formulario
    const [data, setData] = useState<PQRSDFormData>(PQRSD_INITIAL_DATA);
    
    // Archivos adjuntos (máximo 5)
    const [files, setFiles] = useState<File[]>([]);
    
    // Estado de dragging para estilos visuales
    const [isDragging, setIsDragging] = useState(false);
    
    // Errores de validación por campo
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Indicador de procesamiento
    const [processing, setProcessing] = useState(false);
    
    // Hook de toast para notificaciones
    const { toast } = useToast();
    
    // Ref para input de archivos
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ============================================================================
    // FUNCIONES HELPER
    // ============================================================================
    
    /**
     * Hace scroll suave al primer campo con error
     */
    const scrollToFirstError = (errorObj: Record<string, string>) => {
        setTimeout(() => {
            const firstErrorField = Object.keys(errorObj)[0];
            document.getElementById(firstErrorField)?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 100);
    };
    
    /**
     * Valida un archivo individual (tipo y tamaño)
     */
    const validateFile = (file: File): boolean => {
        const isValidType = 
            file.type === "application/pdf" ||
            file.type === "application/msword" ||
            file.type === "image/jpeg" ||
            file.type === "image/jpg";
            
        const isValidSize = file.size <= 500000; // 500KB
        
        if (!isValidType) {
            toast({
                title: "Formato no válido",
                description: `${file.name} debe ser PDF, DOC o JPG`,
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
    };

    // ============================================================================
    // VALIDACIÓN POR PASO
    // ============================================================================
    
    /**
     * Valida los datos del paso actual usando schemas de Zod
     * 
     * @param step Número del paso a validar (1-4)
     * @returns boolean True si válido, false si hay errores
     */
    const validateStep = (step: number): boolean => {
        setErrors({});
        
        let schema;
        let dataToValidate;
        
        // Lógica condicional: si es anónimo, solo 2 pasos
        if (data.esAnonimo) {
            switch (step) {
                case 1:
                    schema = step1Schema;
                    dataToValidate = { empresa: data.empresa, tipoPqrs: data.tipoPqrs };
                    break;
                case 2:
                    // Paso 2 en anónimo = descripción (usa schema del paso 4)
                    schema = step4Schema;
                    dataToValidate = { mensaje: data.mensaje };
                    break;
                default:
                    return true;
            }
        } else {
            // Validación normal (4 pasos)
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
                        numId: data.numId,
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
                        relacion: data.relacion,
                    };
                    break;
                case 4:
                    schema = step4Schema;
                    dataToValidate = { mensaje: data.mensaje };
                    break;
                default:
                    return true;
            }
        }
        
        // Ejecuta validación con Zod
        const result = schema.safeParse(dataToValidate);
        
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path.length > 0) {
                    newErrors[err.path[0].toString()] = err.message;
                }
            });
            
            setErrors(newErrors);
            scrollToFirstError(newErrors);
            return false;
        }
        
        return true;
    };

    // ============================================================================
    // NAVEGACIÓN ENTRE PASOS
    // ============================================================================
    
    /**
     * Avanza al siguiente paso si el actual es válido
     */
    const nextStep = () => {
        if (validateStep(currentStep)) {
            // Si es anónimo, salta del paso 1 al 2 (descripción)
            if (data.esAnonimo && currentStep === 1) {
                setCurrentStep(2);
            } else {
                const totalSteps = data.esAnonimo ? 2 : 4;
                setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            }
        }
    };
    
    /**
     * Retrocede al paso anterior
     */
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // ============================================================================
    // MANEJO DE ARCHIVOS
    // ============================================================================
    
    /**
     * Maneja selección de archivos desde input file
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(validateFile);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };
    
    /**
     * Elimina un archivo del array por índice
     */
    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };
    
    /**
     * Maneja archivos soltados en zona de drag-and-drop
     */
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            
            // Verifica límite total antes de procesar
            if (files.length + droppedFiles.length > 5) {
                toast({
                    title: "Límite excedido",
                    description: "Máximo 5 archivos permitidos",
                    variant: "destructive",
                });
                return;
            }
            
            const validFiles = droppedFiles.filter(validateFile);
            setFiles(prev => [...prev, ...validFiles]);
        }
    };
    
    /**
     * Maneja evento drag over
     */
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    /**
     * Maneja evento drag leave
     */
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // ============================================================================
    // HANDLERS
    // ============================================================================
    
    /**
     * Actualiza un campo específico del formulario
     */
    const handleChange = (field: keyof PQRSDFormData, value: string | boolean) => {
        setData(prev => ({ ...prev, [field]: value }));
        
        // Limpia error del campo si existía
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };
    
    /**
     * Resetea el formulario completo
     */
    const resetForm = () => {
        setData(PQRSD_INITIAL_DATA);
        setFiles([]);
        setCurrentStep(1);
        setErrors({});
    };

    // ============================================================================
    // ENVÍO DEL FORMULARIO
    // ============================================================================
    
    /**
     * Envía el formulario completo vía fetch con FormData
     */
    const handleSubmit = async () => {
        // Valida paso final antes de enviar
        if (!validateStep(currentStep)) return;
        
        setProcessing(true);
        
        try {
            // Construye FormData con datos + archivos
            const formData = new FormData();
            
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });
            
            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });
            
            formData.append('esAnonimo', data.esAnonimo ? '1' : '0');
            
            // Fetch POST a backend
            const response = await fetch(route('pqrsd.store'), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
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
                
                resetForm();
                onSuccess?.();
                
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
            console.error("Error de conexión:", error);
            toast({
                title: "Error de conexión",
                description: "Revisa tu conexión e intenta de nuevo.",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    // ============================================================================
    // RETORNO DEL HOOK
    // ============================================================================
    
    return {
        // Estados
        currentStep,
        data,
        files,
        isDragging,
        errors,
        processing,
        fileInputRef,
        
        // Navegación
        nextStep,
        prevStep,
        
        // Handlers de campos
        handleChange,
        
        // Handlers de archivos
        handleFileChange,
        removeFile,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        
        // Envío
        handleSubmit,
        
        // Utilidades
        resetForm,
    };
}