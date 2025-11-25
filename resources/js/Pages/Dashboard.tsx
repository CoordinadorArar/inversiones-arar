import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import {  DollarSign, ChevronUp, ChevronDown, FileText, CalendarIcon, Cake } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {

  const [showAllDocs, setShowAllDocs] = useState(false);

  const documentos = [
    { nombre: "Reglamento interno", tipo: "PDF", fecha: "reatens" },
    { nombre: "Código Ética", tipo: "PDF", fecha: "15 de abril" },
    { nombre: "Reunión de quipo", tipo: "PDF", fecha: "23 de abril" },
    { nombre: "Política SST", tipo: "PDF", fecha: "10 de marzo" },
    { nombre: "Manual de convivencia", tipo: "PDF", fecha: "5 de febrero" },
  ];

  const eventos = [
    { titulo: "Reunión de equipo", fecha: "15 de abril", tipo: "evento" },
    { titulo: "Capacitación SST", fecha: "20 de abril", tipo: "evento" },
    { titulo: "Entrega de reportes", fecha: "25 de abril", tipo: "evento" },
  ];

  const cumpleanos = [
    { nombre: "Carlos Méndez", fecha: "18 de abril" },
    { nombre: "Ana María López", fecha: "22 de abril" },
    { nombre: "Roberto Gómez", fecha: "28 de abril" },
  ];

  const visibleDocs = showAllDocs ? documentos : documentos.slice(0, 3);

  return (
    <>
      <Head title="Intranet" />
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Columna Izquierda */}
          <div className="space-y-6 lg:col-span-2">
            {/* Card de Bienvenida */}
            <Card >
              <CardContent className="py-4">
                <div className="flex items-start gap-6">

                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src="" alt="Usuario" />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-3xl font-bold">Bienvenido, Usuario</h2>
                    <p className="text-muted-foreground">Cargo del Usuario</p>
                    <p className="text-sm mt-2">
                      <span className="text-muted-foreground">Próximo evento:</span>{" "}
                      <span className="font-medium">Reunión de equipo</span> el 15 de abril
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Eventos/Cumpleaños */}
            <Card className="py-5">
              <CardHeader>
                <CardTitle>Eventos y Cumpleaños</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="eventos" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="eventos">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Eventos
                    </TabsTrigger>
                    <TabsTrigger value="cumpleanos">
                      <Cake className="h-4 w-4 mr-2" />
                      Cumpleaños
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="eventos" className="space-y-3 mt-4">
                    {eventos.map((evento, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{evento.titulo}</p>
                          <p className="text-xs text-muted-foreground">{evento.fecha}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="cumpleanos" className="space-y-3 mt-4">
                    {cumpleanos.map((cumple, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                        <Cake className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{cumple.nombre}</p>
                          <p className="text-xs text-muted-foreground">{cumple.fecha}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-6">
            {/* Card de Documentos Importantes */}
            <Card className="py-4">
              <CardHeader>
                <CardTitle>Documentos Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visibleDocs.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{doc.nombre}</p>
                          <p className="text-xs text-muted-foreground">{doc.fecha}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                  ))}
                </div>
                {documentos.length > 3 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => setShowAllDocs(!showAllDocs)}
                  >
                    {showAllDocs ? (
                      <>
                        Ver menos <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Ver más <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Card de Información de Pago */}
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Día de pago</p>
                    <p className="text-2xl font-bold">25 de cada mes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = (page) => (
  <DashboardLayout header="Intranet Corporativa" children={page} />
);
