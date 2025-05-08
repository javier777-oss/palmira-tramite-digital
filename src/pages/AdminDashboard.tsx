
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTramites } from "../services/tramiteService";
import { Tramite } from "../types";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import TramitesList from "../components/TramitesList";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    totalTramites: 0,
    enRevision: 0,
    aprobados: 0,
    rechazados: 0,
    pendientes: 0
  });

  useEffect(() => {
    const fetchTramites = () => {
      const allTramites = getAllTramites();
      setTramites(allTramites);
      
      // Calcular estadísticas
      const stats = {
        totalTramites: allTramites.length,
        enRevision: allTramites.filter(t => t.estado === 'en_revision').length,
        aprobados: allTramites.filter(t => t.estado === 'aprobado').length,
        rechazados: allTramites.filter(t => t.estado === 'rechazado').length,
        pendientes: allTramites.filter(t => 
          ['iniciado', 'documentos_cargados', 'req_documentos'].includes(t.estado)
        ).length
      };
      
      setEstadisticas(stats);
    };
    
    fetchTramites();
  }, []);

  // Datos para el gráfico
  const chartData = [
    { name: 'Pendientes', value: estadisticas.pendientes, color: '#F59E0B' },
    { name: 'En Revisión', value: estadisticas.enRevision, color: '#3B82F6' },
    { name: 'Aprobados', value: estadisticas.aprobados, color: '#10B981' },
    { name: 'Rechazados', value: estadisticas.rechazados, color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Tramites recientes para mostrar en el dashboard
  const tramitesRecientes = tramites
    .sort((a, b) => new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime())
    .slice(0, 5);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total trámites</CardTitle>
              <CardDescription>Todos los trámites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{estadisticas.totalTramites}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pendientes</CardTitle>
              <CardDescription>Requieren revisión</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-500">{estadisticas.pendientes}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Aprobados</CardTitle>
              <CardDescription>Trámites exitosos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-500">{estadisticas.aprobados}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Rechazados</CardTitle>
              <CardDescription>No aprobados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-500">{estadisticas.rechazados}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Gráfica y listado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Estado de trámites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No hay datos disponibles para mostrar
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Trámites recientes</CardTitle>
              <Link to="/admin/tramites">
                <Button variant="ghost">Ver todos</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <TramitesList tramites={tramitesRecientes} isAdmin={true} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
