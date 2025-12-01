/**
 * Componente EmpresaForm
 * 
 * Formulario principal para crear/editar empresas.
 * Maneja validaciones condicionales, estados bloqueados y envío de datos.
 * 
 * Props:
 * - mode: 'create' | 'edit' - Modo del formulario
 * - initialData: Datos iniciales (para modo edit)
 * - disabled: Deshabilitar todo el formulario
 * - onSubmit: Callback al enviar
 * - onCancel: Callback al cancelar
 * 
 * @author Yariangel Aray
 * @date 2025-12-01
 */

import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputError from "@/Components/InputError";
import { Save, Trash2, X, Plus } from "lucide-react";
import {
    EmpresaFormData,
    EMPRESA_INITIAL_DATA,
    EMPRESA_LIMITS,
    createEmpresaSchema,
} from "./empresaForm.types";
import { EmpresaSwitches } from "./EmpresaSwitches";
import { EmpresaLogoUpload } from "./EmpresaLogoUpload";
import {
    handleTextKeyDown,
    handleNumberTextKeyDown,
} from "@/lib/keydownValidations";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/Components/ui/input-group";

interface EmpresaFormProps {
    mode: "create" | "edit";
    initialData?: Partial<EmpresaFormData>;
    disabled?: boolean;
    onSubmit: (data: EmpresaFormData) => Promise<void>;
    onDelete?: () => Promise<void>;
    onCancel: () => void;
}

export function EmpresaForm({
    mode,
    initialData,
    disabled = false,
    onSubmit,
    onDelete,
    onCancel,
}: EmpresaFormProps) {

    const [data, setData] = useState<EmpresaFormData>({
        ...EMPRESA_INITIAL_DATA,
        ...initialData,
    });
    console.log(data);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Focus en primer input cuando se crea o edita
    useEffect(() => {
        if (!disabled && mode === "create") {
            firstInputRef.current?.focus();
        }
    }, [disabled, mode]);

    useEffect(() => {
        setData({
            ...EMPRESA_INITIAL_DATA,
            ...initialData,
        });
    }, [initialData]);


    const handleChange = (
        field: keyof EmpresaFormData,
        value: string | boolean | File | null
    ) => {
        setData((prev) => ({ ...prev, [field]: value }));
        // Limpiar error del campo al modificarlo
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleLogoChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setData((prev) => ({
                ...prev,
                logo: file,
                logo_preview: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleLogoRemove = () => {
        setData((prev) => ({
            ...prev,
            logo: null,
            logo_preview: null,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validar con Zod
        const schema = createEmpresaSchema(data);
        const result = schema.safeParse(data);

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
                behavior: "smooth",
                block: "center",
            });
            return;
        }

        setProcessing(true);
        try {
            await onSubmit(data);
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!onDelete) return;
        setProcessing(true);
        try {
            await onDelete();
            setShowDeleteDialog(false);
        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID Siesa y Razón Social */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label
                        htmlFor="id_siesa"
                        className="flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] after:hidden data-[required=true]:after:block"
                        data-required={data.mostrar_en_header || data.mostrar_en_empresas}
                    >
                        ID Siesa
                    </Label>
                    <Input
                        id="id_siesa"
                        ref={firstInputRef}
                        value={data.id_siesa}
                        onChange={(e) => handleChange("id_siesa", e.target.value)}
                        onKeyDown={handleNumberTextKeyDown}
                        maxLength={EMPRESA_LIMITS.id_siesa}
                        disabled={disabled}
                        className={errors.id_siesa ? "border-destructive" : ""}
                        placeholder="ID en sistema Siesa"
                    />
                    <div className="relative">
                        <InputError message={errors.id_siesa} />
                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.id_siesa.length}/{EMPRESA_LIMITS.id_siesa}
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="razon_social"
                        className='flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-["*"]'
                    >
                        Razón Social
                    </Label>
                    <Input
                        id="razon_social"
                        value={data.razon_social}
                        onChange={(e) => handleChange("razon_social", e.target.value)}
                        maxLength={EMPRESA_LIMITS.razon_social}
                        disabled={disabled}
                        className={errors.razon_social ? "border-destructive" : ""}
                        placeholder="Nombre legal de la empresa"
                    />
                    <div className="relative">
                        <InputError message={errors.razon_social} />
                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.razon_social.length}/{EMPRESA_LIMITS.razon_social}
                        </span>
                    </div>
                </div>
            </div>

            {/* Siglas y Tipo Empresa */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="siglas">Siglas (Opcional)</Label>
                    <Input
                        id="siglas"
                        value={data.siglas}
                        onChange={(e) =>
                            handleChange("siglas", e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) => {
                            if (!/[A-Z]/.test(e.key) && e.key.length === 1) {
                                e.preventDefault();
                            }
                        }}
                        maxLength={EMPRESA_LIMITS.siglas}
                        disabled={disabled}
                        className={errors.siglas ? "border-destructive" : ""}
                        placeholder="Ej: ARAR"
                    />
                    <div className="relative">
                        <InputError message={errors.siglas} />
                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.siglas.length}/{EMPRESA_LIMITS.siglas}
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="tipo_empresa"
                        className="flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] after:hidden data-[required=true]:after:block"
                        data-required={data.mostrar_en_empresas}
                    >
                        Tipo de Empresa
                    </Label>
                    <Input
                        id="tipo_empresa"
                        value={data.tipo_empresa}
                        onChange={(e) => handleChange("tipo_empresa", e.target.value)}
                        onKeyDown={handleTextKeyDown}
                        maxLength={EMPRESA_LIMITS.tipo_empresa}
                        disabled={disabled}
                        className={errors.tipo_empresa ? "border-destructive" : ""}
                        placeholder="Ej: Holding Empresarial"
                    />
                    <div className="relative">
                        <InputError message={errors.tipo_empresa} />
                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.tipo_empresa.length}/{EMPRESA_LIMITS.tipo_empresa}
                        </span>
                    </div>
                </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
                <Label
                    htmlFor="descripcion"
                    className="flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] after:hidden data-[required=true]:after:block"
                    data-required={data.mostrar_en_empresas}
                >
                    Descripción
                </Label>
                <Textarea
                    id="descripcion"
                    value={data.descripcion}
                    onChange={(e) => handleChange("descripcion", e.target.value)}
                    maxLength={EMPRESA_LIMITS.descripcion}
                    disabled={disabled}
                    className={errors.descripcion ? "border-destructive" : ""}
                    placeholder="Descripción breve de la empresa"
                    rows={3}
                />
                <div className="relative">
                    <InputError message={errors.descripcion} />
                    <span className="text-xs text-muted-foreground absolute top-0 right-0">
                        {data.descripcion.length}/{EMPRESA_LIMITS.descripcion}
                    </span>
                </div>
            </div>

            {/* Sitio Web y Dominio */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label
                        htmlFor="sitio_web"
                        className="flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] after:hidden data-[required=true]:after:block"
                        data-required={data.mostrar_en_empresas}
                    >
                        Sitio Web
                    </Label>
                    <Input
                        id="sitio_web"
                        type="url"
                        value={data.sitio_web}
                        onChange={(e) => handleChange("sitio_web", e.target.value)}
                        maxLength={EMPRESA_LIMITS.sitio_web}
                        disabled={disabled}
                        className={errors.sitio_web ? "border-destructive" : ""}
                        placeholder="https://ejemplo.com"
                    />
                    <div className="relative">
                        <InputError message={errors.sitio_web} />
                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.sitio_web.length}/{EMPRESA_LIMITS.sitio_web}
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dominio">Dominio de Correo (Opcional)</Label>
                    <InputGroup>
                        <InputGroupAddon>
                            <InputGroupText>correo@</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                            id="dominio"
                            value={data.dominio}
                            onChange={(e) => handleChange("dominio", e.target.value)}
                            maxLength={EMPRESA_LIMITS.dominio}
                            disabled={disabled}
                            className="!pl-0.5 !pb-1.5"
                            placeholder="empresa.com"
                        />
                    </InputGroup>
                    <div className="relative">
                        <InputError message={errors.dominio} />
                        <span className="text-xs text-muted-foreground absolute top-0 right-0">
                            {data.dominio.length}/{EMPRESA_LIMITS.dominio}
                        </span>
                    </div>
                </div>
            </div>

            {/* Logo Upload */}
            <EmpresaLogoUpload
                logoPreview={data.logo_preview}
                onLogoChange={handleLogoChange}
                onLogoRemove={handleLogoRemove}
                disabled={disabled}
                error={errors.logo}
            />

            {/* Switches */}
            <EmpresaSwitches
                data={data}
                onChange={handleChange}
                disabled={disabled}
            />

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
                {mode === "edit" && onDelete && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        disabled={processing || disabled}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </Button>
                )}

                <div className="flex-1" />

                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={processing}
                >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                </Button>

                <Button type="submit" disabled={processing || disabled}>
                    {mode === "create" ? (
                        <>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Empresa
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Cambios
                        </>
                    )}
                </Button>
            </div>

            {/* Dialog de confirmación de eliminación */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar empresa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer desde la plataforma.
                            La empresa «{data.razon_social}» será desactivada y dejara de estar disponible en el sistema.
                            Para restaurarla posteriormente será necesario realizar el proceso manualmente desde la administración interna.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={processing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {processing ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    );
}