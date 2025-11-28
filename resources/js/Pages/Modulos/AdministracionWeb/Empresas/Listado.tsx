import { ModuleLayout } from "@/Layouts/ModuleLayout";


interface EmpresasListadoProps {
  tabs: Array<{
    id: number;
    nombre: string;
    ruta: string;
  }>;
  empresas: any[];
}

export default function EmpresasListado({ empresas }: EmpresasListadoProps) {
  return (
    <div className="space-y-4">
      <h2>Listado de Empresas</h2>
      {/* Tu tabla o contenido aquí */}
    </div>
  );
}


EmpresasListado.layout = (page) => (
    <ModuleLayout
        moduloNombre="Empresas"
        tabs={page.props.tabs}
        activeTab={window.location.pathname}
    >
        {page}
    </ModuleLayout>
);
