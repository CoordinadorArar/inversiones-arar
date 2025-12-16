import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ModuloAsignacionInterface } from "../types/controlAccesoInterface";
import { DynamicIcon } from "lucide-react/dynamic";
import { Check, ChevronDown, ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible"; // Agrega este import

interface ModulosListProps {
  modulos: ModuloAsignacionInterface[];
  selectedModuloId: number | null;
  onModuloSelect: (moduloId: number) => void;
}

export function ModulosList({
  modulos,
  selectedModuloId,
  onModuloSelect,
}: ModulosListProps) {
  // Estado para grupos abiertos (array de nombres de módulos, como en el sidebar)
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  // Toggle de grupo (agrega/quita nombre del array)
  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName]
    );
  };

  // Expandir todos los módulos padres
  const expandAll = () => {
    const allParentNames = modulos.filter((m) => m.es_padre).map((m) => m.nombre);
    setOpenGroups(allParentNames);
  };

  // Colapsar todos
  const collapseAll = () => {
    setOpenGroups([]);
  };

  return (
    <Card className="py-4 shadow border-none flex flex-col min-h-0">
      <CardHeader>
        <div className="flex max-md:flex-col items-center justify-between">
          <CardTitle className="text-base">
            Módulos disponibles
          </CardTitle>
          {/* Botones para expandir/colapsar todo */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={expandAll}
              className="text-xs"
            >
              <ListChevronsUpDown className="h-3 w-3 mr-1" />
              Expandir Todo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={collapseAll}
              className="text-xs"
            >
              <ListChevronsDownUp className="h-3 w-3 mr-1" />
              Colapsar Todo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-3">
        {modulos.map((modulo) => (
          <div key={modulo.id} className="space-y-2">
            {/* Módulo Padre o Directo */}
            {modulo.es_padre ? (
              <Collapsible
                open={openGroups.includes(modulo.nombre)} // Abre si nombre está en openGroups
                onOpenChange={() => toggleGroup(modulo.nombre)} // Toggle al cambiar
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-colors text-left">
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-primary transition-transform duration-300",
                          openGroups.includes(modulo.nombre) && "rotate-180" // Rota flecha al abrir
                        )}
                      />                      
                      <DynamicIcon name={modulo.icono} className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-sm">{modulo.nombre}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {modulo.hijos?.length || 0} módulos
                      </Badge>
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent
                  className={cn(
                    "ml-6 space-y-2 overflow-hidden mt-3",
                    "data-[state=open]:animate-collapsible-down", // Animación al abrir
                    "data-[state=closed]:animate-collapsible-up"   // Animación al cerrar
                  )}
                >
                  {/* Módulos Hijos */}
                  {modulo.hijos && modulo.hijos.length > 0 && (
                    <>
                      {modulo.hijos.map((hijo) => (
                        <button
                          key={hijo.id}
                          onClick={() => onModuloSelect(hijo.id)}
                          className={cn(
                            "w-full px-3 py-1 rounded-lg border transition-all text-left",
                            selectedModuloId === hijo.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 hover:bg-muted/40"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <DynamicIcon name={hijo.icono} className="h-5 w-5 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{hijo.nombre}</p>
                              {hijo.tiene_pestanas && (
                                <p className="text-xs text-muted-foreground">
                                  {hijo.cant_pestanas} pestañas
                                </p>
                              )}
                            </div>
                            {hijo.asignado && (
                              <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs gap-1">
                                <Check className="h-3 w-3" />
                                Asignado
                              </Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              !modulo.es_padre &&
              modulos.every((m) => !m.hijos?.some((h) => h.id === modulo.id)) && (
                <button
                  onClick={() => onModuloSelect(modulo.id)}
                  className={cn(
                    "w-full p-3 rounded-lg border transition-all text-left",
                    selectedModuloId === modulo.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <DynamicIcon name={modulo.icono} className="h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{modulo.nombre}</p>
                      {modulo.tiene_pestanas && (
                        <p className="text-xs text-muted-foreground">
                          {modulo.cant_pestanas} pestañas
                        </p>
                      )}
                    </div>
                    {modulo.asignado && (
                      <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs gap-1">
                        <Check className="h-3 w-3" />
                        Asignado
                      </Badge>
                    )}
                  </div>
                </button>
              )
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
