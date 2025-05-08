
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTramitesByUserId } from "../services/tramiteService";
import { Tramite } from "../types";
import TramitesList from "../components/TramitesList";
import NotificacionesList from "../components/NotificacionesList";

const Dashboard = () => {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [tramitesEnProceso, setTramitesEnProceso] = useState<Tramite[]>([]);
  const [tramitesCompletados, setTramitesCompletados] = useState<Tramite[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userTramites = getTramitesByUserId(user.id);
      setTramites(userTramites);
      
      // Filtrar trámites
      setTramitesEnProceso(
        userTramites.filter(
          (t) => !["aprobado", "rechazado"].includes(t.estado)
        )
      );
      setTramitesCompletados(
        userTramites.filter((t) => ["aprobado", "rechazado"].includes(t.estado))
      );
    }
  }, [user]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bienvenido, {user?.nombre}</h1>
            <p className="text-gray-600">
              Panel de trámites de la Secretaría de Educación
            </p>
          </div>
          <Link to="/nuevo-tramite">
            <Button className="mt-4 md:mt-0 bg-palmira-600 hover:bg-palmira-700">
              Iniciar nuevo trámite
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total trámites</CardTitle>
              <CardDescription>Todos tus trámites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{tramites.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>En proceso</CardTitle>
              <CardDescription>Trámites en revisión</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{tramitesEnProceso.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Completados</CardTitle>
              <CardDescription>Trámites finalizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{tramitesCompletados.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Trámites recientes</h2>
            <TramitesList tramites={tramites.slice(0, 3)} />
            {tramites.length > 3 && (
              <div className="mt-4 text-center">
                <Link to="/mis-tramites">
                  <Button variant="outline">Ver todos los trámites</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Notificaciones</h2>
            <NotificacionesList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
