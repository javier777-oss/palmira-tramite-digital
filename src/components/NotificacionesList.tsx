
import { useEffect, useState } from "react";
import { getNotificacionesByUserId, markAsRead } from "../services/notificacionService";
import { Notificacion } from "../types";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const NotificacionesList = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchNotificaciones = () => {
        const data = getNotificacionesByUserId(user.id);
        setNotificaciones(data);
      };
      
      fetchNotificaciones();
      
      // Actualizar cada minuto
      const interval = setInterval(fetchNotificaciones, 60000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    setNotificaciones(notificaciones.map(n => 
      n.id === id ? { ...n, leida: true } : n
    ));
  };

  if (!user) return null;

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {notificaciones.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No tienes notificaciones</p>
        </div>
      ) : (
        notificaciones.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-4 border rounded-lg transition-all ${
              !notif.leida ? "bg-blue-50 border-blue-200" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{notif.titulo}</h4>
                <p className="text-sm text-gray-600 mt-1">{notif.mensaje}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {formatDistanceToNow(new Date(notif.fecha), { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                {!notif.leida && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    Marcar como leída
                  </Button>
                )}
                {notif.tramiteId && (
                  <Link 
                    to={`/tramite/${notif.tramiteId}`} 
                    className="text-xs text-palmira-600 hover:underline"
                  >
                    Ver trámite
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificacionesList;
