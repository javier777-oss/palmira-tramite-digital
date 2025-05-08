
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getTramitesByUserId } from "../services/tramiteService";
import { Tramite } from "../types";
import { useAuth } from "../context/AuthContext";
import TramitesList from "../components/TramitesList";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const MisTramites = () => {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [tramitesActivos, setTramitesActivos] = useState<Tramite[]>([]);
  const [tramitesFinalizados, setTramitesFinalizados] = useState<Tramite[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchTramites = () => {
        const userTramites = getTramitesByUserId(user.id);
        setTramites(userTramites);

        // Filtrar trámites activos y finalizados
        setTramitesActivos(
          userTramites.filter(
            (t) => !["aprobado", "rechazado"].includes(t.estado)
          )
        );
        
        setTramitesFinalizados(
          userTramites.filter((t) =>
            ["aprobado", "rechazado"].includes(t.estado)
          )
        );
      };

      fetchTramites();
    }
  }, [user]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis trámites</h1>

        <Tabs defaultValue="todos" className="mb-8">
          <TabsList>
            <TabsTrigger value="todos">Todos ({tramites.length})</TabsTrigger>
            <TabsTrigger value="activos">
              En proceso ({tramitesActivos.length})
            </TabsTrigger>
            <TabsTrigger value="finalizados">
              Finalizados ({tramitesFinalizados.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="todos" className="mt-6">
            <TramitesList tramites={tramites} />
          </TabsContent>
          <TabsContent value="activos" className="mt-6">
            <TramitesList tramites={tramitesActivos} />
          </TabsContent>
          <TabsContent value="finalizados" className="mt-6">
            <TramitesList tramites={tramitesFinalizados} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MisTramites;
