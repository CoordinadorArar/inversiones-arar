import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PestanaAsignacionInterface } from "../types/controlAccesoInterface";
import { DynamicIcon } from "lucide-react/dynamic";
import { Folder, Check, ListChevronsDownUp, ListChevronsUpDown, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible";

interface PestanasListProps {
  pestanas: PestanaAsignacionInterface[];
  selectedPestanaId: number | null;
  onPestanaSelect: (pestanaId: number) => void;
}

export function PestanasList({
  pestanas,
  selectedPestanaId,
  onPestanaSelect,
}: PestanasListProps) {
  const [openPadres, setOpenPadres] = useState<number[]>([]);
  const [openHijos, setOpenHijos] = useState<number[]>([]);

  const togglePadre = (padreId: number) => {
    setOpenPadres((prev) =>
      prev.includes(padreId)
        ? prev.filter((id) => id !== padreId)
        : [...prev, padreId]
    );
  };

  const toggleHijo = (hijoId: number) => {
    setOpenHijos((prev) =>
      prev.includes(hijoId)
        ? prev.filter((id) => id !== hijoId)
        : [...prev, hijoId]
    );
  };

  const expandAll = () => {
    const allPadresIds = pestanas.map((p) => p.id);
    const allHijosIds = pestanas.flatMap((p) => p.hijos.map((h) => h.modulo_id));
    setOpenPadres(allPadresIds);
    setOpenHijos(allHijosIds);
  };

  const collapseAll = () => {
    setOpenPadres([]);
    setOpenHijos([]);
  };

  return (
    <Card className="py-4 shadow border-none flex flex-col min-h-0">
      <CardHeader>
        <div className="flex max-md:flex-col items-center justify-between">
          <CardTitle className="text-base">
            Pestañas disponibles
          </CardTitle>
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
        {pestanas.map((padre) => (
          <div key={padre.id} className="space-y-2">
            {/* Módulo Padre */}
            <Collapsible
              open={openPadres.includes(padre.id)}
              onOpenChange={() => togglePadre(padre.id)}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-colors text-left">
                  <div className="flex items-center gap-2">
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-primary transition-transform duration-300",
                        openPadres.includes(padre.id) && "rotate-180"
                      )}
                    />
                    <DynamicIcon name={padre.icono} className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm">{padre.nombre}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {padre.hijos.length} {padre.hijos.length === 1 ? 'módulo' : 'módulos'}
                    </Badge>
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent
                className={cn(
                  "ml-6 space-y-2 overflow-hidden mt-3",
                  "data-[state=open]:animate-collapsible-down",
                  "data-[state=closed]:animate-collapsible-up"
                )}
              >
                {/* Módulos Hijos */}
                {padre.hijos.map((hijo) => (
                  <Collapsible
                    key={hijo.modulo_id}
                    open={openHijos.includes(hijo.modulo_id)}
                    onOpenChange={() => toggleHijo(hijo.modulo_id)}
                  >
                    <CollapsibleTrigger asChild>
                      <button className="w-full p-2.5 rounded-lg bg-background border border-border hover:bg-muted/50 transition-colors text-left">
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-300",
                              openHijos.includes(hijo.modulo_id) && "rotate-180"
                            )}
                          />
                          <DynamicIcon name={hijo.modulo_icono} className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{hijo.modulo_nombre}</span>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {hijo.pestanas.length} {hijo.pestanas.length === 1 ? 'pestaña' : 'pestañas'}
                          </Badge>
                        </div>
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent
                      className={cn(
                        "ml-6 space-y-2 overflow-hidden mt-2",
                        "data-[state=open]:animate-collapsible-down",
                        "data-[state=closed]:animate-collapsible-up"
                      )}
                    >
                      {/* Pestañas */}
                      {hijo.pestanas.map((pestana) => (
                        <button
                          key={pestana.id}
                          onClick={() => onPestanaSelect(pestana.id)}
                          className={cn(
                            "w-full px-3 py-2 rounded-lg border transition-all text-left",
                            selectedPestanaId === pestana.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 hover:bg-muted/40"
                          )}
                        >
                          <div className="flex items-center gap-3">                            
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{pestana.nombre}</p>
                            </div>
                            {pestana.asignado && (
                              <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs gap-1">
                                <Check className="h-3 w-3" />
                                Asignado
                              </Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}