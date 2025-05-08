
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getAllTramites } from "../services/tramiteService";
import { Tramite } from "../types";
import TramitesList from "../components/TramitesList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const AdminTramites = () => {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [tramitesFiltrados, setTramitesFiltrados] = useState<Tramite[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    const fetchTramites = () => {
      const allTramites = getAllTramites();
      setTramites(allTramites);
      setTramitesFiltrados(allTramites);
    };
    
    fetchTramites();
  }, []);

  // Función para filtrar trámites
  const filterTramites = () => {
    let filtered = tramites;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tipoTramite.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por estado
    if (filtroEstado !== "todos") {
      filtered = filtered.filter(t => t.estado === filtroEstado);
    }
    
    setTramitesFiltrados(filtered);
  };

  // Ejecutar filtrado cuando cambian los criterios
  useEffect(() => {
    filterTramites();
  }, [searchTerm, filtroEstado, tramites]);

  // Agrupar trámites por estado
  const tramitesPendientes = tramitesFiltrados.filter(t => 
    ["iniciado", "documentos_cargados", "req_documentos"].includes(t.estado)
  );
  
  const tramitesEnRevision = tramitesFiltrados.filter(t => 
    t.estado === "en_revision"
  );
  
  const tramitesFinalizados = tramitesFiltrados.filter(t => 
    ["aprobado", "rechazado"].includes(t.estado)
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestión de Trámites</h1>
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por ID o tipo de trámite"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="iniciado">Iniciado</SelectItem>
                <SelectItem value="documentos_cargados">Documentos cargados</SelectItem>
                <SelectItem value="en_revision">En revisión</SelectItem>
                <SelectItem value="req_documentos">Requiere documentos</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setFiltroEstado("todos");
            }}
          >
            Limpiar filtros
          </Button>
        </div>

        {/* Resultados tabulados */}
        <Tabs defaultValue="pendientes" className="mb-8">
          <TabsList>
            <TabsTrigger value="pendientes">
              Pendientes ({tramitesPendientes.length})
            </TabsTrigger>
            <TabsTrigger value="revision">
              En revisión ({tramitesEnRevision.length})
            </TabsTrigger>
            <TabsTrigger value="finalizados">
              Finalizados ({tramitesFinalizados.length})
            </TabsTrigger>
            <TabsTrigger value="todos">
              Todos ({tramitesFiltrados.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pendientes" className="mt-6">
            <TramitesList tramites={tramitesPendientes} isAdmin={true} />
          </TabsContent>
          
          <TabsContent value="revision" className="mt-6">
            <TramitesList tramites={tramitesEnRevision} isAdmin={true} />
          </TabsContent>
          
          <TabsContent value="finalizados" className="mt-6">
            <TramitesList tramites={tramitesFinalizados} isAdmin={true} />
          </TabsContent>
          
          <TabsContent value="todos" className="mt-6">
            <TramitesList tramites={tramitesFiltrados} isAdmin={true} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminTramites;
