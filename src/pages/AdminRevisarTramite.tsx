
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import TramiteStatusBadge from "../components/TramiteStatusBadge";
import { useAuth } from "../context/AuthContext";
import {
  getTramiteById,
  getTipoTramiteById,
  updateTramite,
  updateDocumento,
} from "../services/tramiteService";
import { Tramite, Documento, TipoTramite } from "../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Download, Check, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createNotificacion } from "../services/notificacionService";

const AdminRevisarTramite = () => {
  const { id } = useParams<{ id: string }>();
  const [tramite, setTramite] = useState<Tramite | null>(null);
  const [tipoTramite, setTipoTramite] = useState<TipoTramite | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>("");
  const [comentarioGeneral, setComentarioGeneral] = useState<string>("");
  const [documentosRevisados, setDocumentosRevisados] = useState<Record<string, {estado: string, comentario: string}>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos del trámite
    if (id) {
      const tramiteData = getTramiteById(id);
      if (tramiteData) {
        setTramite(tramiteData);
        
        // Cargar tipo de trámite
        const tipoData = getTipoTramiteById(tramiteData.tipoTramite.split(' ')[0]);
        setTipoTramite(tipoData || null);
        
        // Inicializar estado según el estado actual del trámite
        setNuevoEstado(tramiteData.estado);
        
        // Inicializar estados de documentos
        const docsRevisados: Record<string, {estado: string, comentario: string}> = {};
        
        if (tramiteData.documentos && tramiteData.documentos.length > 0) {
          tramiteData.documentos.forEach(doc => {
            docsRevisados[doc.id] = {
              estado: doc.estado,
              comentario: doc.comentarios || ''
            };
          });
        }
        
        setDocumentosRevisados(docsRevisados);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se encontró el trámite solicitado",
        });
        navigate("/admin/tramites");
      }
    }
  }, [id, navigate, toast]);

  const handleDocumentoEstadoChange = (docId: string, estado: string) => {
    setDocumentosRevisados(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        estado
      }
    }));
  };

  const handleDocumentoComentarioChange = (docId: string, comentario: string) => {
    setDocumentosRevisados(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        comentario
      }
    }));
  };

  const handleGuardarCambios = async () => {
    if (!user || !tramite) return;
    
    try {
      setIsSubmitting(true);
      
      // Actualizar cada documento
      for (const docId in documentosRevisados) {
        const docReview = documentosRevisados[docId];
        
        // Encontrar el documento en el trámite
        const documento = tramite.documentos.find(d => d.id === docId);
        
        if (documento && (documento.estado !== docReview.estado || documento.comentarios !== docReview.comentario)) {
          // Actualizar el documento si hay cambios
          const updatedTramite = updateDocumento(
            tramite.id,
            docId,
            {
              estado: docReview.estado as 'pendiente' | 'aprobado' | 'rechazado',
              comentarios: docReview.comentario
            },
            user.id
          );
          
          // Actualizar el tramite local
          setTramite(updatedTramite);
        }
      }
      
      // Actualizar el estado general del trámite si ha cambiado
      if (nuevoEstado !== tramite.estado || comentarioGeneral) {
        const updatedTramite = updateTramite(
          tramite.id,
          {
            estado: nuevoEstado as any
          },
          user.id,
          comentarioGeneral || `Estado actualizado a ${nuevoEstado}`
        );
        
        setTramite(updatedTramite);
        
        // Crear notificación para el usuario
        createNotificacion({
          usuarioId: tramite.usuarioId,
          titulo: `Trámite actualizado a: ${nuevoEstado.replace(/_/g, " ")}`,
          mensaje: comentarioGeneral || `El estado de su trámite ha sido actualizado a ${nuevoEstado.replace(/_/g, " ")}`,
          tramiteId: tramite.id
        });
      }
      
      toast({
        title: "Cambios guardados",
        description: "Los cambios han sido guardados correctamente",
      });
      
      // Si el estado es aprobado, notificar al usuario
      if (nuevoEstado === 'aprobado') {
        createNotificacion({
          usuarioId: tramite.usuarioId,
          titulo: "¡Trámite aprobado!",
          mensaje: "Su trámite ha sido aprobado. Puede descargar la licencia desde el detalle del trámite.",
          tramiteId: tramite.id
        });
      }
      
      // Limpiar el formulario de comentario general
      setComentarioGeneral("");
    } catch (error) {
      console.error("Error al actualizar trámite:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios. Por favor intente nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tramite || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-palmira-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Verifica si el trámite está en un estado donde no se pueden realizar más modificaciones
  const tramiteFinalizado = tramite.estado === 'aprobado' || tramite.estado === 'rechazado';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Revisar trámite</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-gray-600">
                {tramite.tipoTramite} - ID: {tramite.id.substring(tramite.id.indexOf('-') + 1)}
              </p>
              <TramiteStatusBadge status={tramite.estado} />
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0"
            onClick={() => navigate("/admin/tramites")}
          >
            Volver a la lista
          </Button>
        </div>

        {/* Información del trámite y revisión */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Revisión de documentos */}
            <Card>
              <CardHeader>
                <CardTitle>Revisión de documentos</CardTitle>
              </CardHeader>
              <CardContent>
                {tramite.documentos && tramite.documentos.length > 0 ? (
                  <div className="space-y-8">
                    {tramite.documentos.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">{doc.tipoDocumento}</h3>
                            <p className="text-sm text-gray-600">
                              Subido el{" "}
                              {format(new Date(doc.fechaCarga), "PPp", {
                                locale: es,
                              })}
                            </p>
                          </div>
                          <TramiteStatusBadge
                            status={documentosRevisados[doc.id]?.estado || doc.estado}
                          />
                        </div>

                        {/* Vista del documento */}
                        <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center mb-4">
                          <div>
                            <p className="text-sm font-medium">{doc.nombre}</p>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-palmira-600 hover:text-palmira-800 flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            <span className="text-sm">Ver documento</span>
                          </a>
                        </div>

                        {/* Opciones de revisión */}
                        {!tramiteFinalizado && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Estado del documento</Label>
                              <RadioGroup
                                value={documentosRevisados[doc.id]?.estado}
                                onValueChange={(value) => handleDocumentoEstadoChange(doc.id, value)}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="pendiente" id={`pendiente-${doc.id}`} />
                                  <Label htmlFor={`pendiente-${doc.id}`}>Pendiente</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="aprobado" id={`aprobado-${doc.id}`} />
                                  <Label htmlFor={`aprobado-${doc.id}`}>Aprobado</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="rechazado" id={`rechazado-${doc.id}`} />
                                  <Label htmlFor={`rechazado-${doc.id}`}>Rechazado</Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`comentario-${doc.id}`}>Comentarios</Label>
                              <Textarea
                                id={`comentario-${doc.id}`}
                                placeholder="Añadir comentarios sobre este documento"
                                value={documentosRevisados[doc.id]?.comentario || ''}
                                onChange={(e) => handleDocumentoComentarioChange(doc.id, e.target.value)}
                              />
                            </div>

                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleDocumentoEstadoChange(doc.id, 'aprobado')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Aprobar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleDocumentoEstadoChange(doc.id, 'rechazado')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Rechazar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No hay documentos cargados para este trámite.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Historial del trámite */}
            <Card>
              <CardHeader>
                <CardTitle>Historial del trámite</CardTitle>
              </CardHeader>
              <CardContent>
                {tramite.historial && tramite.historial.length > 0 ? (
                  <ul className="space-y-4">
                    {tramite.historial
                      .slice()
                      .reverse()
                      .map((historial, index) => (
                        <li
                          key={historial.id}
                          className={`border-l-4 pl-4 py-2 ${
                            index === 0
                              ? "border-palmira-600"
                              : "border-gray-200"
                          }`}
                        >
                          <p className="font-medium">
                            {historial.estado
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </p>
                          {historial.comentarios && (
                            <p className="text-gray-600 text-sm">
                              {historial.comentarios}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(historial.fecha), "PPpp", {
                              locale: es,
                            })}
                          </p>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    No hay historial disponible para este trámite.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Estado general y acciones */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Datos del solicitante</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-medium">ID del trámite:</dt>
                    <dd>{tramite.id}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Fecha de creación:</dt>
                    <dd>
                      {format(new Date(tramite.fechaCreacion), "PPp", {
                        locale: es,
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Última actualización:</dt>
                    <dd>
                      {format(new Date(tramite.fechaActualizacion), "PPp", {
                        locale: es,
                      })}
                    </dd>
                  </div>
                  {tramite.descripcion && (
                    <div className="pt-2">
                      <dt className="font-medium">Descripción:</dt>
                      <dd className="mt-1 text-gray-600">{tramite.descripcion}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado del trámite</CardTitle>
              </CardHeader>
              <CardContent>
                {!tramiteFinalizado ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Actualizar estado</Label>
                      <RadioGroup
                        value={nuevoEstado}
                        onValueChange={setNuevoEstado}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="iniciado" id="iniciado" />
                          <Label htmlFor="iniciado">Iniciado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="documentos_cargados" id="documentos_cargados" />
                          <Label htmlFor="documentos_cargados">Documentos cargados</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="en_revision" id="en_revision" />
                          <Label htmlFor="en_revision">En revisión</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="req_documentos" id="req_documentos" />
                          <Label htmlFor="req_documentos">Requiere documentos adicionales</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="aprobado" id="aprobado" />
                          <Label htmlFor="aprobado">Aprobado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rechazado" id="rechazado" />
                          <Label htmlFor="rechazado">Rechazado</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comentario-general">Comentario general</Label>
                      <Textarea
                        id="comentario-general"
                        placeholder="Añadir un comentario general sobre el trámite"
                        value={comentarioGeneral}
                        onChange={(e) => setComentarioGeneral(e.target.value)}
                      />
                    </div>

                    <Button
                      className="w-full bg-palmira-600 hover:bg-palmira-700"
                      onClick={handleGuardarCambios}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        className="w-[48%] text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => {
                          setNuevoEstado('aprobado');
                          setComentarioGeneral("Trámite aprobado");
                        }}
                      >
                        Aprobar trámite
                      </Button>
                      <Button
                        variant="outline"
                        className="w-[48%] text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => {
                          setNuevoEstado('rechazado');
                          setComentarioGeneral("Trámite rechazado");
                        }}
                      >
                        Rechazar trámite
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600">
                      Este trámite ya ha sido {tramite.estado.replace(/_/g, " ")}.
                    </p>
                    <TramiteStatusBadge status={tramite.estado} className="mt-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminRevisarTramite;
