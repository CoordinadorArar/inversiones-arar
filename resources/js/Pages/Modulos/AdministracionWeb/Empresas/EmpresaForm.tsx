import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputError from "@/Components/InputError";
import { Save, Trash2, X, Plus } from "lucide-react";
import { EmpresaFormData, EMPRESA_LIMITS } from "./empresaForm.types";
import { EmpresaSwitches } from "./EmpresaSwitches";
import { EmpresaLogoUpload } from "./EmpresaLogoUpload";
import { EmpresaDeleteDialog } from "./EmpresaDeleteDialog";
import { useEmpresaForm } from "./hooks/useEmpresaForm";
import {
    handleTextKeyDown,
    handleNumberKeyDown,
    handleNumberTextKeyDown,
    handleMessagesKeyDown,
    handleUrlKeyDown,
    handleDominioKeyDown,
} from "@/lib/keydownValidations";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/Components/ui/input-group";

interface EmpresaFormProps {
    mode: "create" | "edit";
    initialData?: Partial<EmpresaFormData>;
    disabled?: boolean;
    onSubmit: (data: EmpresaFormData) => Promise<void>;
    onDelete?: () => Promise<void>;
    onCancel: () => void;
    externalErrors?: Record<string, string>;
}

/**
 * Componente EmpresaForm.
 * 
 * Formulario principal para crear/editar empresas.
 * Maneja validaciones condicionales, estados bloqueados y envío de datos.
 * 
 * @author Yariangel Aray 
 * @version 1.0
 * @date 2025-11-28
 */
export function EmpresaForm({
    mode,
    initialData,
    disabled = false,
    onSubmit,
    onDelete,
    onCancel,
    externalErrors = {},
}: EmpresaFormProps) {

    // Hook personalizado que maneja toda la lógica del formulario: estado, validaciones, envío y eliminación.
    
    const {
        data,
        errors,
        processing,
        showDeleteDialog,
        firstInputRef,
        handleChange,
        handleLogoChange,
        handleLogoRemove,
        handleSubmit,
        handleDeleteClick,
        handleDeleteCancel,
        handleDeleteConfirm,
    } = useEmpresaForm({
        mode,
        initialData,
        disabled,
        onSubmit,
        onDelete,
        externalErrors,
    });

    return (
        <>
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
                            onKeyDown={handleNumberKeyDown}
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
                            onKeyDown={handleNumberTextKeyDown}
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
                                const allowed = /^[a-zA-Z0-9]$/;
                                if (!allowed.test(e.key) &&
                                    !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'].includes(e.key) &&
                                    !e.ctrlKey && !e.metaKey) {
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
                        onKeyDown={handleMessagesKeyDown}
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
                            onKeyDown={handleUrlKeyDown}
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
                                onKeyDown={handleDominioKeyDown}
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
                    {!disabled && (
                        <>
                            {mode === "edit" && onDelete && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDeleteClick}
                                    disabled={processing || disabled}
                                >
                                    <Trash2 className="h-4 w-4" />
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
                                <X className="h-4 w-4" />
                                Cancelar
                            </Button>

                            <Button type="submit" disabled={processing || disabled}>
                                {mode === "create" ? (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        {processing ? "Creando..." : "Crear Empresa"}
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        {processing ? "Guardando..." : "Guardar cambios"}
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </form>

            {/* Dialog de confirmación de eliminación */}
            <EmpresaDeleteDialog
                open={showDeleteDialog}
                onOpenChange={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                empresaNombre={data.razon_social}
                processing={processing}
            />
        </>
    );
}
