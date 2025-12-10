/**
 * Componente EmpresaForm.
 * 
 * Formulario principal para crear/editar empresas: maneja validaciones condicionales,
 * estados bloqueados, subida de logo y envío de datos.
 * Usa hook personalizado para lógica y componentes UI para inputs y switches.
 * Se integra con React para gestionar empresas via Inertia.
 * 
 * @author Yariangel Aray
 * @date 2025-11-28
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputError from "@/Components/InputError";
import { Save, Trash2, X, Plus } from "lucide-react";
import { EmpresaFormData, EMPRESA_LIMITS } from "../types/empresaForm.types";
import { EmpresaSwitches } from "./EmpresaSwitches";
import { useEmpresaForm } from "../hooks/useEmpresaForm";
import { handleTextKeyDown, handleNumberKeyDown, handleNumberTextKeyDown, handleMessagesKeyDown, handleUrlKeyDown, handleDominioKeyDown } from "@/lib/keydownValidations";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/Components/ui/input-group";
import { DeleteDialog } from "@/Components/DeleteDialog";
import { ImageUpload } from "@/Components/ImageUpload";
import { useFormChanges } from "@/hooks/use-form-changes";

/**
 * Interfaz para las props del componente EmpresaForm.
 * Define los parámetros necesarios para configurar el formulario.
 */
interface EmpresaFormProps {
    mode: "create" | "edit"; // Modo del formulario (crear o editar).
    initialData?: Partial<EmpresaFormData>; // Datos iniciales opcionales para prellenar.
    disabled?: boolean; // Indica si el formulario está deshabilitado.
    onSubmit: (data: EmpresaFormData) => Promise<void>; // Función a llamar al enviar datos válidos.
    onDelete?: () => Promise<void>; // Función opcional a llamar para eliminar (solo en modo edit).
    onCancel: () => void; // Función a llamar al cancelar.
    externalErrors?: Record<string, string>; // Errores externos opcionales.
}
/**
 * Componente EmpresaForm.
 * 
 * Formulario principal para crear/editar empresas.
 * Maneja validaciones condicionales, estados bloqueados y envío de datos.
 * 
 * @param {EmpresaFormProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
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

    // Aquí se usa el hook useEmpresaForm para manejar toda la lógica del formulario: estado, validaciones, envío y eliminación.
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

    // Aquí se usa useFormChanges para detectar cambios en el formulario y resaltar campos modificados.
    const changes = useFormChanges(initialData || {}, data);

    // Función para estilos condicionales: resalta si cambió o hay error.
    const getInputClass = (field: keyof typeof data) => {
        return (changes[field] && mode == "edit"
            ? "border-primary/50"
            : "")
            + " " +
            (errors[field]
                ? "border-destructive"
                : "");
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ID Siesa y Razón Social: Grid con dos inputs principales. */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="id_siesa"
                            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] after:hidden data-[required=true]:after:block ${changes.id_siesa && mode == "edit" ? "text-primary" : ""}`}
                            data-required={data.mostrar_en_header || data.mostrar_en_empresas}
                        >
                            ID Siesa
                        </Label>
                        {/* Aquí se usa Input para el campo ID Siesa con validaciones y contador de caracteres. */}
                        <Input
                            id="id_siesa"
                            ref={firstInputRef}
                            value={data.id_siesa}
                            onChange={(e) => handleChange("id_siesa", e.target.value)}
                            onKeyDown={handleNumberKeyDown}
                            maxLength={EMPRESA_LIMITS.id_siesa}
                            disabled={disabled}
                            className={getInputClass('id_siesa')}
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
                            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] ${changes.razon_social && mode == "edit" ? "text-primary" : ""}`}
                        >
                            Razón Social
                        </Label>
                        {/* Aquí se usa Input para el campo Razón Social con validaciones y contador. */}
                        <Input
                            id="razon_social"
                            value={data.razon_social}
                            onChange={(e) => handleChange("razon_social", e.target.value)}
                            maxLength={EMPRESA_LIMITS.razon_social}
                            disabled={disabled}
                            onKeyDown={handleNumberTextKeyDown}
                            className={getInputClass('razon_social')}
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

                {/* Siglas y Tipo Empresa: Grid con inputs opcionales y requeridos. */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="siglas"
                            className={`${changes.siglas && mode == "edit" ? "text-primary" : ""}`}
                        >
                            Siglas (Opcional)</Label>
                        {/* Aquí se usa Input para siglas con transformación a mayúsculas y validaciones. */}
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
                            className={getInputClass('siglas')}
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
                            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] after:hidden data-[required=true]:after:block ${changes.tipo_empresa && mode == "edit" ? "text-primary" : ""}`}
                            data-required={data.mostrar_en_empresas}
                        >
                            Tipo de Empresa
                        </Label>
                        {/* Aquí se usa Input para tipo de empresa con validaciones y contador. */}
                        <Input
                            id="tipo_empresa"
                            value={data.tipo_empresa}
                            onChange={(e) => handleChange("tipo_empresa", e.target.value)}
                            onKeyDown={handleTextKeyDown}
                            maxLength={EMPRESA_LIMITS.tipo_empresa}
                            disabled={disabled}
                            className={getInputClass('tipo_empresa')}
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

                {/* Descripción: Textarea para descripción con validaciones. */}
                <div className="space-y-2">
                    <Label
                        htmlFor="descripcion"
                        className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] after:hidden data-[required=true]:after:block ${changes.descripcion && mode == "edit" ? "text-primary" : ""}`}
                        data-required={data.mostrar_en_empresas}
                    >
                        Descripción
                    </Label>
                    {/* Aquí se usa Textarea para descripción con contador de caracteres. */}
                    <Textarea
                        id="descripcion"
                        value={data.descripcion}
                        onChange={(e) => handleChange("descripcion", e.target.value)}
                        maxLength={EMPRESA_LIMITS.descripcion}
                        disabled={disabled}
                        onKeyDown={handleMessagesKeyDown}
                        className={getInputClass('descripcion')}
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

                {/* Sitio Web y Dominio: Grid con inputs para URLs. */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="sitio_web"
                            className={`flex items-center gap-2 after:ml-0.5 after:text-red-500 after:content-['*'] after:hidden data-[required=true]:after:block ${changes.sitio_web && mode == "edit" ? "text-primary" : ""}`}
                            data-required={data.mostrar_en_empresas}
                        >
                            Sitio Web
                        </Label>
                        {/* Aquí se usa Input para sitio web con validaciones de URL. */}
                        <Input
                            id="sitio_web"
                            type="url"
                            value={data.sitio_web}
                            onChange={(e) => handleChange("sitio_web", e.target.value)}
                            maxLength={EMPRESA_LIMITS.sitio_web}
                            disabled={disabled}
                            onKeyDown={handleUrlKeyDown}
                            className={getInputClass('sitio_web')}
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
                        <Label
                            htmlFor="dominio"
                            className={`${changes.dominio && mode == "edit" ? "text-primary" : ""}`}
                        >
                            Dominio de Correo (Opcional)</Label>
                        {/* Aquí se usa InputGroup para dominio con prefijo "correo@". */}
                        <InputGroup className={`${changes.dominio && mode == "edit" ? "has-[[data-slot=input-group-control]]:border-primary/50" : ""}`}>
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

                {/* Logo Upload: Sección para subir logo de la empresa. */}
                <ImageUpload
                    preview={data.logo_preview}
                    onImageChange={handleLogoChange}
                    onImageRemove={handleLogoRemove}
                    disabled={disabled}
                    error={errors.logo}
                    label="Logo de la Empresa (Opcional)"
                />

                {/* Switches: Componente para opciones booleanas como mostrar en header, etc. */}
                <EmpresaSwitches
                    data={data}
                    onChange={handleChange}
                    disabled={disabled}
                />

                {/* Botones de acción: Eliminar, Cancelar y Guardar/Crear. */}
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

            {/* Dialog de confirmación de eliminación: Usa DeleteDialog para confirmar eliminación. */}
            <DeleteDialog
                open={showDeleteDialog}
                onOpenChange={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                processing={processing}
                itemName={`La empresa «${data.razon_social}» será desactivada y dejará de estar disponible en el sistema.`}
            />
        </>
    );
}
