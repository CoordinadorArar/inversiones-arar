import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { ModuleLayout } from "@/Layouts/ModuleLayout";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { router } from "@inertiajs/react";
import { Save, MapPin, Phone, Mail, Image, Globe, MapPinHouse } from "lucide-react";
import { toast } from "sonner";
import { 
  handleEmailKeyDown, 
  handleNumberKeyDown, 
  handleNumberTextKeyDown, 
  handleUrlKeyDown 
} from "@/lib/keydownValidations";
import { TabInterface } from "@/Types/tabInterface";
import { ImageUpload } from "@/Components/ImageUpload";
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput, 
  InputGroupText 
} from "@/Components/ui/input-group";
import InputError from "@/Components/InputError";

interface InformacionCorporativaProps {
  tabs: TabInterface[];
  moduloNombre: string;
  permisos: string[];
  configuracion: {
    contact: {
      email?: string;
      telefono?: string;
      ubicacion?: string;
      "ubicacion.detalles"?: string;
      "ubicacion.url"?: string;
    };
    images: {
      logo?: string;
      icono?: string;
    };
  };
}

export default function InformacionCorporativa({
  tabs,
  moduloNombre,
  permisos,
  configuracion,
}: InformacionCorporativaProps) {
  const puedeEditar = !permisos.includes("editar");

  const [formData, setFormData] = useState({
    email: configuracion.contact.email || "",
    telefono: configuracion.contact.telefono || "",
    ubicacion: configuracion.contact.ubicacion || "",
    ubicacion_detalles: configuracion.contact["ubicacion.detalles"] || "",
    ubicacion_url: configuracion.contact["ubicacion.url"] || "",
    logo: null as File | null,
    icono: null as File | null,
  });

  const [previews, setPreviews] = useState({
    logo: configuracion.images.logo || null,
    icono: configuracion.images.icono || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (file: File, field: "logo" | "icono") => {
    setFormData((prev) => ({ ...prev, [field]: file }));
    setPreviews((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(file),
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileRemove = (field: "logo" | "icono") => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    setPreviews((prev) => ({ ...prev, [field]: null }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!puedeEditar) {
      toast.error("No tienes permiso para editar la configuración");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value as string);
        }
      }
    });

    try {
      const response = await fetch(route("configuracion.update-corporativa"), {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") || "",
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.error || "Error al guardar");
      }

      toast.success(data.message || "Configuración guardada correctamente");
      router.reload({ only: ["configuracion"] });
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la configuración");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
              <p className="text-sm text-destructive font-medium">
                No tienes permiso para editar la información corporativa
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
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
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onKeyDown={handleEmailKeyDown}
                        placeholder="ejemplo@empresa.com"
                        disabled={isSubmitting}
                        className={errors.email ? "border-destructive" : ""}
                      />
                    </InputGroup>
                    <InputError message={errors.email} />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="telefono"
                        name="telefono"
                        type="text"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        onKeyDown={handleNumberKeyDown}
                        placeholder="607 698 5203"
                        disabled={isSubmitting}
                        className={errors.telefono ? "border-destructive" : ""}
                      />
                    </InputGroup>
                    <InputError message={errors.telefono} />
                  </div>
                </div>

                {/* Ubicación principal (full width) */}
                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="ubicacion"
                      name="ubicacion"
                      type="text"
                      value={formData.ubicacion}
                      onChange={handleInputChange}
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
                    <Label htmlFor="ubicacion_detalles">
                      Detalles de Ubicación
                    </Label>
                    <InputGroup>
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
                        onChange={handleInputChange}
                        onKeyDown={handleNumberTextKeyDown}
                        placeholder="Km 2 • Torre Uno • Oficina 206"
                        disabled={isSubmitting}
                        className={errors.ubicacion_detalles ? "border-destructive" : ""}
                      />
                    </InputGroup>
                    <InputError message={errors.ubicacion_detalles} />
                  </div>

                  {/* URL de Google Maps */}
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion_url">
                      URL de Google Maps
                    </Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="ubicacion_url"
                        name="ubicacion_url"
                        type="url"
                        value={formData.ubicacion_url}
                        onChange={handleInputChange}
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
                  <ImageUpload
                    preview={previews.logo}
                    onImageChange={(file) => handleFileChange(file, "logo")}
                    onImageRemove={() => handleFileRemove("logo")}
                    disabled={isSubmitting}
                    error={errors.logo}
                    label="Logo de la Empresa"
                  />

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

InformacionCorporativa.layout = (page: any) => (
  <DashboardLayout header={page.props.moduloNombre} children={page} />
);