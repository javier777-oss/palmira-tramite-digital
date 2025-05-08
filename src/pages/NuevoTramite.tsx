
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getTiposTramite, getTipoTramiteById, createTramite } from "../services/tramiteService";
import { TipoTramite } from "../types";
import { useAuth } from "../context/AuthContext";
import { createNotificacion } from "../services/notificacionService";

const NuevoTramite = () => {
  const [tiposTramite, setTiposTramite] = useState<TipoTramite[]>([]);
  const [selectedTipoId, setSelectedTipoId] = useState<string>("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoTramite | null>(null);
  const [descripcion, setDescripcion] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Cargar tipos de trámite
    const tipos = getTiposTramite();
    setTiposTramite(tipos);
  }, []);

  useEffect(() => {
    // Cuando cambia el tipo seleccionado, actualizar la información
    if (selectedTipoId) {
      const tipoInfo = getTipoTramiteById(selectedTipoId);
      setTipoSeleccionado(tipoInfo || null);
    } else {
      setTipoSeleccionado(null);
    }
  }, [selectedTipoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe iniciar sesión para crear un trámite",
      });
      return;
    }
    
    if (!selectedTipoId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe seleccionar un tipo de trámite",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Crear trámite
      const nuevoTramite = createTramite({
        tipoTramite: tipoSeleccionado?.nombre || "",
        descripcion,
        usuarioId: user.id,
        estado: "iniciado",
        documentos: [],
        historial: []
      });
      
      // Crear notificación para el usuario
      createNotificacion({
        usuarioId: user.id,
        titulo: "Trámite iniciado",
        mensaje: `Su solicitud de ${tipoSeleccionado?.nombre} ha sido iniciada correctamente. Por favor suba los documentos requeridos.`,
        tramiteId: nuevoTramite.id
      });
      
      toast({
        title: "Trámite iniciado",
        description: "Su trámite ha sido creado correctamente",
      });
      
      // Navegar al detalle del trámite
      navigate(`/tramite/${nuevoTramite.id}`);
    } catch (error) {
      console.error("Error al crear trámite:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el trámite. Por favor intente nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Iniciar nuevo trámite</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tipoTramite">Tipo de trámite</Label>
                <Select
                  value={selectedTipoId}
                  onValueChange={setSelectedTipoId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo de trámite" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposTramite.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {tipoSeleccionado && (
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <p className="text-sm mb-2">
                      <span className="font-medium">Descripción: </span>
                      {tipoSeleccionado.descripcion}
                    </p>
                    <div>
                      <p className="font-medium text-sm mb-1">Documentos requeridos:</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {tipoSeleccionado.documentosRequeridos.map((doc, index) => (
                          <li key={index}>
                            <span className="font-medium">{doc.nombre}</span>
                            {doc.requerido && <span className="text-red-500">*</span>}
                            <p className="text-xs text-gray-600">{doc.descripcion}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="descripcion">
                  Descripción (Opcional)
                </Label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Añada información adicional sobre su solicitud"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-palmira-600 hover:bg-palmira-700"
                  disabled={!selectedTipoId || isSubmitting}
                >
                  {isSubmitting ? "Iniciando..." : "Iniciar trámite"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoTramite;
