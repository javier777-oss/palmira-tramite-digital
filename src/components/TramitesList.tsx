
import { Link } from "react-router-dom";
import { Tramite } from "../types";
import TramiteStatusBadge from "./TramiteStatusBadge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from "react";

interface TramitesListProps {
  tramites: Tramite[];
  isAdmin?: boolean;
}

const TramitesList: React.FC<TramitesListProps> = ({ tramites, isAdmin = false }) => {
  const [sortedTramites, setSortedTramites] = useState<Tramite[]>([]);
  const [sortBy, setSortBy] = useState<string>("fecha");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  useEffect(() => {
    const sortTramites = () => {
      const sorted = [...tramites].sort((a, b) => {
        if (sortBy === "fecha") {
          const dateA = new Date(a.fechaActualizacion).getTime();
          const dateB = new Date(b.fechaActualizacion).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortBy === "estado") {
          return sortOrder === "asc"
            ? a.estado.localeCompare(b.estado)
            : b.estado.localeCompare(a.estado);
        }
        return 0;
      });
      
      setSortedTramites(sorted);
    };
    
    sortTramites();
  }, [tramites, sortBy, sortOrder]);
  
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (sortedTramites.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <p className="text-gray-500">
          {isAdmin 
            ? "No hay trámites disponibles para revisar" 
            : "No has iniciado ningún trámite aún"}
        </p>
        {!isAdmin && (
          <Link to="/nuevo-tramite">
            <Button className="mt-4 bg-palmira-600 hover:bg-palmira-700">
              Iniciar Nuevo Trámite
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSort("fecha")}
            className={sortBy === "fecha" ? "border-palmira-500" : ""}
          >
            Ordenar por fecha {sortBy === "fecha" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSort("estado")}
            className={sortBy === "estado" ? "border-palmira-500" : ""}
          >
            Ordenar por estado {sortBy === "estado" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
        </div>
        {!isAdmin && (
          <Link to="/nuevo-tramite">
            <Button className="bg-palmira-600 hover:bg-palmira-700">
              Nuevo Trámite
            </Button>
          </Link>
        )}
      </div>

      {sortedTramites.map((tramite) => (
        <Link
          key={tramite.id}
          to={isAdmin ? `/admin/revisar-tramite/${tramite.id}` : `/tramite/${tramite.id}`}
        >
          <div className="border rounded-lg p-4 hover:shadow-md transition-all bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{tramite.tipoTramite}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>
                    {formatDistanceToNow(new Date(tramite.fechaActualizacion), {
                      addSuffix: true,
                      locale: es
                    })}
                  </span>
                </div>
              </div>
              <TramiteStatusBadge status={tramite.estado} />
            </div>
            
            <div className="mt-2">
              <div className="text-sm">
                <span className="text-gray-500">Documentos: </span>
                <span className="font-medium">
                  {tramite.documentos?.length || 0} cargados
                </span>
              </div>
              {tramite.historial && tramite.historial.length > 0 && (
                <div className="text-sm">
                  <span className="text-gray-500">Última actualización: </span>
                  <span className="font-medium">
                    {tramite.historial[tramite.historial.length - 1].estado
                      .replace(/_/g, " ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TramitesList;
