/**
 * Página InformacionCorporativa.
 * 
 * Gestión de información corporativa: contacto, ubicación e identidad visual.
 * Renderiza formulario con secciones para contacto e imágenes, usando hook personalizado para lógica.
 * Se integra con React via Inertia para mostrar y editar configuraciones.
 * 
 * @author Yariangel Aray
 * @date 2025-12-04
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { Save, MapPin, Phone, Mail, Image, Globe, MapPinHouse } from "lucide-react";
import { handleEmailKeyDown, handleNumberKeyDown, handleNumberTextKeyDown, handleUrlKeyDown } from "@/lib/keydownValidations";
import { TabInterface } from "@/Types/tabInterface";
import { ImageUpload } from "@/Components/ImageUpload";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/Components/ui/input-group";
import InputError from "@/Components/InputError";
import { useFormChanges } from "@/hooks/use-form-changes";
import { ConfiguracionContacto, ConfiguracionImages } from "../types/configuracionInterface";
import { useInformacionCorporativa } from "../hooks/useInformacionCorporativa";

/**
 * Interfaz para las props del componente InformacionCorporativa.
 * Define la estructura de datos pasados desde el backend via Inertia.
 */
interface InformacionCorporativaProps {
  tabs: TabInterface[]; // Pestañas accesibles del módulo.
  moduloNombre: string; // Nombre del módulo para el header.
  permisos: string[]; // Permisos del usuario para la pestaña.
  configuracion: { // Datos de configuración corporativa.
    contact: ConfiguracionContacto;
    images: ConfiguracionImages;
  };
}

/**
 * Componente principal para la página de Información Corporativa.
 * Renderiza formulario con secciones de contacto e identidad visual, manejando estado via hook personalizado.
 * 
 * @param {InformacionCorporativaProps} props - Props del componente.
 * @returns {JSX.Element} Elemento JSX renderizado.
 */
export default function InformacionCorporativa({
  tabs,
  moduloNombre,
  permisos,
  configuracion,
}: InformacionCorporativaProps) {
  const puedeEditar = permisos.includes("editar");

  // Aquí se usa el hook useInformacionCorporativa para manejar estado, validaciones y envío del formulario.
  const {
    formData,
    previews,
    errors,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleFileRemove,
    handleSubmit,
  } = useInformacionCorporativa({
    configuracion,
    puedeEditar,
  });

  // Aquí se usa useFormChanges para detectar cambios en el formulario y resaltar campos modificados.
  const initialData = {
    email: configuracion.contact.email || "",
    telefono: configuracion.contact.telefono || "",
    ubicacion: configuracion.contact.ubicacion || "",
    ubicacion_detalles: configuracion.contact["ubicacion.detalles"] || "",
    ubicacion_url: configuracion.contact["ubicacion.url"] || "",
    logo: null,
    icono: null,
  };
  const changes = useFormChanges(initialData, formData);

  // Función para estilos condicionales: resalta si cambió o hay error.
  const getInputClass = (field: keyof typeof formData) => {
    return (changes[field]
      ? "has-[[data-slot=input-group-control]]:border-primary/50"
      : "")
      + " " +
      (errors[field]
        ? "has-[[data-slot=input-group-control]]:!border-destructive has-[[data-slot=input-group-control]]:!border-2"
        : "");
  };

  return (
    // Aquí se usa ModuleLayout para envolver la página con navegación de pestañas y header del módulo.
    <ModuleLayout
      moduloNombre={moduloNombre}
      tabs={tabs}
      activeTab={window.location.pathname}
    >
      <Card className="py-6 h-full flex flex-col shadow border-none">
        <CardHeader>
          <CardTitle>Información Corporativa</CardTitle>
        </CardHeader>

        <CardContent>
          {!puedeEditar ? (
            // Aquí se muestra un mensaje si el usuario no tiene permisos para editar.
            <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
              <p className="text-sm text-destructive font-medium">
                No tienes permiso para editar la información corporativa
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* ================================================ */}
              {/* SECCIÓN DE CONTACTO */}
              {/* ================================================ */}
              <div className="space-y-4">
                {/* Header de sección con fondo */}
                <div className="flex items-center gap-3 pb-2 border-b border-primary/50">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="leading-none">
                    <h3 className="text-md font-semibold text-foreground">
                      Información de Contacto
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Datos de contacto mostrados en el sitio público
                    </p>
                  </div>
                </div>

                {/* Grid de inputs */}
                <div className="grid gap-4 md:grid-cols-2 pt-2">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className={changes.email ? "text-primary" : ""}>Correo Electrónico</Label>

                    {/* Aquí se usa InputGroup para el campo de email con ícono y validaciones. */}
                    <InputGroup className={getInputClass("email")}>
                      <InputGroupAddon>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onKeyDown={handleEmailKeyDown}
                        placeholder="ejemplo@empresa.com"
                        disabled={isSubmitting}
                      />
                    </InputGroup>
                    <InputError message={errors.email} />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className={changes.telefono ? "text-primary" : ""}>Teléfono</Label>
                    {/* Aquí se usa InputGroup para el campo de teléfono con ícono y validaciones. */}
                    <InputGroup className={getInputClass("telefono")}>
                      <InputGroupAddon>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="telefono"
                        name="telefono"
                        type="text"
                        value={formData.telefono}
                        onChange={(e) => handleChange("telefono", e.target.value)}
                        onKeyDown={handleNumberKeyDown}
                        placeholder="6076985203"
                        disabled={isSubmitting}
                        className={errors.telefono ? "border-destructive" : ""}
                      />
                    </InputGroup>
                    <InputError message={errors.telefono} />
                  </div>
                </div>

                {/* Ubicación principal (full width) */}
                <div className="space-y-2">
                  <Label htmlFor="ubicacion" className={changes.ubicacion ? "text-primary" : ""}>Ubicación</Label>
                  {/* Aquí se usa InputGroup para el campo de ubicación con ícono y validaciones. */}
                  <InputGroup className={getInputClass("ubicacion")}>
                    <InputGroupAddon>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="ubicacion"
                      name="ubicacion"
                      type="text"
                      value={formData.ubicacion}
                      onChange={(e) => handleChange("ubicacion", e.target.value)}
                      onKeyDown={handleNumberTextKeyDown}
                      placeholder="Ecoparque Natura · Floridablanca, Colombia"
                      disabled={isSubmitting}
                      className={errors.ubicacion ? "border-destructive" : ""}
                    />
                  </InputGroup>
                  <InputError message={errors.ubicacion} />
                </div>

                {/* Grid de detalles */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Detalles de ubicación */}
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion_detalles" className={changes.ubicacion_detalles ? "text-primary" : ""}>
                      Detalles de Ubicación
                    </Label>
                    {/* Aquí se usa InputGroup para detalles de ubicación con ícono y validaciones. */}
                    <InputGroup className={getInputClass("ubicacion_detalles")}>
                      <InputGroupAddon>
                        <InputGroupText className="text-xs">
                          <MapPinHouse className="h-4 w-4 text-muted-foreground" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="ubicacion_detalles"
                        name="ubicacion_detalles"
                        type="text"
                        value={formData.ubicacion_detalles}
                        onChange={(e) => handleChange("ubicacion_detalles", e.target.value)}
                        onKeyDown={handleNumberTextKeyDown}
                        placeholder="Km 2 • Torre Uno • Oficina 206"
                        disabled={isSubmitting}
                        className={errors.ubicacion_detalles ? "border-destructive" : ""}
                      />
                    </InputGroup>
                    <InputError message={errors.ubicacion_detalles} />
                  </div>

                  {/* URL de Google Maps */}
                  <div className="space-y-2" >
                    <Label htmlFor="ubicacion_url" className={changes.ubicacion_url ? "text-primary" : ""}>
                      URL de Google Maps
                    </Label>
                    {/* Aquí se usa InputGroup para URL de ubicación con ícono y validaciones. */}
                    <InputGroup className={getInputClass("ubicacion_url")}>
                      <InputGroupAddon>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="ubicacion_url"
                        name="ubicacion_url"
                        type="url"
                        value={formData.ubicacion_url}
                        onChange={(e) => handleChange("ubicacion_url", e.target.value)}
                        onKeyDown={handleUrlKeyDown}
                        placeholder="https://maps.app.goo.gl/..."
                        disabled={isSubmitting}
                        className={errors.ubicacion_url ? "border-destructive" : ""}
                      />
                    </InputGroup>
                    <InputError message={errors.ubicacion_url} />
                  </div>
                </div>
              </div>

              {/* ================================================ */}
              {/* SECCIÓN DE IDENTIDAD VISUAL */}
              {/* ================================================ */}
              <div className="space-y-4">
                {/* Header de sección con fondo */}
                <div className="flex items-center gap-3 pb-2 border-b border-primary/50">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
                    <Image className="h-5 w-5 text-primary" />
                  </div>
                  <div className="leading-none">
                    <h3 className="text-md font-semibold text-foreground">
                      Identidad Visual
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Logo e icono de la empresa para web y aplicaciones
                    </p>
                  </div>
                </div>

                {/* Grid de uploads */}
                <div className="grid gap-6 md:grid-cols-2 pt-2">
                  {/* Aquí se usa ImageUpload para subir y gestionar el logo. */}
                  <ImageUpload
                    preview={previews.logo}
                    onImageChange={(file) => handleFileChange(file, "logo")}
                    onImageRemove={() => handleFileRemove("logo")}
                    disabled={isSubmitting}
                    error={errors.logo}
                    label="Logo de la Empresa"
                  />

                  {/* Aquí se usa ImageUpload para subir y gestionar el icono. */}
                  <ImageUpload
                    preview={previews.icono}
                    onImageChange={(file) => handleFileChange(file, "icono")}
                    onImageRemove={() => handleFileRemove("icono")}
                    disabled={isSubmitting}
                    error={errors.icono}
                    label="Icono/Favicon"
                    maxSize={1 * 1024 * 1024}
                    acceptedFormats={[
                      "image/png",
                      "image/jpeg",
                      "image/jpg",
                      "image/svg+xml",
                      "image/x-icon",
                    ]}
                  />
                </div>
              </div>

              {/* Botón de guardar */}
              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}

/**
 * Layout del componente: Envuelve la página en DashboardLayout con header dinámico.
 * Se usa para renderizar el componente dentro del layout principal.
 * 
 * @param {any} page - Página a renderizar.
 * @returns {JSX.Element} Elemento JSX con layout aplicado.
 */
InformacionCorporativa.layout = (page: any) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);
