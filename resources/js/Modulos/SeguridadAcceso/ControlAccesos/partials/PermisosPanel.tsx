import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuloAsignacionInterface, PestanaItemInterface } from "../types/controlAccesoInterface";
import { DynamicIcon } from "lucide-react/dynamic";
import { Info, Save, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface PermisosPanelProps {
  item: ModuloAsignacionInterface | PestanaItemInterface | undefined;
  rolId: number;
  permisosBase: string[];
  permisos: string[];
  tipo: "modulo" | "pestana";
  onSuccess: () => void;
}

export function PermisosPanel({
  item,
  rolId,
  permisosBase,
  permisos,
  tipo,
  onSuccess,
}: PermisosPanelProps) {
  const { toast } = useToast();
  const [asignar, setAsignar] = useState(false);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([]);
  const [permisosIniciales, setPermisosIniciales] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const puedeCrear = permisos.includes("crear");
  const puedeEditar = permisos.includes("editar");
  const puedeEliminar = permisos.includes("eliminar");

  const mensajesError: string[] = [];
  if (!puedeCrear && !item?.asignado) {
    mensajesError.push("crear asignaciones");
  }
  if (!puedeEditar && item?.asignado) {
    mensajesError.push("modificar asignaciones");
  }
  if (!puedeEliminar && item?.asignado) {
    mensajesError.push("eliminar asignaciones");
  }

  useEffect(() => {
    if (item) {
      setAsignar(item.asignado);
      const iniciales = item.permisos_asignados || [];
      setPermisosSeleccionados([...iniciales]);
      setPermisosIniciales([...iniciales]);
    } else {
      setAsignar(false);
      setPermisosSeleccionados([]);
      setPermisosIniciales([]);
    }
  }, [item]);

  const handlePermisoToggle = (permiso: string, checked: boolean) => {
    if (checked) {
      setPermisosSeleccionados([...permisosSeleccionados, permiso]);
    } else {
      setPermisosSeleccionados(permisosSeleccionados.filter((p) => p !== permiso));
    }
  };

  const hayCambiosPermisos = item?.asignado && JSON.stringify(permisosSeleccionados.sort()) !== JSON.stringify(permisosIniciales.sort());

  const puedeGuardar = !processing && (
    (!item?.asignado && asignar && puedeCrear) ||
    (item?.asignado && (hayCambiosPermisos || !asignar) && (puedeEditar || puedeEliminar))
  );

  const handleSubmit = async () => {
    if (!item) return;

    const rutaAsignar = tipo === "modulo" ? "control-acceso.asignar-modulo" : "control-acceso.asignar-pestana";
    const rutaDesasignar = tipo === "modulo" ? "control-acceso.desasignar-modulo" : "control-acceso.desasignar-pestana";
    const itemKey = tipo === "modulo" ? "modulo_id" : "pestana_id";

    if (!asignar) {
      if (!puedeEliminar) {
        toast({
          title: "Sin permisos",
          description: `No tienes permiso para eliminar asignaciones de ${tipo === "modulo" ? "módulos" : "pestañas"}`,
          variant: "destructive",
        });
        return;
      }

      setProcessing(true);
      try {
        const response = await fetch(route(rutaDesasignar), {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
          },
          body: JSON.stringify({
            rol_id: rolId,
            [itemKey]: item.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al desasignar");
        }

        toast({
          title: `${tipo === "modulo" ? "Módulo" : "Pestaña"} desasignado`,
          description: data.message,
          variant: "success",
        });

        onSuccess();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setProcessing(false);
      }
      return;
    }

    const esNuevaAsignacion = !item.asignado;

    if (esNuevaAsignacion && !puedeCrear) {
      toast({
        title: "Sin permisos",
        description: `No tienes permiso para crear asignaciones de ${tipo === "modulo" ? "módulos" : "pestañas"}`,
        variant: "destructive",
      });
      return;
    }

    if (!esNuevaAsignacion && !puedeEditar) {
      toast({
        title: "Sin permisos",
        description: `No tienes permiso para editar asignaciones de ${tipo === "modulo" ? "módulos" : "pestañas"}`,
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(route(rutaAsignar), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
        body: JSON.stringify({
          rol_id: rolId,
          [itemKey]: item.id,
          permisos: permisosSeleccionados,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al asignar");
      }

      toast({
        title: esNuevaAsignacion ? `${tipo === "modulo" ? "Módulo" : "Pestaña"} asignado` : "Asignación actualizada",
        description: data.message,
        variant: "success",
      });

      setPermisosIniciales([...permisosSeleccionados]);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const puedeInteractuarSwitch = !processing && (item?.asignado ? puedeEliminar : puedeCrear);

  // Verificar si es módulo con pestañas (solo aplica si tipo === "modulo")
  const esModuloConPestanas = tipo === "modulo" && (item as ModuloAsignacionInterface)?.tiene_pestanas;

  return (
    <Card className="shadow border-none flex flex-col py-4 h-min md:sticky md:top-16">
      {!item ? (
        <CardHeader>
          <CardTitle className="text-base">Permisos de{tipo === "modulo" ? "l Módulo" : " la Pestaña"}</CardTitle>
        </CardHeader>
      ) : (
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DynamicIcon name={item.icono} className="h-5 w-5 text-primary" />
            {item.nombre}
          </CardTitle>
        </CardHeader>
      )}

      {!item ? (
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground space-y-2">
            <Info className="h-12 w-12 mx-auto opacity-50" />
            <p className="text-sm">
              Selecciona {tipo === "modulo" ? "un módulo" : "una pestaña"} de la lista <br /> para configurar sus permisos
            </p>
          </div>
        </CardContent>
      ) : (
        <CardContent className="flex-1 flex flex-col space-y-4">
          {!processing && mensajesError.length > 0 && (
            <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              No tienes permisos para {mensajesError.join(" ni ")}.
            </div>
          )}

          <div className="p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between">
              <Label htmlFor="asignar" className="cursor-pointer flex items-center gap-2 mb-0">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Asignar {tipo === "modulo" ? "módulo" : "pestaña"} al rol
              </Label>
              <Switch
                id="asignar"
                checked={asignar}
                onCheckedChange={setAsignar}
                disabled={!puedeInteractuarSwitch}
              />
            </div>
          </div>

          {asignar && (
            <>
              {esModuloConPestanas && (
                <div className="p-2 rounded-lg border border-amber-500 bg-amber-500/10 text-amber-600 text-sm flex gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Este módulo tiene {(item as ModuloAsignacionInterface).cant_pestanas} pestañas</p>
                    <p className="text-xs">
                      Se recomienda asignar permisos directamente a las pestañas para mayor control
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">Permisos Generales</h4>
                </div>
                <div className="space-y-2">
                  {permisosBase.map((permiso) => (
                    <div
                      key={permiso}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`base-${permiso}`}
                        checked={permisosSeleccionados.includes(permiso)}
                        onCheckedChange={(checked) => handlePermisoToggle(permiso, checked as boolean)}
                        disabled={processing || !puedeEditar}
                      />
                      <Label
                        htmlFor={`base-${permiso}`}
                        className="flex-1 cursor-pointer text-sm capitalize mb-0"
                      >
                        {permiso}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {item.permisos_extra && item.permisos_extra.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">Permisos Extra</h4>
                    <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-700 border-orange-500/20">
                      Específicos del {tipo === "modulo" ? "módulo" : "pestaña"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {item.permisos_extra.map((permiso) => (
                      <div
                        key={permiso}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          id={`extra-${permiso}`}
                          checked={permisosSeleccionados.includes(permiso)}
                          onCheckedChange={(checked) => handlePermisoToggle(permiso, checked as boolean)}
                          disabled={processing || !puedeEditar}
                        />
                        <Label
                          htmlFor={`extra-${permiso}`}
                          className="flex-1 cursor-pointer text-sm mb-0"
                        >
                          {permiso.replace(/_/g, " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-2 rounded-lg bg-primary/10 border border-primary/50 text-primary text-xs flex gap-2">
                <Info className="h-3.5 w-3.5 mt-0.5" />
                El uso de estos permisos se realiza internamente en el controlador y vistas de{tipo === "modulo" ? "l módulo" : " la pestaña"}
              </div>
            </>
          )}

          <div className="mt-auto pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={!puedeGuardar}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {processing
                ? "Guardando..."
                : !item.asignado
                  ? `Asignar ${tipo === "modulo" ? "Módulo" : "Pestaña"}`
                  : !asignar
                    ? `Desasignar ${tipo === "modulo" ? "Módulo" : "Pestaña"}`
                    : "Actualizar Asignación"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}