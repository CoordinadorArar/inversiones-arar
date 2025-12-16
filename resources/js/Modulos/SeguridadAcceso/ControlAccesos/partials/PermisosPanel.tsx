import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuloAsignacionInterface } from "../types/controlAccesoInterface";
import { DynamicIcon } from "lucide-react/dynamic";
import { Info, Save, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface PermisosPanelProps {
  modulo: ModuloAsignacionInterface | undefined; // Corregido: | undefined
  rolId: number;
  permisosBase: string[];
  permisos: string[]; // Permisos del usuario actual en esta pestaña
  onSuccess: () => void;
}

export function PermisosPanel({
  modulo,
  rolId,
  permisosBase,
  permisos,
  onSuccess,
}: PermisosPanelProps) {
  const { toast } = useToast();
  const [asignar, setAsignar] = useState(false);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([]);
  const [permisosIniciales, setPermisosIniciales] = useState<string[]>([]); // Para comparar cambios
  const [processing, setProcessing] = useState(false);

  // Permisos del usuario
  const puedeCrear = permisos.includes("crear");
  const puedeEditar = permisos.includes("editar");
  const puedeEliminar = permisos.includes("eliminar");

  // Determinar mensajes de error basados en permisos faltantes
  const mensajesError: string[] = [];
  if (!puedeCrear && !modulo?.asignado) {
    mensajesError.push("crear asignaciones");
  }
  if (!puedeEditar && modulo?.asignado) {
    mensajesError.push("modificar asignaciones");
  }
  if (!puedeEliminar && modulo?.asignado) {
    mensajesError.push("eliminar asignaciones");
  }


  useEffect(() => {
    if (modulo) {
      setAsignar(modulo.asignado);
      const iniciales = modulo.permisos_asignados || [];
      setPermisosSeleccionados([...iniciales]); // Copia para evitar mutación
      setPermisosIniciales([...iniciales]);
    } else {
      setAsignar(false);
      setPermisosSeleccionados([]);
      setPermisosIniciales([]);
    }
  }, [modulo]);

  const handlePermisoToggle = (permiso: string, checked: boolean) => {
    if (checked) {
      setPermisosSeleccionados([...permisosSeleccionados, permiso]);
    } else {
      setPermisosSeleccionados(permisosSeleccionados.filter((p) => p !== permiso));
    }
  };

  // Verificar si hay cambios en permisos (solo si asignado)
  const hayCambiosPermisos = modulo?.asignado && JSON.stringify(permisosSeleccionados.sort()) !== JSON.stringify(permisosIniciales.sort());

  // Determinar si el botón de guardar está habilitado
  const puedeGuardar = !processing && (
    (!modulo?.asignado && asignar && puedeCrear) || // Asignar nuevo
    (modulo?.asignado && (hayCambiosPermisos || !asignar) && (puedeEditar || puedeEliminar)) // Actualizar o desasignar
  );

  const handleSubmit = async () => {
    if (!modulo) return;

    if (!asignar) {
      // Desasignar - requiere permiso eliminar
      if (!puedeEliminar) {
        toast({
          title: "Sin permisos",
          description: "No tienes permiso para eliminar asignaciones de módulos",
          variant: "destructive",
        });
        return;
      }

      setProcessing(true);
      try {
        const response = await fetch(route("control-acceso.desasignar-modulo"), {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
          },
          body: JSON.stringify({
            rol_id: rolId,
            modulo_id: modulo.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al desasignar");
        }

        toast({
          title: "Módulo desasignado",
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

    // Asignar/Editar con permisos
    const esNuevaAsignacion = !modulo.asignado;

    if (esNuevaAsignacion && !puedeCrear) {
      toast({
        title: "Sin permisos",
        description: "No tienes permiso para crear asignaciones de módulos",
        variant: "destructive",
      });
      return;
    }

    if (!esNuevaAsignacion && !puedeEditar) {
      toast({
        title: "Sin permisos",
        description: "No tienes permiso para editar asignaciones de módulos",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(route("control-acceso.asignar-modulo"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
        body: JSON.stringify({
          rol_id: rolId,
          modulo_id: modulo.id,
          permisos: permisosSeleccionados,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al asignar");
      }

      toast({
        title: esNuevaAsignacion ? "Módulo asignado" : "Asignación actualizada",
        description: data.message,
        variant: "success",
      });

      // Actualizar permisos iniciales después de guardar
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

  // Determinar si puede interactuar con el Switch
  const puedeInteractuarSwitch = !processing && (modulo?.asignado ? puedeEliminar : puedeCrear);

  return (
    <Card className="shadow border-none flex flex-col py-4 h-min md:sticky md:top-16">
      {!modulo ? (
        <CardHeader>
          <CardTitle className="text-base">Permisos del Módulo</CardTitle>
        </CardHeader>
      ) : (
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DynamicIcon name={modulo.icono} className="h-5 w-5 text-primary" />
            {modulo.nombre}
          </CardTitle>
        </CardHeader>
      )}

      {!modulo ? (
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground space-y-2">
            <Info className="h-12 w-12 mx-auto opacity-50" />
            <p className="text-sm">
              Selecciona un módulo de la lista <br /> para configurar sus permisos
            </p>
          </div>
        </CardContent>
      ) : (
        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Mostrar div de error solo si hay mensajes y no está procesando */}
          {!processing && mensajesError.length > 0 && (
            <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              No tienes permisos para {mensajesError.join(" ni ")}.
            </div>
          )}

          {/* Switch de asignar */}
          <div className="p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between">
              <Label htmlFor="asignar" className="cursor-pointer flex items-center gap-2 mb-0">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Asignar módulo al rol
              </Label>
              <Switch
                id="asignar"
                checked={asignar}
                onCheckedChange={setAsignar}
                disabled={!puedeInteractuarSwitch} // Deshabilitado si ya asignado
              />
            </div>
          </div>

          {asignar && (
            <>
              {/* Advertencia si tiene pestañas */}
              {modulo.tiene_pestanas && (
                <div className="p-2 rounded-lg border border-amber-500 bg-amber-500/10 text-amber-600 text-sm flex gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Este módulo tiene {modulo.cant_pestanas} pestañas</p>
                    <p className="text-xs">
                      Se recomienda asignar permisos directamente a las pestañas para mayor control
                    </p>
                  </div>
                </div>
              )}

              {/* Permisos Base */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">Permisos Génerales</h4>
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

              {/* Permisos Extra */}
              {modulo.permisos_extra && modulo.permisos_extra.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">Permisos Extra</h4>
                    <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-700 border-orange-500/20">
                      Específicos del módulo
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {modulo.permisos_extra.map((permiso) => (
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
                          className="flex-1 cursor-pointer text-sm"
                        >
                          {permiso.replace(/_/g, " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info sobre gestión interna */}
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/50 text-primary text-xs flex gap-2">
                <Info className="h-3.5 w-3.5 mt-0.5" />
                El uso de estos permisos se realiza internamente en el controlador y vistas del módulo
              </div>
            </>
          )}

          {/* Botón guardar */}
          <div className="mt-auto pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={!puedeGuardar}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {processing
                ? "Guardando..."
                : !modulo.asignado
                  ? "Asignar Módulo"
                  : !asignar
                    ? "Desasignar Módulo"
                    : "Actualizar Asignación"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}